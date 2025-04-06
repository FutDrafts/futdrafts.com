import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import FantasyLeaguesTable from './_table'

export default function FantasyLeaguesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Fantasy Leagues</h1>
                    <p className="text-muted-foreground">Manage all Fantasy Leagues</p>
                </div>
                <Button disabled>
                    <PlusIcon className="mr-2 size-4" />
                    Add Fantasy League
                </Button>
            </div>

            <FantasyLeaguesTable />
        </div>
    )
}
