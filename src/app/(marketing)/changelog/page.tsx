import { getChangelogEntries } from '@/actions/changelog'
import { ChangelogEntry } from '@/components/changelog/changelog-entry'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function ChangelogPage() {
    const entries = await getChangelogEntries()

    return (
        <div className="container mx-auto py-16">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
                <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
                    Stay up to date with the latest features, improvements, and fixes to FutDrafts
                </p>
            </div>

            <div className="mx-auto max-w-3xl">
                <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-6 pb-8">
                        {entries.map((entry) => (
                            <ChangelogEntry
                                key={entry.id}
                                entry={entry}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
