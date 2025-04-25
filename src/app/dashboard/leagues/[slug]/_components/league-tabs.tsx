'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { MoreVerticalIcon } from 'lucide-react'
import Link from 'next/link'
import { FantasyLeagueType } from './types'

interface LeagueTabsProps {
    fantasyLeague: FantasyLeagueType
}

export function LeagueTabs({ fantasyLeague }: LeagueTabsProps) {
    const [activeTab, setActiveTab] = useState('overview')

    const formatDate = (date: Date | null) => {
        if (!date) return 'Not set'
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    return (
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="standings">Standings</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>League Information</CardTitle>
                        <CardDescription>Details about this fantasy league</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Competition</h3>
                                <p className="text-sm">{fantasyLeague.league.name}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Status</h3>
                                <Badge variant={fantasyLeague.status === 'active' ? 'default' : 'outline'}>
                                    {fantasyLeague.status}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Created by</h3>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={fantasyLeague.user.image ?? undefined} />
                                        <AvatarFallback>{fantasyLeague.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Link href={`/dashboard/profile/${fantasyLeague.user.username}`}>
                                        <span className="text-sm">{fantasyLeague.user.name}</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Draft Start</h3>
                                <p className="text-sm">
                                    {fantasyLeague.draftStart
                                        ? formatDate(new Date(fantasyLeague.draftStart))
                                        : formatDate(null)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="standings" className="pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>League Standings</CardTitle>
                        <CardDescription>Current rankings of all participants</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Player</TableHead>
                                        <TableHead>Team</TableHead>
                                        <TableHead>Points</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!fantasyLeague.fantasyParticipants ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                                Standings will be available after your members have joined.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        fantasyLeague.fantasyParticipants.map((participant) => (
                                            <TableRow key={participant.id}>
                                                <TableCell className="font-medium">{participant.rank}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={participant.user.image ?? undefined} />
                                                            <AvatarFallback>
                                                                {participant.user.name?.slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <Link href={`/dashboard/profile/${participant.user.username}`}>
                                                            {participant.user.name}
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{participant.teamName}</TableCell>
                                                <TableCell>{participant.points}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            participant.role === 'owner'
                                                                ? 'bg-red-600 text-white'
                                                                : participant.role === 'admin'
                                                                  ? 'bg-orange-400 text-orange-200'
                                                                  : ''
                                                        }
                                                    >
                                                        {participant.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button size="icon" variant="ghost">
                                                                <MoreVerticalIcon className="size-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>TBD</PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="rules" className="pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>League Rules</CardTitle>
                        <CardDescription>Official rules and guidelines</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <div className="prose dark:prose-invert max-w-none">
                                <h3>League Description</h3>
                                <p>{fantasyLeague.description || 'No league description specified yet.'}</p>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <h3>Scoring Rules</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Goals:</span>
                                            <span className="font-medium">
                                                {fantasyLeague.scoreRule.goals || 0} points
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Own Goals:</span>
                                            <span className="font-medium">
                                                {fantasyLeague.scoreRule.ownGoal || 0} points
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Clean Sheet:</span>
                                            <span className="font-medium">
                                                {fantasyLeague.scoreRule.cleanSheet || 0} points
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Penalty Save:</span>
                                            <span className="font-medium">
                                                {fantasyLeague.scoreRule.penaltySave || 0} points
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Penalty Miss:</span>
                                            <span className="font-medium">
                                                {fantasyLeague.scoreRule.penaltyMiss || 0} points
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Yellow Card:</span>
                                            <span className="font-medium">
                                                {fantasyLeague.scoreRule.yellowCard || 0} points
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Red Card:</span>
                                            <span className="font-medium">
                                                {fantasyLeague.scoreRule.redCard || 0} points
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
