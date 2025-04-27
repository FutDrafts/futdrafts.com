import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import FixtureTable from './_table'

export default async function AdminFixturesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Fixtures</h1>
                    <p className="text-muted-foreground">Manage All Fixtures</p>
                </div>
            </div>
            <Button disabled>
                <PlusIcon className="mr-2 size-4" />
                Add Fixture
            </Button>

            <FixtureTable />
        </div>
    )
}
