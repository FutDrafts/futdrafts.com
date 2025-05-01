'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import useSWR from 'swr'
import { cn } from '@/lib/utils'
import { FantasyDraftPick, FantasyLeague, FantasyParticipant, SoccerPlayer } from '@/db/schema/types'
import { User } from '@/lib/types'

type CurrentPick = string
type Participants = FantasyParticipant & {
    user: User
    fantasy: FantasyLeague
    draftsPicks: (FantasyDraftPick & {
        player: SoccerPlayer
    })[]
}

interface Props {
    slug: string
}

export function DraftBoard({ slug }: Props) {
    const { data: currentPickData, isLoading: isLoadingCurrentPick } = useSWR<CurrentPick>(
        `/server/api/dashboard/draft/current/${slug}`,
        async (url: string) => fetch(url).then((res) => res.json()),
        { refreshInterval: 5000 },
    )

    const { data: participantsData, isLoading: isLoadingParticipants } = useSWR<{
        participants: Participants[]
        total: number
    }>(
        `/server/api/dashboard/draft/participants/${slug}`,
        async (url: string) => fetch(url).then((res) => res.json()),
        { refreshInterval: 5000 },
    )
    const { participants } = participantsData || {}

    if (!participants) {
        return (
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Draft Board</CardTitle>
                    <CardDescription>
                        <p className="text-destructive">No participants found</p>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-4">
                        <p>Unable to load participants data</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const currentParticipant =
        currentPickData !== 'ended' && currentPickData
            ? participants.find((p) => p.userId === currentPickData)
            : undefined

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Draft Board</CardTitle>
                {isLoadingCurrentPick ? (
                    <CardDescription>
                        <div className="bg-muted h-5 w-32 animate-pulse rounded"></div>
                    </CardDescription>
                ) : (
                    <CardDescription>
                        {currentPickData === 'ended' || (currentPickData === undefined && <p>Draft Ended</p>)}
                        {currentPickData !== 'ended' && currentParticipant && (
                            <div className="flex gap-3">
                                <span>Current Pick:</span>
                                <Badge>{currentParticipant.teamName}</Badge>
                            </div>
                        )}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {isLoadingParticipants ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-4 rounded-md border border-gray-400 px-2 py-2 dark:border-neutral-700"
                            >
                                <div className="bg-muted h-10 w-10 animate-pulse rounded-full"></div>
                                <div className="flex-1">
                                    <div className="bg-muted mb-2 h-5 w-24 animate-pulse rounded"></div>
                                    <div className="bg-muted h-4 w-32 animate-pulse rounded"></div>
                                </div>
                                <div className="flex flex-wrap gap-2 space-x-2">
                                    <div className="bg-muted h-6 w-16 animate-pulse rounded"></div>
                                    <div className="bg-muted h-6 w-16 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {participants &&
                            participants.map((team) => (
                                <div
                                    key={team.id}
                                    className={cn(
                                        `flex items-center space-x-4 rounded-md border px-2 py-2 ${currentPickData !== 'ended' && team.user.id === currentPickData ? 'border-green-400 dark:border-green-700' : 'border-gray-400 dark:border-neutral-700'}"`,
                                    )}
                                >
                                    <Avatar>
                                        <AvatarImage src={team.user.image ?? undefined} alt={team.user.name} />
                                        <AvatarFallback>{team.teamName} Image</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{team.teamName}</h3>
                                        <p className="text-sm text-gray-500">{team.user.displayUsername}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 space-x-2">
                                        {team.draftsPicks.map((pick) => (
                                            <Badge key={pick.id} variant="secondary">
                                                {pick.player && pick.player.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
