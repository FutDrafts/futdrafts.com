'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    Trophy,
    Medal,
    Star,
    Edit,
    Save,
    X,
    Camera,
    ChartLine,
} from 'lucide-react'

// Mock data - replace with real data fetching
const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2023-01-15',
    location: 'London, UK',
    avatar: '/avatars/john-doe.jpg',
}

const mockStats = {
    leaguesJoined: 12,
    leaguesWon: 3,
    totalPoints: 1250,
    averageRank: 4.2,
    winRate: '25%',
}

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

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [userInfo, setUserInfo] = useState(mockUser)
    const [newAvatar, setNewAvatar] = useState<File | null>(null)

    console.log(newAvatar)

    const handleSave = async () => {
        // Implement save logic here
        setIsEditing(false)
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewAvatar(file)
            // Preview logic would go here
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        <TabsTrigger value="leagues">Past Leagues</TabsTrigger>
                    </TabsList>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Manage your profile details and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                                        <AvatarFallback>{userInfo.name.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <div className="absolute bottom-0 right-0">
                                            <Label htmlFor="avatar" className="cursor-pointer">
                                                <div className="rounded-full bg-primary p-1.5 text-primary-foreground hover:bg-primary/90">
                                                    <Camera className="h-4 w-4" />
                                                </div>
                                            </Label>
                                            <Input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={userInfo.name}
                                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={userInfo.email}
                                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={userInfo.location}
                                                onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Join Date</Label>
                                            <Input value={new Date(userInfo.joinDate).toLocaleDateString()} disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Leagues Joined</CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockStats.leaguesJoined}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Leagues Won</CardTitle>
                                <Medal className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockStats.leaguesWon}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockStats.winRate}</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="statistics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Player Statistics</CardTitle>
                            <CardDescription>Your performance metrics and achievements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border bg-card p-8 text-center">
                                <ChartLine className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Statistics Coming Soon</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    We&apos;re working on bringing you detailed statistics and analytics about your fantasy
                                    football performance.
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
                                            <div className="text-sm text-muted-foreground">Season: {league.season}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="font-medium">Position: {league.position}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {league.points} points
                                                </div>
                                            </div>
                                            {league.position === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
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
