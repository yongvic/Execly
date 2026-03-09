import Link from 'next/link'

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Gestion des cookies</h1>
        <p className="mt-4 text-sm text-slate-600">
          Execly utilise des cookies essentiels pour l'authentification et la sécurité des sessions.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Vous pouvez configurer votre navigateur pour limiter les cookies, mais certaines fonctionnalités (connexion,
          préférences de langue, sécurité de session) peuvent être impactées.
        </p>
        <Link href="/privacy" className="mt-6 inline-block text-sm font-medium text-sky-700 hover:underline">
          Voir la politique de confidentialité
        </Link>
      </section>
    </main>
  )
}
