'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditIcon, GlobeIcon, Loader2Icon, MoreVerticalIcon, SearchIcon, Trash2Icon, TrophyIcon } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { league } from '@/db/schema'
import { toast } from 'sonner'
import { updateLeagueStatus } from '@/actions/admin/leagues'

type LeagueTable = typeof league.$inferSelect
type Status = 'active' | 'upcoming' | 'disabled'

export default function LeaguesTable() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedLeague, setSelectedLeague] = useState<LeagueTable | null>(null)
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<Status>('active')

    const ITEMS_PER_PAGE = 10

    const { data, isLoading, error } = useQuery({
        queryKey: ['leagues', currentPage, searchQuery, statusFilter],
        queryFn: async (): Promise<{ leagues: LeagueTable[]; total: number }> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: searchQuery,
                status: statusFilter,
            })

            const response = await fetch(`/api/admin/leagues?${params}`)
            if (!response.ok) throw new Error('Failed to fetch users.')
            return response.json()
        },
    })

    const { leagues = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const handleStatusChange = async (leagueId: string, newStatus: Status) => {
        try {
            await updateLeagueStatus(leagueId, newStatus)
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
            toast.success('Leagues Status updated successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to update league status')
        }
        setIsStatusDialogOpen(false)
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-destructive">Error loading leagues. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leagues</CardTitle>
                <CardDescription>View and manage soccer leagues from around the world</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input
                                placeholder="Search leagues..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {isLoading ? (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                            <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                        </div>
                    ) : leagues.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center">
                            <p>No users found.</p>
                            {searchQuery || statusFilter !== 'all' ? (
                                <p className="mt-1 text-sm">Try adjusting your filters.</p>
                            ) : null}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>League</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Season</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Team Count</TableHead>
                                    <TableHead>Player Count</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leagues.map((league) => (
                                    <TableRow key={league.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <TrophyIcon className="text-primary h-4 w-4" />
                                                <span className="font-medium">{league.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <GlobeIcon className="text-muted-foreground h-4 w-4" />
                                                {league.country}
                                            </div>
                                        </TableCell>
                                        <TableCell>{league.season.toString()}</TableCell>
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
                                        <TableCell>temp</TableCell>
                                        <TableCell>temp</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                        <MoreVerticalIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedLeague(league)
                                                            setSelectedStatus(league.status as Status)
                                                            setIsStatusDialogOpen(true)
                                                        }}
                                                    >
                                                        <EditIcon className="mr-2 h-4 w-4" />
                                                        Edit League
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                                        Delete League
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
                        {Math.min(currentPage * ITEMS_PER_PAGE, leagues.length)} of {leagues.length} results
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

                <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change User Role</DialogTitle>
                            <DialogDescription>Change the role for {selectedLeague?.name}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => setSelectedStatus(value as Status)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select new role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => selectedLeague && handleStatusChange(selectedLeague.id, selectedStatus)}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
