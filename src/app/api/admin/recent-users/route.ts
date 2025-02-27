import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { user } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get recent users (limit to 3)
        const recentUsers = await db.query.user.findMany({
            limit: 3,
            orderBy: [desc(user.createdAt)],
        })

        return NextResponse.json({ users: recentUsers })
    } catch (error) {
        console.error('Error fetching recent users:', error)
        return NextResponse.json({ error: 'Failed to fetch recent users' }, { status: 500 })
    }
}
