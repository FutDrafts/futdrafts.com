import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        PG_DATABASE_URL: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_URL: z.string(),
        GITHUB_CLIENT_ID: z.string(),
        GITHUB_CLIENT_SECRET: z.string(),
        VAPID_PRIVATE_KEY: z.string(),
        POSTHOG_PROJECT_ID: z.string(),
        POSTHOG_API_KEY: z.string(),
        UPLOADTHING_TOKEN: z.string(),
    },
    experimental__runtimeEnv: process.env,
})
