import { db } from '@/db'
import { report } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const reportData = await db.query.report.findFirst({
            where: eq(report.id, id),
            with: {
                reportedUser: true,
                reportedByUser: true,
                resolvedByUser: true,
                comments: {
                    with: {
                        admin: true,
                    },
                },
            },
        })

        if (!reportData) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 })
        }

        return NextResponse.json(reportData)
    } catch (error) {
        console.error('Error fetching report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
