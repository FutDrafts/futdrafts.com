'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getFantasyLeagueByCode, getFantasyLeagueById, getFantasyLeagueParticipants } from './fantasy'
import { db } from '@/db'
import { draftPick, fantasy, fantasyParticipant } from '@/db/schema'
import { and, asc, eq, isNotNull } from 'drizzle-orm'
import { shuffleInPlace } from '@/lib/utils'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export const createDraftPick = async ({ fantasyLeagueId, playerId }: { fantasyLeagueId: string; playerId: string }) => {
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

        if (nextPick.userId !== session.user.id) {
            throw new Error('Not your turn to make a draft pick')
        }

        if (nextPick.pickNumber !== fantasyLeague.pickNumber) {
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

        await db
            .update(fantasy)
            .set({ pickNumber: fantasyLeague.pickNumber + 1 })
            .where(eq(fantasy.id, fantasyLeague.id))

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

        revalidatePath(`/dashboard/leagues/${fantasyLeague.slug}/draft`)
        return newNextPick
    } catch (error) {
        console.error(error)
        throw Error('Error making draft pick')
    }
}

export const startDraft = async (fantasyLeagueId: string) => {
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

export const getAvailableDraftPlayers = async (slug: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const fantasyLeague = await getFantasyLeagueByCode(slug)

        if (!fantasyLeague) {
            throw new Error("Fantasy league doesn't exist")
        }

        const queryOne = await db.query.draftPick.findMany({
            where: isNotNull(draftPick.playerId),
        })

        const queryTwo = await db.query.player.findMany({
            with: {
                statistics: true,
            },
        })

        const leaguePlayers = queryTwo.filter((p) => p.statistics.leagueId === fantasyLeague.leagueId)

        if (queryOne.length < 1) {
            return leaguePlayers
        }

        const draftedPlayerIds = new Set(queryOne.map((pick) => pick.playerId))
        const availablePlayers = leaguePlayers.filter((player) => !draftedPlayerIds.has(player.id))
        return availablePlayers
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get Available Draft Player')
    }
}

export const getFantasyLeagueDraftPicks = async (leagueId: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const results = await db.query.draftPick.findMany({
            where: eq(draftPick.fantasyLeagueId, leagueId),
        })

        console.log('RESULTS', results)

        return results
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get Fantasy League Draft Picks')
    }
}
