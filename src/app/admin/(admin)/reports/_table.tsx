'use client'

import { useState } from 'react'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2Icon, AlertCircleIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateUserBanStatus } from '@/actions/admin/user'
import { toast } from 'sonner'
import { updateReportStatus } from '@/actions/admin/reports'
import { ReportStatus } from '@/db/schema'
import { ReportTable, UserTable } from './_components/types'
import { ReportFilters } from './_components/report-filters'
import { ReportRow } from './_components/report-row'
import { ReportDetailsDialog } from './_components/report-details-dialog'
import { BanUserDialog } from './_components/ban-user-dialog'

const ITEMS_PER_PAGE = 5

export default function ReportsTable() {
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedReport, setSelectedReport] = useState<ReportTable | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
    const [banReason, setBanReason] = useState('')
    const [banExpiryDate, setBanExpiryDate] = useState('')
    const [selectedUser, setSelectedUser] = useState<UserTable | null>(null)
    const [newComment, setNewComment] = useState('')

    const { data: selectedReportData } = useQuery<ReportTable>({
        queryKey: ['report', selectedReport?.id],
        queryFn: async () => {
            if (!selectedReport?.id) return null
            const response = await fetch(`/server/api/admin/reports/${selectedReport.id}`)
            if (!response.ok) throw new Error('Failed to fetch report details')
            return response.json()
        },
        enabled: !!selectedReport?.id,
    })

    const { data, isLoading, error } = useQuery<{ reports: ReportTable[]; total: number }>({
        queryKey: ['reports', currentPage, typeFilter, statusFilter, searchQuery],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                type: typeFilter,
                status: statusFilter,
                search: searchQuery,
            })

            const response = await fetch(`/server/api/admin/reports?${params}`)
            if (!response.ok) throw new Error('Failed to fetch reports')

            return response.json()
        },
    })

    const addCommentMutation = useMutation({
        mutationFn: async (data: { reportId: string; content: string }) => {
            const response = await fetch('/server/api/admin/reports/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error('Failed to add comment')
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['report', selectedReport?.id] })
            queryClient.invalidateQueries({ queryKey: ['reports'] })
            setNewComment('')
            toast.success('Comment added successfully')
        },
        onError: (err) => {
            console.error(err)
            toast.error('Failed to add comment')
        },
    })

    const { reports = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
        try {
            await updateReportStatus(reportId, newStatus)
            queryClient.invalidateQueries({ queryKey: ['reports'] })
            toast.success('Report status updated successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to update report status')
        }
    }

    const handleBanStatusChange = async (userId: string) => {
        try {
            await updateUserBanStatus(userId, {
                reason: banReason,
                expiryDate: banExpiryDate ? new Date(banExpiryDate).toISOString() : null,
            })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User status updated successfully')
            setBanReason('')
            setBanExpiryDate('')
        } catch (error) {
            console.error(error)
            toast.error('Failed to update user status')
        }
        setIsBanDialogOpen(false)
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="text-destructive text-center">
                        <AlertCircleIcon className="mx-auto mb-2 h-8 w-8" />
                        <p>Error loading reports. Please try again later.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Review reported users and content</CardDescription>
            </CardHeader>
            <CardContent>
                <ReportFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <div className="relative min-h-[300px]">
                    {isLoading ? (
                        <div className="py-10 text-center">
                            <Loader2Icon className="mx-auto h-8 w-8 animate-spin" />
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center">
                            <p>No reports found.</p>
                            {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' ? (
                                <p className="mt-1 text-sm">Try adjusting your filters.</p>
                            ) : null}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reported User</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Reported By</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <ReportRow
                                        key={report.id}
                                        report={report}
                                        onViewDetails={(report) => {
                                            setSelectedReport(report)
                                            setSelectedUser(report.reportedUser)
                                            setIsDetailsOpen(true)
                                        }}
                                        onStatusChange={handleStatusChange}
                                        onBanUser={(report) => {
                                            setSelectedReport(report)
                                            setSelectedUser(report.reportedUser)
                                            setIsBanDialogOpen(true)
                                        }}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                        {Math.min(currentPage * ITEMS_PER_PAGE, reports.length)} of {reports.length} results
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

                <ReportDetailsDialog
                    report={selectedReportData || selectedReport}
                    isOpen={isDetailsOpen}
                    onOpenChange={setIsDetailsOpen}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={() =>
                        addCommentMutation.mutate({
                            reportId: selectedReport!.id,
                            content: newComment,
                        })
                    }
                    isAddingComment={addCommentMutation.isPending}
                />

                <BanUserDialog
                    user={selectedUser}
                    isOpen={isBanDialogOpen}
                    onOpenChange={setIsBanDialogOpen}
                    banReason={banReason}
                    setBanReason={setBanReason}
                    banExpiryDate={banExpiryDate}
                    setBanExpiryDate={setBanExpiryDate}
                    onBanUser={handleBanStatusChange}
                />
            </CardContent>
        </Card>
    )
}
