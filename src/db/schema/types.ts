import { changelog, config, post, report, reportComment } from './content'
import { chatMessage, draftsPicks, fantasy, fantasyParticipant, scoreRules } from './fantasy'
import { fixture, fixtureEvent, league, player, playerStatistics, team, venue } from './sports'

// --------------------------------
// Tables
// --------------------------------

export type SoccerLeague = typeof league.$inferSelect
export type SoccerPlayer = typeof player.$inferSelect
export type SoccerPlayerStatistic = typeof playerStatistics.$inferSelect
export type SoccerTeam = typeof team.$inferInsert
export type SoccerVenue = typeof venue.$inferSelect
export type SoccerFixture = typeof fixture.$inferSelect
export type SoccerFixtureEvent = typeof fixtureEvent.$inferSelect

export type FantasyLeague = typeof fantasy.$inferSelect
export type FantasyParticipant = typeof fantasyParticipant.$inferSelect
export type FantasyDraftPick = typeof draftsPicks.$inferSelect
export type FantasyScoringRules = typeof scoreRules.$inferSelect
export type FantasyChatMessage = typeof chatMessage.$inferSelect

export type BlogPost = typeof post.$inferSelect
export type ChangelogPost = typeof changelog.$inferSelect
export type UserReport = typeof report.$inferSelect
export type UserReportComment = typeof reportComment.$inferSelect
export type AppConfig = typeof config.$inferSelect

// --------------------------------
// Enums
// --------------------------------

export type FantasyDraftPickStatusEnum = 'pending' | 'completed'
export type FantasyDraftStatusEnum = 'pending' | 'in-progress' | 'finished'
export type FantasyLeagueStatusEnum = 'pending' | 'active' | 'ended' | 'cancelled'
export type FantasyFixtureStatusEnum = 'upcoming' | 'in_progress' | 'finished' | 'cancelled'
export type FantasyChatMessageStatusEnum = 'sent' | 'delivered' | 'read'
export type FantasyChatMessageTypeEnum = 'text' | 'system' | 'notification'
export type FantasyParticipantRoleEnum = 'owner' | 'admin' | 'player'
export type FantasyParticipantStatusEnum = 'pending' | 'active' | 'banned'

export type SoccerLeagueStatusEnum = 'active' | 'upcoming' | 'disabled'
export type SoccerVenueSurfaceEnum = 'artificial turf' | 'grass'

export type BlogPostCategoryEnum = 'transfers' | 'match-reports' | 'analysis' | 'interviews' | 'new'
export type BlogPostStatusEnum = 'draft' | 'published' | 'archived'
export type UserReportCategoryEnum =
    | 'harassment'
    | 'spam'
    | 'inappropriate_behavior'
    | 'hate_speech'
    | 'cheating'
    | 'impersonation'
    | 'other'
export type UserReportStatusEnum = 'pending' | 'resolved' | 'dismissed'
