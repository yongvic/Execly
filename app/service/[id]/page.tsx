'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Clock, Heart, Share2, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/format'

interface Service {
  id: string
  name: string
  category: string
  description: string
  longDescription?: string
  price: number
  rating: number
  reviewCount: number
  provider: string
  providerRating: number
  deliveryDays: number
  included?: string[]
  reviews?: Array<{
    id: string
    rating: number
    comment?: string
    user: { name: string }
    createdAt: string
  }>
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const t = useTranslations('service')
  const serviceId = params.id as string

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isExpress, setIsExpress] = useState(false)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/services/${serviceId}`)
        if (!response.ok) throw new Error(t('failedLoad'))
        const data = await response.json()
        setService(data.service)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failedLoad'))
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) fetchService()
  }, [serviceId, t])

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      setIsAddingToCart(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, quantity: 1 }),
      })

      if (!response.ok) throw new Error(t('failedAddCart'))
      router.push(`/checkout?express=${isExpress}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedAddCart'))
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToFavorites = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId }),
      })

      if (response.ok) setIsFavorited(true)
    } catch {
      setError(t('failedLoad'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-6 animate-pulse">
            <div className="h-64 rounded-lg bg-muted" />
            <div className="h-8 w-1/2 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-600">{error || t('notFound')}</p>
          </div>
          <Link href="/browse" className="mt-4 inline-block text-primary hover:underline">← {t('backToServices')}</Link>
        </div>
      </div>
    )
  }

  const categoryEmojis: Record<string, string> = {
    'graphic-design': '🎨',
    templates: '📄',
    writing: '✍️',
    'web-dev': '💻',
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/browse" className="text-sm text-primary hover:underline">← {t('backToServices')}</Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div className="space-y-6 lg:col-span-2" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-8xl">
              {categoryEmojis[service.category] || '📦'}
            </div>

            <div>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-foreground">{service.name}</h1>
                  <p className="text-foreground/70">{service.description}</p>
                </div>
                <button onClick={handleAddToFavorites} className="shrink-0">
                  <Heart className={`h-6 w-6 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground/60 hover:text-red-500'}`} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 border-y border-border py-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(service.rating) ? 'fill-accent text-accent' : 'text-foreground/20'}`} />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">{service.rating}</span>
                  <span className="text-foreground/60">({service.reviewCount} {t('reviews')})</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Clock className="h-4 w-4" />
                  <span>{t('dayDelivery', { days: service.deliveryDays })}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                <TabsTrigger value="details">{t('included')}</TabsTrigger>
                <TabsTrigger value="reviews">{t('customerReviews')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{t('aboutService')}</h3>
                  <p className="leading-relaxed text-foreground/70">{service.longDescription || service.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-6 space-y-4">
                <h3 className="mb-3 text-lg font-semibold text-foreground">{t('included')}</h3>
                {service.included && service.included.length > 0 ? (
                  <ul className="space-y-3">
                    {service.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span className="text-foreground/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground/70">{t('noDetails')}</p>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-foreground">{t('customerReviews')}</h3>
                {service.reviews && service.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {service.reviews.map((review) => (
                      <div key={review.id} className="rounded-lg border border-border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{review.user.name}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-foreground/20'}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-foreground/70">{review.comment}</p>}
                        <p className="mt-2 text-xs text-foreground/50">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/70">{t('noReviews')}</p>
                )}
              </TabsContent>
            </Tabs>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 font-semibold text-foreground">{t('aboutProvider')}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{service.provider}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(service.providerRating) ? 'fill-accent text-accent' : 'text-foreground/20'}`} />
                    ))}
                    <span className="text-sm text-foreground/70">{service.providerRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="sticky top-20 space-y-6 rounded-lg border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground/60">{t('price')}</div>
                    <div className="text-4xl font-bold text-primary">
                      {formatPrice(isExpress ? service.price * 1.5 : service.price)}
                    </div>
                  </div>
                  {isExpress && (
                    <Badge className="mb-2 bg-accent text-accent-foreground">{t('express')}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/30 p-1">
                  <button
                    onClick={() => setIsExpress(false)}
                    className={`rounded-md py-2 text-xs font-semibold transition-all ${!isExpress ? 'bg-background text-foreground shadow-sm' : 'text-foreground/50 hover:text-foreground'}`}
                  >
                    {t('standard')}
                  </button>
                  <button
                    onClick={() => setIsExpress(true)}
                    className={`rounded-md py-2 text-xs font-semibold transition-all ${isExpress ? 'bg-accent text-accent-foreground shadow-sm' : 'text-foreground/50 hover:text-foreground'}`}
                  >
                    {t('expressExtra')}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Clock className="h-4 w-4" />
                  <span>
                    {t('deliveryInDays', {
                      days: isExpress
                        ? Math.max(1, Math.floor(service.deliveryDays / 2))
                        : service.deliveryDays
                    })}
                  </span>
                </div>
              </div>

              <Button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full" size="lg">
                {isAddingToCart ? t('adding') : t('addToCart')}
              </Button>

              <Button variant="outline" className="w-full" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                {t('share')}
              </Button>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{t('qualityGuaranteed')}</p>
                    <p className="text-foreground/60">{t('qualityDescription')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{t('verifiedProvider')}</p>
                    <p className="text-foreground/60">{t('trustedByThousands')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
