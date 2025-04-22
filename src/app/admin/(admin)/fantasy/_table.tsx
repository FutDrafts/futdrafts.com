'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { fantasy } from '@/db/schema'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery } from '@tanstack/react-query'
import {
    EditIcon,
    EyeIcon,
    GlobeIcon,
    Loader2Icon,
    LockIcon,
    MoreVerticalIcon,
    SearchIcon,
    Trash2Icon,
    TrophyIcon,
} from 'lucide-react'
import { useState } from 'react'

type FantasyLeaguesTable = typeof fantasy.$inferSelect & {
    owner: {
        name: string
    }
    league: {
        name: string
    }
}

export default function FantasyLeaguesTable() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 300)
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const ITEMS_PER_PAGE = 10

    const { data, isLoading, error } = useQuery({
        queryKey: ['fantasy', 'fantasyleagues', currentPage, debouncedSearchQuery, statusFilter],
        queryFn: async (): Promise<{ fantasyLeagues: FantasyLeaguesTable[]; total: number }> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: debouncedSearchQuery,
                status: statusFilter,
            })

            const response = await fetch(`/server/api/admin/fantasy?${params}`)
            if (!response.ok) throw new Error('Failed to fetch Fantasy Leagues')
            return response.json()
        },
    })

    const { fantasyLeagues = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    if (error) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-destructive">Error loading fantasy leagues. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    const colorStatusCell = (status: string) => {
        let c

        switch (status) {
            case 'active':
                c = (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-700/20 dark:text-green-500">
                        {status.toUpperCase()}
                    </span>
                )
                break
            case 'pending':
                c = (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500">
                        {status.toUpperCase()}
                    </span>
                )
                break
            case 'cancelled':
                c = (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-700/20 dark:text-red-500">
                        {status.toUpperCase()}
                    </span>
                )
                break
            case 'ended':
                c = (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-700/20 dark:text-orange-500">
                        {status.toUpperCase()}
                    </span>
                )
                break
            default:
                c = (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700/20 dark:text-gray-500">
                        {status.toUpperCase()}
                    </span>
                )
        }

        return c
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fantasy Leagues</CardTitle>
                <CardDescription>View and manage all fantasy Leagues</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 size-4" />
                            <Input
                                placeholder="Search Fantasy Leagues..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="ended">Ended</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {isLoading ? (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                            <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
                        </div>
                    ) : fantasyLeagues.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center">
                            <p>No Fantasy Leagues Found.</p>
                            {searchQuery || statusFilter !== 'all' ? (
                                <p className="mt-1 text-sm">Try adjusting your filters.</p>
                            ) : null}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Private</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>League</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fantasyLeagues.map((league) => (
                                    <TableRow key={league.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <TrophyIcon className="text-primary size-4" />
                                                <span className="font-medium">{league.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{colorStatusCell(league.status)}</TableCell>
                                        <TableCell>
                                            {league.isPrivate ? (
                                                <span className="flex items-center gap-1 rounded-full bg-red-100/30 px-2 py-1 text-xs text-red-600">
                                                    <LockIcon className="size-3" />
                                                    Private
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 rounded-full bg-green-100/30 px-2 py-1 text-xs text-green-600">
                                                    <GlobeIcon className="size-3" />
                                                    Public
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{league.owner.name}</TableCell>
                                        <TableCell>{league.league.name}</TableCell>
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
                            {(() => {
                                // Show limited page buttons to prevent overflow
                                const visiblePages: ('ellipsis-start' | 'ellipsis-end' | number)[] = []
                                const maxVisiblePages = 5

                                if (totalPages <= maxVisiblePages) {
                                    // Show all pages if there are few
                                    visiblePages.push(...Array.from({ length: totalPages }, (_, i) => i + 1))
                                } else {
                                    // Always show first page
                                    visiblePages.push(1)

                                    // Calculate range around current page
                                    const startPage = Math.max(2, currentPage - 1)
                                    const endPage = Math.min(totalPages - 1, currentPage + 1)

                                    // Add ellipsis if needed
                                    if (startPage > 2) {
                                        visiblePages.push('ellipsis-start')
                                    }

                                    // Add pages around current page
                                    for (let i = startPage; i <= endPage; i++) {
                                        visiblePages.push(i)
                                    }

                                    // Add ellipsis if needed
                                    if (endPage < totalPages - 1) {
                                        visiblePages.push('ellipsis-end')
                                    }

                                    // Always show last page
                                    visiblePages.push(totalPages)
                                }

                                return visiblePages.map((page, index) => {
                                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                                        return (
                                            <span key={page} className="text-muted-foreground px-2">
                                                ...
                                            </span>
                                        )
                                    }

                                    return (
                                        <Button
                                            key={`page-${page}-${index}`}
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    )
                                })
                            })()}
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
