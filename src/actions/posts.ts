'use server'

import { db } from '@/db'
import { post, PostCategory } from '@/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { postSchema, type PostFormData } from '@/lib/validator'

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .concat('-', nanoid(6))
}

// Check if user is admin
async function isAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        return false
    }

    return session.user.role === 'admin'
}

// Create a new post
export async function createPost(formData: PostFormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        throw new Error('You must be logged in to create a post')
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
        throw new Error('Only administrators can create posts')
    }

    const validatedData = postSchema.parse(formData)

    const slug = validatedData.slug || generateSlug(validatedData.title)

    const newPost = {
        id: nanoid(),
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt || '',
        category: validatedData.category,
        status: validatedData.status,
        slug,
        featuredImage: validatedData.featuredImage,
        authorId: session.user.id,
        publishedAt: validatedData.status === 'published' ? new Date() : null,
    }

    await db.insert(post).values(newPost)

    revalidatePath('/news')
    revalidatePath('/admin/news')

    return { success: true, post: newPost }
}

// Update an existing post
export async function updatePost(id: string, formData: PostFormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        throw new Error('You must be logged in to update a post')
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
        throw new Error('Only administrators can update posts')
    }

    const validatedData = postSchema.parse(formData)

    const existingPost = await db.query.post.findFirst({
        where: eq(post.id, id),
    })

    if (!existingPost) {
        throw new Error('Post not found')
    }

    const wasPublished = existingPost.status === 'published'
    const isNowPublished = validatedData.status === 'published'

    const updatedPost = {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt || existingPost.excerpt,
        category: validatedData.category,
        status: validatedData.status,
        slug: validatedData.slug || existingPost.slug,
        featuredImage: validatedData.featuredImage || existingPost.featuredImage,
        publishedAt: !wasPublished && isNowPublished ? new Date() : existingPost.publishedAt,
        updatedAt: new Date(),
    }

    await db.update(post).set(updatedPost).where(eq(post.id, id))

    revalidatePath('/news')
    revalidatePath(`/news/${updatedPost.slug}`)
    revalidatePath('/admin/news')

    return { success: true, post: { ...existingPost, ...updatedPost } }
}

// Delete a post
export async function deletePost(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        throw new Error('You must be logged in to delete a post')
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
        throw new Error('Only administrators can delete posts')
    }

    const existingPost = await db.query.post.findFirst({
        where: eq(post.id, id),
    })

    if (!existingPost) {
        throw new Error('Post not found')
    }

    await db.delete(post).where(eq(post.id, id))

    revalidatePath('/news')
    revalidatePath('/admin/news')

    return { success: true }
}

// Get all posts with pagination
export async function getPosts(options?: {
    page?: number
    limit?: number
    status?: 'draft' | 'published' | 'archived'
    category?: PostCategory
}) {
    const { page = 1, limit = 10, status, category } = options || {}

    const conditions = []

    if (status) {
        conditions.push(eq(post.status, status))
    }

    if (category) {
        conditions.push(eq(post.category, category))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const posts = await db
        .select()
        .from(post)
        .where(whereClause)
        .orderBy(desc(post.createdAt))
        .limit(limit)
        .offset((page - 1) * limit)

    return posts
}

// Get a single post by ID
export async function getPostById(id: string) {
    const result = await db.query.post.findFirst({
        where: eq(post.id, id),
        with: {
            author: true,
        },
    })

    return result
}

// Get a single post by slug
export async function getPostBySlug(slug: string) {
    console.log('getPostBySlug called with slug:', slug)

    try {
        const result = await db.query.post.findFirst({
            where: eq(post.slug, slug),
            with: {
                author: true,
            },
        })

        console.log('Post found:', result ? 'Yes' : 'No')
        if (result) {
            console.log('Post status:', result.status)
        }

        return result
    } catch (error) {
        console.error('Error fetching post by slug:', error)
        return null
    }
}

// Get published posts for public display
export async function getPublishedPosts(options?: { page?: number; limit?: number; category?: PostCategory }) {
    const { page = 1, limit = 10, category } = options || {}

    const conditions = [eq(post.status, 'published')]

    if (category) {
        conditions.push(eq(post.category, category))
    }

    const posts = await db
        .select()
        .from(post)
        .where(and(...conditions))
        .orderBy(desc(post.publishedAt))
        .limit(limit)
        .offset((page - 1) * limit)

    return posts
}
