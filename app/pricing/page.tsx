import Link from 'next/link'

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Pricing</h1>
        <p className="mt-4 text-sm text-slate-600">
          Execly pricing is service-based. Each offer has a fixed base price, optional template adjustments, and
          delivery speed options.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 p-4">
            <h2 className="text-lg font-semibold">Standard</h2>
            <p className="mt-2 text-sm text-slate-600">Base price with default delivery timeline.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-4">
            <h2 className="text-lg font-semibold">Express</h2>
            <p className="mt-2 text-sm text-slate-600">Faster turnaround with a delivery multiplier.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-4">
            <h2 className="text-lg font-semibold">Custom</h2>
            <p className="mt-2 text-sm text-slate-600">Additional scope estimated after brief review.</p>
          </article>
        </div>
        <div className="mt-8">
          <Link href="/browse" className="text-sm font-medium text-sky-700 hover:underline">
            Browse services
          </Link>
        </div>
      </section>
    </main>
  )
}
