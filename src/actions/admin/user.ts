'use server'

import { db } from '@/db'
import { user } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function getLimitedUserInfo() {
    try {
        const data = await auth.api.getSession({
            headers: await headers(),
        })

        if (!data?.session || !data.user) {
            throw new Error('You must be logged in')
        }

        if (data.user.role !== 'admin') {
            throw new Error('You are unauthorized to perform this action')
        }

        const { user } = data
        const { name, role, image } = user

        return {
            name,
            role: role ?? 'User',
            profileImage: image ?? undefined,
        }
    } catch (error) {
        console.error('Error fetching limited user info:', error)
        throw error
    }
}

export async function getUserCount() {
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
                totalUsersCount: db.$count(user),
                bannedUsersCount: db.$count(user, eq(user.banned, true)),
            })
            .from(user)

        if (!data || data.length === 0) {
            return {
                error: 'Failed to fetch user count',
            }
        }

        return {
            totalUsers: data[0].totalUsersCount,
            bannedUsers: data[0].bannedUsersCount,
            activeUsers: data[0].totalUsersCount - data[0].bannedUsersCount,
        }
    } catch (error) {
        console.error('Error fetching user count:', error)
        throw error
    }
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'user') {
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

        await db.update(user).set({ role: newRole, updatedAt: new Date() }).where(eq(user.id, userId))
        revalidatePath('/admin/users')
    } catch (error) {
        console.error('Error updating user role:', error)
        throw error
    }
}

interface BanUserOptions {
    reason?: string
    expiryDate?: string | null
}

export async function updateUserBanStatus(userId: string, options?: BanUserOptions) {
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

        const targetUser = await db.query.user.findFirst({
            where: eq(user.id, userId),
        })

        if (!targetUser) {
            throw new Error('The user you are trying to ban does not exist')
        }

        const now = new Date()

        await db
            .update(user)
            .set({
                banned: !targetUser.banned,
                banReason: !targetUser.banned ? options?.reason || null : null,
                banExpires: !targetUser.banned ? (options?.expiryDate ? new Date(options.expiryDate) : null) : null,
                updatedAt: now,
            })
            .where(eq(user.id, userId))

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error('Error updating user ban status:', error)
        throw error
    }
}
