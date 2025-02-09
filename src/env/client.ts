import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    client: {
        NEXT_PUBLIC_POSTHOG_KEY: z.string(),
        NEXT_PUBLIC_POSTHOG_HOST: z.string(),
        NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string(),
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_MEILISEARCH_HOST: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_MEILISEARCH_HOST: process.env.NEXT_PUBLIC_MEILISEARCH_HOST,
    },
})
