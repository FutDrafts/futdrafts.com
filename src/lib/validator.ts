import { z } from 'zod'

// Schema for post creation/update
export const postSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().optional(),
    category: z.enum(['transfers', 'match-reports', 'analysis', 'interviews', 'news']),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    featuredImage: z.string().optional(),
    slug: z.string().optional(),
})

export type PostFormData = z.infer<typeof postSchema>
