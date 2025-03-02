'use server'

import { db } from '@/db'
import { changelog } from '@/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const changelogSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    version: z.string().optional(),
    important: z.boolean().default(false),
    published: z.boolean().default(false),
})

type ChangelogFormData = z.infer<typeof changelogSchema>
type ChangelogEntry = typeof changelog.$inferSelect

// Get all changelog entries
export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
    try {
        const entries = await db
            .select()
            .from(changelog)
            .where(eq(changelog.published, true))
            .orderBy(desc(changelog.date))

        return entries
    } catch (error) {
        console.error('Error fetching changelog entries:', error)
        return []
    }
}

// Get all changelog entries for admin (including unpublished)
export async function getAllChangelogEntries() {
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

        const entries = await db
            .select({
                id: changelog.id,
                title: changelog.title,
                description: changelog.description,
                date: changelog.date,
                version: changelog.version,
                important: changelog.important,
                published: changelog.published,
                authorId: changelog.authorId,
            })
            .from(changelog)
            .orderBy(desc(changelog.date))

        return entries
    } catch (error) {
        console.error('Error fetching all changelog entries:', error)
        throw error
    }
}

// Create a new changelog entry
export async function createChangelogEntry(formData: ChangelogFormData) {
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

        const validatedData = changelogSchema.parse(formData)

        await db.insert(changelog).values({
            id: nanoid(),
            title: validatedData.title,
            description: validatedData.description,
            version: validatedData.version || null,
            important: validatedData.important,
            published: validatedData.published,
            authorId: session.user.id,
        })

        revalidatePath('/changelog')
        revalidatePath('/admin/changelog')
        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        console.error('Error creating changelog entry:', error)
        throw error
    }
}

// Update an existing changelog entry
export async function updateChangelogEntry(id: string, formData: ChangelogFormData) {
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

        const validatedData = changelogSchema.parse(formData)

        const existingEntry = await db.query.changelog.findFirst({
            where: eq(changelog.id, id),
        })

        if (!existingEntry) {
            throw new Error('Changelog entry not found')
        }

        const updatedEntry = {
            title: validatedData.title,
            description: validatedData.description,
            version: validatedData.version || existingEntry.version,
            important: validatedData.important,
            published: validatedData.published,
            updatedAt: new Date(),
        }

        await db.update(changelog).set(updatedEntry).where(eq(changelog.id, id))

        revalidatePath('/changelog')
        revalidatePath('/admin/changelog')
        revalidatePath('/dashboard')

        return { success: true, entry: { ...existingEntry, ...updatedEntry } }
    } catch (error) {
        console.error('Error updating changelog entry:', error)
        throw error
    }
}

// Delete a changelog entry
export async function deleteChangelogEntry(id: string) {
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

        await db.delete(changelog).where(eq(changelog.id, id))

        revalidatePath('/changelog')
        revalidatePath('/admin/changelog')
        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        console.error('Error deleting changelog entry:', error)
        throw error
    }
}
