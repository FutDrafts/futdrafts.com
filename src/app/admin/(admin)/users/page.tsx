import TotalUsersCard from './_total-users-card'
import ActiveUsersCard from './_active-users-card'
import BannedUsersCard from './_banned-users-card'
import UsersTable from './_table'
import { getUserCount } from '@/actions/admin/user'
import { toast } from 'sonner'

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
                <TotalUsersCard totalUsers={totalUsers ?? 0} />
                <ActiveUsersCard activeUsers={activeUsers ?? 0} />
                <BannedUsersCard bannedUsers={bannedUsers ?? 0} />
            </div>

            <UsersTable />
        </div>
    )
}
