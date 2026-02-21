import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Overview } from '../../../../components/admin/overview-chart'
import { RecentActivity } from '../../../../components/admin/recent-activity'
import { Users, CreditCard, Activity, Package } from 'lucide-react'
import { formatPrice } from '@/lib/format'

export default function AdminDashboard() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
                <div className="flex items-center space-x-2">
                    {/* Optional actions like Date Picker can go here */}
                </div>
            </div>

            {/* KPI Cards (Bento style) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10,482</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-emerald-500 font-medium">+20.1%</span> depuis le mois dernier
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(45231.89)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-emerald-500 font-medium">+15%</span> depuis le mois dernier
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Commandes (En cours)</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-emerald-500 font-medium">+201</span> depuis la semaine dernière
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-none shadow-sm bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary-foreground/80">Taux d'Engagement</CardTitle>
                        <Activity className="h-4 w-4 text-primary-foreground/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-primary-foreground/70 mt-1">
                            <span className="font-medium">+3.5%</span> depuis hier
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader>
                        <CardTitle>Aperçu de la croissance</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>

                <Card className="col-span-3 rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader>
                        <CardTitle>Activité Récente</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Les 5 dernières actions des utilisateurs
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
