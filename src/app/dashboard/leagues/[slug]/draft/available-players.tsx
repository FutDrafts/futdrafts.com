'use client'

import { createDraftPick } from '@/actions/dashboard/draft'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FantasyDraftStatusEnum, SoccerPlayer, SoccerPlayerStatistic } from '@/db/schema/types'
import { useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

type PlayerTable = SoccerPlayer & {
    playerStatistics: SoccerPlayerStatistic
}

interface Props {
    slug: string
    fantasyLeagueData: {
        id: string
        draftStatus: FantasyDraftStatusEnum
    }
}

export function AvailablePlayers({ slug, fantasyLeagueData }: Props) {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerTable | null>(null)

    const { data, isLoading, error, mutate } = useSWR<PlayerTable[]>(
        `/server/api/dashboard/draft/players/${slug}`,
        async (url: string) => fetch(url).then((res) => res.json()),
        { refreshInterval: 5000 },
    )

    const {
        data: suggestedPlayer,
        isLoading: isSuggestLoading,
        error: suggestError,
        mutate: suggestionMutate,
    } = useSWR<{ player_id: string; ranking: number }>(
        `https://urchin-app-xzm4c.ondigitalocean.app/league/${fantasyLeagueData.id}/suggest`,
        async (url: string) =>
            fetch(url, {
                headers: {
                    'X-API-Key': 'PENIS123',
                },
            }).then((res) => res.json()),
        { refreshInterval: 10000 },
    )

    const handleDraftPlayer = async () => {
        if (!selectedPlayer) return

        try {
            await createDraftPick({
                fantasyLeagueId: fantasyLeagueData.id,
                playerId: selectedPlayer.id,
            })

            setSelectedPlayer(null)
            mutate()
            suggestionMutate()
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(`Error Drafting Player: ${errorMessage}`)
        }
    }

    const handlePlayerSelect = (player: PlayerTable) => {
        setSelectedPlayer(player)
    }

    if (error) {
        toast.error('There was a problem fetching available players')
    }

    const suggestedPlayerObj = data?.find((p) => p.id === suggestedPlayer?.player_id)

    const renderSuggestedBar = () => {
        if (isSuggestLoading) {
            return (
                <div className="bg-muted/50 mb-4 flex animate-pulse items-center gap-4 rounded-lg border px-6 py-3">
                    <div className="bg-muted h-10 w-10 rounded-full" />
                    <div className="flex-1">
                        <div className="bg-muted mb-2 h-5 w-24 rounded" />
                        <div className="bg-muted h-4 w-32 rounded" />
                    </div>
                </div>
            )
        }
        if (suggestError) {
            return (
                <div className="bg-destructive/10 mb-4 flex items-center gap-4 rounded-lg border px-6 py-3">
                    <span className="text-destructive text-sm">Could not load suggestion</span>
                </div>
            )
        }
        if (!suggestedPlayer || !suggestedPlayerObj) {
            return (
                <div className="bg-muted/50 mb-4 flex items-center gap-4 rounded-lg border px-6 py-3">
                    <span className="text-muted-foreground text-sm">No suggestion available</span>
                </div>
            )
        }
        return (
            <div className="bg-primary/5 mb-4 flex items-center gap-4 rounded-lg border px-6 py-3">
                <Avatar>
                    <AvatarImage src={suggestedPlayerObj.profilePicture} />
                    <AvatarFallback>{suggestedPlayerObj.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{suggestedPlayerObj.name}</span>
                        <Badge>Suggested</Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                        {suggestedPlayerObj.playerStatistics?.games?.position}
                    </span>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Available Players</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-4">
                        <p>No available players found</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="flex flex-col gap-1">
            {renderSuggestedBar()}
            <Card>
                <CardHeader>
                    <CardTitle>Available Players</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        {isLoading ? (
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center space-x-4 rounded-lg p-2">
                                        <div className="bg-muted h-10 w-10 animate-pulse rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="bg-muted mb-2 h-5 w-24 animate-pulse rounded"></div>
                                            <div className="bg-muted h-4 w-32 animate-pulse rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {data.map((player) => (
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
                        )}
                    </ScrollArea>
                    {selectedPlayer && fantasyLeagueData.draftStatus === 'in-progress' && (
                        <div className="mt-4">
                            <Button className="w-full" onClick={handleDraftPlayer} disabled={!selectedPlayer}>
                                Draft {selectedPlayer.name}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
