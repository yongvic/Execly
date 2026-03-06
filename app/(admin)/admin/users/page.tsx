import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Search, Filter, MoreHorizontal } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    // En production, nous utiliserions une requête API avec pagination
    // Pour la version actuelle, on récupère les X derniers inscrits
    const users = await prisma.user.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Utilisateurs</h2>
                    <p className="text-muted-foreground mt-1">Gérez les comptes de la plateforme, attribuez des rôles ou appliquez des sanctions.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm">
                        Ajouter un Admin
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
                                placeholder="Rechercher un utilisateur (nom, email)..."
                                className="w-full pl-9 pr-4 py-2 rounded-full border bg-muted/30 focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors whitespace-nowrap">
                            <Filter className="h-4 w-4" /> Filtres Avancés
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-muted/50 text-muted-foreground">
                                <tr className="border-b transition-colors">
                                    <th className="h-10 px-4 font-medium align-middle">Utilisateur</th>
                                    <th className="h-10 px-4 font-medium align-middle">Inscription</th>
                                    <th className="h-10 px-4 font-medium align-middle">Rôle</th>
                                    <th className="h-10 px-4 font-medium align-middle">Statut</th>
                                    <th className="h-10 px-4 font-medium align-middle w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/30 group">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                Actif
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Menu Actions</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-xs text-muted-foreground">
                            Affiche <strong>1-{users.length}</strong> utilisateurs
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
