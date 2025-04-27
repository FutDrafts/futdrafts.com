import { pgEnum } from 'drizzle-orm/pg-core'

export const draftPickStauts = pgEnum('draft_pick_status', ['pending', 'completed'])
export const fantasyStatus = pgEnum('fantasy_status', ['pending', 'active', 'ended', 'cancelled'])
export const fixtureStatus = pgEnum('fixture_status', ['upcoming', 'in_progress', 'finished', 'cancelled'])
export const leagueStatus = pgEnum('league_status', ['active', 'upcoming', 'disabled'])
export const messageStatus = pgEnum('message_status', ['sent', 'delivered', 'read'])
export const messageType = pgEnum('message_type', ['text', 'system', 'notification'])
export const participantRole = pgEnum('participant_role', ['owner', 'admin', 'player'])
export const participantStatus = pgEnum('participant_status', ['pending', 'active', 'banned'])
export const postCategory = pgEnum('post_category', ['transfers', 'match-reports', 'analysis', 'interviews', 'news'])
export const postStatus = pgEnum('post_status', ['draft', 'published', 'archived'])
export const reportCategory = pgEnum('report_category', [
    'harassment',
    'spam',
    'inappropriate_behavior',
    'hate_speech',
    'cheating',
    'impersonation',
    'other',
])
export const reportStatus = pgEnum('report_status', ['pending', 'resolved', 'dismissed'])
export const venueSurface = pgEnum('venue_surface', ['artificial turf', 'grass'])
export const draftStatus = pgEnum('draft_status', ['pending', 'in-progress', 'finished'])
