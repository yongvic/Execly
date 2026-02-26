import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { I18nProvider } from '@/lib/i18n'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mentorly - Pre-Made Services Marketplace for African Entrepreneurs',
  description: 'Find verified graphic design, templates, writing services, and web development solutions. Pre-made, affordable, and ready to use.',
  generator: 'v0.app',
  openGraph: {
    title: 'Mentorly',
    description: 'Pre-made services marketplace for African entrepreneurs',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
