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
    DollarSign,
    Globe,
    Lock
} from 'lucide-react'
import Link from 'next/link'
import { formatLeagueCode } from '@/lib/utils'
import { LeagueChatSidebar } from './_components/league-chat-sidebar'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data - replace with real data fetching
const leagueData = {
    code: 'PREM-2X4Y-9Z7W',
    name: 'Premier Fantasy Masters',
    description: 'The ultimate Premier League fantasy experience',
    competition: 'Premier League',
    type: 'public',
    region: 'Global',
    maxParticipants: 100,
    currentParticipants: 45,
    entryFee: 1000,
    prizePool: 50000,
    startDate: '2024-02-25',
    endDate: '2024-05-19',
    rules: 'Standard Premier League fantasy rules apply. Weekly transfers allowed. Triple captain and bench boost chips available.',
    status: 'active',
    creator: {
        name: 'John Doe',
        image: '/avatars/john-doe.jpg',
    },
    participants: [
        { id: '1', name: 'John Doe', image: '/avatars/john-doe.jpg', points: 450, position: 1 },
        { id: '2', name: 'Jane Smith', image: '/avatars/jane-smith.jpg', points: 425, position: 2 },
        { id: '3', name: 'Bob Johnson', image: '/avatars/bob-johnson.jpg', points: 410, position: 3 },
        { id: '4', name: 'Alice Williams', image: '/avatars/alice-williams.jpg', points: 395, position: 4 },
        { id: '5', name: 'Charlie Brown', image: '/avatars/charlie-brown.jpg', points: 380, position: 5 },
    ]
}

export default function LeagueDetailsPage({ params }: { params: Promise<{ code: string }> }) {
    const [copied, setCopied] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const { code } = use(params)

    const copyInviteLink = () => {
        navigator.clipboard.writeText(`https://futdrafts.com/leagues/${code}/join`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    return (
        <div className="flex h-full">
            <div className={cn("flex-1 transition-all duration-300", 
                isChatOpen ? "mr-80 md:mr-96" : "")}>
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
                                    <h1 className="text-3xl font-bold">{leagueData.name}</h1>
                                    <Badge variant="outline" className="font-mono">
                                        {formatLeagueCode(code)}
                                    </Badge>
                                    <Badge variant={leagueData.type === 'public' ? 'secondary' : 'outline'}>
                                        {leagueData.type === 'public' ? 
                                            <Globe className="mr-1 h-3 w-3" /> : 
                                            <Lock className="mr-1 h-3 w-3" />}
                                        {leagueData.type}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground">{leagueData.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={copyInviteLink}>
                                <Share2 className="mr-2 h-4 w-4" />
                                {copied ? 'Copied!' : 'Share'}
                            </Button>
                            <Button 
                                variant={isChatOpen ? "default" : "outline"} 
                                onClick={toggleChat}
                                className={isChatOpen ? "bg-primary" : ""}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat
                            </Button>
                            {leagueData.creator.name === 'John Doe' && (
                                <Button variant="outline" asChild>
                                    <Link href={`/dashboard/leagues/${code}/settings`}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </Button>
                            )}
                            <Button asChild>
                                <Link href={`/dashboard/leagues/${code}/join`}>Join League</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Participants</CardTitle>
                                <Users className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{leagueData.currentParticipants}/{leagueData.maxParticipants}</div>
                                <p className="text-muted-foreground text-xs">Active players in league</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
                                <DollarSign className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${leagueData.prizePool.toLocaleString()}</div>
                                <p className="text-muted-foreground text-xs">Entry fee: ${leagueData.entryFee}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Season</CardTitle>
                                <Calendar className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{leagueData.competition}</div>
                                <p className="text-muted-foreground text-xs">
                                    {formatDate(leagueData.startDate)} - {formatDate(leagueData.endDate)}
                                </p>
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
                                            <p className="text-sm">{leagueData.competition}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Region</h3>
                                            <p className="text-sm">{leagueData.region}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Status</h3>
                                            <Badge variant={leagueData.status === 'active' ? 'default' : 'outline'}>
                                                {leagueData.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Created by</h3>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={leagueData.creator.image} alt={leagueData.creator.name} />
                                                    <AvatarFallback>{leagueData.creator.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{leagueData.creator.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Performers</CardTitle>
                                    <CardDescription>Current league leaders</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {leagueData.participants.slice(0, 3).map((participant, index) => (
                                            <div key={participant.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={participant.image} alt={participant.name} />
                                                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{participant.name}</p>
                                                        <p className="text-muted-foreground text-sm">Rank #{participant.position}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{participant.points}</p>
                                                    <p className="text-muted-foreground text-sm">points</p>
                                                </div>
                                            </div>
                                        ))}
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
                                        {leagueData.participants.map((participant) => (
                                            <div key={participant.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "flex h-8 w-8 items-center justify-center rounded-full font-semibold",
                                                        participant.position === 1 ? "bg-yellow-100 text-yellow-700" : 
                                                        participant.position === 2 ? "bg-gray-100 text-gray-700" : 
                                                        participant.position === 3 ? "bg-amber-100 text-amber-700" : 
                                                        "bg-muted"
                                                    )}>
                                                        {participant.position}
                                                    </div>
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={participant.image} alt={participant.name} />
                                                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{participant.name}</p>
                                                        {participant.id === '1' && (
                                                            <Badge variant="outline" className="text-xs">You</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{participant.points}</p>
                                                    <p className="text-muted-foreground text-sm">points</p>
                                                </div>
                                            </div>
                                        ))}
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
                                    <div className="prose max-w-none dark:prose-invert">
                                        <p>{leagueData.rules}</p>
                                        <h3>Scoring System</h3>
                                        <ul>
                                            <li>Goal (Forward/Midfielder): 5 points</li>
                                            <li>Goal (Defender/Goalkeeper): 6 points</li>
                                            <li>Assist: 3 points</li>
                                            <li>Clean Sheet (Defender/Goalkeeper): 4 points</li>
                                            <li>Clean Sheet (Midfielder): 1 point</li>
                                            <li>Save (Goalkeeper): 0.5 points per save</li>
                                            <li>Penalty Save: 5 points</li>
                                            <li>Penalty Miss: -2 points</li>
                                            <li>Yellow Card: -1 point</li>
                                            <li>Red Card: -3 points</li>
                                            <li>Own Goal: -2 points</li>
                                        </ul>
                                        <h3>Transfer Rules</h3>
                                        <p>Each manager is allowed one free transfer per gameweek. Additional transfers cost 4 points each.</p>
                                        <h3>Chips</h3>
                                        <p>The following chips are available once per season:</p>
                                        <ul>
                                            <li>{`Triple Captain: Triples your captain's points for one gameweek`}</li>
                                            <li>{`Bench Boost: Points scored by your bench players are included in your total`}</li>
                                            <li>{`Free Hit: Make unlimited free transfers for one gameweek`}</li>
                                            <li>{`Wildcard: Make unlimited free transfers twice per season`}</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            
            {/* Chat Sidebar */}
            <div className="fixed right-0 top-0 h-full">
                {isChatOpen && <LeagueChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} leagueCode={code} />}
            </div>
        </div>
    )
}