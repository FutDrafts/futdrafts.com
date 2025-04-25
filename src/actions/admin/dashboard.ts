'use server'

import { db } from '@/db'
import { post, user } from '@/db/schema'
import { env } from '@/env/server'
import { auth } from '@/lib/auth'
import { formatNumber } from '@/lib/utils'
import { and, desc, gte, lt } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function getRecentArticles({ limit = 3 }: { limit: number }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || session.user.role !== 'admin') {
            throw new Error('Unauthorized!')
        }

        const [recentPosts] = await Promise.all([
            await db.query.post.findMany({
                limit,
                orderBy: [desc(post.createdAt)],
                with: {
                    user: {
                        columns: {
                            name: true,
                        },
                    },
                },
            }),
        ])

        return recentPosts
    } catch (error) {
        console.error('Error fetching recent articles:', error)
        throw new Error('Failed to fetch recent articles')
    }
}

export async function getRecentUsers({ limit = 3 }: { limit: number }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || session.user.role !== 'admin') {
            throw new Error('Unauthorized')
        }

        const [recentUsers] = await Promise.all([
            await db.query.user.findMany({
                limit,
                orderBy: [desc(user.createdAt)],
            }),
        ])

        return recentUsers
    } catch (error) {
        console.error('Error fetching recent users:', error)
        throw new Error('Failed to fetch recent users')
    }
}

export async function getDashboardAnalytics() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || session.user.role !== 'admin') {
            throw new Error('Unauthrorized!')
        }

        const [today, yesterday] = [new Date(), new Date()]
        yesterday.setDate(yesterday.getDate() - 1)

        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const [lastMonth, thisMonth] = [
            new Date(today.getFullYear(), today.getMonth(), 1),
            new Date(today.getFullYear(), today.getMonth() - 1, 1),
        ]

        const [totalUsers, lastMonthUsers, activeUsers, totalArticles, lastMonthArticles] = await Promise.all([
            await db.$count(user),
            await db.$count(user, and(lt(user.createdAt, thisMonth))),
            await db.$count(user, gte(user.lastLogin, sevenDaysAgo)),
            await db.$count(post),
            await db.$count(post, and(lt(post.createdAt, thisMonth), gte(post.createdAt, lastMonth))),
        ])

        const userGrowth =
            lastMonthUsers === 0
                ? `${(totalUsers * 100).toFixed(1)}`
                : lastMonthUsers > 0
                  ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
                  : '0.0'

        const articleGrowth =
            lastMonthArticles === 0 && totalArticles > 0
                ? `${(totalArticles * 100).toFixed(1)}`
                : lastMonthArticles > 0
                  ? (((totalArticles - lastMonthArticles) / lastMonthArticles) * 100).toFixed(1)
                  : '0.0'

        // Fetch page views from PostHog
        const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString()
        const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString()
        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString()
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString()

        // Fetch today's page views
        const todayVisitsResponse = await fetch(
            `https://app.posthog.com/api/projects/${env.POSTHOG_PROJECT_ID}/insights/trend/?events=[{"id":"$pageview","name":"$pageview","type":"events","order":0}]&date_from=${todayStart}&date_to=${todayEnd}`,
            {
                headers: {
                    Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        )

        // Fetch yesterday's page views
        const yesterdayVisitsResponse = await fetch(
            `https://app.posthog.com/api/projects/${env.POSTHOG_PROJECT_ID}/insights/trend/?events=[{"id":"$pageview","name":"$pageview","type":"events","order":0}]&date_from=${yesterdayStart}&date_to=${yesterdayEnd}`,
            {
                headers: {
                    Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        )

        let todayVisits = 0
        let yesterdayVisits = 0

        if (todayVisitsResponse.ok) {
            const todayData = await todayVisitsResponse.json()
            todayVisits = todayData.result[0].data[0] || 0
        }

        if (yesterdayVisitsResponse.ok) {
            const yesterdayData = await yesterdayVisitsResponse.json()
            yesterdayVisits = yesterdayData.result[0].data[0] || 0
        }

        if (todayVisits === 0 && yesterdayVisits === 0) {
            todayVisits = 0
            yesterdayVisits = 0
        }

        const visitsGrowth =
            yesterdayVisits === 0 && todayVisits > 0
                ? `${(todayVisits * 100).toFixed(1)}`
                : yesterdayVisits > 0
                  ? (((todayVisits - yesterdayVisits) / yesterdayVisits) * 100).toFixed(1)
                  : '0.0'

        return {
            totalUsers: formatNumber(totalUsers),
            activeUsers: formatNumber(activeUsers),
            totalArticles: formatNumber(totalArticles),
            dailyVisits: formatNumber(todayVisits),
            userGrowth,
            articleGrowth,
            visitsGrowth,
        }
    } catch (error) {
        console.error('Failed to fetch dashboard statistics', error)
        throw new Error('Failed to fetch dashboard statistics')
    }
}
