'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Check, ChevronLeft, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/format'

interface CartItem {
  id: string
  service: {
    id: string
    name: string
    price: number
    category: string
  }
  quantity: number
}

function CheckoutStepper({
  activeStep,
  labels,
}: {
  activeStep: 'cart' | 'payment' | 'confirmation'
  labels: { cart: string; payment: string; confirmation: string }
}) {
  const steps: Array<'cart' | 'payment' | 'confirmation'> = ['cart', 'payment', 'confirmation']
  const currentIndex = steps.indexOf(activeStep)

  return (
    <div className="mb-8">
      <div className="grid grid-cols-3 gap-3">
        {steps.map((step, index) => (
          <div key={step} className="space-y-2">
            <div className={`h-2 rounded-full transition-all ${index <= currentIndex ? 'bg-primary' : 'bg-muted'}`} />
            <p className={`text-xs font-medium ${index <= currentIndex ? 'text-foreground' : 'text-foreground/50'}`}>
              {labels[step]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const t = useTranslations('checkout')
  const isExpressParam = searchParams.get('express') === 'true'

  const [activeStep, setActiveStep] = useState<'cart' | 'payment' | 'confirmation'>('cart')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'flooz' | 'tmoney'>('flooz')
  const [formData, setFormData] = useState({ phone: '', name: '' })
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'CONFIRMED' | 'FAILED' | null>(null)

  useEffect(() => {
    if (!user && !loading) router.push('/login')
  }, [user, router, loading])

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/cart')
        if (!response.ok) throw new Error(t('failedLoadCart'))
        const data = await response.json()
        setCartItems(data.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failedLoadCart'))
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchCart()
  }, [user, t])

  const subtotal = cartItems.reduce((sum, item) => {
    const basePrice = item.service.price * item.quantity;
    return sum + (isExpressParam ? basePrice * 1.5 : basePrice);
  }, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, { method: 'DELETE' })
      if (response.ok) setCartItems(cartItems.filter((item) => item.id !== cartItemId))
    } catch {
      setError(t('failedLoadCart'))
    }
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(10)
      setError('')
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(20)
      setError('')
    } else {
      setError(t('invalidPromo'))
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsProcessing(true)

    try {
      if (!formData.phone) {
        throw new Error(t('enterPhoneNumber'))
      }

      const items = cartItems.map((item) => ({
        serviceId: item.service.id,
        quantity: item.quantity,
        isExpress: isExpressParam
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentMethod, phone: formData.phone }),
      })

      if (!response.ok) throw new Error(t('failedOrder'))
      const data = await response.json()

      setCartItems([])
      setPaymentStatus(data.paymentStatus || 'PENDING')
      setActiveStep('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : (err as any).message || t('paymentFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user && !loading) return null

  if (activeStep === 'cart') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/browse" className="flex w-fit items-center gap-2 text-sm text-primary hover:underline">
              <ChevronLeft className="h-4 w-4" />
              {t('backToShopping')}
            </Link>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <CheckoutStepper
            activeStep={activeStep}
            labels={{ cart: t('yourCart'), payment: t('paymentDetails'), confirmation: t('orderConfirmed') }}
          />
          <h1 className="mb-8 text-3xl font-bold text-foreground">{t('yourCart')}</h1>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {loading ? (
                <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />)}</div>
              ) : cartItems.length === 0 ? (
                <div className="rounded-lg border border-border bg-card/50 py-12 text-center">
                  <p className="mb-4 text-foreground/60">{t('yourCartEmpty')}</p>
                  <Link href="/browse"><Button>{t('continueShopping')}</Button></Link>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <motion.div key={item.id} className="rounded-lg border border-border bg-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 items-start gap-4">
                        <div className="text-2xl">
                          {item.service.category === 'graphic-design' && '🎨'}
                          {item.service.category === 'templates' && '📄'}
                          {item.service.category === 'writing' && '✍️'}
                          {item.service.category === 'web-dev' && '💻'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.service.name}</h3>
                          <p className="text-sm text-foreground/60">{t('quantity', { qty: item.quantity })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="mb-3 font-bold text-primary">
                          {formatPrice((isExpressParam ? item.service.price * 1.5 : item.service.price) * item.quantity)}
                        </p>
                        <button onClick={() => handleRemoveItem(item.id)} className="text-foreground/40 transition-colors hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6 rounded-lg border border-border bg-card p-6">
                <h2 className="text-xl font-semibold text-foreground">{t('orderSummary')}</h2>

                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-foreground/70"><span>{t('subtotal')}</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>{t('discount', { discount })}</span><span>-{formatPrice(discountAmount)}</span></div>}
                </div>

                <div className="flex justify-between text-lg font-bold text-foreground"><span>{t('total')}</span><span className="text-primary">{formatPrice(total)}</span></div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('promoCode')}</label>
                  <div className="flex gap-2">
                    <Input placeholder={t('enterCode')} value={promoCode} onChange={(e) => setPromoCode(e.target.value)} name="promo" className="border-border bg-muted" />
                    <Button variant="outline" onClick={handleApplyPromo} className="px-3">{t('apply')}</Button>
                  </div>
                </div>

                <Button onClick={() => setActiveStep('payment')} disabled={cartItems.length === 0} className="w-full" size="lg">{t('proceedPayment')}</Button>
                <p className="text-center text-xs text-foreground/50">{t('promoHint')}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (activeStep === 'payment') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button onClick={() => setActiveStep('cart')} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ChevronLeft className="h-4 w-4" />
              {t('backToCart')}
            </button>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <CheckoutStepper
            activeStep={activeStep}
            labels={{ cart: t('yourCart'), payment: t('paymentDetails'), confirmation: t('orderConfirmed') }}
          />
          <h1 className="mb-8 text-3xl font-bold text-foreground">{t('paymentDetails')}</h1>

          {error && <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><p className="text-sm text-red-600">{error}</p></div>}

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-6 rounded-lg border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">{t('selectPaymentMethod')}</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('flooz')}
                  className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${paymentMethod === 'flooz' ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700] text-xl font-bold text-black italic">F</div>
                  <span className="text-sm font-bold">Flooz</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tmoney')}
                  className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${paymentMethod === 'tmoney' ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EE1C25] text-xl font-bold text-white italic">T</div>
                  <span className="text-sm font-bold">TMoney</span>
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">{t('phoneNumber')}</label>
                  <Input
                    name="phone"
                    placeholder={t('phonePlaceholder')}
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="border-border bg-muted text-lg font-bold tracking-widest"
                  />
                  <p className="mt-2 text-xs text-foreground/50">{t('ussdNote')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/50 p-6">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between"><span className="text-foreground/70">{t('subtotal')}</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>{t('discount', { discount })}</span><span>-{formatPrice(discountAmount)}</span></div>}
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-lg font-bold text-foreground"><span>{t('total')}</span><span className="text-primary">{formatPrice(total)}</span></div>
            </div>

            <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? t('initializingUssd') : t('payWithMethod', { amount: formatPrice(total), method: paymentMethod === 'flooz' ? 'Flooz' : 'TMoney' })}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-foreground/50 italic">{t('secureTransactions')}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div className="w-full max-w-md text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <CheckoutStepper
          activeStep={activeStep}
          labels={{ cart: t('yourCart'), payment: t('paymentDetails'), confirmation: t('orderConfirmed') }}
        />
        <div className="mb-6 flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"><Check className="h-8 w-8 text-green-600" /></div></div>

        <h1 className="mb-2 text-3xl font-bold text-foreground">
          {paymentStatus === 'CONFIRMED' ? t('orderConfirmed') : t('paymentPendingTitle')}
        </h1>
        <p className="mb-6 text-foreground/60">
          {paymentStatus === 'CONFIRMED' ? t('orderSuccess') : t('paymentPendingMessage')}
        </p>

        <div className="mb-8 space-y-4 rounded-lg border border-border bg-card p-4">
          <div><p className="text-xs text-foreground/60">{t('orderTotal')}</p><p className="text-2xl font-bold text-primary">{formatPrice(total)}</p></div>
        </div>

        <div className="space-y-3">
          <Link href="/dashboard" className="block"><Button className="w-full">{t('viewOrders')}</Button></Link>
          <Link href="/browse" className="block"><Button variant="outline" className="w-full">{t('continueShopping')}</Button></Link>
        </div>

        <p className="mt-6 text-xs text-foreground/50">{t('orderEmailHint')}</p>
      </motion.div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background px-4">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
