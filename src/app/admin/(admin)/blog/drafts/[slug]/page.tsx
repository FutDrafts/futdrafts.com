/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { getPostBySlug } from '@/actions/posts'
import { ArrowLeftIcon, EditIcon, AlertTriangleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkBreaks from 'remark-breaks'
import React from 'react'
import { post, user } from '@/db/schema'

type PostSchema = typeof post.$inferSelect & {
    author: typeof user.$inferSelect
}

// Function to preprocess markdown content to handle callouts
function preprocessMarkdown(content: string) {
    // Replace GitHub-style callouts with HTML that can be styled
    return content.replace(/^>\s*\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION)\](.*$)/gm, (_, type, text) => {
        type CalloutType = 'NOTE' | 'WARNING' | 'IMPORTANT' | 'TIP' | 'CAUTION'
        const calloutType = type as CalloutType

        const iconMap: Record<CalloutType, string> = {
            NOTE: 'info',
            WARNING: 'alert-triangle',
            IMPORTANT: 'alert-circle',
            TIP: 'check-circle-2',
            CAUTION: 'help-circle',
        }

        const icon = iconMap[calloutType]

        return `<div class="callout callout-${calloutType.toLowerCase()}">
                <div class="callout-title">
                    <span class="callout-icon" data-icon="${icon}"></span>
                    <span class="callout-type">${calloutType}</span>
                </div>
                <div class="callout-content">${text.trim()}</div>
            </div>`
    })
}

export default function DraftPreview({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const router = useRouter()
    const [post, setPost] = useState<PostSchema | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPost() {
            try {
                const result = await getPostBySlug(slug)

                if (!result) {
                    toast.error('Post not found')
                    router.push('/admin/blog/drafts')
                    return
                }

                // Check if the post is a draft
                if (result.status !== 'draft') {
                    toast.info('This post is not a draft. Redirecting to published post.')
                    router.push(`/blog/${result.slug}`)
                    return
                }

                setPost(result)
                setLoading(false)
            } catch (error) {
                console.error('Failed to load post:', error)
                toast.error('Failed to load post')
                router.push('/admin/blog/drafts')
            }
        }

        loadPost()
    }, [slug, router])

    // Preprocess the content to handle callouts
    const processedContent = post?.content ? preprocessMarkdown(post.content) : ''

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl space-y-8 py-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Button>
                    <Skeleton className="h-10 w-64" />
                </div>
                <Skeleton className="h-[300px] w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl space-y-8 py-8">
            <div
                className="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-200"
                role="alert"
            >
                <div className="flex items-center gap-2">
                    <AlertTriangleIcon className="h-5 w-5" />
                    <p className="font-bold">Draft Preview</p>
                </div>
                <p>You are viewing a draft article. This content is not visible to regular users.</p>
            </div>

            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/admin/blog/drafts">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Drafts
                    </Link>
                </Button>

                <Button asChild>
                    <Link href={`/admin/blog/edit/${post?.id}`}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit Draft
                    </Link>
                </Button>
            </div>

            <article className="space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-medium capitalize">{post?.category}</span>
                        <span className="text-muted-foreground">•</span>
                        <time dateTime={post?.createdAt?.toString() || ''} className="text-muted-foreground">
                            Created {formatDistanceToNow(new Date(post?.createdAt || ''), { addSuffix: true })}
                        </time>
                        <span className="text-muted-foreground">•</span>
                        <span className="rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            Draft
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight">{post?.title}</h1>

                    {post?.excerpt && <p className="text-muted-foreground text-xl">{post?.excerpt}</p>}

                    {post?.author && (
                        <div className="flex items-center gap-2">
                            {post?.author.image && (
                                <Image
                                    src={post?.author.image}
                                    alt={post?.author.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            )}
                            <span>By {post?.author.name}</span>
                        </div>
                    )}
                </div>

                {post?.featuredImage && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                        <Image
                            src={post?.featuredImage}
                            alt={post?.title || ''}
                            width={1200}
                            height={675}
                            className="h-full w-full object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="markdown-body">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            components={{
                                // Add custom components for markdown rendering
                                h1: ({ node, ...props }) => <h1 className="mt-6 mb-4 text-3xl font-bold" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="mt-5 mb-3 text-2xl font-bold" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="mt-4 mb-2 text-xl font-bold" {...props} />,
                                p: ({ node, ...props }) => <p className="my-4" {...props} />,
                                ul: ({ node, ...props }) => <ul className="my-4 list-disc pl-6" {...props} />,
                                ol: ({ node, ...props }) => <ol className="my-4 list-decimal pl-6" {...props} />,
                                li: ({ node, ...props }) => <li className="my-1" {...props} />,
                                a: ({ node, ...props }) => (
                                    <a
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                    />
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-primary/20 my-4 border-l-4 pl-4 italic" {...props} />
                                ),
                                img: ({ node, ...props }) => (
                                    <img
                                        className="my-4 h-auto max-w-full rounded-md"
                                        {...props}
                                        alt={props.alt || 'Image'}
                                    />
                                ),
                                code: ({ node, className, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '')
                                    const isInline = !className
                                    const language = match ? match[1] : ''

                                    return isInline ? (
                                        <code className="bg-muted rounded px-1 py-0.5 text-sm" {...props} />
                                    ) : (
                                        <pre className="bg-muted my-4 overflow-x-auto rounded-md p-4">
                                            <code className={className || ''} data-language={language} {...props} />
                                        </pre>
                                    )
                                },
                                table: ({ node, ...props }) => (
                                    <div className="my-4 overflow-x-auto">
                                        <table
                                            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                                            {...props}
                                        />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => (
                                    <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
                                ),
                                tbody: ({ node, ...props }) => (
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                                ),
                                tr: ({ node, ...props }) => (
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50" {...props} />
                                ),
                                th: ({ node, ...props }) => (
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                        {...props}
                                    />
                                ),
                                td: ({ node, ...props }) => (
                                    <td className="px-6 py-4 text-sm whitespace-nowrap" {...props} />
                                ),
                                input: ({ node, ...props }) => {
                                    if (props.type === 'checkbox') {
                                        return (
                                            <input
                                                type="checkbox"
                                                className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                                checked={props.checked || false}
                                                readOnly
                                                {...props}
                                            />
                                        )
                                    }
                                    return <input {...props} />
                                },
                                del: ({ node, ...props }) => <del className="line-through" {...props} />,
                            }}
                        >
                            {processedContent}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>

            <Card className="bg-muted/50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Ready to publish?</h3>
                        <p className="text-muted-foreground">Make this article visible to all users</p>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/blog/edit/${post?.id}`}>Edit and Publish</Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}
