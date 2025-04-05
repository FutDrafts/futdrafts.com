import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import TeamsTable from "./_table";

export default async function TeamsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Soccer Teams</h1>
                    <p className="text-muted-foreground">Manage real-world soccer teams</p>
                </div>
                <Button disabled>
                    <PlusIcon className="mr-2 h-4 w-4"/>
                    Add Team
                </Button>
            </div>

            <TeamsTable />
        </div>
    )
}