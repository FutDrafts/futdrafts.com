import { db } from '@/db'
import { fantasy } from '@/db/schema'
import { and, eq, ilike, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

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
            conditions.push(eq(fantasy.status, 'active'))
        } else if (status === 'pending') {
            conditions.push(eq(fantasy.status, 'pending'))
        } else if (status === 'cancelled') {
            conditions.push(eq(fantasy.status, 'cancelled'))
        } else if (status === 'ended') {
            conditions.push(eq(fantasy.status, 'ended'))
        }
    }

    if (search) {
        conditions.push(or(ilike(fantasy.name, `%${search}%`)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    try {
        const [fantasyLeagues, totalCount] = await Promise.all([
            db.query.fantasy.findMany({
                where,
                limit,
                offset,
                orderBy: (fantasy, { desc }) => [desc(fantasy.name)],
                with: {
                    owner: {
                        columns: {
                            name: true,
                        },
                    },
                    league: {
                        columns: {
                            name: true,
                        },
                    },
                },
            }),
            db.$count(fantasy, where),
        ])

        return NextResponse.json({
            fantasyLeagues,
            total: totalCount,
        })
    } catch (error) {
        console.error('Error fetching fantasy leagues:', error)
        return NextResponse.json({ error: 'Failed to fetch leagues' }, { status: 500 })
    }
}
