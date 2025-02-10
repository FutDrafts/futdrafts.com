import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth'

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

    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard'],
}
