'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreVertical, Trophy, Globe, Edit, Trash2 } from 'lucide-react'

// Mock data - replace with real data fetching
const leagues = [
    {
        id: '1',
        name: 'Premier League',
        country: 'England',
        teams: 20,
        status: 'active',
        season: '2023/24',
    },
    {
        id: '2',
        name: 'La Liga',
        country: 'Spain',
        teams: 20,
        status: 'active',
        season: '2023/24',
    },
    {
        id: '3',
        name: 'Bundesliga',
        country: 'Germany',
        teams: 18,
        status: 'active',
        season: '2023/24',
    },
]

export default function LeaguesPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredLeagues = leagues.filter(
        (league) =>
            league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            league.country.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Soccer Leagues</h1>
                    <p className="text-muted-foreground">Manage real-world soccer leagues and competitions</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add League
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search leagues..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Leagues</CardTitle>
                    <CardDescription>View and manage soccer leagues from around the world</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>League</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Teams</TableHead>
                                <TableHead>Season</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeagues.map((league) => (
                                <TableRow key={league.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{league.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            {league.country}
                                        </div>
                                    </TableCell>
                                    <TableCell>{league.teams} teams</TableCell>
                                    <TableCell>{league.season}</TableCell>
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
