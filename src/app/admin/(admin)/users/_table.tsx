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
import {
    ContactIcon,
    Loader2Icon,
    MoreVerticalIcon,
    SearchIcon,
    ShieldAlertIcon,
    ShieldCheckIcon,
    ShieldIcon,
    UserX2Icon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { user } from '@/db/schema'
import { toast } from 'sonner'
import { updateUserBanStatus, updateUserRole } from '@/actions/admin/user'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const roleIcons = {
    admin: <ShieldCheckIcon className="text-primary h-4 w-4" />,
    user: <ShieldAlertIcon className="text-muted-foreground h-4 w-4" />,
}

type Role = 'admin' | 'user'
type UserTable = typeof user.$inferSelect

export default function UsersTable({ userId }: { userId: string }) {
    const queryClient = useQueryClient()
    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState<UserTable | null>(null)
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role>('user')
    const [banReason, setBanReason] = useState('')
    const [banExpiryDate, setBanExpiryDate] = useState('')

    const ITEMS_PER_PAGE = 10

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', currentPage, roleFilter, statusFilter, searchQuery],
        queryFn: async (): Promise<{ users: UserTable[]; total: number }> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                role: roleFilter,
                status: statusFilter,
                search: searchQuery,
            })

            const response = await fetch(`/server/api/admin/users?${params}`)
            if (!response.ok) throw new Error('Failed to fetch users')

            return response.json()
        },
    })

    const { users = [], total = 0 } = data || {}
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const handleRoleChange = async (userId: string, newRole: Role) => {
        try {
            await updateUserRole(userId, newRole)
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User role updated successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to update user role')
        }
        setIsRoleDialogOpen(false)
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

    const handleImpersonateUser = async (userId: string) => {
        try {
            await authClient.admin.impersonateUser({
                userId,
            })

            router.replace('/dashboard/profile')
        } catch (error) {
            toast.error('Failed to impersonate user')
            console.error(error)
        }
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-destructive">Error loading users. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
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
                        </Select>
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {isLoading ? (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                            <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center">
                            <p>No users found.</p>
                            {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' ? (
                                <p className="mt-1 text-sm">Try adjusting your filters.</p>
                            ) : null}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-muted-foreground text-sm">{user.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {roleIcons[user.role as keyof typeof roleIcons]}
                                                <span className="capitalize">{user.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                                                    !user.banned
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-500',
                                                )}
                                            >
                                                {!user.banned ? 'Active' : 'Banned'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                        <MoreVerticalIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {userId !== user.id && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleImpersonateUser(user.id)}
                                                        >
                                                            <ContactIcon className="mr-2 size-4" />
                                                            Impersonate User
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setSelectedRole(user.role as Role)
                                                            setIsRoleDialogOpen(true)
                                                        }}
                                                    >
                                                        <ShieldIcon className="mr-2 h-4 w-4" />
                                                        Change Role
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsBanDialogOpen(true)
                                                        }}
                                                    >
                                                        <UserX2Icon className="mr-2 h-4 w-4" />
                                                        {!user.banned ? 'Ban User' : 'Unban User'}
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
                        {Math.min(currentPage * ITEMS_PER_PAGE, users.length)} of {users.length} results
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

                {/* Role Change Dialog */}
                <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change User Role</DialogTitle>
                            <DialogDescription>Change the role for {selectedUser?.name}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select new role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => selectedUser && handleRoleChange(selectedUser.id, selectedRole)}>
                                Save Changes
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
