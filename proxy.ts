import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const LOCALES = ['fr', 'en'] as const
const DEFAULT_LOCALE = 'fr'
const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN', 'MODERATOR'])

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

async function guardAdmin(request: NextRequest, localizedPathname: string, locale: string) {
  if (!localizedPathname.startsWith('/admin')) {
    return null
  }

  const sessionToken = request.cookies.get('session')?.value
  if (!sessionToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  try {
    const sessionData = await decrypt(sessionToken)
    const userRole = sessionData?.role?.toString().toUpperCase()
    if (!userRole || !ADMIN_ROLES.has(userRole)) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  } catch {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  return null
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { locale, pathname: localizedPathname } = getPathWithoutLocale(pathname)

  if (!locale) {
    const nextLocale = detectLocale(request)
    const redirectUrl = new URL(`/${nextLocale}${pathname}`, request.url)
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('NEXT_LOCALE', nextLocale, { path: '/', sameSite: 'lax' })
    return response
  }

  const adminGuard = await guardAdmin(request, localizedPathname, locale)
  if (adminGuard) return adminGuard

  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = localizedPathname
  const response = NextResponse.rewrite(rewriteUrl)
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', sameSite: 'lax' })
  response.headers.set('x-app-locale', locale)
  return response
}
