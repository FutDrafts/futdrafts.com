'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getFantasyLeagueByCode, getFantasyLeagueById, getFantasyLeagueParticipants } from './fantasy'
import { db } from '@/db'
import { draftsPicks, fantasy, fantasyParticipant, h2hMatch } from '@/db/schema'
import { and, asc, eq, isNotNull, or } from 'drizzle-orm'
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

        const nextPick = await db.query.draftsPicks.findFirst({
            where: and(eq(draftsPicks.fantasyLeagueId, fantasyLeagueId), eq(draftsPicks.status, 'pending')),
            orderBy: asc(draftsPicks.pickNumber),
        })

        if (!nextPick) {
            await db
                .update(fantasy)
                .set({
                    draftStatus: 'finished',
                })
                .where(eq(fantasy.id, draftsPicks.fantasyLeagueId))
            throw new Error('No more Draft Picks')
        }

        if (nextPick.userId !== session.user.id) {
            throw new Error('Not your turn to make a draft pick')
        }

        if (nextPick.pickNumber !== fantasyLeague.pickNumber) {
            throw new Error('Invalid Pick Number')
        }

        const existingPlayerPick = await db.query.draftsPicks.findFirst({
            where: and(
                and(eq(draftsPicks.fantasyLeagueId, fantasyLeagueId), eq(draftsPicks.playerId, playerId)),
                eq(draftsPicks.status, 'completed'),
            ),
        })

        if (existingPlayerPick) {
            throw new Error('Player has already been picked')
        }

        const now = new Date()
        await db
            .update(draftsPicks)
            .set({
                playerId,
                status: 'completed',
                updatedAt: now,
            })
            .where(eq(draftsPicks.id, nextPick.id))

        await db
            .update(fantasy)
            .set({ pickNumber: fantasyLeague.pickNumber + 1 })
            .where(eq(fantasy.id, fantasyLeague.id))

        const remainingPicks = await db.query.draftsPicks.findFirst({
            where: and(eq(draftsPicks.fantasyLeagueId, fantasyLeagueId), eq(draftsPicks.status, 'pending')),
        })

        if (!remainingPicks) {
            await db
                .update(fantasy)
                .set({ draftStatus: 'finished', status: 'active' })
                .where(eq(fantasy.id, fantasyLeagueId))

            await generateHeadToHeadSchedule(fantasyLeagueId)
        }

        const newNextPick = await db.query.draftsPicks.findFirst({
            where: and(eq(draftsPicks.fantasyLeagueId, fantasyLeagueId), eq(draftsPicks.status, 'pending')),
            orderBy: asc(draftsPicks.pickNumber),
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

        if (fantasyLeague.draftStatus === 'finished') {
            throw new Error('Fantasy League has already finished draft')
        }

        const { participants, total } = await getFantasyLeagueParticipants(fantasyLeagueId)
        const users = participants.map((p) => ({ ...p.user, partipantId: p.id }))

        if (total < 2) {
            throw new Error('Not Enough Members to start draft')
        }

        if (total > participants[0].fantasy.maximumPlayer) {
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

                await db.insert(draftsPicks).values({
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
                draftStatus: 'in-progress',
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

        const queryOne = await db.query.draftsPicks.findMany({
            where: and(isNotNull(draftsPicks.playerId), eq(draftsPicks.fantasyLeagueId, fantasyLeague.id)),
        })

        const queryTwo = await db.query.player.findMany({
            with: {
                playerStatistics: true,
            },
        })

        const leaguePlayers = queryTwo.filter((p) => p.playerStatistics.leagueId === fantasyLeague.leagueId)

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
        const results = await db.query.draftsPicks.findMany({
            where: eq(draftsPicks.fantasyLeagueId, leagueId),
        })

        return results
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get Fantasy League Draft Picks')
    }
}

export const getCurrentDraftPick = async (slug: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const results = await db
            .select({ id: fantasy.id, pickNumber: fantasy.pickNumber, status: fantasy.draftStatus })
            .from(fantasy)
            .where(eq(fantasy.slug, slug))

        if (!results || results.length < 1) {
            throw new Error('No Fantasy League')
        }

        const { id: fantasyId, pickNumber, status } = results[0]

        if (!pickNumber) {
            throw new Error('Draft Not Started!')
        }

        const participant = await db
            .select({ participantId: draftsPicks.userId })
            .from(draftsPicks)
            .where(and(eq(draftsPicks.fantasyLeagueId, fantasyId), eq(draftsPicks.pickNumber, pickNumber)))

        if ((!participant || participant.length < 1) && status === 'in-progress') {
            throw new Error('No Player Pick')
        }

        if (participant.length === 1) {
            return participant[0].participantId
        } else {
            return 'ended'
        }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get current draft pick')
    }
}

export const generateHeadToHeadSchedule = async (fantasyLeagueId: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const fantasyLeague = await getFantasyLeagueById(fantasyLeagueId)

        if (!fantasyLeague || !fantasyLeague.startDate || !fantasyLeague.endDate) {
            throw new Error('Fantasy League not found or missing dates')
        }

        // Get all participants
        const { participants } = await getFantasyLeagueParticipants(fantasyLeagueId)
        const activeParticipants = participants.filter((p) => p.status === 'active')

        if (activeParticipants.length < 2) {
            throw new Error('Not enough participants to create schedule')
        }

        // Calculate number of weeks available for scheduling
        const startDate = new Date(fantasyLeague.startDate)
        const endDate = new Date(fantasyLeague.endDate)

        const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const totalWeeks = Math.floor(totalDays / 7)

        // Each participant plays against every other participant once
        // const numParticipants = activeParticipants.length

        // Create a round-robin schedule
        // Circle method: https://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
        const participantIds = activeParticipants.map((p) => p.userId)

        // Make sure all IDs are valid strings
        const validParticipantIds = participantIds.filter((id) => typeof id === 'string')

        // If odd number of participants, add a dummy participant
        if (validParticipantIds.length % 2 !== 0) {
            validParticipantIds.push('bye')
        }

        const rounds = []
        const n = validParticipantIds.length

        // Generate rounds using the circle method
        for (let round = 0; round < n - 1; round++) {
            const matches = []
            for (let i = 0; i < n / 2; i++) {
                // Skip matches with the dummy participant
                if (validParticipantIds[i] !== 'bye' && validParticipantIds[n - 1 - i] !== 'bye') {
                    matches.push({
                        home: validParticipantIds[i],
                        away: validParticipantIds[n - 1 - i],
                    })
                }
            }
            rounds.push(matches)

            // Rotate participants, keeping the first one fixed
            validParticipantIds.splice(1, 0, validParticipantIds.pop()!)
        }

        console.log(`Created ${rounds.length} initial rounds`)

        // We need to create enough rounds to fill the total weeks
        // If we have more weeks than rounds, we need to repeat the schedule
        let fullScheduleRounds = [...rounds]
        while (fullScheduleRounds.length < totalWeeks) {
            fullScheduleRounds = [...fullScheduleRounds, ...rounds]
        }

        console.log(`Created ${fullScheduleRounds.length} total rounds after expansion`)
        console.log(`Creating matches for ${Math.min(fullScheduleRounds.length, totalWeeks)} weeks`)

        // We'll just use the rounds as they are - no home/away doubling
        const h2hMatches = []
        const weekInMs = 7 * 24 * 60 * 60 * 1000

        // Create a mapping of userId to participantId for easier lookup
        const userIdToParticipantId = activeParticipants.reduce(
            (map, participant) => {
                map[participant.userId] = participant.id
                return map
            },
            {} as Record<string, string>,
        )

        for (let weekNum = 0; weekNum < Math.min(fullScheduleRounds.length, totalWeeks); weekNum++) {
            const roundMatches = fullScheduleRounds[weekNum]
            const weekStartDate = new Date(startDate.getTime() + weekNum * weekInMs)
            const weekEndDate = new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000) // Sunday

            for (let i = 0; i < roundMatches.length; i++) {
                const match = roundMatches[i]

                // Map user IDs back to participant IDs
                const homeParticipantId = userIdToParticipantId[match.home]
                const awayParticipantId = userIdToParticipantId[match.away]

                if (homeParticipantId && awayParticipantId) {
                    // Just one match per pairing per week
                    h2hMatches.push({
                        id: nanoid(),
                        fantasyLeagueId,
                        homeParticipantId,
                        awayParticipantId,
                        weekNumber: weekNum + 1,
                        matchNumber: i + 1,
                        startDate: weekStartDate,
                        endDate: weekEndDate,
                        status: 'scheduled' as const,
                    })
                }
            }
        }

        // Clear any existing matches first
        await db.delete(h2hMatch).where(eq(h2hMatch.fantasyLeagueId, fantasyLeagueId))

        // Insert new matches into the database
        for (const match of h2hMatches) {
            await db.insert(h2hMatch).values(match)
        }

        return h2hMatches
    } catch (error) {
        console.error('Error in generateHeadToHeadSchedule:', error)
        throw new Error('Failed to generate head-to-head schedule')
    }
}

// Function to get all h2h matches for a fantasy league
export const getFantasyLeagueH2HMatches = async (fantasyLeagueId: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const matches = await db.query.h2hMatch.findMany({
            where: eq(h2hMatch.fantasyLeagueId, fantasyLeagueId),
            with: {
                homeParticipant: {
                    with: {
                        user: true,
                    },
                },
                awayParticipant: {
                    with: {
                        user: true,
                    },
                },
            },
            orderBy: [asc(h2hMatch.weekNumber), asc(h2hMatch.matchNumber)],
        })

        return matches
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get fantasy league H2H matches')
    }
}

// Function to get h2h matches for a specific participant
export const getParticipantH2HMatches = async (participantId: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    try {
        const matches = await db.query.h2hMatch.findMany({
            where: or(eq(h2hMatch.homeParticipantId, participantId), eq(h2hMatch.awayParticipantId, participantId)),
            with: {
                homeParticipant: {
                    with: {
                        user: true,
                    },
                },
                awayParticipant: {
                    with: {
                        user: true,
                    },
                },
            },
            orderBy: [asc(h2hMatch.weekNumber), asc(h2hMatch.matchNumber)],
        })

        return matches
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get participant H2H matches')
    }
}
