import { betterAuth } from 'better-auth'
import { admin, jwt } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { env } from '@/env/server'

export const auth = betterAuth({
    appName: 'FutDrafts',
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
            clientId: env.GITHUB_CLIENT_ID as string,
            clientSecret: env.GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [admin(), jwt()],
})
