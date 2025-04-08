'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type FantasyParticipant = {
    id: string
    userId: string
    teamName: string
    points: number
    rank: number
    status: 'pending' | 'active' | 'banned'
    user: {
        name: string
        image: string | null
    }
}

async function getFantasyParticipants(fantasyId: string): Promise<FantasyParticipant[]> {
    const response = await fetch(`/api/fantasy/${fantasyId}/participants`)
    if (!response.ok) throw new Error('Failed to fetch participants')
    return response.json()
}

export default function HeadToHeadPage() {
    const { slug } = useParams()

    const { data: participants, isLoading } = useQuery({
        queryKey: ['fantasy', slug, 'participants'],
        queryFn: () => getFantasyParticipants(slug as string),
    })

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!participants || participants.length < 2) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p>Not enough participants for head-to-head matchup.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Sort participants by points to get top 2
    const [player1, player2] = [...participants].sort((a, b) => b.points - a.points).slice(0, 2)

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Head to Head</h1>
                <Button variant="outline">Match History</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Match-up</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4">
                        {/* Player 1 */}
                        <div className="flex-1 text-center space-y-4">
                            <Avatar className="w-24 h-24 mx-auto">
                                <AvatarImage src={player1.user.image || undefined} />
                                <AvatarFallback>{player1.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-semibold">{player1.teamName || player1.user.name}</h3>
                                <Badge>{player1.status === 'active' ? 'Active' : 'Offline'}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-sm">
                                <div className="bg-muted p-2 rounded">
                                    <div className="font-medium">Points</div>
                                    <div className="text-xl">{player1.points}</div>
                                </div>
                                <div className="bg-muted p-2 rounded">
                                    <div className="font-medium">Rank</div>
                                    <div className="text-xl">#{player1.rank}</div>
                                </div>
                            </div>
                        </div>

                        {/* VS Indicator */}
                        <div className="text-2xl font-bold opacity-50">VS</div>

                        {/* Player 2 */}
                        <div className="flex-1 text-center space-y-4">
                            <Avatar className="w-24 h-24 mx-auto">
                                <AvatarImage src={player2.user.image || undefined} />
                                <AvatarFallback>{player2.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-semibold">{player2.teamName || player2.user.name}</h3>
                                <Badge variant={player2.status === 'active' ? 'default' : 'outline'}>
                                    {player2.status === 'active' ? 'Active' : 'Offline'}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-sm">
                                <div className="bg-muted p-2 rounded">
                                    <div className="font-medium">Points</div>
                                    <div className="text-xl">{player2.points}</div>
                                </div>
                                <div className="bg-muted p-2 rounded">
                                    <div className="font-medium">Rank</div>
                                    <div className="text-xl">#{player2.rank}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Team Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>Total Wins</span>
                                <span className="font-semibold">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Goals Scored</span>
                                <span className="font-semibold">28</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Clean Sheets</span>
                                <span className="font-semibold">5</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 justify-center">
                            <Badge className="bg-green-500">W</Badge>
                            <Badge className="bg-red-500">L</Badge>
                            <Badge className="bg-green-500">W</Badge>
                            <Badge className="bg-yellow-500">D</Badge>
                            <Badge className="bg-green-500">W</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}