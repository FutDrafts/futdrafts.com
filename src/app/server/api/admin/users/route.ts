import { db } from '@/db'
import { user } from '@/db/schema'
import { and, eq, ilike, or } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')

    const offset = (page - 1) * limit

    const conditions = []

    if (role && role !== 'all') {
        conditions.push(eq(user.role, role))
    }

    if (status && status !== 'all') {
        if (status === 'banned') {
            conditions.push(eq(user.banned, true))
        } else if (status === 'active') {
            conditions.push(eq(user.banned, false))
        }
    }

    if (search) {
        conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [users, totalCount] = await Promise.all([
        db.query.user.findMany({
            where: where,
            limit,
            offset,
            orderBy: (user, { desc }) => [desc(user.createdAt)],
        }),
        db.$count(user, where),
    ])

    return NextResponse.json({
        users,
        total: totalCount,
    })
}
