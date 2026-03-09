import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
    include: {
      templates: { select: { id: true, name: true, isActive: true } },
      deliveryOptions: { select: { id: true, label: true, turnaroundDays: true, priceMultiplier: true, isDefault: true } },
      _count: { select: { orders: true, favorites: true } },
    },
  })

  const activeCount = services.filter((s) => s.isActive).length

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight">Services & Templates</h2>
        <p className="mt-1 text-sm text-muted-foreground">Gestion catalogue, pricing et options de livraison.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Services</p><p className="text-2xl font-semibold">{services.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Actifs</p><p className="text-2xl font-semibold">{activeCount}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Inactifs</p><p className="text-2xl font-semibold">{services.length - activeCount}</p></div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Prix base</th>
                <th className="px-4 py-3 font-medium">Templates</th>
                <th className="px-4 py-3 font-medium">Délais</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Etat</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md bg-slate-100">
                        {service.image ? <Image src={service.image} alt={service.name} fill className="object-cover" /> : null}
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-slate-500">{service.category} · {service.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sky-700">{formatPrice(service.price)}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {service.templates.map((t) => (
                        <p key={t.id} className="text-xs">{t.name} <span className={t.isActive ? 'text-emerald-600' : 'text-slate-500'}>{t.isActive ? 'active' : 'off'}</span></p>
                      ))}
                      {service.templates.length === 0 && <p className="text-xs text-slate-500">Aucun template</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {service.deliveryOptions.map((d) => (
                        <p key={d.id} className="text-xs">{d.label} · {d.turnaroundDays}j · x{d.priceMultiplier}{d.isDefault ? ' (default)' : ''}</p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{service._count.orders}</p>
                    <p className="text-xs text-slate-500">{service._count.favorites} favoris</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${service.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {service.isActive ? 'ACTIF' : 'INACTIF'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
