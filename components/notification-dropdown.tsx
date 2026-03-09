'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, Mail, Package, AlertCircle, Info } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
  channel: string
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n: Notification) => !n.isRead).length)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = async (id?: string) => {
    const ids = id ? [id] : notifications.filter(n => !n.isRead).map(n => n.id)
    if (ids.length === 0) return

    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: ids }),
      })

      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => ids.includes(n.id) ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - ids.length))
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const getIcon = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('commande') || t.includes('order')) return <Package className="h-4 w-4 text-primary" />
    if (t.includes('paiement') || t.includes('payment')) return <Check className="h-4 w-4 text-emerald-500" />
    if (t.includes('alerte') || t.includes('alert')) return <AlertCircle className="h-4 w-4 text-amber-500" />
    return <Info className="h-4 w-4 text-blue-500" />
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-primary/5 transition-all">
          <Bell className="h-5 w-5 text-zinc-500" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-4 w-4 bg-primary text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-[1.5rem] p-2 shadow-2xl border-zinc-100 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="font-black uppercase tracking-tighter text-sm p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAsRead()}
              className="h-auto p-0 text-[10px] font-black text-primary hover:bg-transparent uppercase tracking-widest"
            >
              Tout lire
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-zinc-100 mx-2" />
        <ScrollArea className="h-[350px]">
          <div className="space-y-1 p-1">
            <AnimatePresence initial={false}>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <DropdownMenuItem 
                      className={`flex flex-col items-start gap-1 p-4 rounded-xl cursor-pointer transition-all border border-transparent ${!n.isRead ? 'bg-primary/[0.03] border-primary/5' : 'hover:bg-zinc-50'}`}
                      onClick={() => !n.isRead && markAsRead(n.id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className={`p-1.5 rounded-lg ${!n.isRead ? 'bg-white shadow-sm' : 'bg-zinc-100 opacity-50'}`}>
                          {getIcon(n.title)}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-tight flex-1 ${!n.isRead ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {n.title}
                        </span>
                        {!n.isRead && <div className="h-2 w-2 bg-primary rounded-full" />}
                      </div>
                      <p className={`text-xs font-medium leading-relaxed ${!n.isRead ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        {n.body}
                      </p>
                      <time className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-1">
                        {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </DropdownMenuItem>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-zinc-200" />
                  </div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Aucune notification</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
        <DropdownMenuSeparator className="bg-zinc-100 mx-2" />
        <div className="p-2">
          <Button variant="outline" className="w-full h-9 rounded-xl text-xs font-bold text-zinc-500 border-zinc-100 hover:bg-zinc-50">
            Voir tous les paramètres
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
