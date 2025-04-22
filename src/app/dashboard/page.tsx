import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Calendar, Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { getDashboardActiveLeagues, getDashboardLeagueCounts } from '@/actions/dashboard/dashboard'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Mock data - replace with real data fetching

const upcomingMatches = [
    {
        id: '1',
        homeTeam: { name: 'Arsenal', logo: '/team-logos/arsenal.png' },
        awayTeam: { name: 'Chelsea', logo: '/team-logos/chelsea.png' },
        date: '2024-02-20T15:00:00',
        competition: 'Premier League',
    },
    {
        id: '2',
        homeTeam: { name: 'Barcelona', logo: '/team-logos/barcelona.png' },
        awayTeam: { name: 'Real Madrid', logo: '/team-logos/real-madrid.png' },
        date: '2024-02-21T20:00:00',
        competition: 'La Liga',
    },
]

export default async function DashboardPage() {
    const [{ fantasyLeagues: activeLeagues }, { totalLeagueCount, pendingLeagueCount }] = await Promise.all([
        getDashboardActiveLeagues(3),
        getDashboardLeagueCounts(),
    ])

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Welcome Back!</h1>
                    <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your leagues</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href="/dashboard/leagues">
                            <Plus className="mr-2 h-4 w-4" />
                            Join League
                        </Link>
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline">
                                    {/* <Link href="/dashboard/search" aria-disabled> */}
                                    <Search className="mr-2 h-4 w-4" />
                                    Find Players
                                    {/* </Link> */}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Player search coming soon!</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leagues</CardTitle>
                        <Trophy className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLeagueCount}</div>
                        <p className="text-muted-foreground text-xs">{pendingLeagueCount} leagues you can join!</p>
                    </CardContent>
                </Card>
                {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global Ranking</CardTitle>
                        <TrendingUp className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.ranking}</div>
                        <div className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            {userStats.winRate} this month
                        </div>
                    </CardContent>
                </Card> */}
                {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                        <Star className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                        <div className="flex items-center text-xs text-red-500">
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                            {userStats.recentPerformance} last week
                        </div>
                    </CardContent>
                </Card> */}
                {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Players</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">11/11</div>
                        <p className="text-muted-foreground text-xs">Full squad available</p>
                    </CardContent>
                </Card> */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Active Leagues */}
                <Card className="md:col-span-4">
                    <CardHeader>
                        <CardTitle>Your Active Leagues</CardTitle>
                        <CardDescription>Current standings in your leagues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeLeagues.map((league) => (
                                <div
                                    key={league.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{league.name}</p>
                                        <p className="text-muted-foreground text-sm">
                                            Position {league.players[0].rank} of {league.maxPlayer}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {league.players[0].rank === 1 ? (
                                            <Badge>
                                                <Trophy className="h-5 w-5 text-yellow-500" />
                                                <span>1st Place!</span>
                                            </Badge>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">
                                                {league.players[0].points} pts
                                            </p>
                                        )}
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/leagues/${league.slug}`}>View</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Matches */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Matches</CardTitle>
                        <CardDescription>Next matches affecting your leagues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingMatches.map((match) => (
                                <div key={match.id} className="flex flex-col gap-2 rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={match.homeTeam.logo} alt={match.homeTeam.name} />
                                                <AvatarFallback>{match.homeTeam.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{match.homeTeam.name}</span>
                                        </div>
                                        <span className="text-sm font-medium">vs</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{match.awayTeam.name}</span>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={match.awayTeam.logo} alt={match.awayTeam.name} />
                                                <AvatarFallback>{match.awayTeam.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                                        <span>{match.competition}</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(match.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recommended Leagues */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>Recommended Leagues</CardTitle>
                    <CardDescription>Popular leagues you might be interested in joining</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {recommendedLeagues.map((league) => (
                            <div key={league.id} className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <p className="font-medium">{league.name}</p>
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4" />
                                        {league.participants} participants
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant={league.type === 'public' ? 'secondary' : 'outline'}>
                                        {league.type}
                                    </Badge>
                                    <Button size="sm" asChild>
                                        <Link href={`/dashboard/leagues/${league.id}/join`}>Join</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}
