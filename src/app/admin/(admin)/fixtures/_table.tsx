'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery } from '@tanstack/react-query'
import { EditIcon, EyeIcon, Loader2Icon, MoreVerticalIcon, SearchIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { SoccerFixture } from '@/db/schema/types'
import Image from 'next/image'

type FixtureResponse = SoccerFixture & {
    homeTeam: {
        logo: string
        name: string
    }
    awayTeam: {
        logo: string
        name: string
    }
    league: {
        name: string
        logo: string
    }
    venue: {
        name: string
    }
}

export default function FixtureTable() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 300)
    const [currentPage, setCurrentPage] = useState(1)

    const ITEMS_PER_PAGE = 10

    const { data, isLoading, error } = useQuery({
        queryKey: ['fantasy', 'fixtures', 'admin', currentPage, debouncedSearchQuery],
        queryFn: async (): Promise<{ fixtures: FixtureResponse[]; total: number }> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: debouncedSearchQuery,
            })

            const response = await fetch(`/server/api/admin/fixtures?${params}`)
            if (!response.ok) throw new Error('Failed to fetch Fixture')
            return response.json()
        },
    })

    const { fixtures = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    if (error) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-destructive">Error loading fixtures. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fixtures</CardTitle>
                <CardDescription>View and manage all fixtures</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 size-4" />
                            <Input
                                placeholder="Search Fixtures..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {isLoading ? (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                            <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
                        </div>
                    ) : fixtures.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center">
                            <p>No Fixtures Found.</p>
                            {searchQuery ? <p className="mt-1 text-sm">Try adjusting your filters.</p> : null}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Match</TableHead>
                                    <TableHead>League</TableHead>
                                    <TableHead>Venue</TableHead>
                                    <TableHead>Match Day</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fixtures.map((fixture) => (
                                    <TableRow key={fixture.id}>
                                        <TableCell>{fixture.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={fixture.homeTeam.logo}
                                                        alt={fixture.homeTeam.name}
                                                        height="10"
                                                        width="10"
                                                    />
                                                    <span>{fixture.homeTeam.name}</span>
                                                </div>
                                                <span className="mx-1">vs</span>
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={fixture.awayTeam.logo}
                                                        alt={fixture.awayTeam.name}
                                                        height="10"
                                                        width="10"
                                                    />
                                                    <span>{fixture.awayTeam.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={fixture.league.logo}
                                                    alt={fixture.league.name}
                                                    height="10"
                                                    width="10"
                                                />
                                                <span>{fixture.league.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{fixture.venue.name}</TableCell>
                                        <TableCell>{new Date(fixture.matchDay).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-600">
                                                {fixture.status}
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
                                                        Edit Fixture
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                                        Delete Fixture
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

                {/* Pagination */}
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
