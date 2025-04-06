import { db } from '@/db'
import { team } from '@/db/schema'
import { and, eq, ilike, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const national = searchParams.get('national')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')

    const nationalCondition = national === 'international'
    const offset = (page - 1) * limit
    const conditions = []

    if (national && national !== 'all') {
        conditions.push(eq(team.isNational, nationalCondition))
    }

    if (search) {
        conditions.push(or(ilike(team.name, `%${search}%`), ilike(team.code, `%${search}%`)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    try {
        const [teams, totalCount] = await Promise.all([
            db.query.team.findMany({
                where,
                limit,
                offset,
                with: {
                    league: {
                        columns: {
                            country: true,
                            name: true,
                            flag: true,
                        },
                    },
                    venue: {
                        columns: {
                            city: true,
                        },
                    },
                },
                orderBy: (team, { desc }) => [desc(team.name)],
            }),
            db.$count(team, where),
        ])

        return NextResponse.json({
            teams,
            total: totalCount,
        })
    } catch (error) {
        console.error('Error Fetching teams:', error)
        return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
    }
}
