import { getFantasyLeagueParticipantsBySlug } from '@/actions/dashboard/fantasy'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    try {
        const participants = await getFantasyLeagueParticipantsBySlug(slug)
        return NextResponse.json(participants)
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
