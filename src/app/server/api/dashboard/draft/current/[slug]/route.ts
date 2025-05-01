import { getCurrentDraftPick } from '@/actions/dashboard/draft'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    try {
        const currentPickId = await getCurrentDraftPick(slug)
        return NextResponse.json(currentPickId)
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
