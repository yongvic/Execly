import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Search, Filter, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export default async function AdminServicesPage() {
    const services = await prisma.service.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { orders: true }
            }
        }
    })

    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Services & Contenus</h2>
                    <p className="text-muted-foreground mt-1">Supervisez les services proposés, modérez le contenu et validez les nouvelles publications.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors">
                        Créer un Service
                    </button>
                </div>
            </div>

            <Card className="rounded-2xl border-none shadow-sm bg-background">
                <CardHeader className="border-b pb-4 mb-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Rechercher (titre, vendeur, catégorie)..."
                                className="w-full pl-9 pr-4 py-2 rounded-full border bg-muted/30 focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm"
                            />
                        </div>

                        <div className="flex gap-2 text-sm">
                            <select className="border rounded-md px-3 py-2 bg-background hover:bg-muted/50 cursor-pointer">
                                <option value="all">Toutes les catégories</option>
                                <option value="design">Design Graphique</option>
                                <option value="dev">Développement Web</option>
                                <option value="writing">Rédaction</option>
                            </select>
                            <select className="border rounded-md px-3 py-2 bg-background hover:bg-muted/50 cursor-pointer">
                                <option value="all">Tous les statuts</option>
                                <option value="published">Publiés</option>
                                <option value="draft">Brouillons</option>
                                <option value="flagged">Signalés</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-muted/50 text-muted-foreground">
                                <tr className="border-b transition-colors whitespace-nowrap">
                                    <th className="h-10 px-4 font-medium align-middle">Service</th>
                                    <th className="h-10 px-4 font-medium align-middle">Vendeur</th>
                                    <th className="h-10 px-4 font-medium align-middle">Prix / Ventes</th>
                                    <th className="h-10 px-4 font-medium align-middle">Statut</th>
                                    <th className="h-10 px-4 font-medium align-middle text-right w-[150px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {services.map((service) => (
                                    <tr key={service.id} className="border-b transition-colors hover:bg-muted/30">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                                                    {service.image ? (
                                                        <Image
                                                            src={service.image}
                                                            alt={service.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs bg-slate-100">Sans Image</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground line-clamp-1 max-w-[250px]">{service.name}</span>
                                                    <span className="text-xs text-muted-foreground">{service.category}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{service.provider}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-emerald-600">${service.price.toFixed(2)}</span>
                                                <span className="text-xs text-muted-foreground">{service._count.orders} vente(s)</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {/* En implémentation réelle, on ajouterait un champ status à Prisma */}
                                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Publié
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-slate-500 transition-colors" title="Prévisualiser">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-blue-500 transition-colors" title="Éditer">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive transition-colors" title="Supprimer/Archiver">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {services.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Aucun service trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination simple */}
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-xs text-muted-foreground">
                            Affiche <strong>1-{services.length}</strong> services
                        </div>
                        <div className="flex items-center gap-2">
                            <button disabled className="px-3 py-1 border rounded text-xs opacity-50 cursor-not-allowed">Précédent</button>
                            <button className="px-3 py-1 border rounded text-xs hover:bg-muted">Suivant</button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
