import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Users, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { getFantasyLeagueByCode, isMemberOfLeague } from '@/actions/dashboard/fantasy'
import { JoinForm } from './_form'
import { redirect } from 'next/navigation'

export default async function JoinLeaguePage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { slug } = await params
    const { joinCode } = await searchParams

    const league = await getFantasyLeagueByCode(slug)

    if (!league) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">Fantasy league not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isMember = await isMemberOfLeague({ leagueId: league.id })

    if (isMember) {
        redirect(`/dashboard/leagues/${league.slug}`)
    }

    if (!joinCode && league.isPrivate) {
        redirect('/dashboard/leagues')
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/leagues/${slug}`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">Join League</h1>
                        <Badge variant="outline" className="font-mono">
                            {slug}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Join {league.name}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>League Requirements</CardTitle>
                    <CardDescription>Review the requirements before joining</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* <div className="space-y-2">
                            <Label>Entry Fee</Label>
                            <div className="flex items-center gap-2">
                                <Trophy className="text-muted-foreground h-4 w-4" />
                                <span className="font-medium">{league.entryFee.toLocaleString()} points</span>
                            </div>
                        </div> */}

                        <div className="space-y-2">
                            <Label>Participants</Label>
                            <div className="flex items-center gap-2">
                                <Users className="text-muted-foreground h-4 w-4" />
                                <span className="font-medium">
                                    {league.fantasyParticipants.length}/{league.maximumPlayer} players
                                </span>
                            </div>
                        </div>
                    </div>

                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            By joining this league, you agree to commit until{' '}
                            {league.endDate && new Date(league.endDate).toLocaleDateString()}.
                        </AlertDescription>
                    </Alert>

                    <JoinForm slug={slug} league={league} joinCode={joinCode ?? ''} />
                </CardContent>
            </Card>
        </div>
    )
}
