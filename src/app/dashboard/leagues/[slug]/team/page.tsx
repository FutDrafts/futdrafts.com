import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, UserRoundPlus, RotateCcw, Trophy, Flame } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getFantasyLeagueByCode, getFantasyLeagueParticipantById } from '@/actions/dashboard/fantasy'
import Link from 'next/link'
import { player, playerStatistics } from '@/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { TeamView } from './_team-view'

// Define Player type with playerStatistics
type PlayerStatistics = typeof playerStatistics.$inferSelect

type PlayerType = typeof player.$inferSelect & {
    playerStatistics: PlayerStatistics
    age?: string | number
    birthday?: string
}

export default async function LeagueTeamPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect(`/auth/sign-in?ref=/dashboard/leagues/${slug}/team`)
    }

    const [fantasyLeague, participant] = await Promise.all([
        getFantasyLeagueByCode(slug),
        getFantasyLeagueParticipantById(session.user.id, slug),
    ])

    if (!fantasyLeague) {
        redirect(`/auth/sign-in?ref=/dashboard/leagues/${slug}/team`)
    }

    // Get draft picks for the current user
    const userDraftPicks = participant?.draftsPicks || []
    const teamPlayers = userDraftPicks.filter((pick) => pick.player).map((pick) => pick.player) as PlayerType[]

    // Calculate player age from birthday if available

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/leagues/${slug}`}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{participant?.teamName || 'My Team'}</h1>
                            <p className="text-muted-foreground">
                                {fantasyLeague.name} • {fantasyLeague.league.name}
                            </p>
                        </div>
                    </div>
                    {fantasyLeague.draftStatus && (
                        <Button asChild>
                            <Link href={`/dashboard/leagues/${slug}/draft`}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Draft View
                            </Link>
                        </Button>
                    )}
                </div>

                {!fantasyLeague.draftStatus && (
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Draft Not Complete</AlertTitle>
                        <AlertDescription>
                            The draft hasn&apos;t started or completed yet. You&apos;ll need to participate in the draft
                            to build your team.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mb-6 grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Rank</CardTitle>
                            <Trophy className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">#{participant?.rank || '-'}</div>
                            <p className="text-muted-foreground text-xs">
                                Out of {fantasyLeague?.fantasyParticipants.length} teams
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Points</CardTitle>
                            <Flame className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{participant?.points || 0}</div>
                            <p className="text-muted-foreground text-xs">Total fantasy points earned</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Players</CardTitle>
                            <UserRoundPlus className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamPlayers.length}</div>
                            <p className="text-muted-foreground text-xs">Players on roster</p>
                        </CardContent>
                    </Card>
                </div>

                <TeamView slug={slug} players={teamPlayers} league={fantasyLeague} />
            </div>
        </div>
    )
}
