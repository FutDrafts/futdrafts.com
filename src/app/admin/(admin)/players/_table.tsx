'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { league, player, playerStatistics, team } from '@/db/schema'
import { EditIcon, EyeIcon, Loader2Icon, MoreVerticalIcon, SearchIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type PlayerTable = typeof player.$inferSelect & {
    statistics: typeof playerStatistics.$inferSelect & {
        team: typeof team.$inferSelect
        league: typeof league.$inferSelect
    }
}

export default function PlayersTable() {
    // const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    // const [selectedPlayer, setSelectedPlayer] = useState<PlayerTable | null>(null)
    const ITEMS_PER_PAGE = 10

    const { data, isLoading, error } = useQuery({
        queryKey: ['players', currentPage, searchQuery],
        queryFn: async (): Promise<{ players: PlayerTable[]; total: number }> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: searchQuery,
            })

            const response = await fetch(`/api/admin/players?${params}`)
            if (!response.ok) throw new Error('Failed to fetch players.')
            return response.json()
        },
    })

    const { players = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    if (error) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-destructive">Error loading players. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Players</CardTitle>
                <CardDescription>View and manage players across all leagues</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input
                                placeholder="Search players..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select> */}
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {isLoading ? (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                            <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                        </div>
                    ) : players.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center">
                            <p>No users found.</p>
                            {searchQuery ? <p className="mt-1 text-sm">Try adjusting your filters.</p> : null}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]"></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Nationality</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>League</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.map((player) => (
                                    <TableRow key={player.id}>
                                        <TableCell>
                                            <Image
                                                src={player.profilePicture}
                                                alt={`${player.name}`}
                                                width="50"
                                                height="50"
                                                className="rounded-md"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{player.name}</TableCell>
                                        <TableCell>{player.nationality}</TableCell>
                                        <TableCell>{player.statistics.team.name}</TableCell>
                                        <TableCell>{player.statistics.league.name}</TableCell>
                                        <TableCell>{player.statistics.games?.position}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    !player.isInjured
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-500'
                                                }`}
                                            >
                                                {player.isInjured ? 'Injured' : 'Healthy'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                        <MoreVerticalIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <EyeIcon className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <EditIcon className="mr-2 h-4 w-4" />
                                                        Edit Player
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                                        Delete Player
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                        {Math.min(currentPage * ITEMS_PER_PAGE, players.length)} of {players.length} results
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
            </CardContent>
        </Card>
    )
}
