import { db } from '@/db'
import { fantasy, fantasyParticipant, fixture } from '@/db/schema'
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
                where: (fields, { exists, eq, and }) =>
                    exists(
                        db
                            .select()
                            .from(fantasyParticipant)
                            .where(
                                and(
                                    eq(fantasyParticipant.userId, session.user.id),
                                    eq(fantasyParticipant.fantasyId, fields.id),
                                ),
                            ),
                    ),
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

        return fantasyLeagues
    } catch (error) {
        console.error('Error fetching fantasy leagues:', error)
        throw new Error('Failed to fetch fantasy leagues')
    }
}

export const getDashboardUpcomingFixtures = async (limit: number) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user) {
        throw new Error('Unauthorized')
    }

    try {
        const [fixtures] = await Promise.all([
            db.query.fixture.findMany({
                limit,
                orderBy: (fixture, { desc }) => [desc(fixture.matchDay)],
                where: eq(fixture.status, 'upcoming'),
                with: {
                    homeTeam: {
                        columns: {
                            logo: true,
                            name: true,
                        },
                    },
                    awayTeam: {
                        columns: {
                            logo: true,
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
        ])

        return fixtures
    } catch (error) {
        console.error('Error fetching fantasy leagues:', error)
        throw new Error('Failed to fetch fantasy leagues')
    }
}
