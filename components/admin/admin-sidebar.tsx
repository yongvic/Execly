'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Settings,
    ShieldAlert,
    BarChart3,
    LogOut,
    FolderOpen,
    ShoppingCart
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
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
        <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
            {/* Logo Area */}
            <div className="flex h-14 shrink-0 items-center px-4 border-b border-sidebar-border/50">
                <Link href="/admin/dashboard" className="flex items-center gap-2 hover:bg-sidebar-accent/50 rounded-md py-1 px-2 transition-colors">
                    <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                        E
                    </div>
                    <span className="text-sm font-semibold text-sidebar-foreground">Execly Admin</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col overflow-y-auto mt-2 px-2 gap-0.5">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group flex items-center gap-2.5 rounded-[4px] px-3 py-1.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'h-4 w-4 shrink-0',
                                    isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/50'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Area */}
            <div className="p-2 mt-auto border-t border-sidebar-border/50">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 rounded-[4px] px-3 py-1.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                >
                    <LogOut className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
                    Déconnexion
                </button>
            </div>
        </div>
    )
}

