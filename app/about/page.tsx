import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">À propos d'Execly</h1>
        <p className="mt-4 text-sm text-slate-600">
          Execly structure la commande de services digitaux pour réduire les délais, améliorer la qualité livrée et
          offrir un suivi clair aux clients.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Notre approche: process standardisé, communication centralisée et livraison vérifiable.
        </p>
        <Link href="/browse" className="mt-6 inline-block text-sm font-medium text-sky-700 hover:underline">
          Explorer les services
        </Link>
      </section>
    </main>
  )
}
