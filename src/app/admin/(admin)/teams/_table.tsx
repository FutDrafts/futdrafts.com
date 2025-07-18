'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { team } from '@/db/schema'
import { useQuery } from '@tanstack/react-query'
import { EditIcon, EyeIcon, Loader2Icon, MoreVerticalIcon, SearchIcon, Trash2Icon } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import Image from 'next/image'

type TeamTable = typeof team.$inferSelect & {
    league: {
        country: string
        name: string
        flag: string
    }
    venue: {
        city: string
    }
}

export default function TeamsTable() {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const debouncedSearchQuery = useDebounce(searchQuery, 300)
    const [nationalFilter, setNationalFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState<number>(1)

    const ITEMS_PER_PAGE = 10

    const { data, isLoading, error } = useQuery({
        queryKey: ['teams', currentPage, debouncedSearchQuery, nationalFilter],
        queryFn: async (): Promise<{ teams: TeamTable[]; total: number }> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: debouncedSearchQuery,
                national: nationalFilter,
            })

            const response = await fetch(`/server/api/admin/teams?${params}`)
            if (!response.ok) throw new Error('Failed to fetch teams.')
            return response.json()
        },
    })

    const { teams = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    if (error) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-destructive">Error loading teams. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Teams</CardTitle>
                <CardDescription>View and manage soccer teams from around the world.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input
                                placeholder="Search Teams..."
                                aria-label="Search Teams"
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Select value={nationalFilter} onValueChange={setNationalFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="international">International</SelectItem>
                                <SelectItem value="domestic">Domestic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {isLoading ? (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                            <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center">
                            <p>No teams found.</p>
                            {searchQuery || nationalFilter !== 'all' ? (
                                <p className="mt-1 text-sm">Try adjusting your filters.</p>
                            ) : null}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]"></TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Team Code</TableHead>
                                    <TableHead>National</TableHead>
                                    <TableHead>Founded</TableHead>
                                    <TableHead>League</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teams.map((team) => (
                                    <TableRow key={team.id}>
                                        <TableCell>
                                            <Image
                                                src={team.logo}
                                                alt={team.name}
                                                width="50"
                                                height="50"
                                                className="rounded-md"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{team.name}</TableCell>
                                        <TableCell>{team.code}</TableCell>
                                        <TableCell>{team.isNational === true ? 'International' : 'Domestic'}</TableCell>
                                        <TableCell>{team.founded}</TableCell>
                                        <TableCell>{team.league?.name || 'N/A'}</TableCell>
                                        <TableCell>{team.venue?.city || 'N/A'}</TableCell>
                                        <TableCell>{team.league?.country || 'N/A'}</TableCell>
                                        <TableCell>
                                            {team.league && team.league.flag ? (
                                                <Image
                                                    className="border"
                                                    src={team.league.flag}
                                                    alt={`${team.league.name || 'league'}-flag`}
                                                    height="50"
                                                    width="50"
                                                />
                                            ) : (
                                                <span>No Flag</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                        <MoreVerticalIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="align-end">
                                                    <DropdownMenuItem>
                                                        <EyeIcon className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <EditIcon className="mr-2 h-4 w-4" />
                                                        Edit Team
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Trash2Icon className="text-destructive focus:text-destructive mr-2 size-4" />
                                                        Delete Team
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
