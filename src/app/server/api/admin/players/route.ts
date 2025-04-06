import { db } from '@/db'
import { player } from '@/db/schema'
import { and, eq, ilike, or } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    // const league = searchParams.get('league')
    const condition = searchParams.get('condition')
    const nationality = searchParams.get('nationality')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')

    const offset = (page - 1) * limit
    const conditions = []

    if (nationality && nationality !== 'all') {
        conditions.push(eq(player.nationality, nationality))
    }

    if (condition && condition !== 'all') {
        if (condition === 'healthy') {
            conditions.push(eq(player.isInjured, false))
        } else if (condition === 'injured') {
            conditions.push(eq(player.isInjured, true))
        }
    }

    if (search) {
        conditions.push(or(ilike(player.name, `%${search}`), ilike(player.nationality, `%${search}`)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [players, totalCount] = await Promise.all([
        db.query.player.findMany({
            where,
            limit,
            offset,
            with: {
                statistics: {
                    columns: {
                        games: true,
                    },
                    with: {
                        team: {
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
                },
            },
            orderBy: (player, { desc }) => [desc(player.createdAt)],
        }),
        db.$count(player, where),
    ])

    return NextResponse.json({
        players,
        total: totalCount,
    })
}
