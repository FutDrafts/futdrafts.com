import UsersTable from './_table'
import { getUserCount } from '@/actions/admin/user'
import { toast } from 'sonner'
import { AdminQuickStatCard } from '@/components/admin-quick-stat-card'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function UserManagement() {
    const [counts, session] = await Promise.all([
        await getUserCount(),
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
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <AdminQuickStatCard
                    title="Total Users"
                    description="All time users"
                    statistic={counts.totalUsers ?? 0}
                />
                <AdminQuickStatCard
                    title="Active Users"
                    description="Active users"
                    statistic={counts.activeUsers ?? 0}
                />
                <AdminQuickStatCard
                    title="Banned Users"
                    description="Banned users"
                    statistic={counts.bannedUsers ?? 0}
                />
            </div>

            <UsersTable userId={session?.user.id} />
        </div>
    )
}
