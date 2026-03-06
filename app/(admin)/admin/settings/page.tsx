import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Globe, Shield, CreditCard, Mail } from 'lucide-react'

export default function AdminSettingsPage() {
    return (
        <div className="flex-1 space-y-6 max-w-5xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Paramètres Généraux</h2>
                    <p className="text-muted-foreground mt-1">Configurez les comportements globaux de la plateforme, les paiements Mobile Money et les notifications.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-primary flex items-center gap-2 text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm">
                        <Save className="h-4 w-4" /> Sauvegarder
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle>Plateforme</CardTitle>
                        </div>
                        <CardDescription>Nom du site, règles globales, maintenance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Nom de la Plateforme</label>
                            <input type="text" defaultValue="Execly" className="border rounded-md px-3 py-2 text-sm w-full max-w-sm" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Email de Support Contact</label>
                            <input type="email" defaultValue="support@Execly.com" className="border rounded-md px-3 py-2 text-sm w-full max-w-sm" />
                        </div>
                        <div className="flex flex-col gap-2 pt-2 border-t mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4" />
                                <span className="text-sm font-medium text-destructive">Activer le Mode Maintenance (Le site sera inaccessible aux utilisateurs)</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Security / Auth */}
                <Card className="rounded-2xl border-none shadow-sm bg-background">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Sécurité & Inscriptions</CardTitle>
                        </div>
                        <CardDescription>Critères de mot de passe, authentification à deux facteurs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary w-4 h-4" />
                                <span className="text-sm font-medium">Autoriser les nouvelles inscriptions</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary w-4 h-4" />
                                <span className="text-sm font-medium">Exiger une vérification d'email à l'inscription</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-primary w-4 h-4" />
                                <span className="text-sm font-medium">Forcer l'A2F (2FA) pour tous les comptes Admin</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Third Party Integration Placeholder */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="rounded-2xl border-none shadow-sm bg-background">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <CardTitle>Paiements (Flooz / TMoney)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">Statut de la connexion</label>
                                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Connecté (Sandbox Mobile Money)
                                </div>
                            </div>
                            <button className="mt-4 border rounded-md px-4 py-2 text-sm hover:bg-muted transition-colors">Configurer passerelle locale</button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-none shadow-sm bg-background">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                <CardTitle>Notifications Client</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">Canal principal</label>
                                <input type="text" value="Email + SMS transactionnel" readOnly className="border rounded-md px-3 py-2 text-sm w-full bg-muted/50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

