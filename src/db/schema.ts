import { relations } from 'drizzle-orm'
import {
    pgTable,
    text,
    timestamp,
    boolean,
    json,
    jsonb,
    pgEnum,
    serial,
    date,
    numeric,
    uuid,
    integer,
} from 'drizzle-orm/pg-core'

const reportCategories = [
    'harassment',
    'spam',
    'inappropriate_behavior',
    'hate_speech',
    'cheating',
    'impersonation',
    'other',
] as const

const postStatuses = ['draft', 'published', 'archived'] as const
export type PostStatus = (typeof postStatuses)[number]
export const postStatusEnum = pgEnum('post_status', postStatuses)

const postCategories = ['transfers', 'match-reports', 'analysis', 'interviews', 'news'] as const
export type PostCategory = (typeof postCategories)[number]
export const postCategoryEnum = pgEnum('post_category', postCategories)

const leagueStatuses = ['active', 'upcoming', 'disabled'] as const
export type LeagueStatus = (typeof leagueStatuses)[number]
export const leagueStatusEnum = pgEnum('league_status', leagueStatuses)

export type ReportCategory = (typeof reportCategories)[number]
export const reportCategoryEnum = pgEnum('report_category', reportCategories)

const reportStatuses = ['pending', 'resolved', 'dismissed'] as const
export type ReportStatus = (typeof reportStatuses)[number]
export const reportStatusEnum = pgEnum('report_status', reportStatuses)

const venueSurfaces = ['artificial turf'] as const
export type VenueSurface = (typeof venueSurfaces)[number]
export const venueSurfaceEnum = pgEnum('venue_surface', venueSurfaces)

export const post = pgTable('post', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    status: postStatusEnum('status').notNull().default('draft'),
    category: postCategoryEnum('category').notNull(),
    featuredImage: text('featured_image').default(
        'https://4z1m6cqolm.ufs.sh/f/e50LOf69dOrq8oaYBbjfANBJDxULOQeVPkXYuvlmMWnc6C3t',
    ),
    authorId: text('author_id')
        .notNull()
        .references(() => user.id),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const postRelations = relations(post, ({ one }) => ({
    author: one(user, {
        fields: [post.authorId],
        references: [user.id],
    }),
}))

export const config = pgTable('config', {
    key: text('key').primaryKey(),
    value: json('value').notNull(),
    updatedBy: text('updated_by')
        .notNull()
        .references(() => user.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const report = pgTable('report', {
    id: text('id').primaryKey(),
    reportedUserId: text('reported_user_id').notNull(),
    reportedByUserId: text('reported_by_user_id').notNull(),
    reason: text('reason').notNull(),
    category: reportCategoryEnum('category').notNull(),
    details: text('details'),
    status: reportStatusEnum('status').notNull().default('pending'),
    adminNotes: text('admin_notes'),
    resolvedByUserId: text('resolved_by_user_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const reportRelations = relations(report, ({ one, many }) => ({
    reportedUser: one(user, {
        fields: [report.reportedUserId],
        references: [user.id],
    }),
    reportedByUser: one(user, {
        fields: [report.reportedByUserId],
        references: [user.id],
    }),
    resolvedByUser: one(user, {
        fields: [report.resolvedByUserId],
        references: [user.id],
    }),
    comments: many(reportComment),
}))

export const reportComment = pgTable('report_comment', {
    id: text('id').primaryKey(),
    reportId: text('report_id')
        .notNull()
        .references(() => report.id, { onDelete: 'cascade' }),
    adminId: text('admin_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const reportCommentRelations = relations(reportComment, ({ one }) => ({
    report: one(report, {
        fields: [reportComment.reportId],
        references: [report.id],
    }),
    admin: one(user, {
        fields: [reportComment.adminId],
        references: [user.id],
    }),
}))

export const waitlistUsers = pgTable('waitlist_users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    notified: boolean('notified').notNull().default(false),
    signupDate: timestamp('signup_date').notNull().defaultNow(),
})

export const changelog = pgTable('changelog', {
    id: text('id').primaryKey().notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    version: text('version'),
    date: timestamp('date').defaultNow().notNull(),
    important: boolean('important').default(false),
    published: boolean('published').default(false),
    authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const league = pgTable('league', {
    id: text('id').primaryKey().notNull().unique(),
    name: text('name').notNull(),
    country: text('country').notNull(),
    logo: text('logo').notNull(),
    flag: text('flag').notNull(),
    season: numeric('season').notNull(),
    status: leagueStatusEnum('status').default('disabled'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const leagueRelations = relations(league, ({ many }) => ({
    teams: many(team),
    playerStatistics: many(playerStatistics),
    fixtures: many(fixture),
}))

export const team = pgTable('team', {
    id: text('id').primaryKey().notNull().unique(),
    leagueId: text('league_id'),
    venueId: text('venue_id'),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    logo: text('logo').notNull(),
    founded: numeric('founded').notNull(),
    isNational: boolean('is_national').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const teamRelations = relations(team, ({ one }) => ({
    league: one(league, {
        fields: [team.leagueId],
        references: [league.id],
    }),
    venue: one(venue, {
        fields: [team.venueId],
        references: [venue.id],
    }),
}))

export const venue = pgTable('venue', {
    id: text('id').primaryKey().notNull().unique(),
    teamId: text('team_id').notNull(),
    name: text('name').notNull().unique(),
    address: text('address').unique().notNull(),
    city: text('city').notNull(),
    capacity: integer('capacity').notNull().default(0),
    surface: venueSurfaceEnum('surface').notNull().default('artificial turf'),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const venueRelations = relations(venue, ({ one }) => ({
    team: one(team, {
        fields: [venue.teamId],
        references: [team.id],
    }),
}))

export const fixture = pgTable('fixture', {
    id: text('id').primaryKey().unique(),
    leagueId: text('id').notNull(),
    home: text('home')
        .notNull()
        .references(() => team.id),
    away: text('away')
        .notNull()
        .references(() => team.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const fixtureRelations = relations(fixture, ({ one }) => ({
    league: one(league, {
        fields: [fixture.leagueId],
        references: [league.id],
    }),
}))

export const player = pgTable('player', {
    id: text('id').primaryKey().unique(),
    name: text('name').notNull(),
    birthday: date('birthday').notNull(),
    nationality: text('nationality').notNull(),
    height: numeric('height').notNull(),
    weight: numeric('weight').notNull(),
    isInjured: boolean('injured').notNull(),
    profilePicture: text('profile_picture').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const playerRelations = relations(player, ({ many }) => ({
    statistics: many(playerStatistics),
}))

export const playerStatistics = pgTable('player_statistics', {
    id: uuid('id').defaultRandom().primaryKey(),
    playerId: text('user_id')
        .notNull()
        .references(() => player.id),
    teamId: text('team_id')
        .notNull()
        .references(() => team.id),
    leagueId: text('league_id')
        .notNull()
        .references(() => league.id),
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
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const playerStatisticsRelations = relations(playerStatistics, ({ one }) => ({
    player: one(player, {
        fields: [playerStatistics.playerId],
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

// SCHEMA GENERATED BY BETTER-AUTH
// DO NOT EDIT TABLES UNDER THIS COMMENT

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    role: text('role'),
    banned: boolean('banned').default(false).notNull(),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),
    username: text('username').unique(),
    displayUsername: text('display_username'),
    lastLogin: timestamp('last_login').notNull(),
})

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
})

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
})

export const jwks = pgTable('jwks', {
    id: text('id').primaryKey(),
    publicKey: text('public_key').notNull(),
    privateKey: text('private_key').notNull(),
    createdAt: timestamp('created_at').notNull(),
})
