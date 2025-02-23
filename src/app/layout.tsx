import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { ClientPostHogProvider } from '@/providers/posthog-provider'
import { Providers } from '@/providers'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { ReactQueryClientProvider } from '@/providers/react-query-provider'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'FutDrafts',
    description: 'International Fantasy Football Drafts',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en" suppressHydrationWarning>
                <ClientPostHogProvider>
                    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                        <Toaster closeButton={true} richColors={true} />
                        <Providers>{children}</Providers>
                        <SpeedInsights />
                        <Analytics />
                    </body>
                </ClientPostHogProvider>
            </html>
        </ReactQueryClientProvider>
    )
}
