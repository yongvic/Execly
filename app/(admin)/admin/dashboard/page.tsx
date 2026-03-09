import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/format'
import { Bell, CheckCircle2, CreditCard, MessageSquare, Package, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

function monthBuckets(input: Array<{ createdAt: Date; totalPrice: number }>) {
  const labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
  const values = new Array(12).fill(0)
  input.forEach((row) => {
    values[new Date(row.createdAt).getMonth()] += row.totalPrice
  })
  return labels.map((label, idx) => ({ label, total: Math.round(values[idx]) }))
}

export default async function AdminDashboardPage() {
  const [usersCount, orders, activeOrders, otpPending, notificationsUnread, messageCount] = await Promise.all([
    prisma.user.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 600,
      include: {
        user: { select: { name: true } },
        service: { select: { name: true } },
      },
    }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } } }),
    prisma.payment.count({ where: { status: 'OTP_SENT' } }),
    prisma.notification.count({ where: { isRead: false } }),
    prisma.message.count(),
  ])

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length
  const completionRate = orders.length ? Math.round((completedCount / orders.length) * 100) : 0
  const monthly = monthBuckets(orders)
  const recent = orders.slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight">Execly Admin v2</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pilotage global commandes, paiements OTP, messages et notifications.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Utilisateurs</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><p className="text-2xl font-bold">{usersCount}</p></CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Revenus</CardTitle><CreditCard className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p></CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Commandes actives</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><p className="text-2xl font-bold">{activeOrders}</p></CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Paiements OTP en attente</CardTitle><CheckCircle2 className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><p className="text-2xl font-bold">{otpPending}</p></CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Notifications non lues</CardTitle><Bell className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><p className="text-2xl font-bold">{notificationsUnread}</p></CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Messages support</CardTitle><MessageSquare className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><p className="text-2xl font-bold">{messageCount}</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Revenus mensuels (XOF)</h3>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {monthly.map((m) => (
              <div key={m.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className="text-sm font-semibold">{formatPrice(m.total)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">Taux de finalisation global: <span className="font-semibold">{completionRate}%</span></p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Activité récente</h3>
          <div className="mt-3 space-y-2">
            {recent.map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="font-medium">{order.user.name} - {order.service.name}</p>
                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
              </div>
            ))}
            {recent.length === 0 && <p className="text-sm text-slate-500">Aucune activité.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
