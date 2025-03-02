'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteChangelogEntry } from '@/actions/changelog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// This would be fetched from the server in a real implementation
import { getAllChangelogEntries } from '@/actions/changelog'
import { useEffect } from 'react'

interface ChangelogEntry {
    id: string
    title: string
    description: string
    version: string | null
    date: Date
    published: boolean | null
    important: boolean | null
    authorId: string | null
}

export default function ChangelogAdminPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [entries, setEntries] = useState<ChangelogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [previewEntry, setPreviewEntry] = useState<ChangelogEntry | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const data = await getAllChangelogEntries()
                setEntries(data)
            } catch (error) {
                toast.error('Failed to load changelog entries')
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchEntries()
    }, [])

    const filteredEntries = entries.filter(
        (entry) =>
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (entry.version && entry.version.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this changelog entry?')) {
            try {
                await deleteChangelogEntry(id)
                setEntries(entries.filter((entry) => entry.id !== id))
                toast.success('Changelog entry deleted successfully')
            } catch (error) {
                toast.error('Failed to delete changelog entry')
                console.error(error)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Changelog Management</h1>
                    <p className="text-muted-foreground">Create and manage changelog entries for your users</p>
                </div>
                <Button onClick={() => router.push('/admin/changelog/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Entry
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                        placeholder="Search changelog entries..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Changelog Entries</CardTitle>
                    <CardDescription>View and manage all changelog entries</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Important</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEntries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                            No changelog entries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEntries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell className="font-medium">{entry.title}</TableCell>
                                            <TableCell>{entry.version || 'N/A'}</TableCell>
                                            <TableCell>
                                                {entry.date ? format(new Date(entry.date), 'MMM dd, yyyy') : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={entry.published ? 'default' : 'outline'}>
                                                    {entry.published ? 'Published' : 'Draft'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {entry.important && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="flex w-fit items-center gap-1"
                                                    >
                                                        <AlertCircle className="h-3 w-3" />
                                                        Important
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setPreviewEntry(entry)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Preview
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.push(`/admin/changelog/edit/${entry.id}`)
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => handleDelete(entry.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Preview Dialog */}
            <Dialog open={!!previewEntry} onOpenChange={(open) => !open && setPreviewEntry(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {previewEntry?.title}
                            {previewEntry?.version && (
                                <span className="text-muted-foreground text-sm">v{previewEntry.version}</span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {previewEntry?.date && format(new Date(previewEntry.date), 'MMMM dd, yyyy')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 space-y-4">
                        <div className="prose dark:prose-invert max-w-none">
                            <p>{previewEntry?.description}</p>
                        </div>
                        <div className="flex gap-2">
                            {previewEntry?.important && (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Important
                                </Badge>
                            )}
                            <Badge variant={previewEntry?.published ? 'default' : 'outline'}>
                                {previewEntry?.published ? 'Published' : 'Draft'}
                            </Badge>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
