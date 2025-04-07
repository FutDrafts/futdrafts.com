'use server'

import { db } from '@/db'
import { league } from '@/db/schema'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export const getAllLeagueNames = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.session || !session.user) {
        throw new Error('You must be logged in')
    }

    try {
        const [leagues, count] = await Promise.all([
            await db.query.league.findMany({
                columns: {
                    id: true,
                    name: true,
                },
            }),
            await db.$count(league),
        ])

        revalidatePath('/dashboard/leagues')
        return {
            leagues,
            total: count,
        }
    } catch (error) {
        console.error('Error getting all league names', error)
        throw error
    }
}
