import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

// Specify which routes the middleware should apply to
export const config = {
    matcher: ['/admin/:path*'],
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        const sessionToken = request.cookies.get('session')?.value

        if (!sessionToken) {
            // Redirect to login if no session exists
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            // Verify JWT token containing user data
            const sessionData = await decrypt(sessionToken)

            if (!sessionData || !sessionData.role) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            // Check if the user role is authorized to access the admin area
            // Allowed roles: ADMIN, SUPER_ADMIN, MODERATOR
            const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'admin', 'super_admin', 'moderator']

            if (!allowedRoles.includes(sessionData.role.toString().toUpperCase()) &&
                !allowedRoles.includes(sessionData.role.toString().toLowerCase())) {
                // Rediriger ou renvoyer une erreur 403 Forbidden
                return NextResponse.redirect(new URL('/dashboard', request.url)) // Or to an Unauthorized page
            }

            // Optionnel : Actualiser le token JWT en cas d'utilisation active pour étendre la durée de vie
            // const res = NextResponse.next()
            // res.cookies.set('session', ...)

            return NextResponse.next()

        } catch (error) {
            // En cas d'erreur de décryptage du JWT (modifié manuellement, corrompu...)
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}
