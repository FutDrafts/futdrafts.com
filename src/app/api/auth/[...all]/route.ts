import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { headers } from 'next/headers'

export const runtime = 'edge'

const handler = toNextJsHandler(auth)

// Add OPTIONS method handler for CORS preflight requests
export async function OPTIONS() {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Check if the origin is in the trusted origins list
    const isTrustedOrigin = auth.options.trustedOrigins.includes(origin || '')

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': isTrustedOrigin ? origin! : auth.options.baseURL,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        },
    })
}

export const { GET, POST } = handler
