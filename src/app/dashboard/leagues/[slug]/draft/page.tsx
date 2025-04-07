'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getFantasyLeagueByCode } from '@/actions/dashboard/fantasy'

interface Player {
    id: string
    name: string
    position: string
    team: string
    photo: string
}

interface DraftPick {
    id: string
    player: Player
    teamId: string
    teamName: string
    round: number
    pick: number
}

interface Team {
    id: string
    name: string
    owner: string
    picks: DraftPick[]
}

export default function DraftPage() {
    const { slug } = useParams()
    const [players, setPlayers] = useState<Player[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [currentRound, setCurrentRound] = useState(1)
    const [currentPick, setCurrentPick] = useState(1)
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

    const { data: fantasyLeague, isLoading: isLoadingFantasy } = useQuery({
        queryKey: ['fantasy', 'league', slug],
        queryFn: () => getFantasyLeagueByCode(slug as string),
    })

    useEffect(() => {
        if (fantasyLeague) {
            // TODO: Fetch players and teams for this fantasy league
            const mockPlayers: Player[] = [
                {
                    id: '1',
                    name: 'Lionel Messi',
                    position: 'FW',
                    team: 'Inter Miami',
                    photo: 'https://example.com/messi.jpg',
                },
                // Add more mock players
            ]

            const mockTeams: Team[] = [
                {
                    id: '1',
                    name: 'Team 1',
                    owner: 'User 1',
                    picks: [],
                },
                // Add more mock teams
            ]

            setPlayers(mockPlayers)
            setTeams(mockTeams)
        }
    }, [fantasyLeague])

    const handlePlayerSelect = (player: Player) => {
        setSelectedPlayer(player)
    }

    const handleDraftPlayer = async () => {
        if (!selectedPlayer) return

        try {
            // TODO: Implement draft pick API call
            console.log('Drafting player:', selectedPlayer)

            // Update local state
            const updatedTeams = teams.map((team) => {
                if (team.id === teams[currentPick - 1].id) {
                    return {
                        ...team,
                        picks: [
                            ...team.picks,
                            {
                                id: `${currentRound}-${currentPick}`,
                                player: selectedPlayer,
                                teamId: team.id,
                                teamName: team.name,
                                round: currentRound,
                                pick: currentPick,
                            },
                        ],
                    }
                }
                return team
            })

            setTeams(updatedTeams)
            setPlayers(players.filter((p) => p.id !== selectedPlayer.id))
            setSelectedPlayer(null)

            // Update round and pick
            if (currentPick === teams.length) {
                setCurrentRound(currentRound + 1)
                setCurrentPick(1)
            } else {
                setCurrentPick(currentPick + 1)
            }
        } catch (error) {
            console.error('Error drafting player:', error)
        }
    }

    if (isLoadingFantasy) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!fantasyLeague) {
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

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{fantasyLeague.name}</h1>
                <p className="text-muted-foreground">
                    {fantasyLeague.league.name} • {fantasyLeague.owner.name}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Draft Board */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Draft Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teams.map((team) => (
                                <div key={team.id} className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarFallback>{team.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{team.name}</h3>
                                        <p className="text-sm text-gray-500">{team.owner}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {team.picks.map((pick) => (
                                            <Badge key={pick.id} variant="secondary">
                                                {pick.player.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Available Players */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Players</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            <div className="space-y-2">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className={`flex cursor-pointer items-center space-x-4 rounded-lg p-2 ${
                                            selectedPlayer?.id === player.id ? 'bg-primary/10' : 'hover:bg-muted'
                                        }`}
                                        onClick={() => handlePlayerSelect(player)}
                                    >
                                        <Avatar>
                                            <AvatarImage src={player.photo} />
                                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{player.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {player.position} • {player.team}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        {selectedPlayer && (
                            <div className="mt-4">
                                <Button className="w-full" onClick={handleDraftPlayer} disabled={!selectedPlayer}>
                                    Draft {selectedPlayer.name}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
