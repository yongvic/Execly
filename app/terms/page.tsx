import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Terms and Conditions</h1>
        <p className="mt-4 text-sm text-slate-600">
          Execly provides digital services on-demand. Templates are preview-only for clients and are customized by the
          Execly team. Payments are validated via OTP before order confirmation.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Delivery timelines depend on selected service speed. Files are delivered via dashboard links.
        </p>
        <Link href="/signup" className="mt-6 inline-block text-sm font-medium text-sky-700 hover:underline">
          Back to signup
        </Link>
      </section>
    </main>
  )
}
