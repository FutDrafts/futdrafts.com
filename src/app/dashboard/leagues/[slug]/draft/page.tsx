import { Button } from '@/components/ui/button'
import { AlertCircleIcon, ArrowLeftIcon } from 'lucide-react'
import { getFantasyLeagueByCode } from '@/actions/dashboard/fantasy'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { AvailablePlayers } from './available-players'
import { redirect } from 'next/navigation'
import { DraftBoard } from './draft-board'

export default async function DraftPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const fantasyLeague = await getFantasyLeagueByCode(slug)

    if (!fantasyLeague) {
        redirect(`/dashboard/leagues/${slug}`)
    }

    const { id, draftStatus } = fantasyLeague

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="mr-2 mb-2">
                    <Link href={`/dashboard/leagues/${slug}`} className="flex items-center">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                </Button>
                {draftStatus === 'finished' ? (
                    <Alert variant="destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Draft Over</AlertTitle>
                        <AlertDescription>
                            The draft for this league is over. You can now view your team and the league standings.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert variant="default">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Important Draft Information</AlertTitle>
                        <AlertDescription>
                            Once you select a player, your choice is final and cannot be changed. Please review your
                            selection carefully before confirming.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold">{fantasyLeague.name}</h1>
                <p className="text-muted-foreground">
                    {fantasyLeague.league.name} • {fantasyLeague.user.name}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Draft Board */}
                <DraftBoard slug={slug} />

                {/* Available Players */}
                {draftStatus !== 'finished' && <AvailablePlayers slug={slug} fantasyLeagueData={{ id, draftStatus }} />}
            </div>
        </div>
    )
}
