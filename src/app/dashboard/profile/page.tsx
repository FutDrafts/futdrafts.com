import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ChartLineIcon, TrophyIcon } from 'lucide-react'
import { UserTab } from './_user-tab'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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

export default async function ProfilePage() {
    const [session, activeSessions] = await Promise.all([
        auth.api.getSession({
            headers: await headers(),
        }),
        auth.api.listSessions({
            headers: await headers(),
        }),
    ]).catch(() => redirect('/auth/sign-in'))

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

                <UserTab session={session} activeSessions={activeSessions} />

                <TabsContent value="statistics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Player Statistics</CardTitle>
                            <CardDescription>Your performance metrics and achievements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-card rounded-lg border p-8 text-center">
                                <ChartLineIcon className="text-muted-foreground mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">Statistics Coming Soon</h3>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    We&apos;re working on bringing you detailed statistics and analytics about your
                                    fantasy football performance.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leagues" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Past Leagues</CardTitle>
                            <CardDescription>Your league history and achievements</CardDescription>
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
