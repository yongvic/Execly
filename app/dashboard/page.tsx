'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Download, Heart, LogOut, Settings, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/format'

interface Order {
  id: string
  service: { name: string; category: string }
  status: string
  totalPrice: number
  createdAt: string
  deliveryDate?: string
  deadlineDate?: string
  isExpress?: boolean
}

interface Favorite {
  id: string
  service: { id: string; name: string; price: number; category: string }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const tabMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22 },
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const t = useTranslations('dashboard')

  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersRes, favoritesRes] = await Promise.all([fetch('/api/orders'), fetch('/api/favorites')])

        if (!ordersRes.ok || !favoritesRes.ok) throw new Error(t('failedLoad'))

        const ordersData = await ordersRes.json()
        const favoritesData = await favoritesRes.json()

        setOrders(ordersData.orders)
        setFavorites(favoritesData.favorites)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failedLoad'))
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchData()
  }, [user, t])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' })
      if (response.ok) setFavorites(favorites.filter((f) => f.id !== favoriteId))
    } catch {
      setError(t('failedLoad'))
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-sm font-bold text-primary-foreground">M</span>
              </div>
              <span className="hidden font-bold text-foreground sm:inline">Mentorly</span>
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <span className="hidden text-sm text-foreground/70 md:inline">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t('welcomeBack', { name: user.name })}</h1>
          <p className="text-foreground/60">{t('manage')}</p>
        </motion.div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.div className="rounded-lg border border-border bg-card p-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-foreground/60">{t('totalOrders')}</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary/50" />
            </div>
          </motion.div>

          <motion.div className="rounded-lg border border-border bg-card p-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-foreground/60">{t('totalSpent')}</p>
                <p className="text-2xl font-bold text-foreground">{formatPrice(orders.reduce((sum, order) => sum + order.totalPrice, 0))}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-accent/50" />
            </div>
          </motion.div>

          <motion.div className="rounded-lg border border-border bg-card p-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-foreground/60">{t('savedServices')}</p>
                <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500/50" />
            </div>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
            <TabsTrigger value="favorites">{t('savedServices')}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" forceMount className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div key="orders" className="space-y-4" {...tabMotion}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">{t('yourOrders')}</h2>
                    <Link href="/browse"><Button size="sm">{t('browseMore')}</Button></Link>
                  </div>

                  {loading ? (
                    <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}</div>
                  ) : orders.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card/50 py-12 text-center">
                      <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-foreground/20" />
                      <p className="mb-4 text-foreground/60">{t('noOrders')}</p>
                      <Link href="/browse"><Button>{t('startShopping')}</Button></Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div key={order.id} className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="mb-1 font-semibold text-foreground">{order.service.name}</h3>
                              <p className="mb-3 text-sm text-foreground/60">{new Date(order.createdAt).toLocaleDateString()} • {order.service.category}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                                {(order.deadlineDate || order.deliveryDate) && (
                                  <span className="text-xs text-foreground/60">
                                    {t('delivery', { date: new Date(order.deadlineDate || order.deliveryDate!).toLocaleDateString() })}
                                    {order.isExpress && <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">Express</Badge>}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="mb-3 text-lg font-bold text-primary">{formatPrice(order.totalPrice)}</p>
                              {order.status === 'completed' && <Button size="sm" variant="outline" className="gap-2"><Download className="h-4 w-4" />{t('download')}</Button>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="favorites" forceMount className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'favorites' && (
                <motion.div key="favorites" className="space-y-4" {...tabMotion}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">{t('savedServices')}</h2>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />)}</div>
                  ) : favorites.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card/50 py-12 text-center">
                      <Heart className="mx-auto mb-3 h-12 w-12 text-foreground/20" />
                      <p className="mb-4 text-foreground/60">{t('noSaved')}</p>
                      <Link href="/browse"><Button>{t('explore')}</Button></Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {favorites.map((fav) => (
                        <div key={fav.id} className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="text-2xl">
                              {fav.service.category === 'graphic-design' && '🎨'}
                              {fav.service.category === 'templates' && '📄'}
                              {fav.service.category === 'writing' && '✍️'}
                              {fav.service.category === 'web-dev' && '💻'}
                            </div>
                            <button onClick={() => handleRemoveFavorite(fav.id)} className="text-foreground/40 hover:text-red-500">✕</button>
                          </div>
                          <h3 className="mb-1 line-clamp-2 font-semibold text-foreground">{fav.service.name}</h3>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-bold text-primary">{formatPrice(fav.service.price)}</span>
                            <Link href={`/service/${fav.service.id}`}><Button size="sm" variant="outline">{t('view')}</Button></Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="settings" forceMount className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'settings' && (
                <motion.div key="settings" className="space-y-6" {...tabMotion}>
                  <h2 className="text-xl font-semibold text-foreground">{t('accountSettings')}</h2>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="mb-3 font-semibold text-foreground">{t('profileInfo')}</h3>
                      <div className="space-y-3">
                        <div><label className="text-sm text-foreground/60">{t('name')}</label><p className="font-medium text-foreground">{user.name}</p></div>
                        <div><label className="text-sm text-foreground/60">{t('email')}</label><p className="font-medium text-foreground">{user.email}</p></div>
                        {user.phone && <div><label className="text-sm text-foreground/60">{t('phone')}</label><p className="font-medium text-foreground">{user.phone}</p></div>}
                        {user.country && <div><label className="text-sm text-foreground/60">{t('country')}</label><p className="font-medium text-foreground">{user.country}</p></div>}
                      </div>
                      <Button className="mt-4 gap-2" variant="outline"><Settings className="h-4 w-4" />{t('editProfile')}</Button>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="mb-3 font-semibold text-foreground">{t('accountActions')}</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">{t('changePassword')}</Button>
                        <Button variant="outline" className="w-full justify-start">{t('notificationSettings')}</Button>
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">{t('deleteAccount')}</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
