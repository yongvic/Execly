import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Users, Activity, ExternalLink } from 'lucide-react'
import { Overview } from '@/components/admin/overview-chart'
import { formatPrice } from '@/lib/format'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function monthlyOrderSeries(orders: Array<{ createdAt: Date; totalPrice: number }>) {
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
  const totals = new Array(12).fill(0)
  orders.forEach((order) => {
    totals[new Date(order.createdAt).getMonth()] += order.totalPrice
  })
  return months.map((name, i) => ({ name, total: Math.round(totals[i]) }))
}

export default async function AdminStatsPage() {
  const [orders, userCount, topServices] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true } },
        service: { select: { id: true, name: true, provider: true } },
      },
    }),
    prisma.user.count(),
    prisma.service.findMany({
      take: 5,
      include: {
        _count: { select: { orders: true } },
        orders: { select: { totalPrice: true } },
      },
      orderBy: { orders: { _count: 'desc' } },
    }),
  ])

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const completedOrders = orders.filter((order) => order.status === 'completed').length
  const conversionRate = orders.length ? Math.round((completedOrders / orders.length) * 1000) / 10 : 0
  const repeatCustomers = new Set(orders.map((o) => o.user.id)).size

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistiques Détaillées</h2>
          <p className="text-muted-foreground mt-1">Analysez les performances globales de la plateforme Execly.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de finalisation</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500">{completedOrders} commandes finalisées</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus cumulés</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500">{orders.length} commandes</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repeatCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">{userCount} comptes au total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader>
            <CardTitle>Ventes mensuelles</CardTitle>
            <CardDescription>Évolution des revenus sur l'année</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={monthlyOrderSeries(orders)} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader>
            <CardTitle>Top Services (Ventes)</CardTitle>
            <CardDescription>Les services les plus performants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => {
                const serviceRevenue = service.orders.reduce((sum, order) => sum + order.totalPrice, 0)
                return (
                  <div key={service.id} className="flex items-center">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center font-bold text-primary mr-4">
                      #{index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.provider}</p>
                    </div>
                    <div className="text-sm font-medium">{formatPrice(serviceRevenue)}</div>
                  </div>
                )
              })}
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-primary hover:underline">
              Classement en temps réel <ExternalLink className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
