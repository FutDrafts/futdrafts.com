import { Button } from '@/components/ui/button'
import PlayersTable from './_table'
import { PlusIcon } from 'lucide-react'
import { AdminQuickStatCard } from '@/components/admin-quick-stat-card'
import { getPlayerCount } from '@/actions/admin/players'
import { toast } from 'sonner'

export default async function PlayersPage() {
    const { totalPlayers, injuredPlayers, error: playerCountError } = await getPlayerCount()

    if (playerCountError) {
        toast.error(playerCountError)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Players</h1>
                    <p className="text-muted-foreground">Manage players across all leagues</p>
                </div>
                <Button disabled>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Player
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <AdminQuickStatCard
                    title="Total Players"
                    description="All Football Players supported"
                    statistic={totalPlayers ?? 0}
                />
                <AdminQuickStatCard
                    title="Injured Players"
                    description="Injured Players"
                    statistic={injuredPlayers ?? 0}
                />
                <AdminQuickStatCard title="" description="" statistic={0} />
            </div>
            <PlayersTable />
        </div>
    )
}
