import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Activity, ExternalLink } from 'lucide-react'
import { Overview } from '@/components/admin/overview-chart'
import { formatPrice } from '@/lib/format'

export default function AdminStatsPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Statistiques Détaillées</h2>
                    <p className="text-muted-foreground mt-1">Analysez les performances globales de la plateforme Mentorly.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <select className="border-input bg-background rounded-md px-3 py-2 text-sm">
                        <option>7 derniers jours</option>
                        <option>30 derniers jours</option>
                        <option>Cette année</option>
                    </select>
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors">
                        Exporter le rapport
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* KPI Cards */}
                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.4%</div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-500">+2.1% (vs mois précédent)</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Temps moyen sur le site</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4m 12s</div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-500">+18s (vs mois précédent)</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nouveaux Visiteurs</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,450</div>
                        <p className="text-xs text-muted-foreground mt-1 text-red-500">-5.2% (vs mois précédent)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader>
                        <CardTitle>Ventes mensuelles</CardTitle>
                        <CardDescription>Évolution des revenus sur l'année</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader>
                        <CardTitle>Top Services (Ventes)</CardTitle>
                        <CardDescription>Les services les plus performants</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex items-center">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center font-bold text-primary mr-4">
                                        #{item}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Service Digital Premium {item}</p>
                                        <p className="text-xs text-muted-foreground">Fournisseur {item}</p>
                                    </div>
                                    <div className="text-sm font-medium">
                                        {formatPrice(Math.random() * 500000 + 10000)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-primary hover:underline">
                            Voir le classement complet <ExternalLink className="h-3 w-3" />
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
