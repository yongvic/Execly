import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const LOCALES = ['fr', 'en'] as const
const DEFAULT_LOCALE = 'fr'
const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN', 'MODERATOR'])

// Routes that require authentication (user must be logged in)
const PROTECTED_ROUTES = ['/dashboard', '/checkout', '/orders', '/favorites', '/cookies']
// Routes that already-authenticated users should not access
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password']

function detectLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number])) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() || ''
  return acceptLanguage.startsWith('en') ? 'en' : DEFAULT_LOCALE
}

function getPathWithoutLocale(pathname: string) {
  const parts = pathname.split('/')
  const maybeLocale = parts[1]

  if (LOCALES.includes(maybeLocale as (typeof LOCALES)[number])) {
    return {
      locale: maybeLocale,
      pathname: `/${parts.slice(2).join('/')}`.replace(/\/+$/, '') || '/',
    }
  }

  return { locale: null, pathname }
}

async function getSession(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value
  if (!sessionToken) return null
  try {
    return await decrypt(sessionToken)
  } catch {
    return null
  }
}

async function guardAdmin(request: NextRequest, localizedPathname: string, locale: string) {
  if (!localizedPathname.startsWith('/admin')) {
    return null
  }

  const session = await getSession(request)
  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  const userRole = session?.role?.toString().toUpperCase()
  if (!userRole || !ADMIN_ROLES.has(userRole)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return null
}

async function guardProtectedRoutes(request: NextRequest, localizedPathname: string, locale: string) {
  const isProtected = PROTECTED_ROUTES.some(r => localizedPathname.startsWith(r))
  const isAuthPage = AUTH_ROUTES.some(r => localizedPathname.startsWith(r))

  if (!isProtected && !isAuthPage) return null

  const session = await getSession(request)
  const isAuthenticated = !!session

  // Redirect logged-in users away from auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/browse', request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', localizedPathname)
    return NextResponse.redirect(loginUrl)
  }

  return null
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { locale, pathname: localizedPathname } = getPathWithoutLocale(pathname)
  const effectiveLocale = locale || detectLocale(request)

  // Keep stable non-prefixed URLs; locale is persisted in cookie.
  if (locale) {
    const redirectUrl = new URL(localizedPathname, request.url)
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('NEXT_LOCALE', locale, { path: '/', sameSite: 'lax' })
    response.headers.set('x-app-locale', locale)
    return response
  }

  // Guard: admin-only routes
  const adminGuard = await guardAdmin(request, pathname, effectiveLocale)
  if (adminGuard) return adminGuard

  // Guard: private routes + auth page redirects
  const routeGuard = await guardProtectedRoutes(request, pathname, effectiveLocale)
  if (routeGuard) return routeGuard

  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', effectiveLocale, { path: '/', sameSite: 'lax' })
  response.headers.set('x-app-locale', effectiveLocale)
  return response
}
