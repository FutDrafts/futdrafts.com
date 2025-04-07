'use server'

import { db } from '@/db'
import { chatMessage } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function getChatMessages(leagueId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const messages = await db.query.chatMessage.findMany({
        where: eq(chatMessage.leagueId, leagueId),
        with: {
            sender: true,
            replyTo: true,
        },
        orderBy: (chatMessage, { asc }) => [asc(chatMessage.createdAt)],
    })

    return messages
}

export async function sendChatMessage(leagueId: string, content: string, replyToId?: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const message = await db
        .insert(chatMessage)
        .values({
            id: crypto.randomUUID(),
            leagueId,
            senderId: session.user.id,
            content,
            replyToId,
            type: 'text',
            status: 'sent',
        })
        .returning()

    return message[0]
}

export async function updateMessageStatus(messageId: string, status: 'delivered' | 'read') {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const message = await db.update(chatMessage).set({ status }).where(eq(chatMessage.id, messageId)).returning()

    return message[0]
}
