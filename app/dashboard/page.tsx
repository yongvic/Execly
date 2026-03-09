'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Check, Star, Layout, FileText, Globe, 
  PenTool, Sparkles, ShieldCheck, Mail, Loader2, 
  User as UserIcon, LogOut, Package, CreditCard, Clock, 
  Bell, ChevronRight, Settings, Grid, Search, Plus,
  Filter, Download, ExternalLink, MoreVertical, Heart,
  CreditCard as CardIcon, History
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useAppLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from '@/lib/format'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { Switch } from '@/components/ui/switch'

type TabType = 'overview' | 'orders' | 'favorites' | 'payments' | 'history' | 'settings'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [loading, setLoading] = useState(true)
  
  const [orders, setOrders] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [preferences, setPreferences] = useState({
    inAppEnabled: true,
    emailEnabled: true,
    whatsappEnabled: true
  })

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [ordersRes, favoritesRes, paymentsRes, historyRes, prefsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/favorites'),
          fetch('/api/payments'),
          fetch('/api/analytics'),
          fetch('/api/notifications/preferences')
        ])

        if (ordersRes.ok) setOrders((await ordersRes.json()).orders || [])
        if (favoritesRes.ok) setFavorites((await favoritesRes.json()).favorites || [])
        if (paymentsRes.ok) setPayments((await paymentsRes.json()).payments || [])
        if (historyRes.ok) setHistory((await historyRes.json()).events || [])
        if (prefsRes.ok) setPreferences((await prefsRes.json()).preferences)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const updatePreference = async (key: keyof typeof preferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value }
    setPreferences(newPrefs)
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs),
      })
    } catch (err) {
      console.error('Failed to update preferences:', err)
    }
  }

  if (!user) return null

  const navigation = [
    { id: 'overview', icon: Grid, label: 'Vue d\'ensemble' },
    { id: 'orders', icon: Package, label: 'Mes Commandes' },
    { id: 'favorites', icon: Heart, label: 'Favoris' },
    { id: 'payments', icon: CardIcon, label: 'Paiements' },
    { id: 'history', icon: History, label: 'Historique' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ]

  // Calculate stats
  const activeOrdersCount = orders.filter(o => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(o.status)).length
  const completedProjectsCount = orders.filter(o => o.status === 'COMPLETED').length
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'CONFIRMED': return 'Confirmé'
      case 'IN_PROGRESS': return 'En cours'
      case 'COMPLETED': return 'Terminé'
      case 'CANCELLED': return 'Annulé'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600'
      case 'CANCELLED': return 'bg-red-50 text-red-600'
      case 'PENDING': return 'bg-zinc-50 text-zinc-600'
      default: return 'bg-amber-50 text-amber-600'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-zinc-200 hidden lg:flex flex-col z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">E</div>
            <span>Execly.</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-zinc-100">
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Besoin d'aide ?</p>
            <p className="text-xs text-zinc-500 mb-3 font-medium">Notre support est disponible 24/7 pour vos projets.</p>
            <Button size="sm" className="w-full rounded-lg bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm font-bold text-xs">
              Contacter le support
            </Button>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-8 py-4 flex items-center justify-between">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              placeholder="Rechercher..." 
              className="w-full bg-zinc-50 border-zinc-100 rounded-full py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="h-8 w-px bg-zinc-100" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-black text-zinc-900 leading-tight">{user.name}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client Premium</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-primary text-white font-bold">{user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Chargement de vos données...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Bonjour, {user.name.split(' ')[0]} 👋</h1>
                      <p className="text-zinc-500 font-medium mt-1">Voici un aperçu de vos activités en cours.</p>
                    </div>
                    <Link href="/browse">
                      <Button className="rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus className="h-4 w-4 mr-2" /> Nouveau Projet
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Commandes Actives', value: activeOrdersCount, icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
                      { label: 'Projets Terminés', value: completedProjectsCount, icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: 'Total Investi', value: formatPrice(totalSpent), icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((stat, i) => (
                      <Card key={i} className="border-zinc-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                              <h3 className="text-2xl font-black text-zinc-900">{stat.value}</h3>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}><stat.icon className="h-6 w-6" /></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Commandes en cours</h2>
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((project, i) => (
                          <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-6 hover:border-primary/20 transition-all group shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                  {project.service.category.includes('Web') ? <Globe className="h-6 w-6" /> : <PenTool className="h-6 w-6" />}
                                </div>
                                <div>
                                  <h4 className="font-black text-zinc-900 text-lg leading-tight">{project.service.name}</h4>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{project.service.category}</p>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(project.status)} border-none uppercase text-[9px] font-black`}>{getStatusLabel(project.status)}</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                <span>Status</span>
                                <span>{project.status === 'COMPLETED' ? '100%' : 'En cours'}</span>
                              </div>
                              <Progress value={project.status === 'COMPLETED' ? 100 : 50} className="h-1.5" />
                            </div>
                          </div>
                        ))}
                        {orders.length === 0 && (
                          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
                            <Package className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Aucune commande active</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Activité Récente</h2>
                      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-6">
                        {history.slice(0, 5).map((act, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className={`mt-1 p-1.5 rounded-lg bg-zinc-50 text-primary`}><History className="h-3.5 w-3.5" /></div>
                            <div>
                              <p className="text-xs font-bold text-zinc-800">{act.name}</p>
                              <p className="text-[10px] font-medium text-zinc-400">{new Date(act.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {history.length === 0 && (
                          <p className="text-center text-xs font-bold text-zinc-300 uppercase tracking-widest py-8">Aucune activité</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase italic">Mes Commandes</h1>
                  </div>
                  
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white border border-zinc-100 rounded-[1.5rem] p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg hover:shadow-primary/5 transition-all">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary">
                            {order.service.image ? <img src={order.service.image} className="h-full w-full object-cover rounded-2xl" /> : <Package className="h-8 w-8 text-zinc-300" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{order.id.slice(-8).toUpperCase()}</p>
                            <h3 className="font-black text-zinc-900 text-lg">{order.service.name}</h3>
                            <p className="text-xs text-zinc-400 font-medium">Commandé le {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-zinc-400 uppercase">Montant</p>
                            <p className="font-black text-zinc-900">{formatPrice(order.totalPrice)}</p>
                          </div>
                          <Badge className={`px-4 py-1.5 rounded-full uppercase text-[9px] font-black ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button size="icon" variant="ghost" className="rounded-full hover:bg-zinc-100"><ChevronRight className="h-5 w-5" /></Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="py-24 text-center bg-white border border-dashed border-zinc-200 rounded-[2rem]">
                        <Package className="h-16 w-16 text-zinc-100 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-zinc-900 mb-2">Aucune commande</h3>
                        <p className="text-zinc-400 font-medium mb-8">Commencez par explorer nos services d'élite.</p>
                        <Link href="/browse"><Button className="rounded-xl font-bold bg-primary text-white">Explorer les services</Button></Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'favorites' && (
                <motion.div 
                  key="favorites"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase italic">Mes Favoris</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="group border-zinc-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                        <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                          <img 
                            src={fav.service.image || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"} 
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                          />
                          <button className="absolute top-4 right-4 h-10 w-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm"><Heart className="h-5 w-5 fill-current" /></button>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-black text-zinc-900 text-lg mb-2">{fav.service.name}</h3>
                          <p className="text-sm text-zinc-500 font-medium mb-4 line-clamp-2">{fav.service.description}</p>
                          <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                            <p className="font-black text-primary">{formatPrice(fav.service.price)}</p>
                            <Link href={`/service/${fav.service.id}`}>
                              <Button size="sm" className="rounded-full bg-zinc-900 text-white font-bold text-xs">Commander</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {favorites.length === 0 && (
                      <div className="col-span-full py-24 text-center bg-white border border-dashed border-zinc-200 rounded-[2rem]">
                        <Heart className="h-16 w-16 text-zinc-100 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-zinc-900 mb-2">Liste vide</h3>
                        <p className="text-zinc-400 font-medium">Sauvegardez les services qui vous intéressent pour plus tard.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div 
                  key="payments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase italic">Paiements</h1>
                  <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-black text-zinc-800 uppercase tracking-tighter">Historique des transactions</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white">
                            <th className="px-8 py-4">Référence</th>
                            <th className="px-8 py-4">Date</th>
                            <th className="px-8 py-4">Méthode</th>
                            <th className="px-8 py-4">Montant</th>
                            <th className="px-8 py-4 text-right">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y border-zinc-100">
                          {payments.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6 font-bold text-zinc-600 text-sm">{p.providerRef || p.id.slice(-8).toUpperCase()}</td>
                              <td className="px-8 py-6 text-sm font-medium text-zinc-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                              <td className="px-8 py-6">
                                <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{p.method}</span>
                              </td>
                              <td className="px-8 py-6 font-black text-zinc-900">{formatPrice(p.amount)}</td>
                              <td className="px-8 py-6 text-right">
                                <Badge className={`border-none uppercase text-[9px] font-black ${p.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                  {p.status === 'CONFIRMED' ? 'Réussi' : p.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {payments.length === 0 && (
                        <div className="p-12 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">Aucune transaction trouvée</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase italic">Historique d'activité</h1>
                  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                    {history.map((event, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-zinc-100 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <History className="h-5 w-5" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:border-primary/20 transition-all">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-black text-zinc-900 uppercase tracking-tighter text-sm">{event.name}</div>
                            <time className="font-bold text-primary text-[10px] uppercase tracking-widest">{new Date(event.createdAt).toLocaleString()}</time>
                          </div>
                          {event.properties && (
                            <div className="text-zinc-500 text-xs font-medium truncate">{event.properties}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="text-center py-24 bg-white border border-dashed border-zinc-200 rounded-[2rem]">
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Aucun historique disponible</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase italic">Paramètres</h1>

                  <div className="grid gap-8 max-w-2xl">
                    <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
                      <h3 className="font-black text-zinc-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" /> Notifications
                      </h3>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-zinc-800 text-sm">Notifications In-App</p>
                            <p className="text-xs text-zinc-400">Recevoir des alertes directement dans le dashboard</p>
                          </div>
                          <Switch 
                            checked={preferences.inAppEnabled} 
                            onCheckedChange={(val) => updatePreference('inAppEnabled', val)} 
                          />
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                          <div>
                            <p className="font-bold text-zinc-800 text-sm">Emails</p>
                            <p className="text-xs text-zinc-400">Suivi de commande et facturation par mail</p>
                          </div>
                          <Switch 
                            checked={preferences.emailEnabled} 
                            onCheckedChange={(val) => updatePreference('emailEnabled', val)} 
                          />
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                          <div>
                            <p className="font-bold text-zinc-800 text-sm">WhatsApp</p>
                            <p className="text-xs text-zinc-400">Alertes instantanées sur votre mobile</p>
                          </div>
                          <Switch 
                            checked={preferences.whatsappEnabled} 
                            onCheckedChange={(val) => updatePreference('whatsappEnabled', val)} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
                      <h3 className="font-black text-zinc-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-primary" /> Profil
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nom Complet</p>
                            <p className="text-sm font-bold text-zinc-800">{user.name}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary font-bold text-xs uppercase">Modifier</Button>
                        </div>
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email</p>
                            <p className="text-sm font-bold text-zinc-800">{user.email}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary font-bold text-xs uppercase">Modifier</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  )
}
