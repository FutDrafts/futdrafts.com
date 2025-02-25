import UsersTable from './_table'
import { getUserCount } from '@/actions/admin/user'
import { toast } from 'sonner'
import { AdminQuickStatCard } from '@/components/admin-quick-stat-card'

export default async function UserManagement() {
    const { totalUsers, activeUsers, bannedUsers, error: userCountError } = await getUserCount()

    if (userCountError) {
        toast.error(userCountError)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <AdminQuickStatCard title="Total Users" description="All time users" statistic={totalUsers ?? 0} />
                <AdminQuickStatCard title="Active Users" description="Active users" statistic={activeUsers ?? 0} />
                <AdminQuickStatCard title="Banned Users" description="Banned users" statistic={bannedUsers ?? 0} />
            </div>

            <UsersTable />
        </div>
    )
}
