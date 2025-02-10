'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trophy, Users, Search, Calendar, Globe, Lock, ArrowUpRight, Info } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with real data fetching
const leagues = [
    {
        id: '1',
        name: 'Premier League Fantasy Elite',
        competition: 'Premier League',
        type: 'public',
        participants: 234,
        maxParticipants: 500,
        startDate: '2024-03-01',
        endDate: '2024-05-30',
        entryFee: 0,
        prizePool: '1000 Points',
        status: 'registering',
        region: 'Global',
    },
    {
        id: '2',
        name: 'La Liga Masters Cup',
        competition: 'La Liga',
        type: 'private',
        participants: 45,
        maxParticipants: 50,
        startDate: '2024-03-15',
        endDate: '2024-06-15',
        entryFee: 100,
        prizePool: '5000 Points',
        status: 'registering',
        region: 'Europe',
    },
    {
        id: '3',
        name: 'Champions League Fantasy',
        competition: 'UEFA Champions League',
        type: 'public',
        participants: 1234,
        maxParticipants: 2000,
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        entryFee: 50,
        prizePool: '10000 Points',
        status: 'upcoming',
        region: 'Global',
    },
]

const competitions = ['All Competitions', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'UEFA Champions League']
const regions = ['Global', 'Europe', 'Americas', 'Asia', 'Africa']
const types = ['All Types', 'public', 'private']
const statuses = ['All Statuses', 'registering', 'upcoming', 'in_progress', 'completed']

export default function LeaguesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCompetition, setSelectedCompetition] = useState('All Competitions')
    const [selectedRegion, setSelectedRegion] = useState('Global')
    const [selectedType, setSelectedType] = useState('All Types')
    const [selectedStatus, setSelectedStatus] = useState('All Statuses')

    const filteredLeagues = leagues.filter((league) => {
        const matchesSearch = league.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCompetition =
            selectedCompetition === 'All Competitions' || league.competition === selectedCompetition
        const matchesRegion = selectedRegion === 'Global' || league.region === selectedRegion
        const matchesType = selectedType === 'All Types' || league.type === selectedType
        const matchesStatus = selectedStatus === 'All Statuses' || league.status === selectedStatus

        return matchesSearch && matchesCompetition && matchesRegion && matchesType && matchesStatus
    })

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Fantasy Leagues</h1>
                    <p className="text-muted-foreground">Browse and join fantasy soccer leagues</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/leagues/create">
                        <Trophy className="mr-2 h-4 w-4" />
                        Create League
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Leagues</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">Across all competitions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.5k</div>
                        <div className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            +12% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prize Pools</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">50.2k</div>
                        <p className="text-xs text-muted-foreground">Total points available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Competitions</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6</div>
                        <p className="text-xs text-muted-foreground">Major leagues covered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Find the perfect league for you</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search leagues..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Competition" />
                            </SelectTrigger>
                            <SelectContent>
                                {competitions.map((competition) => (
                                    <SelectItem key={competition} value={competition}>
                                        {competition}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent>
                                {regions.map((region) => (
                                    <SelectItem key={region} value={region}>
                                        {region}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Leagues Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Leagues</CardTitle>
                    <CardDescription>Join a league to start competing</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>League Name</TableHead>
                                <TableHead>Competition</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Participants</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Entry Fee</TableHead>
                                <TableHead>Prize Pool</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeagues.map((league) => (
                                <TableRow key={league.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {league.type === 'private' ? (
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="font-medium">{league.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{league.competition}</TableCell>
                                    <TableCell>
                                        <Badge variant={league.type === 'public' ? 'secondary' : 'outline'}>
                                            {league.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            {league.participants}/{league.maxParticipants}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            {new Date(league.startDate).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {league.entryFee === 0 ? (
                                            <Badge variant="secondary">Free</Badge>
                                        ) : (
                                            <span>{league.entryFee} Points</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{league.prizePool}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/leagues/${league.id}`}>
                                                    <Info className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button size="sm" asChild>
                                                <Link href={`/dashboard/leagues/${league.id}/join`}>Join</Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
