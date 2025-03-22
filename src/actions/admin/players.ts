import { db } from '@/db'
import { player } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function getPlayerCount() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.session || !session.user) {
            throw new Error('You must be logged in')
        }

        if (session.user.role !== 'admin') {
            throw new Error('You are unauthorized to perform this action')
        }

        const data = await db
            .select({
                totalUserCount: db.$count(player),
                injuredPlayerCount: db.$count(player, eq(player.isInjured, true)),
            })
            .from(player)

        if (!data || data.length === 0) {
            return { error: 'Failed to fetch player count' }
        }

        return {
            totalPlayers: data[0].totalUserCount,
            injuredPlayers: data[0].injuredPlayerCount,
        }
    } catch (error) {
        console.error('Error fetching player count:', error)
        throw error
    }
}
