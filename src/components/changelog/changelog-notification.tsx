'use client'

import { useState, useEffect } from 'react'
import { BellIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ChangelogEntry as ChangelogEntryComponent } from './changelog-entry'
import { getChangelogEntries } from '@/actions/changelog'
import { changelog } from '@/db/schema'

type ChangelogEntry = typeof changelog.$inferSelect

export function ChangelogNotification() {
    const [isOpen, setIsOpen] = useState(false)
    const [entries, setEntries] = useState<ChangelogEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load changelogs from the server
        const loadChangelogs = async () => {
            setLoading(true)
            try {
                const changelogs = await getChangelogEntries()

                setEntries(changelogs)
            } catch (error) {
                console.error('Failed to load changelogs:', error)
            } finally {
                setLoading(false)
            }
        }

        loadChangelogs()
    }, [])

    return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Changelog notifications"
            >
                <BellIcon className="h-5 w-5" />
            </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{`What's New`}</DialogTitle>
                        <DialogDescription>Recent updates and improvements to FutDrafts</DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-[400px] pr-4">
                        {loading ? (
                            <div className="flex justify-center py-8">Loading changelogs...</div>
                        ) : entries.length > 0 ? (
                            <div className="space-y-6 pb-4">
                                {entries.map((entry) => (
                                    <ChangelogEntryComponent key={entry.id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No changelog entries available</div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
    )
}
