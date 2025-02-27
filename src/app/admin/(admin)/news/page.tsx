'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
import { Plus, MoreVertical, Pencil, Trash2, Eye, FileText } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getPosts, deletePost } from '@/actions/posts'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { post } from '@/db/schema'

type PostSchema = typeof post.$inferSelect

export default function NewsManagement() {
    const [articles, setArticles] = useState<PostSchema[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
    const [counts, setCounts] = useState({
        total: 0,
        published: 0,
        draft: 0,
    })

    useEffect(() => {
        async function loadPosts() {
            try {
                const posts = await getPosts()
                setArticles(posts)

                // Calculate counts
                setCounts({
                    total: posts.length,
                    published: posts.filter((post) => post.status === 'published').length,
                    draft: posts.filter((post) => post.status === 'draft').length,
                })

                setLoading(false)
            } catch (error) {
                console.error('Failed to load posts:', error)
                toast.error('Failed to load posts')
                setLoading(false)
            }
        }

        loadPosts()
    }, [])

    const handleDeleteClick = (id: string) => {
        setArticleToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!articleToDelete) return

        try {
            const result = await deletePost(articleToDelete)

            if (result.success) {
                // Remove the deleted article from the state
                const updatedArticles = articles.filter((article) => article.id !== articleToDelete)
                setArticles(updatedArticles)

                // Update counts
                setCounts({
                    total: updatedArticles.length,
                    published: updatedArticles.filter((post) => post.status === 'published').length,
                    draft: updatedArticles.filter((post) => post.status === 'draft').length,
                })

                toast.success('Article deleted successfully')
            } else {
                toast.error('Failed to delete article')
            }
        } catch (error) {
            console.error('Failed to delete article:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to delete article')
        } finally {
            setDeleteDialogOpen(false)
            setArticleToDelete(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">News Management</h1>
                    <p className="text-muted-foreground">Create and manage news articles</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/news/drafts">
                            <FileText className="mr-2 h-4 w-4" />
                            View Drafts
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/news/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Article
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Articles</CardTitle>
                        <CardDescription>Across all categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{counts.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Published</CardTitle>
                        <CardDescription>Live articles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{counts.published}</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <CardTitle>Drafts</CardTitle>
                        <CardDescription>Work in progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{counts.draft}</p>
                    </CardContent>
                    {counts.draft > 0 && (
                        <div className="absolute right-0 bottom-0 p-4">
                            <Button size="sm" variant="ghost" asChild>
                                <Link href="/admin/news/drafts">View All</Link>
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>Manage your news articles</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <p>Loading articles...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-muted-foreground mb-4">No articles found</p>
                            <Button asChild>
                                <Link href="/admin/news/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create your first article
                                </Link>
                            </Button>
                        </div>
                    ) : (
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
                                                    article.status === 'published'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500',
                                                )}
                                            >
                                                {article.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {article.publishedAt
                                                ? formatDistanceToNow(new Date(article.publishedAt), {
                                                      addSuffix: true,
                                                  })
                                                : formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell>{article.authorId}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        {article.status === 'published' ? (
                                                            <Link href={`/news/${article.slug}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        ) : (
                                                            <Link href={`/admin/news/drafts/${article.slug}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Preview
                                                            </Link>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/news/edit/${article.id}`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDeleteClick(article.id)}
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
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the article.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
