'use client'

import { useTranslations } from 'next-intl'
import { useAppLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const { locale, setLocale } = useAppLocale()
  const t = useTranslations('language')

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1" aria-label={t('label')}>
      <Button
        type="button"
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 rounded-full px-3"
        onClick={() => setLocale('en')}
      >
        {t('english')}
      </Button>
      <Button
        type="button"
        variant={locale === 'fr' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 rounded-full px-3"
        onClick={() => setLocale('fr')}
      >
        {t('french')}
      </Button>
    </div>
  )
}
