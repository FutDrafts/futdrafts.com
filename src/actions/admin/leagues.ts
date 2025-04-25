'use server'

import { db } from '@/db'
import { league } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function updateLeagueStatus(leagueId: string, newStatus: 'active' | 'upcoming' | 'disabled') {
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

        await db.update(league).set({ status: newStatus, updatedAt: new Date() }).where(eq(league.id, leagueId))
        revalidatePath('/admin/leagues')
    } catch (error) {
        console.error('Error updating user role:', error)
        throw error
    }
}
