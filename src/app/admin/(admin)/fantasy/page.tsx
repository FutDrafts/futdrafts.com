'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreVertical, Trophy, Users, Edit, Trash2, Eye } from 'lucide-react'

// Mock data - replace with real data fetching
const fantasyLeagues = [
    {
        id: '1',
        name: 'Premier Fantasy Masters',
        baseLeague: 'Premier League',
        members: 120,
        status: 'active',
        season: '2023/24',
        type: 'public',
    },
    {
        id: '2',
        name: 'La Liga Fantasy Elite',
        baseLeague: 'La Liga',
        members: 85,
        status: 'active',
        season: '2023/24',
        type: 'private',
    },
    {
        id: '3',
        name: 'Bundesliga Fantasy Cup',
        baseLeague: 'Bundesliga',
        members: 95,
        status: 'upcoming',
        season: '2023/24',
        type: 'public',
    },
]

export default function FantasyLeaguesPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredLeagues = fantasyLeagues.filter(
        (league) =>
            league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            league.baseLeague.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Fantasy Leagues</h1>
                    <p className="text-muted-foreground">Manage fantasy soccer leagues and competitions</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create League
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leagues</CardTitle>
                        <Trophy className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{fantasyLeagues.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Players</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {fantasyLeagues.reduce((acc, league) => acc + league.members, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Season</CardTitle>
                        <Trophy className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2023/24</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                    <Input
                        placeholder="Search fantasy leagues..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Fantasy Leagues</CardTitle>
                    <CardDescription>View and manage fantasy soccer leagues</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>League Name</TableHead>
                                <TableHead>Base League</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeagues.map((league) => (
                                <TableRow key={league.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Trophy className="text-primary h-4 w-4" />
                                            <span className="font-medium">{league.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{league.baseLeague}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="text-muted-foreground h-4 w-4" />
                                            {league.members} members
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                league.type === 'public'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-500'
                                                    : 'bg-purple-100 text-purple-700 dark:bg-purple-700/20 dark:text-purple-500'
                                            }`}
                                        >
                                            {league.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                league.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500'
                                            }`}
                                        >
                                            {league.status}
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
                                                    Edit League
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete League
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
