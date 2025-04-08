'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trophy, Users, Search, Globe, Lock, ArrowUpRight, Info, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getFantasyLeagues } from '@/actions/dashboard/fantasy'
import { useQuery } from '@tanstack/react-query'
import { fantasyStatusEnum } from '@/db/schema'
import { getAllLeagueNames } from '@/actions/dashboard/leagues'
import { toast } from 'sonner'

type FantasyStatus = (typeof fantasyStatusEnum.enumValues)[number]
type StatusOption = FantasyStatus | 'All Statuses'

const competitions = ['All Competitions', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'UEFA Champions League']
const regions = ['Global', 'Europe', 'Americas', 'Asia', 'Africa']
const types = ['All Types', 'public', 'private']
const statuses = ['All Statuses', 'pending', 'active'] as const

export default function LeaguesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCompetition, setSelectedCompetition] = useState('All Competitions')
    const [selectedRegion, setSelectedRegion] = useState('Global')
    const [selectedType, setSelectedType] = useState('All Types')
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>('All Statuses')
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const { data, isLoading, error } = useQuery({
        queryKey: ['fantasy', 'leagues', currentPage, searchQuery, selectedStatus, ITEMS_PER_PAGE],
        queryFn: async () => {
            return getFantasyLeagues({
                search: searchQuery,
                status: selectedStatus === 'All Statuses' ? undefined : selectedStatus,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            })
        },
    })

    const { data: leagueData, error: leagueError } = useQuery({
        queryKey: ['fantasy', 'leagues', 'soccer'],
        queryFn: async () => {
            return getAllLeagueNames()
        },
    })

    const { fantasyLeagues = [], total = 0 } = data || {}
    const { leagues = [], total: totalLeagues = 0 } = leagueData || {}
    console.log(leagues, totalLeagues)
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const colorStatusCell = (status: FantasyStatus) => {
        const statusText = status.toUpperCase()
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-700/20 dark:text-green-500">
                        {statusText}
                    </span>
                )
            case 'pending':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500">
                        {statusText}
                    </span>
                )
            case 'ended':
                return (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-700/20 dark:text-orange-500">
                        {statusText}
                    </span>
                )
            case 'cancelled':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-700/20 dark:text-red-500">
                        {statusText}
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700/20 dark:text-gray-500">
                        {statusText}
                    </span>
                )
        }
    }

    if (error) {
        toast.error(error.message)
    }

    if (leagueError) {
        toast.error(leagueError.message)
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Fantasy Leagues</h1>
                    <p className="text-muted-foreground">Browse and join fantasy soccer leagues</p>
                </div>
                <Button asChild className="h-10">
                    <Link href="/dashboard/leagues/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create League
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Leagues</CardTitle>
                        <Trophy className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {fantasyLeagues.filter((league) => league.status === 'active').length}
                        </div>
                        <p className="text-muted-foreground text-xs">Across all competitions</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {fantasyLeagues.reduce((acc, league) => acc + league.maxPlayer, 0)}
                        </div>
                        <div className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            +12% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leagues</CardTitle>
                        <Trophy className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                        <p className="text-muted-foreground text-xs">Leagues available</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Competitions</CardTitle>
                        <Globe className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(fantasyLeagues.map((league) => league.league.name)).size}
                        </div>
                        <p className="text-muted-foreground text-xs">Major leagues covered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Combined Filters and Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div>
                            <CardTitle>Available Leagues</CardTitle>
                            <CardDescription>Join a league to start competing</CardDescription>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
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
                            <Select
                                value={selectedStatus}
                                onValueChange={(value: StatusOption) => setSelectedStatus(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status === 'All Statuses'
                                                ? 'All Statuses'
                                                : status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex h-[300px] items-center justify-center">
                            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex h-[300px] items-center justify-center">
                            <p className="text-destructive">Error loading leagues. Please try again later.</p>
                        </div>
                    ) : fantasyLeagues.length === 0 ? (
                        <div className="flex h-[300px] items-center justify-center">
                            <p className="text-muted-foreground">No leagues found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>League Name</TableHead>
                                            <TableHead>Competition</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Participants</TableHead>
                                            <TableHead>Minimum/Maximum Players</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fantasyLeagues.map((league) => (
                                            <TableRow key={league.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {league.isPrivate ? (
                                                            <Lock className="text-muted-foreground h-4 w-4" />
                                                        ) : (
                                                            <Globe className="text-muted-foreground h-4 w-4" />
                                                        )}
                                                        <span className="font-medium">{league.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{league.league.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={league.isPrivate ? 'outline' : 'secondary'}>
                                                        {league.isPrivate ? 'Private' : 'Public'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>TODO: Add Player Count</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="text-muted-foreground h-4 w-4" />
                                                        {league.minPlayer}/{league.maxPlayer}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{colorStatusCell(league.status as FantasyStatus)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/dashboard/leagues/${league.slug}`}>
                                                                <Info className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        {league.isPrivate ? (
                                                            <Button disabled>Request to Join</Button>
                                                        ) : (
                                                            <Button size="sm" asChild>
                                                                <Link href={`/dashboard/leagues/${league.slug}/join`}>
                                                                    Join
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-muted-foreground text-sm">
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                                    {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
