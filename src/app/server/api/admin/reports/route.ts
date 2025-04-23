import { db } from '@/db'
import { report, user } from '@/db/schema'
import { and, eq, ilike, or } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

type ReportCategory =
    | 'harassment'
    | 'spam'
    | 'inappropriate_behavior'
    | 'hate_speech'
    | 'cheating'
    | 'impersonation'
    | 'other'
type ReportStatus = 'pending' | 'resolved' | 'dismissed'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')

    const offset = (page - 1) * limit

    const conditions = []

    if (type && type !== 'all') {
        conditions.push(eq(report.category, type as ReportCategory))
    }

    if (status && status !== 'all') {
        conditions.push(eq(report.status, status as ReportStatus))
    }

    if (search) {
        conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [reports, totalCount] = await Promise.all([
        db.query.report.findMany({
            where: where,
            limit,
            offset,
            orderBy: (report, { desc }) => [desc(report.createdAt)],
            with: {
                reportedBy: true,
                reported: true,
                resolvedBy: true,
                reportComments: {
                    with: {
                        user: true,
                    },
                },
            },
        }),
        db.$count(report, where),
    ])

    return NextResponse.json({
        reports,
        total: totalCount,
    })
}
