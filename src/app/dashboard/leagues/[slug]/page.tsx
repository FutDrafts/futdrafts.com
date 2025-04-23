'use client'

import { use, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Settings,
    Share2,
    MessageSquare,
    Users,
    Calendar,
    Globe,
    Lock,
    MoreVerticalIcon,
} from 'lucide-react'
import Link from 'next/link'
import { LeagueChatSidebar } from './_components/league-chat-sidebar'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery } from '@tanstack/react-query'
import { getFantasyLeagueByCode } from '@/actions/dashboard/fantasy'
import { Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { startDraft } from '@/actions/dashboard/draft'

export default function LeagueDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [copied, setCopied] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    const { data: fantasyLeague, isLoading } = useQuery({
        queryKey: ['fantasy', 'league', slug],
        queryFn: () => getFantasyLeagueByCode(slug),
    })

    const copyInviteLink = () => {
        navigator.clipboard.writeText(`https://futdrafts.com/leagues/${slug}/join`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    }

    const handleDraft = () => {
        startDraft(fantasyLeague!.id)
    }

    const formatDate = (date: Date | null) => {
        if (!date) return 'Not set'
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    if (isLoading) {
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
        <div className="flex h-full">
            <div className={cn('flex-1 transition-all duration-300', isChatOpen ? 'mr-80 md:mr-96' : '')}>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/dashboard/leagues">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-bold">{fantasyLeague.name}</h1>
                                    <Badge variant={fantasyLeague.isPrivate ? 'outline' : 'secondary'}>
                                        {fantasyLeague.isPrivate ? (
                                            <Lock className="mr-1 h-3 w-3" />
                                        ) : (
                                            <Globe className="mr-1 h-3 w-3" />
                                        )}
                                        {fantasyLeague.isPrivate ? 'Private' : 'Public'}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground">{fantasyLeague.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={copyInviteLink}>
                                <Share2 className="mr-2 h-4 w-4" />
                                {copied ? 'Copied!' : 'Share'}
                            </Button>
                            <Button
                                variant={isChatOpen ? 'default' : 'outline'}
                                onClick={toggleChat}
                                className={isChatOpen ? 'bg-primary' : ''}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/dashboard/leagues/${slug}/settings`}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </Button>
                            {fantasyLeague.draftStatus === null ? (
                                <div></div>
                            ) : !fantasyLeague.draftStatus ? (
                                <Button onClick={() => handleDraft()}>Start Draft</Button>
                            ) : (
                                <Button asChild>
                                    <Link href={`/dashboard/leagues/${slug}/draft`}>Go To Draft</Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Participants</CardTitle>
                                <Users className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {fantasyLeague.minPlayer}/{fantasyLeague.maxPlayer}
                                </div>
                                <p className="text-muted-foreground text-xs">Active players in league</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Season</CardTitle>
                                <Calendar className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{fantasyLeague.league.name}</div>
                                <p className="text-muted-foreground text-xs">
                                    {formatDate(fantasyLeague.startDate)} - {formatDate(fantasyLeague.endDate)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Status</CardTitle>
                                <Badge variant={fantasyLeague.status === 'active' ? 'default' : 'outline'}>
                                    {fantasyLeague.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{fantasyLeague.owner.name}</div>
                                <p className="text-muted-foreground text-xs">League Owner</p>
                            </CardContent>
                        </Card>
                    </div>

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
                                                    <AvatarImage src={fantasyLeague.owner.image ?? undefined} />
                                                    <AvatarFallback>
                                                        {fantasyLeague.owner.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Link href={`/dashboard/profile/${fantasyLeague.owner.username}`}>
                                                    <span className="text-sm">{fantasyLeague.owner.name}</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Draft Start</h3>
                                            <p className="text-sm">{formatDate(fantasyLeague.draftStart)}</p>
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
                                                {!fantasyLeague.players ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={6}
                                                            className="text-muted-foreground py-8 text-center"
                                                        >
                                                            Standings will be available after your members have joined.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    fantasyLeague.players.map((player) => (
                                                        <TableRow key={player.id}>
                                                            <TableCell className="font-medium">{player.rank}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarImage
                                                                            src={player.user.image ?? undefined}
                                                                        />
                                                                        <AvatarFallback>
                                                                            {player.user.name?.slice(0, 2)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <Link
                                                                        href={`/dashboard/profile/${player.user.username}`}
                                                                    >
                                                                        {player.user.name}
                                                                    </Link>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{player.teamName}</TableCell>
                                                            <TableCell>{player.points}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    className={
                                                                        player.role === 'owner'
                                                                            ? 'bg-red-600 text-white'
                                                                            : player.role === 'admin'
                                                                              ? 'bg-orange-400 text-orange-200'
                                                                              : ''
                                                                    }
                                                                >
                                                                    {player.role}
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
                                                            {fantasyLeague.scoreRules.goals || 0} points
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Own Goals:</span>
                                                        <span className="font-medium">
                                                            {fantasyLeague.scoreRules.ownGoal || 0} points
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Clean Sheet:</span>
                                                        <span className="font-medium">
                                                            {fantasyLeague.scoreRules.cleanSheet || 0} points
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Penalty Save:</span>
                                                        <span className="font-medium">
                                                            {fantasyLeague.scoreRules.penaltySave || 0} points
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Penalty Miss:</span>
                                                        <span className="font-medium">
                                                            {fantasyLeague.scoreRules.penaltyMiss || 0} points
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Yellow Card:</span>
                                                        <span className="font-medium">
                                                            {fantasyLeague.scoreRules.yellowCard || 0} points
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Red Card:</span>
                                                        <span className="font-medium">
                                                            {fantasyLeague.scoreRules.redCard || 0} points
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
                </div>
            </div>

            {/* Chat Sidebar */}
            <div className="fixed top-0 right-0 h-full">
                {isChatOpen && (
                    <LeagueChatSidebar
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                        leagueCode={slug}
                        leagueId={fantasyLeague.id}
                    />
                )}
            </div>
        </div>
    )
}
