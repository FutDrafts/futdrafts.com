import { db } from '@/db'
import { config } from '@/db/schema'
import { auth } from '@/lib/auth'
import { betterFetch } from '@better-fetch/fetch'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

type Session = typeof auth.$Infer.Session

export async function GET() {
    const cfgs = await db.select().from(config)
    return NextResponse.json(cfgs)
}

export async function PATCH(request: Request) {
    const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
        baseURL: new URL(request.url).origin,
        headers: {
            cookie: request.headers.get('cookie') || '',
        },
    })

    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body

    try {
        const updated = await db
            .update(config)
            .set({
                value,
                updatedAt: new Date(),
                updatedBy: session.user.id,
            })
            .where(eq(config.key, key))
            .returning()

        return NextResponse.json(updated[0])
    } catch (error) {
        return NextResponse.json({ error: 'Error updating config', details: error }, { status: 500 })
    }
}
