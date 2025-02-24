'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import {
    AlertCircleIcon,
    SearchIcon,
    ClockIcon,
    CheckCircle2Icon,
    Trash2Icon,
    MoreVerticalIcon,
    EyeIcon,
    UserX2Icon,
    Loader2Icon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { report, reportComment, ReportStatus, user } from '@/db/schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateUserBanStatus } from '@/actions/admin/user'
import { toast } from 'sonner'
import { updateReportStatus } from '@/actions/admin/reports'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const statusIcons = {
    pending: <ClockIcon className="h-4 w-4 text-yellow-500" />,
    resolved: <CheckCircle2Icon className="h-4 w-4 text-green-500" />,
    dismissed: <Trash2Icon className="text-muted-foreground h-4 w-4" />,
}

type ReportTable = typeof report.$inferSelect & {
    reportedUser: UserTable
    reportedByUser: UserTable
    resolvedByUser: UserTable
    comments: ReportCommentTable[]
}
type ReportCommentTable = typeof reportComment.$inferSelect & {
    admin: UserTable
}
type UserTable = typeof user.$inferSelect

export default function ReportsTable() {
    const queryClient = useQueryClient()
    const ITEMS_PER_PAGE = 5

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

            const response = await fetch(`/api/admin/reports?${params}`)
            if (!response.ok) throw new Error('Failed to fetch reports')

            return response.json()
        },
    })

    const addCommentMutation = useMutation({
        mutationFn: async (data: { reportId: string; content: string }) => {
            const response = await fetch('/api/admin/reports/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error('Failed to add comment')
            return response.json()
        },
        onMutate: async (newComment) => {
            await queryClient.cancelQueries({ queryKey: ['reports'] })

            const previousReports = queryClient.getQueryData<{ reports: ReportTable[]; total: number }>(['reports'])

            if (previousReports && selectedReport) {
                const optimisticComment: ReportCommentTable = {
                    id: 'temp-' + Date.now(),
                    reportId: selectedReport.id,
                    adminId: selectedReport.resolvedByUser.id,
                    content: newComment.content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    admin: selectedReport.resolvedByUser,
                }

                const updatedReports = {
                    ...previousReports,
                    reports: previousReports.reports.map((report) => {
                        if (report.id === selectedReport.id) {
                            return {
                                ...report,
                                comments: [...(report.comments || []), optimisticComment],
                            }
                        }
                        return report
                    }),
                }

                queryClient.setQueryData(['reports'], updatedReports)
                const updatedReport = updatedReports.reports.find((r) => r.id === selectedReport.id)
                if (updatedReport) {
                    setSelectedReport(updatedReport)
                }
            }

            return { previousReports }
        },
        onError: (err, newComment, context) => {
            if (context?.previousReports) {
                queryClient.setQueryData(['reports'], context.previousReports)
                const previousReport = context.previousReports.reports.find((r) => r.id === selectedReport?.id)
                if (previousReport) {
                    setSelectedReport(previousReport)
                }
            }
            console.error(err)
            toast.error('Failed to add comment')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] })
            setNewComment('')
            toast.success('Comment added successfully')
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
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                            <Input
                                placeholder="Search reports..."
                                disabled
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="harassment">Harassment</SelectItem>
                                <SelectItem value="spam">Spam</SelectItem>
                                <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                                <SelectItem value="hate_speech">Hate Speech</SelectItem>
                                <SelectItem value="cheating">Cheating</SelectItem>
                                <SelectItem value="impersonation">Impersonation</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="dismissed">Dismissed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

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
                                    <TableRow key={report.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{report.reportedUser.name}</div>
                                                <div className="text-muted-foreground text-sm">
                                                    {report.reportedUser.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <AlertCircleIcon className="text-destructive h-4 w-4" />
                                                <span>{report.reason}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize">{report.category}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {statusIcons[report.status as keyof typeof statusIcons]}
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                                                        {
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500':
                                                                report.status === 'pending',
                                                            'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500':
                                                                report.status === 'resolved',
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-500':
                                                                report.status === 'dismissed',
                                                        },
                                                    )}
                                                >
                                                    {report.status}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{report.reportedByUser.name}</TableCell>
                                        <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
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
                                                            setSelectedReport(report)
                                                            setSelectedUser(report.reportedUser)
                                                            setIsDetailsOpen(true)
                                                        }}
                                                    >
                                                        <EyeIcon className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {report.status === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                className="text-green-600 focus:text-green-600"
                                                                onClick={() =>
                                                                    handleStatusChange(report.id, 'resolved')
                                                                }
                                                            >
                                                                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                                                                Mark as Resolved
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-muted-foreground"
                                                                onClick={() =>
                                                                    handleStatusChange(report.id, 'dismissed')
                                                                }
                                                            >
                                                                <Trash2Icon className="mr-2 h-4 w-4" />
                                                                Dismiss Report
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => {
                                                                    setSelectedReport(report)
                                                                    setSelectedUser(report.reportedUser)
                                                                    setIsBanDialogOpen(true)
                                                                }}
                                                            >
                                                                <UserX2Icon className="mr-2 h-4 w-4" />
                                                                Ban User
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
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

                {/* Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Report Details</DialogTitle>
                            <DialogDescription>Full information about the report</DialogDescription>
                        </DialogHeader>
                        {selectedReport && (
                            <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="users">Users</TabsTrigger>
                                    <TabsTrigger value="comments">Comments</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium">Category</h4>
                                        <p className="text-muted-foreground text-sm capitalize">
                                            {selectedReport.category}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Reason</h4>
                                        <p className="text-muted-foreground text-sm">{selectedReport.reason}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Details</h4>
                                        <p className="text-muted-foreground text-sm">{selectedReport.details}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium">Created At</h4>
                                            <p className="text-muted-foreground text-sm">
                                                {new Date(selectedReport.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium">Status</h4>
                                            <div className="flex items-center gap-2">
                                                {statusIcons[selectedReport.status as keyof typeof statusIcons]}
                                                <span className="text-muted-foreground text-sm capitalize">
                                                    {selectedReport.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="users" className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Reported User</h4>
                                            <div className="flex items-start gap-4 rounded-lg border p-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={selectedReport.reportedUser.image ?? ''} />
                                                    <AvatarFallback>
                                                        {selectedReport.reportedUser.name?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <p className="font-medium">{selectedReport.reportedUser.name}</p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {selectedReport.reportedUser.email}
                                                    </p>
                                                    {selectedReport.reportedUser.banned && (
                                                        <div className="text-destructive text-sm">
                                                            Banned until:{' '}
                                                            {selectedReport.reportedUser.banExpires
                                                                ? new Date(
                                                                      selectedReport.reportedUser.banExpires,
                                                                  ).toLocaleDateString()
                                                                : 'Permanently'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium">Reported By</h4>
                                            <div className="flex items-start gap-4 rounded-lg border p-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={selectedReport.reportedByUser.image ?? ''} />
                                                    <AvatarFallback>
                                                        {selectedReport.reportedByUser.name?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <p className="font-medium">{selectedReport.reportedByUser.name}</p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {selectedReport.reportedByUser.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="comments" className="space-y-4">
                                    <ScrollArea className="h-[300px] rounded-md border p-4">
                                        <div className="space-y-4">
                                            {selectedReport.comments && selectedReport.comments.length > 0 ? (
                                                selectedReport.comments.toReversed().map((comment) => (
                                                    <div key={comment.id} className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={comment.admin.image ?? ''} />
                                                                <AvatarFallback>
                                                                    {comment.admin.name?.[0]?.toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm font-medium">
                                                                {comment.admin.name}
                                                            </span>
                                                            <span className="text-muted-foreground text-xs">
                                                                {new Date(comment.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm">{comment.content}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-muted-foreground py-8 text-center">
                                                    No comments yet
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>

                                    <div className="space-y-2">
                                        <Textarea
                                            placeholder="Add a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <Button
                                            onClick={() =>
                                                addCommentMutation.mutate({
                                                    reportId: selectedReport.id,
                                                    content: newComment,
                                                })
                                            }
                                            disabled={!newComment.trim() || addCommentMutation.isPending}
                                        >
                                            {addCommentMutation.isPending ? (
                                                <>
                                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                                    Adding Comment...
                                                </>
                                            ) : (
                                                'Add Comment'
                                            )}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Ban User Confirmation Dialog */}
                <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{!selectedUser?.banned ? 'Ban User' : 'Unban User'}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {!selectedUser?.banned
                                    ? `Are you sure you want to ban ${selectedUser?.name}? They will no longer be able to access their account.`
                                    : `Are you sure you want to unban ${selectedUser?.name}? They will regain access to their account.`}
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {!selectedUser?.banned && (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="banReason" className="text-sm font-medium">
                                        Ban Reason
                                    </label>
                                    <Input
                                        id="banReason"
                                        value={banReason}
                                        onChange={(e) => setBanReason(e.target.value)}
                                        placeholder="Enter reason for ban"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="banExpiry" className="text-sm font-medium">
                                        Ban Expiry (optional)
                                    </label>
                                    <Input
                                        id="banExpiry"
                                        type="datetime-local"
                                        value={banExpiryDate}
                                        onChange={(e) => setBanExpiryDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => {
                                    setSelectedUser(null)
                                    setBanReason('')
                                    setBanExpiryDate('')
                                }}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className={cn(
                                    !selectedUser?.banned
                                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                        : 'bg-green-600 text-white hover:bg-green-600/90',
                                )}
                                onClick={() => selectedUser && handleBanStatusChange(selectedUser.id)}
                            >
                                {!selectedUser?.banned ? 'Ban User' : 'Unban User'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    )
}
