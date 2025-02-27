'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, CalendarIcon, EditIcon, EyeIcon } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { getPosts } from '@/actions/posts'
import { toast } from 'sonner'
import { post } from '@/db/schema'
import Image from 'next/image'

type PostSchema = typeof post.$inferSelect

export default function DraftArticles() {
    const [drafts, setDrafts] = useState<PostSchema[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadDrafts() {
            try {
                const posts = await getPosts({ status: 'draft' })
                setDrafts(posts)
                setLoading(false)
            } catch (error) {
                console.error('Failed to load drafts:', error)
                toast.error('Failed to load draft articles')
                setLoading(false)
            }
        }

        loadDrafts()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/news">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Draft Articles</h1>
                    <p className="text-muted-foreground">Preview and manage your draft articles</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <p>Loading draft articles...</p>
                </div>
            ) : drafts.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">No draft articles found</p>
                        <Button asChild>
                            <Link href="/admin/news/create">Create a new article</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {drafts.map((draft) => (
                        <Card key={draft.id} className="overflow-hidden">
                            {draft.featuredImage && (
                                <div className="aspect-video w-full overflow-hidden">
                                    <Image
                                        src={draft.featuredImage}
                                        alt={draft.title}
                                        fill
                                        className="h-full w-full object-cover transition-all hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <span className="capitalize">{draft.category}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <CardTitle className="line-clamp-2">{draft.title}</CardTitle>
                                {draft.excerpt && (
                                    <CardDescription className="line-clamp-3">{draft.excerpt}</CardDescription>
                                )}
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/news/drafts/${draft.slug}`}>
                                        <EyeIcon className="mr-2 h-4 w-4" />
                                        Preview
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/news/edit/${draft.id}`}>
                                        <EditIcon className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
