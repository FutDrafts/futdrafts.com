import { Metadata } from 'next'
import { AnnouncementBanner } from '@/app/news/_components/_announcement-banner'
import { AdZone } from '@/app/news/_components/_ad-zone'
import { NewsCard } from '@/app/news/_components/_news-card'
import { getPublishedPosts } from '@/actions/posts'

export const metadata: Metadata = {
    title: 'News | FutDrafts',
    description: 'Stay up to date with the latest football news, transfers, and match reports.',
}

export default async function NewsPage() {
    // Get featured news (latest 3 published posts)
    const featuredNews = await getPublishedPosts({ limit: 3 })

    // Get latest news (next 4 published posts)
    const latestNews = await getPublishedPosts({
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
                message="Welcome to our new news section!"
                link={{
                    text: 'Learn more',
                    href: '/news/about',
                }}
            />

            {/* Featured News Section */}
            <section>
                <h2 className="mb-6 text-3xl font-bold">Featured News</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredNews.length > 0 ? (
                        featuredNews.map((news) => (
                            <NewsCard
                                key={news.id}
                                title={news.title}
                                category={news.category}
                                imageUrl={news.featuredImage || '/images/placeholder.jpg'}
                                author={news.authorId}
                                publishedAt={news.publishedAt ? new Date(news.publishedAt) : new Date(news.createdAt)}
                                slug={news.slug}
                            />
                        ))
                    ) : (
                        <div className="text-muted-foreground col-span-3 py-12 text-center">
                            No featured news available at the moment.
                        </div>
                    )}
                </div>
            </section>

            {/* Advertisement */}
            <section>
                <AdZone size="large" className="mx-auto max-w-4xl" />
            </section>

            {/* More News Sections */}
            <section className="grid gap-8 md:grid-cols-2">
                <div>
                    <h2 className="mb-4 text-2xl font-bold">Latest News</h2>
                    <div className="space-y-6">
                        {latestNews.length > 0 ? (
                            latestNews.map((news) => (
                                <NewsCard
                                    key={news.id}
                                    title={news.title}
                                    category={news.category}
                                    imageUrl={news.featuredImage || '/images/placeholder.jpg'}
                                    author={news.authorId}
                                    publishedAt={
                                        news.publishedAt ? new Date(news.publishedAt) : new Date(news.createdAt)
                                    }
                                    slug={news.slug}
                                />
                            ))
                        ) : (
                            <div className="text-muted-foreground py-8 text-center">
                                No latest news available at the moment.
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-2xl font-bold">Top Stories</h2>
                    <div className="space-y-6">
                        {topStories.length > 0 ? (
                            topStories.map((news) => (
                                <NewsCard
                                    key={news.id}
                                    title={news.title}
                                    category={news.category}
                                    imageUrl={news.featuredImage || '/images/placeholder.jpg'}
                                    author={news.authorId}
                                    publishedAt={
                                        news.publishedAt ? new Date(news.publishedAt) : new Date(news.createdAt)
                                    }
                                    slug={news.slug}
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
