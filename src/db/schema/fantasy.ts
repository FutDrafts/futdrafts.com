import { pgTable, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import {
    fantasyStatus,
    draftPickStauts,
    participantRole,
    participantStatus,
    messageType,
    messageStatus,
    draftStatus,
} from './enums'
import { user } from './auth'
import { league, player } from './sports'

export const scoreRules = pgTable('score_rules', {
    id: text().primaryKey().notNull(),
    goals: integer(),
    ownGoal: integer('own_goal'),
    cleanSheet: integer('clean_sheet'),
    penaltySave: integer('penalty_save'),
    penaltyMiss: integer('penalty_miss'),
    yellowCard: integer('yellow_card'),
    redCard: integer('red_card'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const fantasy = pgTable('fantasy', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    ownerId: text('owner_id').notNull(),
    leagueId: text('league_id').notNull(),
    scoreRulesId: text('score_rules_id').notNull(),
    status: fantasyStatus().default('pending').notNull(),
    minimumPlayer: integer('minimum_player').default(2).notNull(),
    maximumPlayer: integer('maximum_player').default(8).notNull(),
    isPrivate: boolean('is_private').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    joinCode: text('join_code').notNull(),
    slug: text().notNull(),
    description: text(),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    draftStart: timestamp('draft_start'),
    draftStatus: draftStatus('draft_status').default('pending').notNull(),
    pickNumber: integer('pick_number').default(1),
})

export const fantasyParticipant = pgTable('fantasy_participant', {
    id: text().primaryKey().notNull(),
    fantasyId: text('fantasy_id').notNull(),
    userId: text('user_id').notNull(),
    role: participantRole().default('player').notNull(),
    status: participantStatus().default('pending').notNull(),
    teamName: text('team_name'),
    points: integer().default(0),
    rank: integer().default(1),
    lastActive: timestamp('last_active'),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    draftPosition: integer('draft_position'),
})

export const chatMessage = pgTable('chat_message', {
    id: text().primaryKey().notNull(),
    leagueId: text('league_id').notNull(),
    senderId: text('sender_id').notNull(),
    content: text().notNull(),
    type: messageType().default('text').notNull(),
    status: messageStatus().default('sent').notNull(),
    replyToId: text('reply_to_id'),
    metadata: jsonb(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const draftsPicks = pgTable('drafts_picks', {
    id: text().primaryKey().notNull(),
    fantasyLeagueId: text('fantasy_league_id').notNull(),
    playerId: text('player_id'),
    userId: text('user_id').notNull(),
    fantasyParticipantId: text('fantasy_participant_id').notNull(),
    pickNumber: integer('pick_number').notNull(),
    roundNumber: integer('round_number').notNull(),
    status: draftPickStauts().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const scoreRulesRelations = relations(scoreRules, ({ many }) => ({
    fantasies: many(fantasy),
}))

export const fantasyRelations = relations(fantasy, ({ one, many }) => ({
    league: one(league, {
        fields: [fantasy.leagueId],
        references: [league.id],
    }),
    user: one(user, {
        fields: [fantasy.ownerId],
        references: [user.id],
    }),
    scoreRule: one(scoreRules, {
        fields: [fantasy.scoreRulesId],
        references: [scoreRules.id],
    }),
    chatMessages: many(chatMessage),
    fantasyParticipants: many(fantasyParticipant),
}))

export const fantasyParticipantRelations = relations(fantasyParticipant, ({ one, many }) => ({
    fantasy: one(fantasy, {
        fields: [fantasyParticipant.fantasyId],
        references: [fantasy.id],
    }),
    user: one(user, {
        fields: [fantasyParticipant.userId],
        references: [user.id],
    }),
    draftsPicks: many(draftsPicks),
}))

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
    user: one(user, {
        fields: [chatMessage.senderId],
        references: [user.id],
    }),
    fantasy: one(fantasy, {
        fields: [chatMessage.leagueId],
        references: [fantasy.id],
    }),
}))

export const draftsPicksRelations = relations(draftsPicks, ({ one }) => ({
    fantasyLeague: one(fantasy, {
        fields: [draftsPicks.fantasyLeagueId],
        references: [fantasy.id],
    }),
    player: one(player, {
        fields: [draftsPicks.playerId],
        references: [player.id],
    }),
    user: one(user, {
        fields: [draftsPicks.userId],
        references: [user.id],
    }),
    fantasyParticipant: one(fantasyParticipant, {
        fields: [draftsPicks.fantasyParticipantId],
        references: [fantasyParticipant.id],
    }),
}))
