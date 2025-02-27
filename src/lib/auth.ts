import { betterAuth } from 'better-auth'
import { admin, jwt } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { env as serverEnv } from '@/env/server'
import { env as clientEnv } from '@/env/client'
import { nextCookies } from 'better-auth/next-js'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'

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
    account: {
        accountLinking: {
            trustedProviders: ['github', 'google', 'discord', 'apple', 'email-password'],
        },
    },
    user: {
        additionalFields: {
            lastLogin: {
                type: 'date',
                input: false,
                required: true,
            },
        },
    },
    databaseHooks: {
        session: {
            create: {
                after: async (session) => {
                    await db.update(user).set({ lastLogin: new Date() }).where(eq(user.id, session.userId))
                },
            },
        },
    },
    socialProviders: {
        github: {
            enabled: true,
            clientId: serverEnv.GITHUB_CLIENT_ID as string,
            clientSecret: serverEnv.GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [admin({}), jwt(), nextCookies()],
    trustedOrigins: [
        clientEnv.NEXT_PUBLIC_APP_URL,
        clientEnv.NEXT_PUBLIC_API_URL,
        'https://futdrafts.com',
        'https://www.futdrafts.com',
        'http://localhost:3000',
        'https://localhost:3000',
    ],
    logger: {
        disabled: process.env.NODE_ENV === 'production',
    },
})
