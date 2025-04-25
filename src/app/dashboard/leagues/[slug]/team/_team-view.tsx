'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useState } from 'react'
import { UserRoundMinusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { player, playerStatistics } from '@/db/schema'

interface Props {
    slug: string
    players: PlayerType[]
    league: {
        draftStatus: 'finished' | 'pending' | 'started'
    }
}

type PlayerStatistics = typeof playerStatistics.$inferSelect

type PlayerType = typeof player.$inferSelect & {
    playerStatistics: PlayerStatistics
    age?: string | number
    birthday?: string
}

export function TeamView({ players, slug, league }: Props) {
    const [activeTab, setActiveTab] = useState('overview')

    const getPlayerAge = (player: PlayerType) => {
        if (player.age) return player.age

        if (player.birthday) {
            const birthDate = new Date(player.birthday)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDifference = today.getMonth() - birthDate.getMonth()

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }

            return age
        }

        return '-'
    }

    return (
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Team Overview</TabsTrigger>
                <TabsTrigger value="players">Player List</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-4">
                {players.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {players.map((player) => (
                            <Card key={player.id} className="overflow-hidden">
                                <div className="from-primary/10 to-primary/5 bg-gradient-to-r p-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="border-primary/20 h-16 w-16 border-2">
                                            <AvatarImage src={player.profilePicture} alt={player.name} />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-lg font-bold">{player.name}</h3>
                                            <div className="mt-1 flex items-center">
                                                {player.playerStatistics?.games?.position}
                                                <span className="text-sm">
                                                    {player.playerStatistics?.games?.position || 'Unknown Position'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="pt-4">
                                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Age</p>
                                            <p className="font-medium">{getPlayerAge(player)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Goals</p>
                                            <p className="font-medium">
                                                {player.playerStatistics?.goals?.total || '0'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Games</p>
                                            <p className="font-medium">
                                                {player.playerStatistics?.games?.appearences || '0'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <UserRoundMinusIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                            <h3 className="mb-2 text-lg font-medium">No Players on Your Team Yet</h3>
                            <p className="text-muted-foreground mb-4">
                                {!league.draftStatus
                                    ? "You'll need to participate in the draft to build your team."
                                    : "You don't have any players on your team yet."}
                            </p>
                            {league.draftStatus && (
                                <Button asChild>
                                    <Link href={`/dashboard/leagues/${slug}/draft`}>Go to Draft</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </TabsContent>

            <TabsContent value="players" className="space-y-4 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>My Players</CardTitle>
                        <CardDescription>
                            {players.length > 0
                                ? `You have ${players.length} players on your team`
                                : "You don't have any players on your team yet"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {players.length > 0 ? (
                            <ScrollArea className="h-[500px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Player</TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Age</TableHead>
                                            <TableHead>Nationality</TableHead>
                                            <TableHead>Stats</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {players.map((player) => (
                                            <TableRow key={player.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={player.profilePicture}
                                                                alt={player.name}
                                                            />
                                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{player.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        {player.playerStatistics?.games?.position}
                                                        <span>
                                                            {player.playerStatistics?.games?.position || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getPlayerAge(player)}</TableCell>
                                                <TableCell>{player.nationality || '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Badge variant="outline">
                                                            G: {player.playerStatistics?.goals?.total || '0'}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            A: {player.playerStatistics?.goals?.assists || '0'}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        ) : (
                            <div className="py-8 text-center">
                                <UserRoundMinusIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-medium">No Players on Your Team Yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    {!league.draftStatus
                                        ? "You'll need to participate in the draft to build your team."
                                        : "You don't have any players on your team yet."}
                                </p>
                                {league.draftStatus && (
                                    <Button asChild>
                                        <Link href={`/dashboard/leagues/${slug}/draft`}>Go to Draft</Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
