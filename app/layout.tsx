import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { I18nProvider } from '@/lib/i18n'
import { cookies } from 'next/headers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Execly - Services Digitaux Rapides et Abordables',
  description: 'Commandez vos services digitaux personnalisés en quelques clics: CV, portfolio, site vitrine, visuels et plus.',
  generator: 'v0.app',
  openGraph: {
    title: 'Execly',
    description: 'Plateforme SaaS de services digitaux pour étudiants et jeunes professionnels',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/images/icons/icon-light.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/icons/icon-dark.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/images/icons/icon-light.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/images/icons/apple-icon.svg',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const initialLocale = cookieStore.get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'fr'

  return (
    <html lang={initialLocale}>
      <body className="font-sans antialiased">
        <I18nProvider initialLocale={initialLocale}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
