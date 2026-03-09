import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/format'

export const dynamic = 'force-dynamic'

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 1000) / 10
}

export default async function AdminStatsPage() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [orders, payments, services, landingViews, ctaClicks, checkoutClicks, paidEvents] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: since } } }),
    prisma.payment.findMany({ where: { createdAt: { gte: since } } }),
    prisma.service.findMany({
      include: { _count: { select: { orders: true } }, orders: { select: { totalPrice: true } } },
      orderBy: { orders: { _count: 'desc' } },
      take: 8,
    }),
    prisma.analyticsEvent.count({ where: { name: 'landing_view', createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { name: 'landing_cta_click', createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { name: 'checkout_pay_click', createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { name: 'checkout_paid', createdAt: { gte: since } } }),
  ])

  const revenue = orders.reduce((s, o) => s + o.totalPrice, 0)
  const completed = orders.filter((o) => o.status === 'COMPLETED').length
  const otpPending = payments.filter((p) => p.status === 'OTP_SENT').length
  const paidConversion = pct(paidEvents, checkoutClicks)
  const landingConversion = pct(ctaClicks, landingViews)
  const completionRate = pct(completed, orders.length)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight">Statistiques</h2>
        <p className="mt-1 text-sm text-muted-foreground">KPI business sur les 30 derniers jours.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Revenus 30j</p><p className="text-2xl font-semibold">{formatPrice(revenue)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Completion commandes</p><p className="text-2xl font-semibold">{completionRate}%</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">OTP en attente</p><p className="text-2xl font-semibold">{otpPending}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Paid / Checkout</p><p className="text-2xl font-semibold">{paidConversion}%</p></div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Funnel 30j</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Landing views</p><p className="text-xl font-semibold">{landingViews}</p></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">CTA clicks</p><p className="text-xl font-semibold">{ctaClicks}</p><p className="text-xs text-emerald-600">{landingConversion}%</p></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Checkout clicks</p><p className="text-xl font-semibold">{checkoutClicks}</p></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Paid events</p><p className="text-xl font-semibold">{paidEvents}</p><p className="text-xs text-emerald-600">{paidConversion}%</p></div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Top services (30j)</h3>
        <div className="mt-3 space-y-2">
          {services.map((service, idx) => (
            <div key={service.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
              <div>
                <p className="font-medium">#{idx + 1} {service.name}</p>
                <p className="text-xs text-slate-500">{service.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{service._count.orders} commandes</p>
                <p className="text-xs text-slate-500">{formatPrice(service.orders.reduce((s, o) => s + o.totalPrice, 0))}</p>
              </div>
            </div>
          ))}
          {services.length === 0 && <p className="text-sm text-slate-500">Aucune donnée.</p>}
        </div>
      </div>
    </div>
  )
}
