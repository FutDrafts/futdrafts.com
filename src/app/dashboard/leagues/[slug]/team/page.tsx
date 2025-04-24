'use client'

import { useState, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft,
    AlertCircle,
    UserRoundPlus,
    UserRoundMinus,
    RotateCcw,
    Trophy,
    Flame,
    Shield,
    Swords,
    Loader2,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useQuery } from '@tanstack/react-query'
import { getFantasyLeagueByCode, getFantasyLeagueParticipantsBySlug } from '@/actions/dashboard/fantasy'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { player, playerStatistics } from '@/db/schema'

// Define Player type with playerStatistics
type PlayerStatistics = typeof playerStatistics.$inferSelect

type PlayerType = typeof player.$inferSelect & {
    playerStatistics: PlayerStatistics
    age?: string | number
    birthday?: string
}

export default function LeagueTeamPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [activeTab, setActiveTab] = useState('overview')

    // Fetch fantasy league data
    const {
        data: fantasyLeague,
        error: leagueError,
        isLoading: isLoadingLeague,
    } = useQuery({
        queryKey: ['fantasy', 'league', slug],
        queryFn: () => getFantasyLeagueByCode(slug as string),
    })

    // Fetch participant data
    const {
        data: participantsData,
        error: participantsError,
        isLoading: isLoadingParticipants,
    } = useQuery({
        queryKey: ['fantasy', 'league', 'participants', slug],
        queryFn: () => getFantasyLeagueParticipantsBySlug(slug),
    })

    const isLoading = isLoadingLeague || isLoadingParticipants
    const error = leagueError || participantsError

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">Error loading team data: {error.message}</p>
                    </CardContent>
                </Card>
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

    // Find the current user's team
    const { participants } = participantsData || { participants: [] }
    const currentUserTeam = participants.find(
        (participant) => participant.user.username === fantasyLeague.user.username,
    )

    // Get draft picks for the current user
    const userDraftPicks = currentUserTeam?.draftsPicks || []
    const teamPlayers = userDraftPicks.filter((pick) => pick.player).map((pick) => pick.player) as PlayerType[]

    const getPositionEmoji = (position?: string) => {
        if (!position) return null

        switch (position.toLowerCase()) {
            case 'goalkeeper':
            case 'gk':
                return <Shield className="mr-1 h-4 w-4" />
            case 'defender':
            case 'def':
                return <Shield className="mr-1 h-4 w-4" />
            case 'midfielder':
            case 'mid':
                return <Swords className="mr-1 h-4 w-4" />
            case 'forward':
            case 'attacker':
            case 'fwd':
                return <Flame className="mr-1 h-4 w-4" />
            default:
                return null
        }
    }

    // Calculate player age from birthday if available
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
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/leagues/${slug}`}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{currentUserTeam?.teamName || 'My Team'}</h1>
                            <p className="text-muted-foreground">
                                {fantasyLeague.name} • {fantasyLeague.league.name}
                            </p>
                        </div>
                    </div>
                    {fantasyLeague.draftStatus && (
                        <Button asChild>
                            <Link href={`/dashboard/leagues/${slug}/draft`}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Draft View
                            </Link>
                        </Button>
                    )}
                </div>

                {!fantasyLeague.draftStatus && (
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Draft Not Complete</AlertTitle>
                        <AlertDescription>
                            The draft hasn&apos;t started or completed yet. You&apos;ll need to participate in the draft
                            to build your team.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mb-6 grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Rank</CardTitle>
                            <Trophy className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">#{currentUserTeam?.rank || '-'}</div>
                            <p className="text-muted-foreground text-xs">Out of {participants.length} teams</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Points</CardTitle>
                            <Flame className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currentUserTeam?.points || 0}</div>
                            <p className="text-muted-foreground text-xs">Total fantasy points earned</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Players</CardTitle>
                            <UserRoundPlus className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamPlayers.length}</div>
                            <p className="text-muted-foreground text-xs">Players on roster</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Team Overview</TabsTrigger>
                    <TabsTrigger value="players">Player List</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4">
                    {teamPlayers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {teamPlayers.map((player) => (
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
                                                    {getPositionEmoji(player.playerStatistics?.games?.position)}
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
                                <UserRoundMinus className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-medium">No Players on Your Team Yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    {!fantasyLeague.draftStatus
                                        ? "You'll need to participate in the draft to build your team."
                                        : "You don't have any players on your team yet."}
                                </p>
                                {fantasyLeague.draftStatus && (
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
                                {teamPlayers.length > 0
                                    ? `You have ${teamPlayers.length} players on your team`
                                    : "You don't have any players on your team yet"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {teamPlayers.length > 0 ? (
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
                                            {teamPlayers.map((player) => (
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
                                                            {getPositionEmoji(player.playerStatistics?.games?.position)}
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
                                    <UserRoundMinus className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <h3 className="mb-2 text-lg font-medium">No Players on Your Team Yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {!fantasyLeague.draftStatus
                                            ? "You'll need to participate in the draft to build your team."
                                            : "You don't have any players on your team yet."}
                                    </p>
                                    {fantasyLeague.draftStatus && (
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
        </div>
    )
}
