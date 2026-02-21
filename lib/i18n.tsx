'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { type Locale, messages } from '@/lib/messages'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)
const STORAGE_KEY = 'mentorly-locale'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'fr' || stored === 'en') return stored

  return window.navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    setLocale(getInitialLocale())
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale])

  return (
    <I18nContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
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
