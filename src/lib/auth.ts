import { betterAuth } from 'better-auth'
import { admin, jwt } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { env as serverEnv } from '@/env/server'
import { env as clientEnv } from '@/env/client'

export const auth = betterAuth({
    appName: 'FutDrafts',
    baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        autoSignIn: true,
        maxPasswordLength: 32,
        async sendResetPassword(data, request) {
            // TODO: Implement
            console.log('sendResetPassword')
            console.log(data, request)
        },
    },
    socialProviders: {
        github: {
            enabled: true,
            clientId: serverEnv.GITHUB_CLIENT_ID as string,
            clientSecret: serverEnv.GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [admin(), jwt()],
})
