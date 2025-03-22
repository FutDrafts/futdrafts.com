import { Metadata } from 'next'
import { MarketingFooter } from './_footer'
import { MarketingNavbar } from './_navbar'

export const metadata: Metadata = {
    title: 'FutDrafts - Global Fantasy Football Drafts',
    description:
        'Create, manage, and compete in fantasy football drafts with friends, colleagues, and others from around the world.',
    keywords: [
        'fantasy football',
        'drafts',
        'leagues',
        'competitions',
        'fantasy sports',
        'football management',
        'futdrafts',
        'futdrafts.com',
    ],
    openGraph: {
        title: 'FutDrafts - Global Fantasy Football Drafts',
        description:
            'Create, manage, and compete in fantasy football drafts with friends, colleagues, and others from around the world.',
        type: 'website',
        url: 'https://futdrafts.com',
        images: [
            {
                url: '/android-chrome-512x512.png',
                width: 1200,
                height: 630,
                alt: 'FutDrafts Logo',
            },
        ],
    },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <MarketingNavbar />
            <main className="flex-1">{children}</main>
            <MarketingFooter />
        </div>
    )
}
