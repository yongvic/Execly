import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { I18nProvider } from '@/lib/i18n'
import { cookies } from 'next/headers'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Execly - Services digitaux premium pour étudiants et jeunes professionnels',
  description: 'CV, portfolio, design, site web, présentations et documents académiques livrés rapidement avec un suivi clair.',
  generator: 'v0.app',
  openGraph: {
    title: 'Execly',
    description: 'Plateforme SaaS premium pour commander des services digitaux personnalisés et suivre ses livraisons.',
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
      <body className={`${jakarta.variable} ${grotesk.variable} font-sans antialiased`}>
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
