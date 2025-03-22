import { Button } from '@/components/ui/button'
import LeaguesTable from './_table'
import { PlusIcon } from 'lucide-react'

export default function LeaguesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Soccer Leagues</h1>
                    <p className="text-muted-foreground">Manage real-world soccer leagues and competitions</p>
                </div>
                <Button disabled>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add League
                </Button>
            </div>

            <LeaguesTable />
        </div>
    )
}
