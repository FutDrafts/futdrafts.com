import { db } from '@/db'
import { fantasyParticipant } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

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
                    players: {
                        where: eq(fantasyParticipant.userId, session.user.id),
                        columns: {
                            rank: true,
                            points: true,
                        },
                    },
                },
            }),
        ])

        return {
            fantasyLeagues,
        }
    } catch (error) {
        console.error('Error fetching fantasy leagues:', error)
        throw new Error('Failed to fetch fantasy leagues')
    }
}
