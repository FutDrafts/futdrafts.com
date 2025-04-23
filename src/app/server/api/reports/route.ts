import { auth } from '@/lib/auth'
import { db } from '@/db'
import { report } from '@/db/schema'
import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                {
                    status: 401,
                },
            )
        }

        const body = await request.json()
        const { reportedUserId, category, reason, details } = body

        if (!reportedUserId || !category || !reason) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                {
                    status: 400,
                },
            )
        }

        // Prevent self-reporting
        if (reportedUserId === session.user.id) {
            return NextResponse.json(
                { error: 'You cannot report yourself' },
                {
                    status: 400,
                },
            )
        }

        const now = new Date()
        await db.insert(report).values({
            id: nanoid(),
            reportedUserId,
            reportedByUserId: session.user.id,
            category,
            reason,
            details: details || null,
            createdAt: now.toDateString(),
            updatedAt: now.toDateString(),
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error creating report:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            {
                status: 500,
            },
        )
    }
}
