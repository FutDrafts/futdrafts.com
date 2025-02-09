import { betterFetch } from '@better-fetch/fetch'
import type { auth } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'

type Session = typeof auth.$Infer.Session

// List of paths that should be accessible even in maintenance mode
const ALLOWED_PATHS = ['/admin', '/admin/settings', '/auth/sign-in', '/maintenance']

export async function middleware(request: NextRequest) {
    // Check if the site is in maintenance mode
    const maintenanceMode = request.cookies.get('maintenance_mode')?.value === 'true'

    if (maintenanceMode) {
        // Get the path from the request
        const path = request.nextUrl.pathname

        // Allow access to admin paths and maintenance page
        const isAllowedPath = ALLOWED_PATHS.some((allowedPath) => path.startsWith(allowedPath))

        // If in maintenance mode and not an allowed path, redirect to maintenance page
        if (maintenanceMode && !isAllowedPath) {
            return NextResponse.rewrite(new URL('/maintenance', request.url))
        }
    }

    const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get('cookie') || '',
        },
    })

    if (!session) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    return NextResponse.next()
}

// Configure the paths that should be handled by this middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}
