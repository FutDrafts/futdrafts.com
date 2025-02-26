import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json(
        {
            message: 'Next Server running',
        },
        { status: 200 },
    )
}
