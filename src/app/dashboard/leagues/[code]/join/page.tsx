'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatLeagueCode } from '@/lib/utils'

// Mock data - replace with real data fetching
const leagueData = {
    code: 'PREM-2X4Y-9Z7W',
    name: 'Premier Fantasy Masters',
    description: 'The ultimate Premier League fantasy experience',
    type: 'private',
    maxParticipants: 100,
    currentParticipants: 45,
    entryFee: 1000,
    prizePool: 50000,
    startDate: '2024-02-25',
    endDate: '2024-05-19',
    inviteRequired: true,
}

export default function JoinLeaguePage({ params }: { params: Promise<{ code: string }> }) {
    const router = useRouter()

    const { code } = use(params)
    const [loading, setLoading] = useState(false)
    const [inviteCode, setInviteCode] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // TODO: Implement league join API call
            // await joinLeague(code, inviteCode)
            router.push(`/dashboard/leagues/${code}`)
        } catch (error) {
            setError('Failed to join league. Please check your invite code and try again.')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/leagues/${code}`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">Join League</h1>
                        <Badge variant="outline" className="font-mono">
                            {formatLeagueCode(code)}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Join {leagueData.name}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>League Requirements</CardTitle>
                    <CardDescription>Review the requirements before joining</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Entry Fee</Label>
                            <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{leagueData.entryFee.toLocaleString()} points</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Participants</Label>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {leagueData.currentParticipants}/{leagueData.maxParticipants} players
                                </span>
                            </div>
                        </div>
                    </div>

                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            By joining this league, you agree to commit until{' '}
                            {new Date(leagueData.endDate).toLocaleDateString()}. The entry fee will be deducted from
                            your points balance.
                        </AlertDescription>
                    </Alert>

                    <form onSubmit={handleJoin} className="space-y-4">
                        {leagueData.inviteRequired && (
                            <div className="space-y-2">
                                <Label htmlFor="inviteCode">Invite Code</Label>
                                <Input
                                    id="inviteCode"
                                    placeholder="Enter the league invite code"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" asChild>
                                <Link href={`/dashboard/leagues/${code}`}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    'Join League'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
