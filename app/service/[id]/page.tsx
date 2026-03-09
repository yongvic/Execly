'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice } from '@/lib/format'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SiteFooter } from '@/components/site-footer'

type ServiceData = {
  id: string
  name: string
  category: string
  description: string
  longDescription?: string
  price: number
  image?: string | null
  templates: Array<{ id: string; name: string; description: string; previewImage: string }>
  deliveryOptions: Array<{ id: string; label: string; turnaroundDays: number; priceMultiplier: number; isDefault: boolean }>
}

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [service, setService] = useState<ServiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null)
  const [brief, setBrief] = useState('')

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const res = await fetch(`/api/services/${id}`)
      const data = await res.json()
      setService(data.service || null)
      const def = data.service?.deliveryOptions?.find((x: any) => x.isDefault) ?? data.service?.deliveryOptions?.[0]
      setSelectedDelivery(def?.id || null)
      setSelectedTemplate(data.service?.templates?.[0]?.id || null)
      setLoading(false)
    }
    if (id) void run()
  }, [id])

  const delivery = useMemo(() => service?.deliveryOptions.find((d) => d.id === selectedDelivery), [service, selectedDelivery])
  const total = useMemo(() => (service && delivery ? service.price * delivery.priceMultiplier : 0), [service, delivery])

  const goCheckout = () => {
    if (!service || !selectedDelivery) return
    const payload = encodeURIComponent(JSON.stringify({
      serviceId: service.id,
      deliveryOptionId: selectedDelivery,
      templateId: selectedTemplate,
      customizationBrief: brief.trim(),
    }))
    router.push(`/checkout?draft=${payload}`)
  }

  if (loading) return <div className="min-h-screen animate-pulse bg-[#faf9f7]" />
  if (!service) return <div className="min-h-screen bg-[#faf9f7] p-8">Service introuvable.</div>

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1f1f1f]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#faf9f7]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/browse" className="text-sm font-medium">← Services</Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <img src={service.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&h=900&fit=crop'} alt={service.name} className="h-72 w-full object-cover" />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-xs text-black/45">{service.category}</p>
            <h1 className="mt-1 text-3xl font-semibold">{service.name}</h1>
            <p className="mt-2 text-black/65">{service.longDescription || service.description}</p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <h2 className="text-xl font-semibold">Templates disponibles</h2>
            <p className="mt-1 text-sm text-black/60">Tu sélectionnes une base visuelle. L’équipe Execly personnalise le rendu final.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.templates.map((t) => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`rounded-xl border p-2 text-left ${selectedTemplate === t.id ? 'border-black bg-[#f5f4ef]' : 'border-black/10'}`}>
                  <img src={t.previewImage} alt={t.name} className="h-28 w-full rounded-lg object-cover" />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">{t.name}</p>
                    <Lock className="h-3.5 w-3.5 text-black/50" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <h3 className="text-lg font-semibold">Ton brief</h3>
            <Textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Objectif, style, audience, contraintes, deadline..." className="mt-3 min-h-[120px] border-black/10 bg-[#f6f5f1]" />
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-black/10 bg-white p-5 lg:sticky lg:top-20">
          <h3 className="text-lg font-semibold">Délai & tarif</h3>
          <div className="mt-3 space-y-2">
            {service.deliveryOptions.map((d) => (
              <button key={d.id} onClick={() => setSelectedDelivery(d.id)} className={`w-full rounded-lg border p-3 text-left ${selectedDelivery === d.id ? 'border-black bg-[#f5f4ef]' : 'border-black/10'}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{d.label}</span>
                  <span className="font-semibold">{formatPrice(service.price * d.priceMultiplier)}</span>
                </div>
                <p className="mt-1 text-xs text-black/55">{d.turnaroundDays} jours</p>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-black/10 bg-[#f6f5f1] p-3">
            <p className="text-xs text-black/55">Total</p>
            <p className="text-2xl font-semibold">{formatPrice(total)}</p>
          </div>

          <Button onClick={goCheckout} className="mt-4 w-full bg-[#111] text-white hover:bg-black">Continuer vers paiement</Button>
        </aside>
      </main>
      <SiteFooter />
    </div>
  )
}
