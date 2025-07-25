import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { changelog } from '@/db/schema'
import ReactMarkdown from 'react-markdown'

type ChangelogEntry = typeof changelog.$inferSelect

interface ChangelogEntryProps {
    entry: ChangelogEntry
}

export function ChangelogEntry({ entry }: ChangelogEntryProps) {
    const formattedDate = formatDistanceToNow(new Date(entry.date), { addSuffix: true })

    return (
        <div className={cn('rounded-lg border p-4 transition-colors')}>
            <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{entry.title}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">v{entry.version}</span>
                    {entry.important && (
                        <Badge variant="outline" className="bg-primary text-primary-foreground text-xs">
                            Important
                        </Badge>
                    )}
                </div>
            </div>
            <div className="prose dark:prose-invert prose-sm mb-2 max-w-none">
                <ReactMarkdown>{entry.description}</ReactMarkdown>
            </div>
            <p className="text-muted-foreground text-xs">{formattedDate}</p>
        </div>
    )
}
