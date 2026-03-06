import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Overview } from '../../../../components/admin/overview-chart'
import { RecentActivity } from '../../../../components/admin/recent-activity'
import { Users, CreditCard, Activity, Package } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function buildMonthlyRevenue(orders: Array<{ createdAt: Date; totalPrice: number }>) {
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
  const bucket = new Array(12).fill(0)
  orders.forEach((order) => {
    const idx = new Date(order.createdAt).getMonth()
    bucket[idx] += order.totalPrice
  })
  return months.map((name, idx) => ({ name, total: Math.round(bucket[idx]) }))
}

export default async function AdminDashboard() {
  const [usersCount, orders, inProgressCount] = await Promise.all([
    prisma.user.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: {
        user: { select: { name: true } },
        service: { select: { name: true } },
      },
    }),
    prisma.order.count({ where: { status: { in: ['pending', 'confirmed', 'in-progress'] } } }),
  ])

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const completionRate = orders.length
    ? Math.round((orders.filter((o) => o.status === 'completed').length / orders.length) * 100)
    : 0

  const monthlyRevenue = buildMonthlyRevenue(orders)
  const recentActivity = orders.slice(0, 5).map((order) => ({
    id: order.id,
    user: order.user.name,
    action: `a commandé "${order.service.name}"`,
    time: new Date(order.createdAt).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount.toLocaleString('fr-FR')}</div>
            <p className="text-xs text-muted-foreground mt-1">Comptes enregistrés sur la plateforme</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Somme des commandes enregistrées</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes (En cours)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending, confirmed et in-progress</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Taux de finalisation</CardTitle>
            <Activity className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-primary-foreground/70 mt-1">Commandes livrées / commandes totales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-2xl border-none shadow-sm bg-background">
          <CardHeader>
            <CardTitle>Aperçu des revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={monthlyRevenue} />
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-2xl border-none shadow-sm bg-background">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <div className="text-sm text-muted-foreground">Les 5 dernières commandes</div>
          </CardHeader>
          <CardContent>
            <RecentActivity acts={recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
