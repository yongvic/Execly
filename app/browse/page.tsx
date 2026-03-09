'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, ArrowRight } from 'lucide-react'
import { useAppLocale } from '@/lib/i18n'
import { formatPrice } from '@/lib/format'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SiteFooter } from '@/components/site-footer'

type Service = {
  id: string
  name: string
  category: string
  description: string
  price: number
  image?: string | null
  defaultDeliveryOption?: {
    turnaroundDays: number
  }
}

const txt = {
  fr: {
    title: 'Catalogue des services',
    subtitle: 'Des livrables standardisés pour lancer vos projets.',
    search: 'Rechercher...',
    all: 'Tout voir',
    empty: 'Aucun service trouvé.',
    open: 'Configurer',
    templates: 'Templates',
    delivery: 'Livraison',
  },
  en: {
    title: 'Service Catalog',
    subtitle: 'Standardized deliverables to launch your projects.',
    search: 'Search...',
    all: 'All',
    empty: 'No service found.',
    open: 'Configure',
    templates: 'Templates',
    delivery: 'Delivery',
  },
} as const

const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'cv', label: 'CV & Carrière' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'graphic-design', label: 'Design' },
  { id: 'web-dev', label: 'Web' },
  { id: 'presentation', label: 'Slides' },
  { id: 'writing', label: 'Rédaction' }
]

function BrowseContent() {
  const searchParams = useSearchParams()
  const { locale } = useAppLocale()
  const t = txt[locale]
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')

  // Mock data loader (replace with real API call if needed, mimicking the original file's fetch)
  useEffect(() => {
    const run = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(r => setTimeout(r, 500)) 
      // In a real scenario, fetch from /api/services
      // For now, let's assume the API returns data based on params or use mock data if fetch fails/returns empty
      try {
          const params = new URLSearchParams()
          if (query) params.set('search', query)
          if (category !== 'all') params.set('category', category)
          const res = await fetch(`/api/services?${params.toString()}`)
          const data = await res.json()
          if(data.services) setServices(data.services)
          else setServices([]) // Fallback or empty
      } catch (e) {
          console.error(e)
          setServices([])
      }
      setLoading(false)
    }
    void run()
  }, [query, category])

  const rows = useMemo(() => services, [services])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar Consistent with others */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
             <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-primary text-primary-foreground text-xs font-bold">E</div>
             <span>Execly</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="h-4 w-px bg-border hidden sm:block"></div>
            <Link href="/dashboard">
                <Button size="sm" className="h-8 rounded-[6px] text-xs px-3 font-medium">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl px-4 py-12 sm:px-6 w-full">
        
        {/* Header */}
        <div className="mb-10">
           <h1 className="text-3xl font-bold tracking-tight mb-2">{t.title}</h1>
           <p className="text-muted-foreground max-w-2xl text-lg">{t.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <div className="relative">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input 
                 value={query} 
                 onChange={(e) => setQuery(e.target.value)} 
                 placeholder={t.search} 
                 className="pl-9 bg-muted/30 border-transparent hover:border-border focus:bg-background transition-all" 
               />
            </div>
            
            <div className="space-y-1">
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Catégories</p>
               {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                       category === c.id 
                       ? 'bg-secondary text-secondary-foreground' 
                       : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {c.label}
                  </button>
               ))}
            </div>
          </aside>

          {/* Grid Content */}
          <section>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="rounded-xl border bg-card p-0 overflow-hidden space-y-3">
                      <div className="h-40 bg-muted/20 animate-pulse" />
                      <div className="p-4 space-y-2">
                         <div className="h-4 w-2/3 bg-muted/20 rounded animate-pulse" />
                         <div className="h-4 w-1/3 bg-muted/20 rounded animate-pulse" />
                      </div>
                   </div>
                ))}
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center bg-muted/5">
                 <Filter className="h-10 w-10 text-muted-foreground/30 mb-4" />
                 <p className="text-muted-foreground font-medium">{t.empty}</p>
                 <Button variant="link" onClick={() => {setCategory('all'); setQuery('')}} className="mt-2">Réinitialiser les filtres</Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((service) => (
                  <Link key={service.id} href={`/service/${service.id}`} className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-foreground/20 hover:shadow-sm">
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                       {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                       ) : (
                          <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                             No Image
                          </div>
                       )}
                       <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-background/90 backdrop-blur text-xs font-medium border-0 shadow-sm">
                             {service.category}
                          </Badge>
                       </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-5">
                       <h3 className="font-semibold tracking-tight text-lg mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                       <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">{service.description}</p>
                       
                       <div className="flex items-center justify-between pt-4 border-t mt-auto">
                          <div className="flex flex-col">
                             <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">À partir de</span>
                             <span className="font-semibold">{formatPrice(service.price)}</span>
                          </div>
                          <div className="text-right">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{t.delivery}</span>
                              <span className="block text-sm font-medium">{service.defaultDeliveryOption?.turnaroundDays || 2} jours</span>
                          </div>
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BrowseContent />
    </Suspense>
  )
}
