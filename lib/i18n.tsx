'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { type Locale, messages } from '@/lib/messages'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)
const STORAGE_KEY = 'execly-locale'

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; samesite=lax`
      window.localStorage.setItem(STORAGE_KEY, nextLocale)
      document.documentElement.lang = nextLocale
      window.location.reload()
    }
  }

  const value = useMemo(() => ({ locale, setLocale }), [locale])

  return (
    <I18nContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages[locale]}
        timeZone="Africa/Lagos"
      >
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  )
}

export function useAppLocale() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useAppLocale must be used within I18nProvider')
  }

  return context
}
