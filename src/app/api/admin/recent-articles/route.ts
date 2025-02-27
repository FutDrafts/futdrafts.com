import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { post } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get recent articles (limit to 3)
        const recentPosts = await db.query.post.findMany({
            limit: 3,
            orderBy: [desc(post.createdAt)],
            with: {
                author: true,
            },
        })

        return NextResponse.json({ articles: recentPosts })
    } catch (error) {
        console.error('Error fetching recent articles:', error)
        return NextResponse.json({ error: 'Failed to fetch recent articles' }, { status: 500 })
    }
}
