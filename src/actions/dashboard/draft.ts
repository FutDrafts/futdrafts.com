'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getFantasyLeagueById, getFantasyLeagueParticipants } from './fantasy'
import { db } from '@/db'
import { draftPick, fantasy, fantasyParticipant } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { shuffleInPlace } from '@/lib/utils'
import { nanoid } from 'nanoid'

export const createDraftPick = async ({
    fantasyLeagueId,
    userId,
    playerId,
    pickNumber,
}: {
    fantasyLeagueId: string
    userId: string
    playerId: string
    pickNumber: number
}) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const fantasyLeague = await getFantasyLeagueById(fantasyLeagueId)

        if (fantasyLeague.status !== 'active' && fantasyLeague.status !== 'pending') {
            throw new Error('League is not Active')
        }

        const nextPick = await db.query.draftPick.findFirst({
            where: and(eq(draftPick.fantasyLeagueId, fantasyLeagueId), eq(draftPick.status, 'pending')),
            orderBy: asc(draftPick.pickNumber),
        })

        if (!nextPick) {
            throw new Error('No more Draft Picks')
        }

        if (nextPick.userId !== userId) {
            throw new Error('Not your turn to make a draft pick')
        }

        if (nextPick.pickNumber !== pickNumber) {
            throw new Error('Invalid Pick Number')
        }

        const existingPlayerPick = await db.query.draftPick.findFirst({
            where: and(
                and(eq(draftPick.fantasyLeagueId, fantasyLeagueId), eq(draftPick.playerId, playerId)),
                eq(draftPick.status, 'completed'),
            ),
        })

        if (existingPlayerPick) {
            throw new Error('Player has already been picked')
        }

        const now = new Date()
        await db
            .update(draftPick)
            .set({
                playerId,
                status: 'completed',
                updatedAt: now,
            })
            .where(eq(draftPick.id, nextPick.id))

        const remainingPicks = await db.query.draftPick.findFirst({
            where: and(eq(draftPick.fantasyLeagueId, fantasyLeagueId), eq(draftPick.status, 'pending')),
        })

        if (!remainingPicks) {
            await db.update(fantasy).set({ draftStatus: true }).where(eq(fantasy.id, fantasyLeagueId))
        }

        const newNextPick = await db.query.draftPick.findFirst({
            where: and(eq(draftPick.fantasyLeagueId, fantasyLeagueId), eq(draftPick.status, 'pending')),
            orderBy: asc(draftPick.pickNumber),
        })

        return newNextPick
    } catch (error) {
        console.error(error)
        throw Error('Error making draft pick')
    }
}

export const startDraft = async ({ fantasyLeagueId }: { fantasyLeagueId: string }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const fantasyLeague = await getFantasyLeagueById(fantasyLeagueId)

        if (!fantasyLeague) {
            throw new Error('Fantasy League Not Found')
        }

        if (fantasyLeague.draftStatus === true) {
            throw new Error('Fantasy League has already finished draft')
        }

        const { participants, total } = await getFantasyLeagueParticipants(fantasyLeagueId)
        const users = participants.map((p) => ({ ...p.user, partipantId: p.id }))

        if (total < 2) {
            throw new Error('Not Enough Members to start draft')
        }

        if (total > participants[0].fantasy.maxPlayer) {
            throw new Error('Too Many Members in your league')
        }

        if (total % 2 !== 0) {
            throw new Error('Member count must be even to start draft')
        }

        shuffleInPlace(users)

        for (let i = 0; i < users.length; i++) {
            const pos = i + 1
            const user = users[i]

            const participant = await db.query.fantasyParticipant.findFirst({
                where: and(eq(fantasyParticipant.fantasyId, fantasyLeagueId), eq(fantasyParticipant.userId, user.id)),
            })

            if (participant) {
                await db
                    .update(fantasyParticipant)
                    .set({
                        draftPosition: pos,
                    })
                    .where(eq(fantasyParticipant.id, participant.id))
            }
        }

        // TODO: make dynamic team size
        // const totalPicks = users.length * 15
        for (let roundNum = 1; roundNum <= 15; roundNum++) {
            const currentOrder = roundNum % 2 === 1 ? users : [...users].reverse()

            for (let i = 0; i < currentOrder.length; i++) {
                const pos = i + 1
                const user = currentOrder[i]
                const pickNumber = (roundNum - 1) * users.length + pos

                await db.insert(draftPick).values({
                    id: nanoid(),
                    userId: user.id,
                    fantasyLeagueId,
                    fantasyParticipantId: user.partipantId,
                    roundNumber: roundNum,
                    pickNumber,
                    playerId: null,
                    status: 'pending',
                })
            }
        }

        const league = await db
            .update(fantasy)
            .set({
                draftStatus: true,
            })
            .where(eq(fantasy.id, fantasyLeagueId))
            .returning()

        return league
    } catch (error) {
        console.error(error)
        throw new Error('Failed to start draft')
    }
}
