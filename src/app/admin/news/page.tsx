'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// This would come from your database
const mockArticles = [
    {
        id: '1',
        title: 'Premier League Transfer Window Updates',
        category: 'Transfers',
        status: 'Published',
        date: '2024-02-15',
        author: 'John Doe',
    },
    {
        id: '2',
        title: 'Champions League Quarter-Finals Preview',
        category: 'Match Reports',
        status: 'Draft',
        date: '2024-02-14',
        author: 'Jane Smith',
    },
]

export default function NewsManagement() {
    const [articles] = useState(mockArticles)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">News Management</h1>
                    <p className="text-muted-foreground">Create and manage news articles</p>
                </div>
                <Button asChild>
                    <Link href="/admin/news/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Article
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Articles</CardTitle>
                        <CardDescription>Across all categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{articles.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Published</CardTitle>
                        <CardDescription>Live articles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{articles.filter((a) => a.status === 'Published').length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Drafts</CardTitle>
                        <CardDescription>Work in progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{articles.filter((a) => a.status === 'Draft').length}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>Manage your news articles</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>{article.category}</TableCell>
                                    <TableCell>
                                        <span
                                            className={cn(
                                                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                                                article.status === 'Published'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500',
                                            )}
                                        >
                                            {article.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{article.date}</TableCell>
                                    <TableCell>{article.author}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/news/${article.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/news/${article.id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        // Add delete confirmation dialog
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
