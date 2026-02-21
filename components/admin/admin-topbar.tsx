'use client'

import React from 'react'
import { Bell, Search, Menu } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { ThemeToggle } from '@/components/theme-toggle'

export function AdminTopbar() {
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b bg-background/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Search Bar - Hidden on small screens */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1 w-full" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                        Rechercher dans l'admin...
                    </label>
                    <div className="relative w-full max-w-md my-auto">
                        <Search
                            className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <input
                            id="search-field"
                            className="block h-10 w-full rounded-full border border-input bg-muted/50 py-2 pl-10 pr-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                            placeholder="Rechercher (Ctrl+K)..."
                            type="search"
                            name="search"
                        />
                    </div>
                </form>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Alerts & Theme */}
                <div className="flex items-center gap-x-2">
                    <ThemeToggle />

                    <button type="button" className="relative p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors">
                        <span className="sr-only">Voir les notifications</span>
                        <Bell className="h-5 w-5" aria-hidden="true" />
                        <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                    </button>
                </div>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

                {/* User Profile */}
                <div className="flex items-center gap-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="hidden lg:flex lg:flex-col lg:items-start text-sm leading-none">
                        <span className="font-semibold">{user?.name || 'Administrateur'}</span>
                        <span className="text-xs text-muted-foreground mt-1 capitalize">{user?.role || 'Admin'}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
