import { db } from '@/db'
import { fantasy, fantasyParticipant } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq, not } from 'drizzle-orm'
import { headers } from 'next/headers'

export const getDashboardLeagueCounts = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user) {
        throw new Error('Unauthorized')
    }

    try {
        const [leagueCount, pendingLeagueCount] = await Promise.all([
            db.$count(fantasy, not(eq(fantasy.status, 'ended'))),
            db.$count(fantasy, eq(fantasy.status, 'pending')),
        ])

        return {
            totalLeagueCount: leagueCount,
            pendingLeagueCount,
        }
    } catch (error) {
        console.error('Error fetching fantasy league counts:', error)
        throw new Error('Failed to fetch fantasy league counts')
    }
}

export const getDashboardActiveLeagues = async (limit: number) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user) {
        throw new Error('Unauthorized')
    }

    try {
        const [fantasyLeagues] = await Promise.all([
            db.query.fantasy.findMany({
                limit,
                orderBy: (fantasy, { desc }) => [desc(fantasy.createdAt)],
                with: {
                    user: {
                        columns: {
                            name: true,
                        },
                    },
                    league: {
                        columns: {
                            name: true,
                        },
                    },
                    fantasyParticipants: {
                        where: eq(fantasyParticipant.userId, session.user.id),
                        columns: {
                            rank: true,
                            points: true,
                        },
                    },
                },
            }),
        ])

        for (const league of fantasyLeagues) {
            if (league.fantasyParticipants.length == 0) {
                return []
            }
        }

        return fantasyLeagues
    } catch (error) {
        console.error('Error fetching fantasy leagues:', error)
        throw new Error('Failed to fetch fantasy leagues')
    }
}
