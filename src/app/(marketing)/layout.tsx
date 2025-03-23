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
    authors: [{ name: 'FutDrafts Team' }],
    creator: 'FutDrafts',
    publisher: 'FutDrafts',
    metadataBase: new URL('https://futdrafts.com'),
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
        shortcut: '/favicon-16x16.png',
    },
    manifest: '/manifest.json',
    themeColor: '#ffffff',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    openGraph: {
        title: 'FutDrafts - Global Fantasy Football Drafts',
        description:
            'Create, manage, and compete in fantasy football drafts with friends, colleagues, and others from around the world.',
        type: 'website',
        url: 'https://futdrafts.com',
        siteName: 'FutDrafts',
        locale: 'en_US',
        images: [
            {
                url: '/android-chrome-512x512.png',
                width: 1200,
                height: 630,
                alt: 'FutDrafts Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FutDrafts - Global Fantasy Football Drafts',
        description:
            'Create, manage, and compete in fantasy football drafts with friends, colleagues, and others from around the world.',
        creator: '@futdraftsapp',
        images: ['/android-chrome-512x512.png'],
    },
    applicationName: 'FutDrafts',
    category: 'Sports & Games',
    verification: {
        google: 'google-site-verification-code',
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
