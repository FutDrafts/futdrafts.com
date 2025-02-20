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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Clock, Eye, MoreVertical, Search, Trash2, UserX2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// This would come from your database
const mockReports = [
    {
        id: '1',
        reportedUser: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
        },
        reportedBy: {
            id: '2',
            name: 'Jane Smith',
        },
        reason: 'Inappropriate behavior',
        type: 'user',
        status: 'pending',
        createdAt: '2024-02-15T10:00:00Z',
        updatedAt: '2024-02-15T10:00:00Z',
        details: 'User was spamming chat with inappropriate content',
    },
    {
        id: '2',
        reportedUser: {
            id: '3',
            name: 'Bob Wilson',
            email: 'bob@example.com',
        },
        reportedBy: {
            id: '4',
            name: 'Alice Brown',
        },
        reason: 'Harassment',
        type: 'user',
        status: 'resolved',
        createdAt: '2024-02-14T15:30:00Z',
        updatedAt: '2024-02-14T16:45:00Z',
        details: 'User was sending threatening messages',
    },
    {
        id: '3',
        reportedUser: {
            id: '5',
            name: 'Charlie Davis',
            email: 'charlie@example.com',
        },
        reportedBy: {
            id: '6',
            name: 'Eva Green',
        },
        reason: 'Spam',
        type: 'content',
        status: 'dismissed',
        createdAt: '2024-02-13T09:15:00Z',
        updatedAt: '2024-02-13T11:20:00Z',
        details: 'Posted multiple spam links in comments',
    },
]

const statusIcons = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
    resolved: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    dismissed: <Trash2 className="text-muted-foreground h-4 w-4" />,
}

export default function ReportsManagement() {
    const [reports, setReports] = useState(mockReports)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedReport, setSelectedReport] = useState<(typeof mockReports)[0] | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)

    const ITEMS_PER_PAGE = 5

    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.reportedUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reportedUser.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reason.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === 'all' || report.type === typeFilter
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE)
    const paginatedReports = filteredReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleStatusChange = (reportId: string, newStatus: 'resolved' | 'dismissed') => {
        setReports(
            reports.map((report) =>
                report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date().toISOString() } : report,
            ),
        )
    }

    const handleBanUser = (reportId: string) => {
        // In a real app, this would call an API to ban the user
        console.log('Banning user from report:', reportId)
        handleStatusChange(reportId, 'resolved')
        setIsBanDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Reports Management</h1>
                <p className="text-muted-foreground">Review and manage reported users and content</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Reports</CardTitle>
                        <CardDescription>All time reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{reports.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending</CardTitle>
                        <CardDescription>Reports awaiting review</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {reports.filter((report) => report.status === 'pending').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Resolved</CardTitle>
                        <CardDescription>Handled reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {reports.filter((report) => report.status === 'resolved').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>Review reported users and content</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                <Input
                                    placeholder="Search reports..."
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
                                    <SelectItem value="user">User Reports</SelectItem>
                                    <SelectItem value="content">Content Reports</SelectItem>
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
                            {paginatedReports.map((report) => (
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
                                            <AlertCircle className="text-destructive h-4 w-4" />
                                            <span>{report.reason}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="capitalize">{report.type}</span>
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
                                    <TableCell>{report.reportedBy.name}</TableCell>
                                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedReport(report)
                                                        setIsDetailsOpen(true)
                                                    }}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {report.status === 'pending' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="text-green-600 focus:text-green-600"
                                                            onClick={() => handleStatusChange(report.id, 'resolved')}
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                            Mark as Resolved
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-muted-foreground"
                                                            onClick={() => handleStatusChange(report.id, 'dismissed')}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Dismiss Report
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => {
                                                                setSelectedReport(report)
                                                                setIsBanDialogOpen(true)
                                                            }}
                                                        >
                                                            <UserX2 className="mr-2 h-4 w-4" />
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

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length}{' '}
                            results
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
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Report Details</DialogTitle>
                                <DialogDescription>Full information about the report</DialogDescription>
                            </DialogHeader>
                            {selectedReport && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium">Reported User</h4>
                                        <p className="text-muted-foreground text-sm">
                                            {selectedReport.reportedUser.name} ({selectedReport.reportedUser.email})
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Reported By</h4>
                                        <p className="text-muted-foreground text-sm">
                                            {selectedReport.reportedBy.name}
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
                                            <h4 className="text-sm font-medium">Last Updated</h4>
                                            <p className="text-muted-foreground text-sm">
                                                {new Date(selectedReport.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
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
                                <AlertDialogTitle>Ban User</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to ban {selectedReport?.reportedUser.name}? This action cannot
                                    be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => selectedReport && handleBanUser(selectedReport.id)}
                                >
                                    Ban User
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    )
}
