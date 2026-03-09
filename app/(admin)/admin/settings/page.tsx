export const dynamic = 'force-dynamic'

function statusLabel(ok: boolean) {
  return ok ? 'Configure' : 'Manquant'
}

export default function AdminSettingsPage() {
  const env = {
    database: Boolean(process.env.DATABASE_URL),
    auth: Boolean(process.env.AUTH_SECRET),
    flooz: Boolean(process.env.FLOOZ_API_URL && process.env.FLOOZ_API_TOKEN),
    tmoney: Boolean(process.env.TMONEY_API_URL && process.env.TMONEY_API_TOKEN),
    webhook: Boolean(process.env.PAYMENT_WEBHOOK_SECRET),
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    resend: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
    whatsapp: Boolean(process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN),
    pusherServer: Boolean(process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET && process.env.PUSHER_CLUSTER),
    pusherClient: Boolean(process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
    websocket: Boolean(process.env.NEXT_PUBLIC_WS_URL),
  }

  const rows = [
    ['DATABASE_URL', statusLabel(env.database)],
    ['AUTH_SECRET', statusLabel(env.auth)],
    ['FLOOZ_API_URL + FLOOZ_API_TOKEN', statusLabel(env.flooz)],
    ['TMONEY_API_URL + TMONEY_API_TOKEN', statusLabel(env.tmoney)],
    ['PAYMENT_WEBHOOK_SECRET', statusLabel(env.webhook)],
    ['BLOB_READ_WRITE_TOKEN', statusLabel(env.blob)],
    ['RESEND_API_KEY + RESEND_FROM_EMAIL', statusLabel(env.resend)],
    ['WHATSAPP_*', statusLabel(env.whatsapp)],
    ['PUSHER_APP_ID + PUSHER_KEY + PUSHER_SECRET + PUSHER_CLUSTER', statusLabel(env.pusherServer)],
    ['NEXT_PUBLIC_PUSHER_KEY + NEXT_PUBLIC_PUSHER_CLUSTER', statusLabel(env.pusherClient)],
    ['NEXT_PUBLIC_WS_URL', statusLabel(env.websocket)],
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="mt-1 text-sm text-muted-foreground">Vérification rapide de la configuration Execly v2.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Santé configuration (.env)</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 font-medium">Variable</th>
                <th className="px-3 py-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, state]) => (
                <tr key={name} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-mono text-xs">{name}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${state === 'Configure' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-semibold">Politique plateforme</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>- Devise unique: XOF (FCFA)</li>
            <li>- Paiement OTP obligatoire avant création commande</li>
            <li>- Templates non modifiables côté client</li>
            <li>- Livraison via URL Vercel Blob</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-semibold">Canaux notifications</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>- In-app: activé par défaut</li>
            <li>- Email: selon config SMTP</li>
            <li>- WhatsApp: selon config API</li>
            <li>- Temps réel: WebSocket si URL configurée</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
