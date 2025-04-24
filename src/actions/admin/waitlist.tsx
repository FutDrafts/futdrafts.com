'use server'

import { db } from '@/db'
import { waitlistUsers } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import WaitlistLaunchNotification from '@/lib/templates/waitlist-launch'

const notifySchema = z.object({
    id: z.number(),
    notified: z.boolean(),
})

export type NotifyWaitlistUserData = z.infer<typeof notifySchema>

export async function updateWaitlistUserNotificationStatus(data: NotifyWaitlistUserData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.session || !session.user) {
            return { success: false, error: 'You must be logged in' }
        }

        if (session.user.role !== 'admin') {
            return { success: false, error: 'You are unauthorized to perform this action' }
        }

        const result = notifySchema.safeParse(data)
        if (!result.success) {
            return { success: false, error: 'Invalid data provided' }
        }

        await db
            .update(waitlistUsers)
            .set({
                notified: result.data.notified,
            })
            .where(eq(waitlistUsers.id, result.data.id))

        return {
            success: true,
        }
    } catch (error) {
        console.error('Error updating waitlist user notification status:', error)
        return { success: false, error: 'Failed to update notification status' }
    }
}

export async function getWaitlistCount() {
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
                totalCount: db.$count(waitlistUsers),
                notifiedCount: db.$count(waitlistUsers, eq(waitlistUsers.notified, true)),
            })
            .from(waitlistUsers)

        if (!data || data.length === 0) {
            return {
                error: 'Failed to fetch waitlist count',
            }
        }

        return {
            totalWaitlist: data[0].totalCount,
            notifiedUsers: data[0].notifiedCount,
            notNotifiedUsers: data[0].totalCount - data[0].notifiedCount,
        }
    } catch (error) {
        console.error('Error fetching waitlist count:', error)
        throw error
    }
}

export async function sendWaitlistNotificationEmail(userId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.session || !session.user) {
            return { success: false, error: 'You must be logged in' }
        }

        if (session.user.role !== 'admin') {
            return { success: false, error: 'You are unauthorized to perform this action' }
        }

        // Get the user's email
        const user = await db.query.waitlistUsers.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        // Send the email
        await sendEmail({
            to: user.email,
            subject: 'FutDrafts is now available!',
            Template: <WaitlistLaunchNotification />,
        })

        // Update user as notified
        await db
            .update(waitlistUsers)
            .set({
                notified: true,
            })
            .where(eq(waitlistUsers.id, userId))

        return {
            success: true,
        }
    } catch (error) {
        console.error('Error sending waitlist notification email:', error)
        return { success: false, error: 'Failed to send notification email' }
    }
}
