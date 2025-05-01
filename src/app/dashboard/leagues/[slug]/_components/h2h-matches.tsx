'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { H2HMatchType } from './types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CalendarIcon, TrophyIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

interface H2HMatchesProps {
    fantasyLeagueId: string
    isOwner: boolean
    leagueStatus: string
    draftStatus?: string
}

async function fetchMatches(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch matches')
    }
    return response.json()
}

async function generateSchedule(url: string) {
    const response = await fetch(url, { method: 'POST' })
    if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
    }
    return response.json()
}

export function H2HMatches({ fantasyLeagueId, isOwner, leagueStatus }: H2HMatchesProps) {
    const [currentWeek, setCurrentWeek] = useState('1')

    const {
        data: matches,
        error,
        isLoading,
        mutate,
    } = useSWR<H2HMatchType[]>(`/server/api/dashboard/draft/h2h?fantasyLeagueId=${fantasyLeagueId}`, fetchMatches, {
        revalidateOnFocus: false,
    })

    const { trigger: generateH2H, isMutating } = useSWRMutation(
        `/server/api/dashboard/draft/h2h?fantasyLeagueId=${fantasyLeagueId}`,
        generateSchedule,
        {
            onSuccess: async (newMatches) => {
                toast.success(`Successfully generated ${newMatches.length} matches!`)
                await mutate() // Revalidate the matches data
            },
            onError: (error) => {
                console.error('Error generating H2H schedule:', error)
                toast.error(`Failed to generate H2H schedule: ${error.message}`)
            },
        },
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2Icon className="size-4 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-destructive">Error loading matches. Please try again later.</p>
            </div>
        )
    }

    if (!matches || matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">No Head-to-Head Matches Yet</h3>
                    <p className="text-muted-foreground mt-1">
                        {isOwner && leagueStatus === 'active'
                            ? 'Generate a schedule to create head-to-head matches between participants. Make sure you have an even number of active participants.'
                            : 'The league owner needs to generate the match schedule.'}
                    </p>
                </div>

                {isOwner && leagueStatus === 'active' && (
                    <div className="flex flex-col items-center gap-2">
                        <Button onClick={() => generateH2H()} disabled={isMutating} className="mt-4">
                            {isMutating ? (
                                <>
                                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                                    Generating Schedule...
                                </>
                            ) : (
                                'Generate H2H Schedule'
                            )}
                        </Button>
                        <p className="text-muted-foreground text-xs">
                            This will create a balanced schedule for all participants
                        </p>
                    </div>
                )}
            </div>
        )
    }

    // Group matches by week
    const matchesByWeek = matches.reduce(
        (acc, match) => {
            const weekNumber = match.weekNumber
            if (!acc[weekNumber]) {
                acc[weekNumber] = []
            }
            acc[weekNumber].push(match)
            return acc
        },
        {} as Record<number, H2HMatchType[]>,
    )

    const weekNumbers = Object.keys(matchesByWeek).sort((a, b) => parseInt(a) - parseInt(b))

    const goToPreviousWeek = () => {
        const currentIndex = weekNumbers.indexOf(currentWeek)
        if (currentIndex > 0) {
            setCurrentWeek(weekNumbers[currentIndex - 1])
        }
    }

    const goToNextWeek = () => {
        const currentIndex = weekNumbers.indexOf(currentWeek)
        if (currentIndex < weekNumbers.length - 1) {
            setCurrentWeek(weekNumbers[currentIndex + 1])
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <div className="space-y-6">
            <Tabs value={currentWeek} onValueChange={setCurrentWeek} className="w-full">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Head-to-Head Schedule</h3>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPreviousWeek}
                            disabled={weekNumbers.indexOf(currentWeek) === 0}
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>

                        <Select value={currentWeek} onValueChange={setCurrentWeek}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Select Week" />
                            </SelectTrigger>
                            <SelectContent>
                                {weekNumbers.map((week) => (
                                    <SelectItem key={week} value={week}>
                                        Week {week}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNextWeek}
                            disabled={weekNumbers.indexOf(currentWeek) === weekNumbers.length - 1}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {Object.entries(matchesByWeek).map(([week, weekMatches]) => (
                    <TabsContent key={week} value={week} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {weekMatches.map((match) => (
                                <Card key={match.id} className="overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-medium">
                                                Match {match.matchNumber}
                                            </CardTitle>
                                            <Badge
                                                className={
                                                    match.status === 'scheduled'
                                                        ? 'bg-blue-500'
                                                        : match.status === 'in-progress'
                                                          ? 'bg-amber-500'
                                                          : 'bg-green-500'
                                                }
                                            >
                                                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <CardDescription className="flex items-center gap-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            {formatDate(match.startDate)} - {formatDate(match.endDate)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 items-center py-2">
                                            {/* Home Team */}
                                            <div className="flex flex-col items-center text-center">
                                                <Avatar className="mb-2 h-12 w-12">
                                                    <AvatarImage src={match.homeParticipant.user.image ?? undefined} />
                                                    <AvatarFallback>
                                                        {match.homeParticipant.user.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="max-w-[100px] truncate">
                                                    <p className="font-semibold">
                                                        {match.homeParticipant.teamName || 'Team'}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {match.homeParticipant.user.name}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Score */}
                                            <div className="text-center">
                                                <div className="text-xl font-bold">
                                                    {match.homePoints} - {match.awayPoints}
                                                </div>
                                                {match.status === 'completed' && match.winner && (
                                                    <div className="mt-1 flex items-center justify-center text-xs text-yellow-500">
                                                        <TrophyIcon className="mr-1 h-3 w-3" />
                                                        {match.winner.teamName || match.winner.user.name} won
                                                    </div>
                                                )}
                                            </div>

                                            {/* Away Team */}
                                            <div className="flex flex-col items-center text-center">
                                                <Avatar className="mb-2 h-12 w-12">
                                                    <AvatarImage src={match.awayParticipant.user.image ?? undefined} />
                                                    <AvatarFallback>
                                                        {match.awayParticipant.user.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="max-w-[100px] truncate">
                                                    <p className="font-semibold">
                                                        {match.awayParticipant.teamName || 'Team'}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {match.awayParticipant.user.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
