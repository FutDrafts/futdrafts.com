import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateHeadToHeadSchedule, getFantasyLeagueH2HMatches } from '@/actions/dashboard/draft'

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const fantasyLeagueId = searchParams.get('fantasyLeagueId')

        if (!fantasyLeagueId) {
            return new NextResponse('Fantasy League ID is required', { status: 400 })
        }

        const matches = await getFantasyLeagueH2HMatches(fantasyLeagueId)
        return NextResponse.json(matches)
    } catch (error) {
        console.error('[H2H_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const fantasyLeagueId = searchParams.get('fantasyLeagueId')

        if (!fantasyLeagueId) {
            return new NextResponse('Fantasy League ID is required', { status: 400 })
        }

        const matches = await generateHeadToHeadSchedule(fantasyLeagueId)
        return NextResponse.json(matches)
    } catch (error) {
        console.error('[H2H_POST]', error)
        const message = error instanceof Error ? error.message : 'Internal Error'
        return new NextResponse(message, { status: 500 })
    }
}
