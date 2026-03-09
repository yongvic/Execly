import Link from 'next/link'

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Support</h1>
        <p className="mt-4 text-sm text-slate-600">
          Pour toute question sur une commande, un paiement ou un livrable, contactez l'équipe support.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Email: contact@execly.app</li>
          <li>Téléphone: +228 90 00 00 00</li>
          <li>Heures de support: Lundi à Vendredi, 08:00 - 18:00</li>
        </ul>
        <Link href="/dashboard" className="mt-6 inline-block text-sm font-medium text-sky-700 hover:underline">
          Retour au tableau de bord
        </Link>
      </section>
    </main>
  )
}
