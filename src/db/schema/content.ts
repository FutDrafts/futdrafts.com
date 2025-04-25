import { pgTable, text, timestamp, boolean, json, serial } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { postCategory, postStatus, reportCategory, reportStatus } from './enums'
import { user } from './auth'

export const post = pgTable('post', {
    id: text().primaryKey().notNull(),
    title: text().notNull(),
    slug: text().notNull(),
    content: text().notNull(),
    excerpt: text(),
    status: postStatus().default('draft').notNull(),
    category: postCategory().notNull(),
    featuredImage: text('featured_image').default(
        'https://4z1m6cqolm.ufs.sh/f/e50LOf69dOrq8oaYBbjfANBJDxULOQeVPkXYuvlmMWnc6C3t',
    ),
    authorId: text('author_id').notNull(),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const changelog = pgTable('changelog', {
    id: text().primaryKey().notNull(),
    title: text().notNull(),
    description: text().notNull(),
    version: text(),
    date: timestamp().defaultNow().notNull(),
    important: boolean().default(false),
    published: boolean().default(false),
    authorId: text('author_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const report = pgTable('report', {
    id: text().primaryKey().notNull(),
    reportedUserId: text('reported_user_id').notNull(),
    reportedByUserId: text('reported_by_user_id').notNull(),
    reason: text().notNull(),
    category: reportCategory().notNull(),
    details: text(),
    status: reportStatus().default('pending').notNull(),
    adminNotes: text('admin_notes'),
    resolvedByUserId: text('resolved_by_user_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const reportComment = pgTable('report_comment', {
    id: text().primaryKey().notNull(),
    reportId: text('report_id').notNull(),
    adminId: text('admin_id').notNull(),
    content: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const waitlistUsers = pgTable('waitlist_users', {
    id: serial().primaryKey().notNull(),
    email: text().notNull(),
    notified: boolean().default(false).notNull(),
    signupDate: timestamp('signup_date').defaultNow().notNull(),
})

export const config = pgTable('config', {
    key: text().primaryKey().notNull(),
    value: json().notNull(),
    updatedBy: text('updated_by').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const postRelations = relations(post, ({ one }) => ({
    user: one(user, {
        fields: [post.authorId],
        references: [user.id],
    }),
}))

export const changelogRelations = relations(changelog, ({ one }) => ({
    user: one(user, {
        fields: [changelog.authorId],
        references: [user.id],
    }),
}))

export const reportRelations = relations(report, ({ many, one }) => ({
    reportComments: many(reportComment),
    resolvedBy: one(user, { fields: [report.resolvedByUserId], references: [user.id] }),
    reportedBy: one(user, { fields: [report.reportedByUserId], references: [user.id] }),
    reported: one(user, { fields: [report.reportedUserId], references: [user.id] }),
}))

export const reportCommentRelations = relations(reportComment, ({ one }) => ({
    report: one(report, {
        fields: [reportComment.reportId],
        references: [report.id],
    }),
    user: one(user, {
        fields: [reportComment.adminId],
        references: [user.id],
    }),
}))

export const configRelations = relations(config, ({ one }) => ({
    user: one(user, {
        fields: [config.updatedBy],
        references: [user.id],
    }),
}))
