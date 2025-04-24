'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { Loader2Icon, MailCheckIcon, MailIcon, SendIcon, MoreVerticalIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sendWaitlistNotificationEmail, updateWaitlistUserNotificationStatus } from '@/actions/admin/waitlist'

type WaitlistUser = {
    id: number
    email: string
    notified: boolean
    signupDate: string
}

export default function WaitlistTable() {
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState('')
    const [notifiedFilter, setNotifiedFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState<WaitlistUser | null>(null)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [isMarkingAsNotified, setIsMarkingAsNotified] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isConfirmSendEmailOpen, setIsConfirmSendEmailOpen] = useState(false)

    const ITEMS_PER_PAGE = 10

    const { data, isLoading } = useQuery({
        queryKey: ['waitlist', currentPage, notifiedFilter, searchQuery],
        queryFn: async (): Promise<{ users: WaitlistUser[]; total: number }> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                notified: notifiedFilter,
                search: searchQuery,
            })

            const response = await fetch(`/server/api/admin/waitlist?${params}`)
            if (!response.ok) throw new Error('Failed to fetch waitlist users')

            return response.json()
        },
    })

    const { users = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const handleUpdateNotifiedStatus = async () => {
        if (!selectedUser) return

        setIsProcessing(true)
        try {
            const result = await updateWaitlistUserNotificationStatus({
                id: selectedUser.id,
                notified: isMarkingAsNotified,
            })

            if (result.success) {
                toast.success(
                    `User ${isMarkingAsNotified ? 'marked as notified' : 'marked as not notified'} successfully`,
                )
                queryClient.invalidateQueries({ queryKey: ['waitlist'] })
            } else {
                toast.error(result.error || 'Failed to update notification status')
            }
        } catch (error) {
            toast.error('An error occurred while updating notification status')
            console.error(error)
        } finally {
            setIsProcessing(false)
            setIsConfirmDialogOpen(false)
        }
    }

    const handleSendNotificationEmail = async () => {
        if (!selectedUser) return

        setIsProcessing(true)
        try {
            const result = await sendWaitlistNotificationEmail(selectedUser.id)

            if (result.success) {
                toast.success('Notification email sent successfully')
                queryClient.invalidateQueries({ queryKey: ['waitlist'] })
            } else {
                toast.error(result.error || 'Failed to send notification email')
            }
        } catch (error) {
            toast.error('An error occurred while sending the email')
            console.error(error)
        } finally {
            setIsProcessing(false)
            setIsConfirmSendEmailOpen(false)
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Waitlist Users</CardTitle>
                    <CardDescription>View and manage users who have joined the waitlist</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative flex-1 md:max-w-sm">
                                <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                <Input
                                    placeholder="Search by email..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={notifiedFilter} onValueChange={setNotifiedFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="notified">Notified</SelectItem>
                                    <SelectItem value="not-notified">Not Notified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="relative min-h-[300px]">
                        {isLoading ? (
                            <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                                <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                            </div>
                        ) : !users.length ? (
                            <div className="text-muted-foreground py-20 text-center">
                                <p>No waitlist users found.</p>
                                {searchQuery || notifiedFilter !== 'all' ? (
                                    <p className="mt-1 text-sm">Try adjusting your filters.</p>
                                ) : null}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Signup Date</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="font-medium">{user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                                                        user.notified
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500',
                                                    )}
                                                >
                                                    {user.notified ? 'Notified' : 'Not Notified'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(user.signupDate).toLocaleDateString()}</TableCell>
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
                                                                setSelectedUser(user)
                                                                setIsMarkingAsNotified(!user.notified)
                                                                setIsConfirmDialogOpen(true)
                                                            }}
                                                        >
                                                            {user.notified ? (
                                                                <>
                                                                    <MailIcon className="mr-2 h-4 w-4" />
                                                                    Mark as Not Notified
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <MailCheckIcon className="mr-2 h-4 w-4" />
                                                                    Mark as Notified
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setIsConfirmSendEmailOpen(true)
                                                            }}
                                                            disabled={user.notified}
                                                        >
                                                            <SendIcon className="mr-2 h-4 w-4" />
                                                            Send Notification Email
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
                    {totalPages > 1 && (
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
                                <div className="text-muted-foreground text-sm">
                                    Page {currentPage} of {totalPages}
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
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isMarkingAsNotified ? 'Mark user as notified?' : 'Mark user as not notified?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isMarkingAsNotified
                                ? 'This will mark the user as having been notified about the platform launch.'
                                : 'This will mark the user as not having been notified about the platform launch.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={isProcessing} onClick={handleUpdateNotifiedStatus}>
                            {isProcessing ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isConfirmSendEmailOpen} onOpenChange={setIsConfirmSendEmailOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Send notification email?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will send a platform launch notification email to {selectedUser?.email} and mark them
                            as notified.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={isProcessing} onClick={handleSendNotificationEmail}>
                            {isProcessing ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Email'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
