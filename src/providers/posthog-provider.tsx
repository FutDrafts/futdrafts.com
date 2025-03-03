'use client'

import { scan } from 'react-scan'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { env } from '@/env/client'
import { useEffect } from 'react'

export function ClientPostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        scan({
            enabled: process.env.NODE_ENV !== 'production',
            log: true,
        })

        if (!window.location.host.includes('127.0.0.1') && !window.location.host.includes('localhost')) {
            posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
                person_profiles: 'always',
            })
        }

        
    }, [])

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
