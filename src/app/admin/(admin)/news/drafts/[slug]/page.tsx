'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { getPostBySlug } from '@/actions/posts'
import { ArrowLeft, Edit, AlertTriangle, Info, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react'
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

// Function to preprocess markdown content to handle callouts
function preprocessMarkdown(content: string) {
    // Replace GitHub-style callouts with HTML that can be styled
    return content.replace(
        /^>\s*\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION)\](.*$)/gm,
        (_, type, text) => {
            type CalloutType = 'NOTE' | 'WARNING' | 'IMPORTANT' | 'TIP' | 'CAUTION';
            const calloutType = type as CalloutType;
            
            const iconMap: Record<CalloutType, string> = {
                'NOTE': 'info',
                'WARNING': 'alert-triangle',
                'IMPORTANT': 'alert-circle',
                'TIP': 'check-circle-2',
                'CAUTION': 'help-circle'
            };
            
            const icon = iconMap[calloutType];
            
            return `<div class="callout callout-${calloutType.toLowerCase()}">
                <div class="callout-title">
                    <span class="callout-icon" data-icon="${icon}"></span>
                    <span class="callout-type">${calloutType}</span>
                </div>
                <div class="callout-content">${text.trim()}</div>
            </div>`;
        }
    );
}

export default function DraftPreview({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const router = useRouter()
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPost() {
            try {
                const result = await getPostBySlug(slug)
                
                if (!result) {
                    toast.error('Post not found')
                    router.push('/admin/news/drafts')
                    return
                }
                
                // Check if the post is a draft
                if (result.status !== 'draft') {
                    toast.info('This post is not a draft. Redirecting to published post.')
                    router.push(`/news/${result.slug}`)
                    return
                }
                
                setPost(result)
                setLoading(false)
            } catch (error) {
                console.error('Failed to load post:', error)
                toast.error('Failed to load post')
                router.push('/admin/news/drafts')
            }
        }
        
        loadPost()
    }, [slug, router])

    // Preprocess the content to handle callouts
    const processedContent = post?.content ? preprocessMarkdown(post.content) : '';

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl space-y-8 py-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
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
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-600" role="alert">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-bold">Draft Preview</p>
                </div>
                <p>You are viewing a draft article. This content is not visible to regular users.</p>
            </div>
            
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/admin/news/drafts">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Drafts
                    </Link>
                </Button>
                
                <Button asChild>
                    <Link href={`/admin/news/edit/${post.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Draft
                    </Link>
                </Button>
            </div>
            
            <article className="space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-medium capitalize">{post.category}</span>
                        <span className="text-muted-foreground">•</span>
                        <time dateTime={post.createdAt.toString()} className="text-muted-foreground">
                            Created {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </time>
                        <span className="text-muted-foreground">•</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                            Draft
                        </span>
                    </div>
                    
                    <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
                    
                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground">{post.excerpt}</p>
                    )}
                    
                    {post.author && (
                        <div className="flex items-center gap-2">
                            {post.author.image && (
                                <Image 
                                    src={post.author.image} 
                                    alt={post.author.name} 
                                    width={40} 
                                    height={40} 
                                    className="rounded-full"
                                />
                            )}
                            <span>By {post.author.name}</span>
                        </div>
                    )}
                </div>
                
                {post.featuredImage && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
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
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                p: ({ node, ...props }) => <p className="my-4" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
                                li: ({ node, ...props }) => <li className="my-1" {...props} />,
                                a: ({ node, ...props }) => (
                                    <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-primary/20 pl-4 italic my-4" {...props} />
                                ),
                                img: ({ node, ...props }) => (
                                    <img className="max-w-full h-auto rounded-md my-4" {...props} alt={props.alt || 'Image'} />
                                ),
                                code: ({ node, className, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '')
                                    const isInline = !className
                                    const language = match ? match[1] : ''
                                    
                                    return isInline ? (
                                        <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
                                    ) : (
                                        <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4">
                                            <code className={className || ''} data-language={language} {...props} />
                                        </pre>
                                    )
                                },
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-4">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
                                tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props} />,
                                tr: ({ node, ...props }) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50" {...props} />,
                                th: ({ node, ...props }) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />,
                                td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />,
                                input: ({ node, ...props }) => {
                                    if (props.type === 'checkbox') {
                                        return (
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
            
            <Card className="p-6 bg-muted/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">Ready to publish?</h3>
                        <p className="text-muted-foreground">Make this article visible to all users</p>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/news/edit/${post.id}`}>
                            Edit and Publish
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
} 