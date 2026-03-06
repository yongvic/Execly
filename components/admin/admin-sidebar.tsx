'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    ShieldAlert,
    BarChart3,
    LogOut,
    FolderOpen
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Contenus & Services', href: '/admin/services', icon: FolderOpen },
    { name: 'Statistiques', href: '/admin/stats', icon: BarChart3 },
    { name: 'Logs Sécurité', href: '/admin/logs', icon: ShieldAlert },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <div className="flex h-full w-64 flex-col bg-background border-r shadow-sm">
            {/* Logo Area */}
            <div className="flex h-16 shrink-0 items-center px-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                        M
                    </div>
                    <span className="text-xl font-bold tracking-tight">Execly <span className="text-primary">Admin</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col overflow-y-auto mt-4 px-3 gap-1">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'h-5 w-5 shrink-0 transition-colors',
                                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto w-1 h-5 bg-primary rounded-full transition-all" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Area */}
            <div className="p-4 mt-auto">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    Déconnexion
                </button>
            </div>
        </div>
    )
}

