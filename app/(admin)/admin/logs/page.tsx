import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

type AuditLog = {
  id: string
  level: 'critical' | 'warning' | 'info' | 'success'
  message: string
  actor: string
  target: string
  time: Date
}

function inferLevel(name: string): AuditLog['level'] {
  if (name.includes('failed') || name.includes('error')) return 'critical'
  if (name.includes('warning') || name.includes('otp_sent')) return 'warning'
  if (name.includes('paid') || name.includes('completed')) return 'success'
  return 'info'
}

export default async function AdminLogsPage() {
  const [events, failedPayments, latestMessages] = await Promise.all([
    prisma.analyticsEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 80 }),
    prisma.payment.findMany({ where: { status: 'FAILED' }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { sender: { select: { name: true, role: true } }, thread: { select: { orderId: true } } },
    }),
  ])

  const logs: AuditLog[] = [
    ...events.map((e) => ({
      id: `evt_${e.id}`,
      level: inferLevel(e.name),
      message: e.name,
      actor: e.userId || 'system',
      target: e.properties || '-',
      time: e.createdAt,
    })),
    ...failedPayments.map((p) => ({
      id: `pay_${p.id}`,
      level: 'critical' as const,
      message: `payment_failed_${p.method.toLowerCase()}`,
      actor: p.userId,
      target: p.providerRef || '-',
      time: p.createdAt,
    })),
    ...latestMessages.map((m) => ({
      id: `msg_${m.id}`,
      level: 'info' as const,
      message: 'chat_message',
      actor: `${m.sender.name} (${m.sender.role})`,
      target: `order:${m.thread.orderId}`,
      time: m.createdAt,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 120)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight">Logs Sécurité & Audit</h2>
        <p className="mt-1 text-sm text-muted-foreground">Journal consolidé analytics, paiements et messages.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Entrées</p><p className="text-2xl font-semibold">{logs.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Critiques</p><p className="text-2xl font-semibold">{logs.filter((l) => l.level === 'critical').length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Warnings</p><p className="text-2xl font-semibold">{logs.filter((l) => l.level === 'warning').length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Success</p><p className="text-2xl font-semibold">{logs.filter((l) => l.level === 'success').length}</p></div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Niveau</th>
                <th className="px-4 py-3 font-medium">Evènement</th>
                <th className="px-4 py-3 font-medium">Acteur</th>
                <th className="px-4 py-3 font-medium">Cible</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      log.level === 'critical' ? 'bg-rose-100 text-rose-700' :
                      log.level === 'warning' ? 'bg-amber-100 text-amber-700' :
                      log.level === 'success' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{log.message}</td>
                  <td className="px-4 py-3 text-slate-600">{log.actor}</td>
                  <td className="px-4 py-3 text-slate-600">{log.target}</td>
                  <td className="px-4 py-3 text-slate-500">{log.time.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
