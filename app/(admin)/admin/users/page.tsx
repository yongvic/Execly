import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    take: 60,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true, notifications: true, sentMessages: true } },
    },
  })

  const totals = {
    all: users.length,
    admins: users.filter((u) => ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(u.role)).length,
    clients: users.filter((u) => u.role === 'USER').length,
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight">Utilisateurs</h2>
        <p className="mt-1 text-sm text-muted-foreground">Vue globale des comptes et activité client/admin.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Total</p><p className="text-2xl font-semibold">{totals.all}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Clients</p><p className="text-2xl font-semibold">{totals.clients}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Admins/Modération</p><p className="text-2xl font-semibold">{totals.admins}</p></div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Utilisateur</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Commandes</th>
                <th className="px-4 py-3 font-medium">Messages</th>
                <th className="px-4 py-3 font-medium">Notifications</th>
                <th className="px-4 py-3 font-medium">Inscription</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold">{user.name.slice(0, 1).toUpperCase()}</div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${user.role === 'USER' ? 'bg-slate-100 text-slate-700' : 'bg-violet-100 text-violet-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{user._count.orders}</td>
                  <td className="px-4 py-3 font-medium">{user._count.sentMessages}</td>
                  <td className="px-4 py-3 font-medium">{user._count.notifications}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">Aucun utilisateur trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
