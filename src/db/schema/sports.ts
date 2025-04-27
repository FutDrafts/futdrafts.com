import { pgTable, text, timestamp, numeric, json, boolean, date, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { fixtureStatus, leagueStatus, venueSurface } from './enums'

export const league = pgTable('league', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    country: text().notNull(),
    logo: text().notNull(),
    flag: text().notNull(),
    season: numeric().notNull(),
    status: leagueStatus().default('disabled'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const player = pgTable('player', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    birthday: date().notNull(),
    nationality: text().notNull(),
    height: numeric().notNull(),
    weight: numeric().notNull(),
    injured: boolean().notNull(),
    profilePicture: text('profile_picture').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    statisticsId: text('statistics_id').notNull(),
})

export const team = pgTable('team', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    logo: text().notNull(),
    leagueId: text('league_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    venueId: text('venue_id'),
    code: text().notNull(),
    founded: numeric().notNull(),
    isNational: boolean('is_national').default(false).notNull(),
})

export const venue = pgTable('venue', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    address: text().notNull(),
    city: text().notNull(),
    capacity: integer().default(0).notNull(),
    surface: venueSurface().default('artificial turf').notNull(),
    image: text(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const fixture = pgTable('fixture', {
    id: text().primaryKey().notNull(),
    referee: text(),
    timezone: text().default('UTC'),
    matchDay: timestamp().notNull(),
    firstHalf: timestamp().notNull(),
    secondHalf: timestamp().notNull(),
    status: fixtureStatus().default('upcoming').notNull(),
    score: json().default({ away: 0, home: 0 }),
    venueId: text()
        .references(() => venue.id)
        .notNull(),
    leagueId: text()
        .references(() => league.id)
        .notNull(),
    homeTeamId: text()
        .references(() => team.id)
        .notNull(),
    awayTeamId: text()
        .references(() => team.id)
        .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const fixtureEvent = pgTable('fixture_events', {
    id: text().primaryKey().notNull(),
    elapsedTime: timestamp(),
    extraTime: timestamp(),
    type: text(),
    detail: text(),
    comments: text(),
    teamId: text(),
    playerId: text(),
    assistPlayerId: text(),
    fixtureId: text(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const playerStatistics = pgTable('player_statistics', {
    id: text().primaryKey().notNull(),
    teamId: text('team_id').notNull(),
    leagueId: text('league_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => player.id),
    games: json('games')
        .$type<{
            appearences: number
            lineups: number
            minutes: number
            number: number | null
            position: string
            rating: string
            captain: boolean
        }>()
        .default({
            appearences: 0,
            lineups: 0,
            minutes: 0,
            number: null,
            position: 'undefined',
            rating: '0.0',
            captain: false,
        }),
    substitutes: json('substitues')
        .$type<{ in: number; out: number; bench: number }>()
        .default({ in: 0, out: 0, bench: 0 }),
    shots: json('shots').$type<{ total: number; on_target: number }>().default({ total: 0, on_target: 0 }),
    goals: json('goals').$type<{ total: number; conceded: number; assists: number; saves: number }>().default({
        total: 0,
        conceded: 0,
        assists: 0,
        saves: 0,
    }),
    passes: json('passes')
        .$type<{ total: number; key_assist: number; accuracy: number | null }>()
        .default({ total: 0, key_assist: 0, accuracy: 0 }),
    tackles: json('tackles')
        .$type<{
            total: number
            blocks: number
            interceptions: number
        }>()
        .default({ total: 0, blocks: 0, interceptions: 0 }),
    duels: json('duels').$type<{ total: number; won: number }>().default({ total: 0, won: 0 }),
    dribbles: json('dribbles').$type<{ attempts: number; success: number; past: number | null }>().default({
        attempts: 0,
        success: 0,
        past: null,
    }),
    fouls: json('fouls')
        .$type<{
            drawn: number
            committed: number
        }>()
        .default({
            drawn: 0,
            committed: 0,
        }),
    cards: json('cards')
        .$type<{
            yellow: number
            yellowToRed: number
            red: number
        }>()
        .default({ yellow: 0, yellowToRed: 0, red: 0 }),
    penalty: json('penalty')
        .$type<{
            won: number | null
            committed: number | null
            scored: number | null
            missed: number | null
            saved: number | null
        }>()
        .default({
            won: null,
            committed: null,
            scored: 0,
            missed: 0,
            saved: null,
        }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const venueRelations = relations(venue, ({ many }) => ({
    fixtures: many(fixture),
    teams: many(team),
}))

export const fixtureRelations = relations(fixture, ({ one, many }) => ({
    venue: one(venue, {
        fields: [fixture.venueId],
        references: [venue.id],
    }),
    league: one(league, {
        fields: [fixture.leagueId],
        references: [league.id],
    }),
    homeTeam: one(team, {
        fields: [fixture.homeTeamId],
        references: [team.id],
    }),
    awayTeam: one(team, {
        fields: [fixture.awayTeamId],
        references: [team.id],
    }),
    events: many(fixtureEvent),
}))

export const leagueRelations = relations(league, ({ many }) => ({
    fixtures: many(fixture),
    playerStatistics: many(playerStatistics),
}))

export const playerRelations = relations(player, ({ one }) => ({
    playerStatistics: one(playerStatistics, { fields: [player.statisticsId], references: [playerStatistics.id] }),
}))

export const teamRelations = relations(team, ({ many, one }) => ({
    playerStatistics: many(playerStatistics),
    venue: one(venue, {
        fields: [team.venueId],
        references: [venue.id],
    }),
    league: one(league, {
        fields: [team.leagueId],
        references: [league.id],
    }),
}))

export const playerStatisticsRelations = relations(playerStatistics, ({ one }) => ({
    player: one(player, {
        fields: [playerStatistics.userId],
        references: [player.id],
    }),
    team: one(team, {
        fields: [playerStatistics.teamId],
        references: [team.id],
    }),
    league: one(league, {
        fields: [playerStatistics.leagueId],
        references: [league.id],
    }),
}))

export const fixtureEventRelations = relations(fixtureEvent, ({ one }) => ({
    fixture: one(fixture, {
        fields: [fixtureEvent.fixtureId],
        references: [fixture.id],
    }),
    team: one(team, {
        fields: [fixtureEvent.teamId],
        references: [team.id],
    }),
    player: one(player, {
        fields: [fixtureEvent.playerId],
        references: [player.id],
    }),
    assist: one(player, {
        fields: [fixtureEvent.assistPlayerId],
        references: [player.id],
    }),
}))
