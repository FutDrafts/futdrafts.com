import { db } from '@/db'
import { league } from '@/db/schema'
import { and, eq, ilike, or } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')

    const offset = (page - 1) * limit
    const conditions = []

    if (status && status !== 'all') {
        if (status === 'active') {
            conditions.push(eq(league.status, 'active'))
        } else if (status === 'upcoming') {
            conditions.push(eq(league.status, 'upcoming'))
        } else if (status === 'disabled') {
            conditions.push(eq(league.status, 'disabled'))
        }
    }

    if (search) {
        conditions.push(or(ilike(league.name, `%${search}%`), ilike(league.country, `%${search}%`)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [leagues, totalCount] = await Promise.all([
        db.query.league.findMany({
            where: where,
            limit,
            offset,
            orderBy: (league, { desc }) => [desc(league.country)],
        }),
        db.$count(league, where),
    ])

    return NextResponse.json({
        leagues,
        total: totalCount,
    })
}
