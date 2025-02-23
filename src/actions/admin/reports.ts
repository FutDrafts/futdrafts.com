'use server'

import { db } from '@/db'
import { report, ReportStatus } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function getReportCount() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.session || !session.user) {
            throw new Error('You must be logged in')
        }

        if (session.user.role !== 'admin') {
            throw new Error('You are unauthorized to perform this action')
        }

        const data = await db
            .select({
                totalReportCount: db.$count(report),
                resolvedReportCount: db.$count(report, eq(report.status, 'resolved')),
                pendingReportCount: db.$count(report, eq(report.status, 'pending')),
                dismissedReportCount: db.$count(report, eq(report.status, 'dismissed')),
            })
            .from(report)

        if (!data || data.length === 0) {
            return {
                error: 'Failed to fetch report counts',
            }
        }

        return {
            totalReportCount: data[0].totalReportCount,
            resolvedReportCount: data[0].resolvedReportCount,
            pendingReportCount: data[0].pendingReportCount,
            dismissedReportCount: data[0].dismissedReportCount,
        }
    } catch (error) {
        console.error('Error fetching report counts:', error)
        throw error
    }
}

export async function updateReportStatus(reportId: string, newStatus: ReportStatus) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.session || !session.user) {
            throw new Error('You must be logged in')
        }

        if (session.user.role !== 'admin') {
            throw new Error('You are unauthorized to perform this action')
        }

        await db
            .update(report)
            .set({ status: newStatus, updatedAt: new Date(), resolvedByUserId: session.user.id })
            .where(eq(report.id, reportId))
        revalidatePath('/admin/reports')
    } catch (error) {
        console.error('Error updating report status:', error)
        throw error
    }
}
