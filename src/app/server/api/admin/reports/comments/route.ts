import { db } from '@/db'
import { reportComment } from '@/db/schema'
import { auth } from '@/lib/auth'
import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { reportId, content } = await request.json()

        if (!reportId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        await db.insert(reportComment).values({
            id: nanoid(),
            reportId,
            adminId: session.user.id,
            content,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error creating comment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
