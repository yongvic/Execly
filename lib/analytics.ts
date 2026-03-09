'use client'

type AnalyticsValue = string | number | boolean

export async function trackEvent(name: string, properties?: Record<string, AnalyticsValue>) {
  if (typeof window === 'undefined') return

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, properties }),
    keepalive: true,
  }).catch(() => null)

  const { track } = await import('@vercel/analytics')
  track(name, properties)
}
