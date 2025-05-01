import { NextRequest, NextResponse } from 'next/server'
import { getAvailableDraftPlayers } from '@/actions/dashboard/draft'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    try {
        const players = await getAvailableDraftPlayers(slug)
        return NextResponse.json(players)
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
