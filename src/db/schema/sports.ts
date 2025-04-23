import {
    pgTable,
    text,
    timestamp,
    numeric,
    unique,
    jsonb,
    boolean,
    date,
    foreignKey,
    integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { fixtureStatus, leagueStatus, venueSurface } from './enums'

export const league = pgTable(
    'league',
    {
        id: text().primaryKey().notNull(),
        name: text().notNull(),
        country: text().notNull(),
        logo: text().notNull(),
        flag: text().notNull(),
        season: numeric().notNull(),
        status: leagueStatus().default('disabled'),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    },
    (table) => [unique('league_id_unique').on(table.id)],
)

export const player = pgTable(
    'player',
    {
        id: text().primaryKey().notNull(),
        name: text().notNull(),
        birthday: date().notNull(),
        nationality: text().notNull(),
        height: numeric().notNull(),
        weight: numeric().notNull(),
        injured: boolean().notNull(),
        profilePicture: text('profile_picture').notNull(),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
        statisticsId: text('statistics_id').notNull(),
    },
    (table) => [unique('player_id_unique').on(table.id)],
)

export const team = pgTable(
    'team',
    {
        id: text().primaryKey().notNull(),
        name: text().notNull(),
        logo: text().notNull(),
        leagueId: text('league_id'),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
        venueId: text('venue_id'),
        code: text().notNull(),
        founded: numeric().notNull(),
        isNational: boolean('is_national').default(false).notNull(),
    },
    (table) => [unique('team_id_unique').on(table.id), unique('team_code_unique').on(table.code)],
)

export const venue = pgTable(
    'venue',
    {
        id: text().primaryKey().notNull(),
        teamId: text('team_id').notNull(),
        name: text().notNull(),
        address: text().notNull(),
        city: text().notNull(),
        capacity: integer().default(0).notNull(),
        surface: venueSurface().default('artificial turf').notNull(),
        image: text(),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    },
    (table) => [unique('venue_name_unique').on(table.name), unique('venue_address_unique').on(table.address)],
)

export const fixture = pgTable(
    'fixture',
    {
        id: text().primaryKey().notNull(),
        homeTeamId: text('home_team_id').notNull(),
        awayTeamId: text('away_team_id').notNull(),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
        matchday: timestamp({ mode: 'string' }).notNull(),
        halftime: timestamp({ mode: 'string' }).notNull(),
        venueId: text('venue_id').notNull(),
        leagueId: text('league_id').notNull(),
        score: jsonb().default({ away: 0, home: 0 }),
        status: fixtureStatus().default('upcoming').notNull(),
    },
    (table) => [unique('fixture_id_unique').on(table.id)],
)

export const playerStatistics = pgTable(
    'player_statistics',
    {
        id: text().primaryKey().notNull(),
        userId: text('user_id').notNull(),
        teamId: text('team_id').notNull(),
        leagueId: text('league_id').notNull(),
        playerId: text('user_id')
            .notNull()
            .references(() => player.id),
        games: jsonb('games')
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
        substitutes: jsonb('substitues')
            .$type<{ in: number; out: number; bench: number }>()
            .default({ in: 0, out: 0, bench: 0 }),
        shots: jsonb('shots').$type<{ total: number; on_target: number }>().default({ total: 0, on_target: 0 }),
        goals: jsonb('goals').$type<{ total: number; conceded: number; assists: number; saves: number }>().default({
            total: 0,
            conceded: 0,
            assists: 0,
            saves: 0,
        }),
        passes: jsonb('passes')
            .$type<{ total: number; key_assist: number; accuracy: number | null }>()
            .default({ total: 0, key_assist: 0, accuracy: 0 }),
        tackles: jsonb('tackles')
            .$type<{
                total: number
                blocks: number
                interceptions: number
            }>()
            .default({ total: 0, blocks: 0, interceptions: 0 }),
        duels: jsonb('duels').$type<{ total: number; won: number }>().default({ total: 0, won: 0 }),
        dribbles: jsonb('dribbles').$type<{ attempts: number; success: number; past: number | null }>().default({
            attempts: 0,
            success: 0,
            past: null,
        }),
        fouls: jsonb('fouls')
            .$type<{
                drawn: number
                committed: number
            }>()
            .default({
                drawn: 0,
                committed: 0,
            }),
        cards: jsonb('cards')
            .$type<{
                yellow: number
                yellowToRed: number
                red: number
            }>()
            .default({ yellow: 0, yellowToRed: 0, red: 0 }),
        penalty: jsonb('penalty')
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
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [player.id],
            name: 'player_statistics_user_id_player_id_fk',
        }),
        foreignKey({
            columns: [table.teamId],
            foreignColumns: [team.id],
            name: 'player_statistics_team_id_team_id_fk',
        }),
        foreignKey({
            columns: [table.leagueId],
            foreignColumns: [league.id],
            name: 'player_statistics_league_id_league_id_fk',
        }),
    ],
)

export const fixtureRelations = relations(fixture, ({ one }) => ({
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
