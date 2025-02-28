import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ChartLineIcon, TrophyIcon, AlertTriangleIcon, MedalIcon, StarIcon } from 'lucide-react'
import { UserTab } from './_user-tab'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const mockPastLeagues = [
    {
        id: '1',
        name: 'Premier Fantasy Masters 2023',
        position: 1,
        points: 450,
        season: '2023/24',
        status: 'completed',
    },
    {
        id: '2',
        name: 'La Liga Fantasy Elite',
        position: 3,
        points: 380,
        season: '2023/24',
        status: 'active',
    },
    {
        id: '3',
        name: 'Bundesliga Fantasy Cup',
        position: 5,
        points: 420,
        season: '2023/24',
        status: 'completed',
    },
]

const mockStats = {
    leaguesJoined: 12,
    leaguesWon: 3,
    totalPoints: 1250,
    averageRank: 4.2,
    winRate: '25%',
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const [session, activeSessions] = await Promise.all([
        auth.api.getSession({
            headers: await headers(),
        }),
        auth.api.listSessions({
            headers: await headers(),
        }),
    ]).catch(() => redirect('/auth/sign-in'))

    if (!session || !activeSessions) {
        redirect('/auth/sign-in')
    }

    // Find the user by username
    const userExists = await db.query.user.findFirst({
        where: eq(user.username, username),
    })

    // If no user is found, show error
    if (!userExists) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center py-20">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex flex-col items-center text-center">
                            <AlertTriangleIcon className="mb-4 h-12 w-12 text-yellow-500" />
                            <CardTitle>User Not Found</CardTitle>
                            <CardDescription>{`The user "${username}" does not exist or has been removed.`}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild>
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Check if the current user is viewing their own profile
    const isOwnProfile = session.user.id === userExists.id

    return (
        <div className="container mx-auto py-10">
            <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex flex-col-reverse items-center gap-3 md:flex-row md:justify-center">
                    <TabsList className="w-full">
                        <TabsTrigger value="overview" className="w-full">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="statistics" className="w-full">
                            Statistics
                        </TabsTrigger>
                        <TabsTrigger value="leagues" className="w-full">
                            Past Leagues
                        </TabsTrigger>
                    </TabsList>
                </div>

                <UserTab
                    session={session}
                    activeSessions={activeSessions}
                    profileUser={userExists}
                    isOwnProfile={isOwnProfile}
                />

                <TabsContent value="statistics" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Leagues Joined</CardTitle>
                                <TrophyIcon className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockStats.leaguesJoined}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Leagues Won</CardTitle>
                                <MedalIcon className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockStats.leaguesWon}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                                <StarIcon className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockStats.winRate}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Player Statistics</CardTitle>
                            <CardDescription>Performance metrics and achievements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-card rounded-lg border p-8 text-center">
                                <ChartLineIcon className="text-muted-foreground mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">More Statistics Coming Soon</h3>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    {
                                        "We're working on bringing you detailed statistics and analytics about fantasy football performance."
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leagues" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Past Leagues</CardTitle>
                            <CardDescription>League history and achievements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockPastLeagues.map((league) => (
                                    <div
                                        key={league.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{league.name}</span>
                                                <Badge
                                                    variant={league.status === 'completed' ? 'secondary' : 'default'}
                                                >
                                                    {league.status}
                                                </Badge>
                                            </div>
                                            <div className="text-muted-foreground text-sm">Season: {league.season}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="font-medium">Position: {league.position}</div>
                                                <div className="text-muted-foreground text-sm">
                                                    {league.points} points
                                                </div>
                                            </div>
                                            {league.position === 1 && (
                                                <TrophyIcon className="h-5 w-5 text-yellow-500" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
