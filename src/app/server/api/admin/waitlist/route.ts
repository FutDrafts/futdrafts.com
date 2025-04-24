import { db } from '@/db'
import { waitlistUsers } from '@/db/schema'
import { and, eq, ilike } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const notifiedFilter = searchParams.get('notified')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')

    const offset = (page - 1) * limit

    const conditions = []

    if (notifiedFilter && notifiedFilter !== 'all') {
        if (notifiedFilter === 'notified') {
            conditions.push(eq(waitlistUsers.notified, true))
        } else if (notifiedFilter === 'not-notified') {
            conditions.push(eq(waitlistUsers.notified, false))
        }
    }

    if (search) {
        conditions.push(ilike(waitlistUsers.email, `%${search}%`))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [users, totalCount] = await Promise.all([
        db.query.waitlistUsers.findMany({
            where: where,
            limit,
            offset,
            orderBy: (waitlistUsers, { desc }) => [desc(waitlistUsers.signupDate)],
        }),
        db.$count(waitlistUsers, where),
    ])

    return NextResponse.json({
        users,
        total: totalCount,
    })
}
