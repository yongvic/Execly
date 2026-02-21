'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, Clock, Search, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TiltCard } from '@/components/animations/tilt-card'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/format'
import { useSearchParams } from 'next/navigation'

interface Service {
  id: string
  name: string
  category: string
  description: string
  price: number
  rating: number
  reviewCount: number
  provider: string
  deliveryDays: number
}

export default function BrowsePage() {
  const t = useTranslations('browse')

  const CATEGORIES = [
    { value: 'all', label: t('allServices') },
    { value: 'graphic-design', label: t('graphicDesign') },
    { value: 'templates', label: t('templates') },
    { value: 'writing', label: t('writing') },
    { value: 'web-dev', label: t('webDev') },
  ]

  const PRICE_RANGES = [
    { label: t('all'), min: 0, max: Infinity },
    { label: 'Sous 15 000 FCFA', min: 0, max: 15000 },
    { label: '15 000 - 50 000 FCFA', min: 15000, max: 50000 },
    { label: '50 000 - 150 000 FCFA', min: 50000, max: 150000 },
    { label: 'Plus de 150 000 FCFA', min: 150000, max: Infinity },
  ]

  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: Infinity })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams()
        if (selectedCategory !== 'all') params.append('category', selectedCategory)
        if (selectedPriceRange.min > 0) params.append('minPrice', String(selectedPriceRange.min))
        if (selectedPriceRange.max !== Infinity) params.append('maxPrice', String(selectedPriceRange.max))
        if (searchQuery) params.append('search', searchQuery)

        const response = await fetch(`/api/services?${params.toString()}`)
        if (!response.ok) throw new Error(t('failedLoad'))

        const data = await response.json()
        setServices(data.services)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failedLoad'))
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchServices, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, selectedPriceRange, t])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-sm font-bold text-primary-foreground">M</span>
              </div>
              <span className="hidden font-bold text-foreground sm:inline">Mentorly</span>
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary">Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="space-y-6 rounded-xl border border-border bg-card p-5">
              <div>
                <label className="mb-3 block text-sm font-semibold text-foreground">{t('search')}</label>
                <div className="relative">
                  <Input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-border bg-muted" />
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-foreground">{t('category')}</label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.value} className="flex cursor-pointer items-center gap-2">
                      <input type="radio" name="category" value={cat.value} checked={selectedCategory === cat.value} onChange={() => setSelectedCategory(cat.value)} className="rounded" />
                      <span className="text-sm text-foreground/70">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-foreground">{t('priceRange')}</label>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange.min === range.min && selectedPriceRange.max === range.max}
                        onChange={() => setSelectedPriceRange({ min: range.min, max: range.max })}
                        className="rounded"
                      />
                      <span className="text-sm text-foreground/70">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
              <p className="mt-1 text-sm text-foreground/60">{t('servicesFound', { count: services.length })}</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-4">
                    <div className="mb-4 h-32 rounded bg-muted" />
                    <div className="mb-2 h-4 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="py-12 text-center"><p className="text-foreground/60">{t('noServices')}</p></div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {services.map((service, idx) => (
                  <TiltCard key={service.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.35 }}
                      whileHover={{ y: -6 }}
                    >
                      <Link href={`/service/${service.id}`} className="group block rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10">
                        <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-4xl transition-colors group-hover:from-primary/20 group-hover:to-accent/20">
                          {service.category === 'graphic-design' && '🎨'}
                          {service.category === 'templates' && '📄'}
                          {service.category === 'writing' && '✍️'}
                          {service.category === 'web-dev' && '💻'}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Badge variant="outline" className="mb-2 text-xs">{service.category}</Badge>
                            <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">{service.name}</h3>
                            <p className="mt-1 text-sm text-foreground/60">{service.description}</p>
                          </div>

                          <p className="text-sm text-foreground/70">{t('by')} <span className="font-medium">{service.provider}</span></p>

                          <div className="flex items-center justify-between border-t border-border pt-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-accent text-accent" />
                                <span className="text-sm font-medium text-foreground">{service.rating.toFixed(1)}</span>
                                <span className="text-xs text-foreground/50">({service.reviewCount})</span>
                              </div>
                              <div className="flex items-center gap-1 text-foreground/60">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">{service.deliveryDays}d</span>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-primary">{formatPrice(service.price)}</div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </TiltCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
