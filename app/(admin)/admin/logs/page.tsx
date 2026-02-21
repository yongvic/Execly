import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldAlert, AlertTriangle, Info, CheckCircle, Search } from 'lucide-react'

// Mock des logs système liés à la sécurité et aux actions admins
const systemLogs = [
    { id: 1, type: 'critical', message: 'Tentative de connexion échouée répétée', user: 'IP: 192.168.1.54', time: 'Il y a 5 min' },
    { id: 2, type: 'warning', message: 'Modification du rôle utilisateur', user: 'Admin: Sophie M.', target: 'User: John (ID: 4092)', time: 'Il y a 12 min' },
    { id: 3, type: 'info', message: 'Nouveau service créé', user: 'Creative Studio', time: 'Il y a 45 min' },
    { id: 4, type: 'success', message: 'Mise à jour des paramètres de paiement', user: 'Super Admin', time: 'Il y a 2h' },
    { id: 5, type: 'critical', message: 'Alerte sécurité: Token JWT invalide détecté', user: 'Middleware', time: 'Il y a 3h' },
    { id: 6, type: 'info', message: 'Export de la base utilisateurs (CSV)', user: 'Admin: Marc K.', time: 'Hier' },
    { id: 7, type: 'warning', message: 'Signalement de contenu reçu', user: 'User: Alice', target: 'Service ID: 89', time: 'Hier' },
    { id: 8, type: 'success', message: 'Migration de la base de données terminée', user: 'Système', time: 'Hier' },
]

export default function AdminLogsPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Logs Sécurité & Audit</h2>
                    <p className="text-muted-foreground mt-1">Supervisez l'historique des actions, les alertes de sécurité et la journalisation RBAC.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-background border text-foreground hover:bg-muted rounded-md px-4 py-2 text-sm font-medium transition-colors">
                        Purger les logs (Archiver)
                    </button>
                </div>
            </div>

            <Card className="rounded-2xl border-none shadow-sm bg-background">
                <CardHeader className="border-b pb-4 mb-0">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Chercher dans les logs (Event, Utilisateur, IP)..."
                                className="w-full pl-9 pr-4 py-2 rounded-full border bg-muted/30 focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm"
                            />
                        </div>

                        <div className="flex gap-2 text-sm">
                            <select className="border rounded-md px-3 py-2 bg-background hover:bg-muted/50 cursor-pointer">
                                <option value="all">Tous les niveaux d'alerte</option>
                                <option value="critical">Critique</option>
                                <option value="warning">Avertissement</option>
                                <option value="info">Information</option>
                                <option value="success">Succès</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-muted/50 text-muted-foreground">
                                <tr className="border-b transition-colors">
                                    <th className="h-10 px-4 font-medium align-middle w-[50px]">Niveau</th>
                                    <th className="h-10 px-4 font-medium align-middle">Événement</th>
                                    <th className="h-10 px-4 font-medium align-middle">Acteur / Source</th>
                                    <th className="h-10 px-4 font-medium align-middle">Cible</th>
                                    <th className="h-10 px-4 font-medium align-middle text-right">Date/Heure</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {systemLogs.map((log) => (
                                    <tr key={log.id} className="border-b transition-colors hover:bg-muted/30">
                                        <td className="p-4 align-middle">
                                            <div className="flex justify-center">
                                                {log.type === 'critical' && <ShieldAlert className="h-5 w-5 text-red-500" />}
                                                {log.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                                                {log.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                                                {log.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`font-medium ${log.type === 'critical' ? 'text-red-600' :
                                                    log.type === 'warning' ? 'text-amber-600' : 'text-foreground'
                                                }`}>
                                                {log.message}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground font-mono text-xs">
                                            {log.user}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground text-xs">
                                            {log.target || '-'}
                                        </td>
                                        <td className="p-4 align-middle text-right text-muted-foreground whitespace-nowrap">
                                            {log.time}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-xs text-muted-foreground">
                            Pagination: 50 entrées par page
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
