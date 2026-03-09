'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAuth } from '@/lib/auth-context'
import { trackEvent } from '@/lib/analytics'
import { formatPrice } from '@/lib/format'
import { useAppLocale } from '@/lib/i18n'
import { SiteFooter } from '@/components/site-footer'

type DraftItem = {
  serviceId: string
  deliveryOptionId?: string
  templateId?: string | null
  customizationBrief?: string
}

type CartItem = {
  id: string
  service: { id: string; name: string; price: number }
  quantity: number
}

const i18n = {
  fr: {
    title: 'Validation finale',
    subtitle: 'Une dernière étape et ta commande entre en production premium.',
    summary: 'Recapitulatif',
    phone: 'Numero de telephone',
    note: 'Brief (optionnel)',
    pay: 'Payer maintenant',
    success: 'Commande creee avec succes',
    pending: 'Paiement en attente de confirmation USSD',
    orderHistory: 'Voir mes commandes',
  },
  en: {
    title: 'Final validation',
    subtitle: 'One last step before your order enters premium production.',
    summary: 'Summary',
    phone: 'Phone number',
    note: 'Brief (optional)',
    pay: 'Pay now',
    success: 'Order created successfully',
    pending: 'Payment pending USSD confirmation',
    orderHistory: 'View my orders',
  },
} as const

function CheckoutContent() {
  const { user } = useAuth()
  const { locale } = useAppLocale()
  const t = i18n[locale]
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [draftItem, setDraftItem] = useState<DraftItem | null>(null)
  const [phone, setPhone] = useState(user?.phone || '')
  const [brief, setBrief] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'flooz' | 'tmoney'>('flooz')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [draftPreview, setDraftPreview] = useState<{ name: string; total: number } | null>(null)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'OTP_SENT' | 'CONFIRMED' | 'FAILED' | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpHint, setOtpHint] = useState<string | null>(null)

  useEffect(() => {
    if (!user) router.push('/login')
  }, [router, user])

  useEffect(() => {
    if (user?.phone && !phone) {
      setPhone(user.phone)
    }
  }, [user, phone])

  useEffect(() => {
    if (!paymentStatus) return
    void trackEvent('checkout_payment_status', { status: paymentStatus })
    if (paymentStatus === 'CONFIRMED') {
      void trackEvent('checkout_paid', { method: paymentMethod })
    }
  }, [paymentStatus])

  useEffect(() => {
    const bootstrap = async () => {
      const encoded = searchParams.get('draft')
      if (encoded) {
        try {
          const parsed = JSON.parse(decodeURIComponent(encoded)) as DraftItem
          setDraftItem(parsed)
          setBrief(parsed.customizationBrief || '')
          const previewRes = await fetch(`/api/services/${parsed.serviceId}`)
          if (previewRes.ok) {
            const previewData = await previewRes.json()
            const selected =
              previewData.service?.deliveryOptions?.find((option: any) => option.id === parsed.deliveryOptionId) ??
              previewData.service?.deliveryOptions?.find((option: any) => option.isDefault) ??
              previewData.service?.deliveryOptions?.[0]
            if (previewData.service && selected) {
              setDraftPreview({
                name: previewData.service.name,
                total: previewData.service.price * selected.priceMultiplier,
              })
            }
          }
          setLoading(false)
          return
        } catch {
          setError('Invalid checkout draft')
        }
      }

      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCartItems(data.items || [])
      }
      setLoading(false)
    }

    bootstrap()
  }, [searchParams])

  const fallbackTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0),
    [cartItems]
  )

  const submitOrder = async () => {
    setError('')
    setProcessing(true)
    void trackEvent('checkout_pay_click', {
      method: paymentMethod,
      mode: draftItem ? 'single' : 'cart',
    })
    try {
      let items: Array<{ serviceId: string; quantity: number; deliveryOptionId?: string; templateId?: string | null; customizationBrief?: string }>

      if (draftItem) {
        items = [
          {
            serviceId: draftItem.serviceId,
            quantity: 1,
            deliveryOptionId: draftItem.deliveryOptionId,
            templateId: draftItem.templateId,
            customizationBrief: brief || draftItem.customizationBrief,
          },
        ]
      } else {
        items = cartItems.map((item) => ({
          serviceId: item.service.id,
          quantity: item.quantity,
          customizationBrief: brief || undefined,
        }))
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          paymentMethod,
          phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      setPaymentStatus(data.paymentStatus || 'PENDING')
      if (data.paymentId) setPaymentId(data.paymentId)
      if (data.otpHint) setOtpHint(data.otpHint)
      if (data.paymentStatus === 'OTP_SENT') {
        setOtpSent(true)
        setPaymentStatus(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setProcessing(false)
    }
  }

  const confirmOtp = async () => {
    if (!paymentId) return
    setProcessing(true)
    setError('')
    try {
      const baseItems = draftItem
        ? [{
            serviceId: draftItem.serviceId,
            quantity: 1,
            deliveryOptionId: draftItem.deliveryOptionId,
            templateId: draftItem.templateId,
            customizationBrief: brief || draftItem.customizationBrief,
          }]
        : cartItems.map((item) => ({
            serviceId: item.service.id,
            quantity: item.quantity,
            customizationBrief: brief || undefined,
          }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: baseItems,
          paymentMethod,
          phone,
          paymentId,
          otpCode,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'OTP confirmation failed')
      setPaymentStatus(data.paymentStatus || 'CONFIRMED')
      setOtpSent(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP confirmation failed')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen animate-pulse bg-muted/30" />
  }

  if (paymentStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f7] p-4">
        <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold">{paymentStatus === 'CONFIRMED' ? t.success : t.pending}</h1>
          <p className="mt-2 text-foreground/70">Status: {paymentStatus}</p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button>{t.orderHistory}</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1f1f1f]">
      <header className="border-b border-black/5 bg-[#faf9f7]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/browse" className="text-sm font-medium text-black/70">← Back</Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-3xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-black/60">{t.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[#f1f0ed] px-3 py-1 text-black/70">1. Service configuration</span>
            <span className="rounded-full bg-[#f1f0ed] px-3 py-1 text-black/70">2. Payment</span>
            <span className="rounded-full bg-[#f1f0ed] px-3 py-1 text-black/70">3. Confirmation</span>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4" /> {error}
          </div>
        )}

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-5 rounded-3xl border border-black/10 bg-white p-5">
            <div>
              <label className="text-sm font-medium">{t.phone}</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+228 90 00 00 00" className="mt-2 h-11 border-black/10 bg-[#f6f5f1]" />
            </div>

            <div>
              <label className="text-sm font-medium">Mode de paiement</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => setPaymentMethod('flooz')} className={`rounded-lg border p-3 ${paymentMethod === 'flooz' ? 'border-black bg-[#f5f4ef]' : 'border-black/10'}`}>Flooz</button>
                <button onClick={() => setPaymentMethod('tmoney')} className={`rounded-lg border p-3 ${paymentMethod === 'tmoney' ? 'border-black bg-[#f5f4ef]' : 'border-black/10'}`}>TMoney</button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="text-sm font-medium">Code OTP</label>
                <Input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="6 chiffres"
                  className="mt-2 h-11 border-black/10 bg-[#f6f5f1]"
                />
                <p className="mt-1 text-xs text-foreground/60">
                  Un code est envoye sur ton telephone. {otpHint ? `(test: ${otpHint})` : ''}
                </p>
                <Button
                  type="button"
                  onClick={confirmOtp}
                  disabled={processing || otpCode.trim().length !== 6}
                  className="mt-3 w-full"
                >
                  {processing ? 'Verification...' : 'Confirmer OTP'}
                </Button>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">{t.note}</label>
              <Textarea value={brief} onChange={(e) => setBrief(e.target.value)} className="mt-2 min-h-[100px] border-black/10 bg-[#f6f5f1]" />
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-black/10 bg-white p-5 lg:sticky lg:top-8">
            <h2 className="text-lg font-semibold">{t.summary}</h2>
            <div className="mt-3 space-y-2 text-sm text-foreground/70">
              {draftItem ? (
                <div className="flex justify-between">
                  <span>{draftPreview?.name || '1 service configure'}</span>
                  <span>{formatPrice(draftPreview?.total || 0)}</span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.service.name}</span>
                    <span>{formatPrice(item.service.price * item.quantity)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span>Total</span>
                <span className="font-semibold">{formatPrice(draftItem ? draftPreview?.total || 0 : fallbackTotal)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-black/10 bg-[#f6f5f1] p-3 text-xs text-black/65">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Payment confirmation via secure mobile network.</span>
            </div>

            <Button onClick={submitOrder} disabled={processing || !phone || otpSent} className="mt-4 w-full bg-[#111] text-white hover:bg-black">
              {processing ? 'Processing...' : t.pay}
            </Button>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CheckoutContent />
    </Suspense>
  )
}
