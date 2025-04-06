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
                                        <TableCell>{team.league.name}</TableCell>
                                        <TableCell>{team.venue.city}</TableCell>
                                        <TableCell>{team.league.country}</TableCell>
                                        <TableCell>
                                            <Image
                                                className="border"
                                                src={team.league.flag}
                                                alt={`${team.league.name}-flag`}
                                                height="50"
                                                width="50"
                                            />
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
                                                        <Trash2Icon className="text-destructive focus:text-destructive" />
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
                                const pageButtons = []
                                const maxVisiblePages = 5

                                if (totalPages > 0) {
                                    pageButtons.push(
                                        <Button
                                            key={1}
                                            variant={currentPage === 1 ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(1)}
                                        >
                                            1
                                        </Button>,
                                    )
                                }

                                const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
                                const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2)

                                for (let i = startPage; i <= endPage; i++) {
                                    pageButtons.push(
                                        <Button
                                            key={i}
                                            variant={currentPage === i ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(i)}
                                        >
                                            {i}
                                        </Button>,
                                    )
                                }

                                if (endPage < totalPages - 1) {
                                    pageButtons.push(<span key="ellipsis-end">...</span>)
                                }

                                if (totalPages > 1) {
                                    pageButtons.push(
                                        <Button
                                            key={totalPages}
                                            variant={currentPage === totalPages ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(totalPages)}
                                        >
                                            {totalPages}
                                        </Button>,
                                    )
                                }

                                return pageButtons
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
