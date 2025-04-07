'use server'

import { db } from '@/db'
import { fantasy, fantasyParticipant, fantasyStatusEnum, user } from '@/db/schema'
import { and, eq, ilike, or } from 'drizzle-orm'

export type FantasyLeague = typeof fantasy.$inferSelect & {
    owner: {
        name: string
    }
    league: {
        name: string
    }
}

type FantasyStatus = (typeof fantasyStatusEnum.enumValues)[number]

export async function getFantasyLeagues({
    search,
    status,
    page = 1,
    limit = 10,
}: {
    search?: string
    status?: FantasyStatus | 'all'
    page?: number
    limit?: number
}) {
    const offset = (page - 1) * limit
    const conditions = []

    if (status && status !== 'all') {
        conditions.push(eq(fantasy.status, status))
    }

    if (search) {
        conditions.push(ilike(fantasy.name, `%${search}%`))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    try {
        const [fantasyLeagues, totalCount] = await Promise.all([
            db.query.fantasy.findMany({
                where,
                limit,
                offset,
                orderBy: (fantasy, { desc }) => [desc(fantasy.createdAt)],
                with: {
                    owner: {
                        columns: {
                            name: true,
                        },
                    },
                    league: {
                        columns: {
                            name: true,
                        },
                    },
                },
            }),
            db.$count(fantasy, where),
        ])

        return {
            fantasyLeagues,
            total: totalCount,
        }
    } catch (error) {
        console.error('Error fetching fantasy leagues:', error)
        throw new Error('Failed to fetch fantasy leagues')
    }
}

export async function getFantasyLeagueByCode(slug: string) {
    try {
        const fantasyLeague = await db.query.fantasy.findFirst({
            where: eq(fantasy.slug, slug),
            with: {
                owner: {
                    columns: {
                        name: true,
                        username: true,
                        image: true,
                    },
                },
                league: {
                    columns: {
                        name: true,
                    },
                },
                scoreRules: {
                    columns: {
                        id: false,
                        createdAt: false,
                        updatedAt: false,
                    },
                },
                players: {
                    with: {
                        user: {
                            columns: {
                                name: true,
                                image: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        })

        if (!fantasyLeague) {
            throw new Error('Fantasy league not found')
        }

        return fantasyLeague
    } catch (error) {
        console.error('Error fetching fantasy league:', error)
        throw new Error('Failed to fetch fantasy league')
    }
}

export async function getUserFantasyLeagues(username: string, old: boolean) {
    try {
        const userId = await db.select({ id: user.id }).from(user).where(eq(user.username, username))

        if (!userId[0]) {
            throw new Error('No user found for username')
        }

        const conditions = !old
            ? and(or(eq(fantasy.status, 'active'), eq(fantasy.status, 'pending')))
            : and(or(eq(fantasy.status, 'cancelled'), eq(fantasy.status, 'ended')))

        const results = await db.query.fantasy.findMany({
            where: conditions,
            with: {
                players: {
                    where: eq(fantasyParticipant.userId, userId[0].id),
                    columns: {
                        rank: true,
                        points: true,
                    },
                },
            },
        })

        const filtered = results.filter((l) => l.players.length >= 1)

        return filtered
    } catch (error) {
        console.error('Error getting user active fantasy leagues', error)
        throw error
    }
}
