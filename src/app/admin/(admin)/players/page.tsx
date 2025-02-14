'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreVertical, Users, Edit, Trash2, Eye, Trophy, ShieldCheck } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock data - replace with real data fetching
const players = [
    {
        id: '1',
        name: 'Marcus Rashford',
        age: 26,
        nationality: 'England',
        team: 'Manchester United',
        league: 'Premier League',
        position: 'Forward',
        status: 'active',
    },
    {
        id: '2',
        name: 'Jude Bellingham',
        age: 20,
        nationality: 'England',
        team: 'Real Madrid',
        league: 'La Liga',
        position: 'Midfielder',
        status: 'active',
    },
    {
        id: '3',
        name: 'Erling Haaland',
        age: 23,
        nationality: 'Norway',
        team: 'Manchester City',
        league: 'Premier League',
        position: 'Forward',
        status: 'injured',
    },
]

const leagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1']
const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper']
const statuses = ['active', 'injured', 'suspended']

export default function PlayersPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLeague, setSelectedLeague] = useState<string>('')
    const [selectedPosition, setSelectedPosition] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const [ageRange, setAgeRange] = useState({ min: '', max: '' })

    const filteredPlayers = players.filter((player) => {
        const matchesSearch =
            player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.nationality.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesLeague = !selectedLeague || player.league === selectedLeague
        const matchesPosition = !selectedPosition || player.position === selectedPosition
        const matchesStatus = !selectedStatus || player.status === selectedStatus
        const matchesAge =
            (!ageRange.min || player.age >= parseInt(ageRange.min)) &&
            (!ageRange.max || player.age <= parseInt(ageRange.max))

        return matchesSearch && matchesLeague && matchesPosition && matchesStatus && matchesAge
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Players</h1>
                    <p className="text-muted-foreground">Manage players across all leagues</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Player
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{players.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Players</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{players.filter((p) => p.status === 'active').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leagues</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leagues.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Player Filters</CardTitle>
                    <CardDescription>Filter players by various criteria</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search players..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select League" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-leagues">All Leagues</SelectItem>
                                {leagues.map((league) => (
                                    <SelectItem key={league} value={league}>
                                        {league}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-positions">All Positions</SelectItem>
                                {positions.map((position) => (
                                    <SelectItem key={position} value={position}>
                                        {position}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-statuses">All Statuses</SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Min Age"
                                value={ageRange.min}
                                onChange={(e) => setAgeRange((prev) => ({ ...prev, min: e.target.value }))}
                                className="w-24"
                            />
                            <span>to</span>
                            <Input
                                type="number"
                                placeholder="Max Age"
                                value={ageRange.max}
                                onChange={(e) => setAgeRange((prev) => ({ ...prev, max: e.target.value }))}
                                className="w-24"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Players</CardTitle>
                    <CardDescription>View and manage players across all leagues</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Nationality</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>League</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlayers.map((player) => (
                                <TableRow key={player.id}>
                                    <TableCell className="font-medium">{player.name}</TableCell>
                                    <TableCell>{player.age}</TableCell>
                                    <TableCell>{player.nationality}</TableCell>
                                    <TableCell>{player.team}</TableCell>
                                    <TableCell>{player.league}</TableCell>
                                    <TableCell>{player.position}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                player.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                    : player.status === 'injured'
                                                      ? 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-500'
                                                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500'
                                            }`}
                                        >
                                            {player.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Player
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Player
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
