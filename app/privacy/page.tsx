import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-600">
          Execly collects only the data required to deliver services, process payments, and provide support.
          Authentication uses secure HttpOnly cookies and encrypted tokens.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Your account information, orders, and payment events are stored in a secured database and are never sold to
          third parties. You can request data correction or account deletion through support.
        </p>
        <Link href="/signup" className="mt-6 inline-block text-sm font-medium text-sky-700 hover:underline">
          Back to signup
        </Link>
      </section>
    </main>
  )
}
