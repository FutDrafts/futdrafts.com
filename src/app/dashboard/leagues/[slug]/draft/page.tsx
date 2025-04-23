'use client'

import { useState, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertCircleIcon, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getFantasyLeagueByCode, getFantasyLeagueParticipantsBySlug } from '@/actions/dashboard/fantasy'
import { createDraftPick, getAvailableDraftPlayers } from '@/actions/dashboard/draft'
import { player, playerStatistics } from '@/db/schema'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type PlayerStatsTable = typeof playerStatistics.$inferSelect
type PlayerTable = typeof player.$inferSelect & {
    playerStatistics: PlayerStatsTable
}

export default function DraftPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerTable | null>(null)

    const {
        data: fantasyLeagueData,
        error,
        isLoading: isLoadingFantasy,
    } = useQuery({
        queryKey: ['fantasy', 'league', slug],
        queryFn: async () => await getFantasyLeagueByCode(slug as string),
    })

    const { data: availablePlayersData, isLoading: isLoadingPlayers } = useQuery({
        queryKey: ['fantasy', 'league', 'draft', slug, 'players'],
        queryFn: () => getAvailableDraftPlayers(slug),
    })

    const { data: participantsData, isLoading: isLoadingParticipants } = useQuery({
        queryKey: ['fantasy', 'league', 'draft', slug, 'players', 'team', 'participants'],
        queryFn: () => getFantasyLeagueParticipantsBySlug(slug),
    })

    if (error) {
        return <p>Error Loading League Data</p>
    }

    const availablePlayers = availablePlayersData || []
    const { participants } = participantsData || {}

    const handlePlayerSelect = (player: PlayerTable) => {
        setSelectedPlayer(player)
    }

    const handleDraftPlayer = async () => {
        if (!selectedPlayer) return

        try {
            await createDraftPick({
                fantasyLeagueId: fantasyLeagueData!.id,
                playerId: selectedPlayer.id,
            })

            setSelectedPlayer(null)
        } catch (error) {
            console.error('Error drafting player:', error)
        }
    }

    if (isLoadingFantasy || isLoadingPlayers || isLoadingParticipants) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!fantasyLeagueData) {
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
            <div className="mb-4">
                <Alert variant="default">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Important Draft Information</AlertTitle>
                    <AlertDescription>
                        Once you select a player, your choice is final and cannot be changed. Please review your
                        selection carefully before confirming.
                    </AlertDescription>
                </Alert>
            </div>
            <div className="mb-6">
                {/* <h1 className="text-2xl font-bold">{fantasyLeague.name}</h1> */}
                league name
                <p className="text-muted-foreground">{/* {fantasyLeague} • {fantasyLeague.owner.name} */}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Draft Board */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Draft Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {participants &&
                                participants.map((team) => (
                                    <div
                                        key={team.id}
                                        className="flex items-center space-x-4 rounded-md border border-gray-200 px-2 py-1 dark:border-neutral-700"
                                    >
                                        <Avatar>
                                            <AvatarImage src={team.user.image ?? undefined} alt={team.user.name} />
                                            <AvatarFallback>{team.teamName} Image</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{team.teamName}</h3>
                                            <p className="text-sm text-gray-500">{team.user.displayUsername}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            {team.draftsPicks.map((pick) => (
                                                <Badge key={pick.id} variant="secondary">
                                                    {pick.player && pick.player.name}
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
                                {availablePlayers.map((player) => (
                                    <div
                                        key={player.id}
                                        className={`flex cursor-pointer items-center space-x-4 rounded-lg p-2 ${
                                            selectedPlayer?.id === player.id ? 'bg-primary/10' : 'hover:bg-muted'
                                        }`}
                                        onClick={() => handlePlayerSelect(player)}
                                    >
                                        <Avatar>
                                            <AvatarImage src={player.profilePicture} />
                                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{player.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {player.playerStatistics.games?.position}
                                                {/* {player.statistics.games?.position} • {player.statistics.team.name} */}
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
