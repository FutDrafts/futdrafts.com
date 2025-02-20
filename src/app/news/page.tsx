import { AnnouncementBanner } from '@/app/news/_components/_announcement-banner'
import { AdZone } from '@/app/news/_components/_ad-zone'
import { NewsCard } from '@/app/news/_components/_news-card'

// TODO: Replace with actual data fetching
const mockNews = [
    {
        title: 'Transfer News: Major Signing Expected',
        category: 'Transfers',
        imageUrl: '/images/placeholder.jpg',
        author: 'John Doe',
        publishedAt: new Date(),
        slug: 'transfer-news-major-signing',
    },
    {
        title: 'Match Report: Thrilling Derby',
        category: 'Match Reports',
        imageUrl: '/images/placeholder.jpg',
        author: 'Jane Smith',
        publishedAt: new Date(),
        slug: 'match-report-thrilling-derby',
    },
]

export default async function NewsPage() {
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
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {mockNews.map((news) => (
                        <NewsCard key={news.slug} {...news} />
                    ))}
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
                        {mockNews.map((news) => (
                            <NewsCard key={news.slug} {...news} />
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-2xl font-bold">Top Stories</h2>
                    <div className="space-y-6">
                        {mockNews.map((news) => (
                            <NewsCard key={news.slug} {...news} />
                        ))}
                    </div>
                    <div className="mt-8">
                        <AdZone size="medium" />
                    </div>
                </div>
            </section>
        </div>
    )
}
