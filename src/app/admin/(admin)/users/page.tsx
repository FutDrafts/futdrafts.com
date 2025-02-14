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
import { MoreVertical, Search, Shield, ShieldAlert, ShieldCheck, UserX2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// This would come from your database
const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        joinedAt: '2024-01-15',
        lastLogin: '2024-02-15',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        status: 'active',
        joinedAt: '2024-01-10',
        lastLogin: '2024-02-14',
    },
    {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'user',
        status: 'banned',
        joinedAt: '2024-01-05',
        lastLogin: '2024-02-01',
    },
]

const roleIcons = {
    admin: <ShieldCheck className="h-4 w-4 text-primary" />,
    user: <ShieldAlert className="h-4 w-4 text-muted-foreground" />,
}

type Role = 'admin' | 'user'

export default function UserManagement() {
    const [users, setUsers] = useState(mockUsers)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null)
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role>('user')

    const ITEMS_PER_PAGE = 5

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleRoleChange = (userId: string, newRole: Role) => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
        setIsRoleDialogOpen(false)
    }

    const handleBanStatusChange = (userId: string) => {
        setUsers(
            users.map((user) =>
                user.id === userId ? { ...user, status: user.status === 'active' ? 'banned' : 'active' } : user,
            ),
        )
        setIsBanDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                        <CardDescription>Active and inactive accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Active Users</CardTitle>
                        <CardDescription>Currently active accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users.filter((user) => user.status === 'active').length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Banned Users</CardTitle>
                        <CardDescription>Suspended accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users.filter((user) => user.status === 'banned').length}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>View and manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
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
                                                user.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-500',
                                            )}
                                        >
                                            {user.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
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
                                                        setSelectedUser(user)
                                                        setSelectedRole(user.role as Role)
                                                        setIsRoleDialogOpen(true)
                                                    }}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Change Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setIsBanDialogOpen(true)
                                                    }}
                                                >
                                                    <UserX2 className="mr-2 h-4 w-4" />
                                                    {user.status === 'active' ? 'Ban User' : 'Unban User'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}{' '}
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
                                <AlertDialogTitle>
                                    {selectedUser?.status === 'active' ? 'Ban User' : 'Unban User'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {selectedUser?.status === 'active'
                                        ? `Are you sure you want to ban ${selectedUser?.name}? They will no longer be able to access their account.`
                                        : `Are you sure you want to unban ${selectedUser?.name}? They will regain access to their account.`}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className={cn(
                                        selectedUser?.status === 'active'
                                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                            : 'bg-green-600 text-white hover:bg-green-600/90',
                                    )}
                                    onClick={() => selectedUser && handleBanStatusChange(selectedUser.id)}
                                >
                                    {selectedUser?.status === 'active' ? 'Ban User' : 'Unban User'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    )
}
