import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

// Specify which routes middleware should apply to
export const config = {
    matcher: ['/admin/:path*'],
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        const sessionToken = request.cookies.get('session')?.value

        if (!sessionToken) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            // Verify JWT token containing user data
            const sessionData = await decrypt(sessionToken)

            if (!sessionData || !sessionData.role) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            // Normalize role to uppercase for comparison
            const userRole = sessionData.role.toString().toUpperCase()
            
            // Check if user role is authorized to access admin area
            const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR']

            if (!allowedRoles.includes(userRole)) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }

            // Add security headers
            const response = NextResponse.next()
            response.headers.set('X-Admin-Access', 'granted')
            response.headers.set('X-User-Role', userRole)

            return response

        } catch (error) {
            console.warn('Admin middleware error:', error instanceof Error ? error.message : 'Unknown error')
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}
