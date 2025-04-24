import WaitlistTable from './_table'
import { getWaitlistCount } from '@/actions/admin/waitlist'
import { toast } from 'sonner'
import { AdminQuickStatCard } from '@/components/admin-quick-stat-card'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminWaitlistUsersPage() {
    const [counts, session] = await Promise.all([
        await getWaitlistCount(),
        await auth.api.getSession({
            headers: await headers(),
        }),
    ])

    if (!session) {
        redirect('/auth/sign-in')
    }

    if (counts.error) {
        toast.error(counts.error)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Waitlist Users</h1>
                <p className="text-muted-foreground">Manage waitlisted users</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <AdminQuickStatCard
                    title="Total Waitlist"
                    description="All waitlisted users"
                    statistic={counts.totalWaitlist ?? 0}
                />
                <AdminQuickStatCard
                    title="Notified Users"
                    description="Notified waitlist users"
                    statistic={counts.notifiedUsers ?? 0}
                />
                <AdminQuickStatCard
                    title="Not Notified"
                    description="Not notified waitlist users"
                    statistic={counts.notNotifiedUsers ?? 0}
                />
            </div>

            <WaitlistTable />
        </div>
    )
}
