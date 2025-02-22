import { env } from '@/env/client'
import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_APP_URL,
    plugins: [adminClient()],
    fetchOptions: {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    },
})
