import { db } from '@/db'
import { fixture } from '@/db/schema'
import { and, ilike, or } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')

    const offset = (page - 1) * limit
    const conditions = []

    if (search) {
        conditions.push(or(ilike(fixture.referee, `%${search}%`)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    try {
        const [fixtures, totalCount] = await Promise.all([
            db.query.fixture.findMany({
                where,
                limit,
                offset,
                orderBy: (fixture, { desc }) => [desc(fixture.matchDay)],
                with: {
                    homeTeam: true,
                    awayTeam: true,
                    league: true,
                    venue: true,
                },
            }),
            db.$count(fixture),
        ])

        return NextResponse.json({
            fixtures,
            total: totalCount,
        })
    } catch (error) {
        console.error('Error fetching fixtures:', error)
        return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 })
    }
}
