import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { ClientPostHogProvider } from '@/providers/posthog-provider'
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { ReactQueryClientProvider } from '@/providers/react-query-provider'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from './server/api/uploadthing/core'
import { connection } from 'next/server'
import { Suspense } from 'react'

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

async function UTSSR() {
    await connection()

    return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
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
                        <Toaster richColors={true} />
                        <SpeedInsights />
                        <Suspense>
                            <UTSSR />
                        </Suspense>
                        <Analytics />
                        <Providers>{children}</Providers>
                    </body>
                </ClientPostHogProvider>
            </html>
        </ReactQueryClientProvider>
    )
}
