'use server'

import { db } from '@/db'
import { waitlistUsers } from '@/db/schema'
import { sendEmail } from '@/lib/email'
import WaitlistConfirmation from '@/lib/templates/waitlist'
import { z } from 'zod'

// Define schema for validation
const waitlistSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>

export async function joinWaitlist(data: WaitlistFormData) {
    // Validate the input
    const result = waitlistSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.errors[0]?.message || 'Invalid email' }
    }

    try {
        // Check if email already exists
        const existingUser = await db.query.waitlistUsers.findFirst({
            where: (users, { eq }) => eq(users.email, result.data.email),
        })

        if (existingUser) {
            return { success: false, error: "You're already on our waitlist!" }
        }

        // Insert into waitlist table
        await db.insert(waitlistUsers).values({
            email: result.data.email,
            signupDate: new Date(),
        })

        await sendEmail({
            to: result.data.email,
            subject: 'Welcome to the waitlist',
            Template: <WaitlistConfirmation estimatedLaunchDate="1st May 2025" />,
        })

        return { success: true }
    } catch (error) {
        console.error('Error adding to waitlist:', error)
        return { success: false, error: 'Failed to join waitlist. Please try again.' }
    }
}
