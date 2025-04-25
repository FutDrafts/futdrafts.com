import { fantasy, fantasyParticipant } from '@/db/schema'

export interface ParticipantType {
    id: string
    rank: number
    teamName: string
    points: number
    role: string
    user: {
        name: string
        image: string | null
        username: string
    }
}

export interface ScoreRuleType {
    goals: number
    ownGoal: number
    cleanSheet: number
    penaltySave: number
    penaltyMiss: number
    yellowCard: number
    redCard: number
}

export type FantasyLeagueType = typeof fantasy.$inferSelect & {
    user: {
        name: string
        username: string
        image: string | null
    }
    league: {
        name: string
    }
    scoreRule: {
        goals: number | null
        ownGoal: number | null
        cleanSheet: number | null
        penaltySave: number | null
        penaltyMiss: number | null
        yellowCard: number | null
        redCard: number | null
    }
    fantasyParticipants: (typeof fantasyParticipant.$inferSelect & {
        user: {
            name: string
            image: string | null
            username: string
        }
    })[]
}
