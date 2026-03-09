'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Link as LinkIcon, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/format'

type AdminOrder = {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  totalPrice: number
  createdAt: string
  deadlineDate?: string | null
  deliverableUrl?: string | null
  user: { name: string; email: string }
  service: { name: string; category: string }
  payment?: { method: string; status: string } | null
}

const statusOptions: AdminOrder['status'][] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | AdminOrder['status']>('ALL')
  const [urlByOrder, setUrlByOrder] = useState<Record<string, string>>({})
  const [savingByOrder, setSavingByOrder] = useState<Record<string, boolean>>({})

  const load = async () => {
    setLoading(true)
    const query = filter === 'ALL' ? '' : `?status=${filter}`
    const res = await fetch(`/api/admin/orders${query}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [filter])

  const totals = useMemo(() => orders.reduce((sum, o) => sum + o.totalPrice, 0), [orders])

  const updateStatus = async (orderId: string, status: AdminOrder['status']) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await load()
  }

  const saveDeliverable = async (order: AdminOrder) => {
    setSavingByOrder((prev) => ({ ...prev, [order.id]: true }))
    try {
      const formData = new FormData()
      formData.set('status', order.status)

      const urlValue = (urlByOrder[order.id] ?? order.deliverableUrl ?? '').trim()
      if (urlValue) {
        formData.set('deliverableUrl', urlValue)
      }

      await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        body: formData,
      })

      await load()
    } finally {
      setSavingByOrder((prev) => ({ ...prev, [order.id]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des commandes</h2>
          <p className="mt-1 text-muted-foreground">Statuts, paiements, et publication livrables via URL Vercel Blob.</p>
        </div>
        <div className="rounded-lg border bg-background px-3 py-2 text-sm">
          Revenus filtres: <span className="font-semibold">{formatPrice(totals)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className={`rounded-full px-3 py-1 text-xs ${filter === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} onClick={() => setFilter('ALL')}>ALL</button>
        {statusOptions.map((status) => (
          <button key={status} className={`rounded-full px-3 py-1 text-xs ${filter === status ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} onClick={() => setFilter(status)}>{status}</button>
        ))}
      </div>

      <div className="rounded-2xl border bg-background p-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const isWebLike = ['web-dev', 'portfolio'].includes(order.service.category)
              return (
                <div key={order.id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{order.service.name}</p>
                      <p className="text-xs text-muted-foreground">{order.user.name} ({order.user.email})</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{formatPrice(order.totalPrice)}</p>
                      <p className="text-xs text-muted-foreground">{order.payment?.method || '-'} · {order.payment?.status || '-'}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 md:grid-cols-[220px_1fr]">
                    <select
                      className="rounded-md border bg-background px-2 py-2 text-sm"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as AdminOrder['status'])}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    <Input
                      value={urlByOrder[order.id] ?? order.deliverableUrl ?? ''}
                      placeholder={isWebLike ? 'https://portfolio-domain.com' : 'https://blob.vercel-storage.com/...'}
                      onChange={(e) => setUrlByOrder((prev) => ({ ...prev, [order.id]: e.target.value }))}
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={savingByOrder[order.id]}
                      onClick={() => saveDeliverable(order)}
                    >
                      <Save className="mr-1 h-4 w-4" />
                      {savingByOrder[order.id] ? 'Enregistrement...' : 'Publier URL livrable'}
                    </Button>
                  </div>

                  {order.deliverableUrl && (
                    <a className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline" target="_blank" rel="noreferrer" href={order.deliverableUrl}>
                      {order.deliverableUrl.startsWith('http') ? <LinkIcon className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                      Ouvrir le livrable
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
