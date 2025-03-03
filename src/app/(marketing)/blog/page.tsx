import { Metadata } from 'next'
import { AnnouncementBanner } from './_components/_announcement-banner'
import { AdZone } from './_components/_ad-zone'
import { BlogCard } from './_components/_blog-card'
import { getPublishedPosts } from '@/actions/posts'

export const metadata: Metadata = {
    title: 'Blog | FutDrafts',
    description: 'Stay up to date with the latest news and updates from FutDrafts.',
}

export default async function BlogPage() {
    // Get featured posts (latest 3 published posts)
    const featuredPosts = await getPublishedPosts({ limit: 3 })

    // Get latest posts (next 4 published posts)
    const latestPosts = await getPublishedPosts({
        limit: 4,
        page: 2,
    })

    // Get top stories (published posts in the 'analysis' category)
    const topStories = await getPublishedPosts({
        limit: 4,
        category: 'analysis',
    })

    return (
        <div className="space-y-8">
            <AnnouncementBanner
                message="Welcome to our new blog section!"
                link={{
                    text: 'Learn more',
                    href: '/blog/about',
                }}
            />

            {/* Featured Blog Posts Section */}
            <section>
                <h2 className="mb-6 text-3xl font-bold">Featured Posts</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredPosts.length > 0 ? (
                        featuredPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                title={post.title}
                                category={post.category}
                                imageUrl={post.featuredImage || '/images/placeholder.jpg'}
                                author={post.authorId}
                                publishedAt={post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)}
                                slug={post.slug}
                            />
                        ))
                    ) : (
                        <div className="text-muted-foreground col-span-3 py-12 text-center">
                            No featured posts available at the moment.
                        </div>
                    )}
                </div>
            </section>

            {/* Advertisement */}
            <section>
                <AdZone size="large" className="mx-auto max-w-4xl" />
            </section>

            {/* More Posts Sections */}
            <section className="grid gap-8 md:grid-cols-2">
                <div>
                    <h2 className="mb-4 text-2xl font-bold">Latest Posts</h2>
                    <div className="space-y-6">
                        {latestPosts.length > 0 ? (
                            latestPosts.map((post) => (
                                <BlogCard
                                    key={post.id}
                                    title={post.title}
                                    category={post.category}
                                    imageUrl={post.featuredImage || '/images/placeholder.jpg'}
                                    author={post.authorId}
                                    publishedAt={
                                        post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)
                                    }
                                    slug={post.slug}
                                />
                            ))
                        ) : (
                            <div className="text-muted-foreground py-8 text-center">
                                No latest posts available at the moment.
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-2xl font-bold">Top Stories</h2>
                    <div className="space-y-6">
                        {topStories.length > 0 ? (
                            topStories.map((post) => (
                                <BlogCard
                                    key={post.id}
                                    title={post.title}
                                    category={post.category}
                                    imageUrl={post.featuredImage || '/images/placeholder.jpg'}
                                    author={post.authorId}
                                    publishedAt={
                                        post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)
                                    }
                                    slug={post.slug}
                                />
                            ))
                        ) : (
                            <div className="text-muted-foreground py-8 text-center">
                                No top stories available at the moment.
                            </div>
                        )}
                    </div>
                    <div className="mt-8">
                        <AdZone size="medium" />
                    </div>
                </div>
            </section>
        </div>
    )
}
