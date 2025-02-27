import { env } from '@/env/client'
import { createAuthClient } from 'better-auth/react'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { type auth } from './auth'

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_APP_URL,
    plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
})
