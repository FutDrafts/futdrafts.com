import { env } from '@/env/client'
import { createAuthClient } from 'better-auth/react'
import { adminClient, inferAdditionalFields, usernameClient } from 'better-auth/client/plugins'
import { type auth } from './auth'

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_APP_URL,
    basePath: '/server/api/auth',
    plugins: [adminClient(), usernameClient(), inferAdditionalFields<typeof auth>()],
})
