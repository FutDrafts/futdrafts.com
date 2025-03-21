import { betterAuth } from 'better-auth'
import { admin, jwt, username } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { env as serverEnv } from '@/env/server'
import { env as clientEnv } from '@/env/client'
import { nextCookies } from 'better-auth/next-js'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import posthog from 'posthog-js'

const isFeatureFlagEnabled = (featureFlag: string) => {
    const flagEnabled = posthog.isFeatureEnabled(featureFlag)
    return flagEnabled
}

export const auth = betterAuth({
    appName: 'FutDrafts',
    baseURL: clientEnv.NEXT_PUBLIC_APP_URL as string,
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    emailVerification: {
        sendOnSignUp: true,
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        maxPasswordLength: 32,
        async sendResetPassword({ user, url, token }, request) {
            console.log(user, url, token, request)
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
                defaultValue: new Date(),
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
            disableSignUp: isFeatureFlagEnabled('github-auth'),
            clientId: serverEnv.GITHUB_CLIENT_ID as string,
            clientSecret: serverEnv.GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [admin(), jwt(), username(), nextCookies()],
    trustedOrigins: [
        clientEnv.NEXT_PUBLIC_APP_URL,
        clientEnv.NEXT_PUBLIC_API_URL,
        'https://futdrafts.com',
        'https://www.futdrafts.com',
        'http://localhost:3000',
        'https://localhost:3000',
    ],
    logger: {
        disabled: false,
        level: 'debug',
        log: (level, message, ...args) => {
            console.log(`[BETTER-AUTH] [${level.toUpperCase()}]: ${message}`, ...args)
        },
    },
    // advanced: {
    //     useSecureCookies: true,

    //     crossSubDomainCookies: {
    //         enabled: true,
    //         additionalCookies: ['__cf_bm'],
    //     },
    // },
})
