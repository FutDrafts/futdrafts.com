'use server'

import { db } from '@/db'
import { fantasy, fantasyParticipant, fantasyStatus, user } from '@/db/schema'
import { auth } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { and, eq, ilike, or } from 'drizzle-orm'
import { headers } from 'next/headers'

export type FantasyLeague = typeof fantasy.$inferSelect & {
    owner: {
        name: string
    }
    league: {
        name: string
    }
}

type FantasyStatus = (typeof fantasyStatus.enumValues)[number]

export async function getFantasyLeagues({
    search,
    page = 1,
    limit = 10,
}: {
    search?: string
    page?: number
    limit?: number
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user || !session.session) {
        throw new Error('Unauthorized')
    }

    const offset = (page - 1) * limit
    const conditions = []

    conditions.push(eq(fantasy.status, 'pending'))

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
                        columns: {
                            id: true,
                        },
                    },
                },
            }),
            db.$count(fantasy, where),
        ])

        const filteredFantasyLeagues = fantasyLeagues.filter((league) => {
            return !league.fantasyParticipants.some((participant) => participant.id === session.user.id)
        })

        return {
            fantasyLeagues: filteredFantasyLeagues,
            total: totalCount,
        }
    } catch (error) {
        console.error('Error fetching fantasy leagues:', error)
        throw new Error('Failed to fetch fantasy leagues')
    }
}

export async function getActiveFantasyLeagues({
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

    if (status === 'all') {
        conditions.push(or(eq(fantasy.status, 'active'), eq(fantasy.status, 'pending')))
    }

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
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const league = await db.query.fantasy.findFirst({ where: eq(fantasy.slug, slug) })

        if (!league) {
            throw new Error("League doesn't exist")
        }

        return await db.query.fantasy.findFirst({
            where: eq(fantasy.id, league.id),
            with: {
                user: {
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
                scoreRule: {
                    columns: {
                        id: false,
                        createdAt: false,
                        updatedAt: false,
                    },
                },
                fantasyParticipants: {
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
                h2hMatches: {
                    with: {
                        homeParticipant: {
                            columns: {
                                id: true,
                                teamName: true,
                                points: true,
                            },
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
                        awayParticipant: {
                            columns: {
                                id: true,
                                teamName: true,
                                points: true,
                            },
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
                        winner: {
                            columns: {
                                id: true,
                                teamName: true,
                            },
                            with: {
                                user: {
                                    columns: {
                                        name: true,
                                        username: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: (h2hMatch, { asc }) => [asc(h2hMatch.weekNumber), asc(h2hMatch.matchNumber)],
                },
            },
        })
    } catch (error) {
        console.error('Error fetching fantasy league:', error)
        throw new Error('Failed to fetch fantasy league')
    }
}

export async function getFantasyLeagueById(id: string) {
    try {
        const fantasyLeague = await db.query.fantasy.findFirst({
            where: eq(fantasy.id, id),
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
                fantasyParticipants: {
                    where: eq(fantasyParticipant.userId, userId[0].id),
                    columns: {
                        rank: true,
                        points: true,
                    },
                },
            },
        })

        const filtered = results.filter((l) => l.fantasyParticipants.length >= 1)

        return filtered
    } catch (error) {
        console.error('Error getting user active fantasy leagues', error)
        throw error
    }
}

export async function getFantasyLeagueParticipants(leagueId: string) {
    try {
        const [participants, total] = await Promise.all([
            await db.query.fantasyParticipant.findMany({
                where: eq(fantasyParticipant.fantasyId, leagueId),
                with: {
                    user: true,
                    fantasy: true,
                },
            }),
            await db.$count(fantasyParticipant, eq(fantasyParticipant.fantasyId, leagueId)),
        ])

        return {
            participants,
            total,
        }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get League Participants')
    }
}

export async function getFantasyLeagueParticipantsBySlug(slug: string) {
    try {
        const fantasyLeague = await db.query.fantasy.findFirst({
            where: eq(fantasy.slug, slug),
        })

        if (!fantasyLeague) {
            throw new Error('No League with that slug')
        }

        const [participants, total] = await Promise.all([
            await db.query.fantasyParticipant.findMany({
                where: eq(fantasyParticipant.fantasyId, fantasyLeague.id),
                with: {
                    user: true,
                    fantasy: true,
                    draftsPicks: {
                        with: {
                            player: true,
                        },
                    },
                },
            }),
            await db.$count(fantasyParticipant, eq(fantasyParticipant.fantasyId, fantasyLeague.id)),
        ])

        return {
            participants,
            total,
        }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get League Participants')
    }
}

export async function getFantasyLeagueParticipantById(userId: string, slug: string) {
    try {
        const results = await db.select({ leagueId: fantasy.id }).from(fantasy).where(eq(fantasy.slug, slug))

        if (results.length < 1) {
            throw new Error('No League Found')
        }

        const { leagueId } = results[0]

        const participant = await db.query.fantasyParticipant.findFirst({
            where: and(eq(fantasyParticipant.fantasyId, leagueId), eq(fantasyParticipant.userId, userId)),
            with: {
                draftsPicks: {
                    with: {
                        player: true,
                    },
                },
                user: true,
            },
        })

        if (!participant) {
            throw new Error('No Participants Found')
        }

        return participant
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get League Participant')
    }
}

export async function createFantasyLeague({
    name,
    leagueId,
    slug,
    joinCode,
    minPlayer = 2,
    maxPlayer = 8,
    isPrivate,
    description = '',
    startDate,
    endDate,
    teamName,
}: {
    name: string
    leagueId: string
    slug: string
    joinCode: string
    minPlayer: number
    maxPlayer: number
    isPrivate: boolean
    description?: string | undefined
    startDate?: Date | undefined
    endDate?: Date | undefined
    teamName: string
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    const genSlug = slug ? generateSlug(slug) : generateSlug(name)

    try {
        const newLeague = await db
            .insert(fantasy)
            .values({
                id: crypto.randomUUID(),
                name,
                leagueId,
                scoreRulesId: '5Etfk9Y467NO1Ph3JFhGM',
                slug: genSlug,
                joinCode,
                minimumPlayer: minPlayer,
                maximumPlayer: maxPlayer,
                isPrivate,
                description,
                startDate: startDate,
                endDate: endDate,
                ownerId: session.user.id,
                status: 'pending',
            })
            .returning()

        await db.insert(fantasyParticipant).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            fantasyId: newLeague[0].id,
            rank: 1,
            points: 0,
            role: 'owner',
            status: 'active',
            teamName,
        })

        return {
            message: 'Successfully created new fantasy league',
            slug: genSlug,
        }
    } catch (error) {
        console.error('Error creating fantasy league:', error)
        throw new Error('Failed to create fantasy league')
    }
}

export const joinPrivateLeague = async ({
    leagueId,
    joinCode,
    teamName,
}: {
    leagueId: string
    teamName: string
    joinCode: string
}) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.session || !session.user) {
        throw new Error('You must be logged in')
    }

    try {
        const league = await db.query.fantasy.findFirst({
            where: eq(fantasy.id, leagueId),
            columns: {
                id: true,
                isPrivate: true,
                joinCode: true,
                maximumPlayer: true,
                status: true,
            },
            with: {
                fantasyParticipants: {
                    columns: {
                        userId: true,
                        teamName: true,
                    },
                },
            },
        })

        if (!league) {
            throw new Error('Invalid Fantasy League')
        }

        if (league.fantasyParticipants.length == league.maximumPlayer) {
            throw new Error('League is full. Join a different one.')
        }

        if (league.fantasyParticipants.some((user) => user.userId === session.user.id)) {
            throw new Error('You are already a member of this league.')
        }

        if (joinCode == '') {
            throw new Error('Please enter a join code')
        }

        if (joinCode !== league.joinCode) {
            throw new Error('Invalid Join Code')
        }

        await db.insert(fantasyParticipant).values({
            id: crypto.randomUUID(),
            fantasyId: league.id,
            userId: session.user.id,
            role: 'player',
            status: 'active',
            teamName: teamName,
        })
    } catch (error) {
        console.error('Failed to join league', error)
        throw new Error('Failed to join fantasy league')
    }
}

export const joinPublicLeague = async ({ leagueId, teamName }: { leagueId: string; teamName: string }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.session || !session.user) {
        throw new Error('You must be logged in')
    }

    try {
        const league = await db.query.fantasy.findFirst({
            where: eq(fantasy.id, leagueId),
            columns: {
                id: true,
                isPrivate: true,
                joinCode: true,
                maximumPlayer: true,
                status: true,
            },
            with: {
                fantasyParticipants: {
                    columns: {
                        userId: true,
                        teamName: true,
                    },
                },
            },
        })

        if (!league) {
            throw new Error('Invalid Fantasy League')
        }

        if (league.fantasyParticipants.length == league.maximumPlayer) {
            throw new Error('League is full. Join a different one.')
        }

        if (league.fantasyParticipants.some((user) => user.userId === session.user.id)) {
            throw new Error('You are already a member of this league.')
        }

        await db.insert(fantasyParticipant).values({
            id: crypto.randomUUID(),
            fantasyId: league.id,
            userId: session.user.id,
            role: 'player',
            status: 'active',
            teamName: teamName,
        })
    } catch (error) {
        console.error('Failed to join league', error)
        throw new Error('Failed to join fantasy league')
    }
}

export const isMemberOfLeague = async ({ leagueId }: { leagueId: string }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user || !session.session) {
        throw new Error('Unauthorized')
    }

    try {
        const { id: userId } = session.user

        const result = await db.query.fantasyParticipant.findFirst({
            where: and(eq(fantasyParticipant.fantasyId, leagueId), eq(fantasyParticipant.userId, userId)),
        })

        if (!result) {
            return false
        }

        return true
    } catch (error) {
        console.error('Failed to check if you are a member', error)
        throw new Error('Failed to check if user is a member')
    }
}
