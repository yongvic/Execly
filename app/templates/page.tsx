'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useAppLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSwitcher } from '@/components/language-switcher'
import { formatPrice } from '@/lib/format'
import { SiteFooter } from '@/components/site-footer'

type TemplateItem = {
  id: string
  name: string
  category: string
  description: string
  previewImage: string
  service: {
    id: string
    name: string
    price: number
    deliveryDays: number
  }
}

const txt = {
  fr: {
    title: 'Template gallery',
    sub: 'Inspire-toi du rendu final: chaque template est sélectionné puis adapté par l’équipe Execly.',
    search: 'Rechercher template',
    lock: 'Preview only: modification client désactivée',
    start: 'A partir de',
    choose: 'Choisir ce template',
    noResult: 'Aucun template trouvé.',
  },
  en: {
    title: 'Template gallery',
    sub: 'Preview your final output: each template is selected then customized by the Execly team.',
    search: 'Search template',
    lock: 'Preview only: direct client editing disabled',
    start: 'Starting at',
    choose: 'Choose this template',
    noResult: 'No template found.',
  },
} as const

export default function TemplatesPage() {
  const { locale } = useAppLocale()
  const t = txt[locale]
  const [items, setItems] = useState<TemplateItem[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const res = await fetch('/api/templates')
      const data = await res.json()
      setItems(data.templates || [])
      setLoading(false)
    }
    void run()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return items
    return items.filter((i) => `${i.name} ${i.description} ${i.category}`.toLowerCase().includes(q))
  }, [items, query])

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1f1f1f]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#faf9f7]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-semibold">Execly</Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/browse"><Button variant="outline" size="sm">Services</Button></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-4xl font-semibold tracking-tight">{t.title}</h1>
          <p className="mt-2 max-w-3xl text-black/60">{t.sub}</p>
          <div className="relative mt-5 max-w-md">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="border-black/10 bg-[#f6f5f1] pr-9" />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
          </div>
          <p className="mt-3 text-xs text-black/45">{t.lock}</p>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-[#eceae4]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60">{t.noResult}</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tpl) => (
                <article key={tpl.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-sm">
                  <img src={tpl.previewImage} alt={tpl.name} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs text-black/45">{tpl.category}</p>
                    <h2 className="mt-1 font-semibold">{tpl.name}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-black/60">{tpl.description}</p>
                    <p className="mt-3 text-sm font-semibold">{t.start} {formatPrice(tpl.service.price)}</p>
                    <p className="mt-1 text-xs text-black/55">{tpl.service.deliveryDays}j</p>
                    <Link href={`/service/${tpl.service.id}`} className="mt-3 inline-block w-full">
                      <Button className="w-full bg-[#111] text-white hover:bg-black">{t.choose}</Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
