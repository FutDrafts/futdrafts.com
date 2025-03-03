import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { getPostBySlug, getPublishedPosts } from '@/actions/posts'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AdZone } from '../_components/_ad-zone'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

// Generate static params for static generation
export async function generateStaticParams() {
    try {
        const posts = await getPublishedPosts()

        return posts.map((post) => ({
            slug: post.slug,
        }))
    } catch (error) {
        console.error('Error generating static params:', error)
        return []
    }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await Promise.resolve(params)
    const post = await getPostBySlug(slug)

    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The requested post could not be found.',
        }
    }

    return {
        title: post.title,
        description: post.excerpt || `Read about ${post.title}`,
        openGraph: {
            title: post.title,
            description: post.excerpt || `Read about ${post.title}`,
            type: 'article',
            publishedTime: post.publishedAt?.toString(),
            modifiedTime: post.updatedAt.toString(),
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    // Get the post by slug
    const { slug } = await Promise.resolve(params)
    const post = await getPostBySlug(slug)

    if (!post || post.status !== 'published') {
        notFound()
    }

    return (
        <div className="container mx-auto max-w-4xl space-y-8 py-8">
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </Button>
            </div>

            <article className="space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-medium">{post.category}</span>
                        <span className="text-muted-foreground">•</span>
                        <time
                            dateTime={post.publishedAt?.toString() || post.createdAt.toString()}
                            className="text-muted-foreground"
                        >
                            {post.publishedAt
                                ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                                : formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </time>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

                    {post.excerpt && <p className="text-muted-foreground text-xl">{post.excerpt}</p>}

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
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>

            <div className="my-12">
                <AdZone size="large" className="mx-auto" />
            </div>

            <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold">Share this article</h2>
                <div className="flex gap-4">
                    <Button variant="outline" size="sm">
                        Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                        Facebook
                    </Button>
                    <Button variant="outline" size="sm">
                        LinkedIn
                    </Button>
                </div>
            </Card>
        </div>
    )
}
