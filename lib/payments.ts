import crypto from 'crypto'

export type MobileMoneyMethod = 'flooz' | 'tmoney'

type InitiatePaymentInput = {
  amount: number
  phone: string
  method: MobileMoneyMethod
  externalId: string
}

type InitiatePaymentResult = {
  providerRef: string
  status: 'PENDING' | 'CONFIRMED' | 'FAILED'
  rawResponse?: unknown
}

function providerConfig(method: MobileMoneyMethod) {
  if (method === 'flooz') {
    return {
      endpoint: process.env.FLOOZ_API_URL,
      token: process.env.FLOOZ_API_TOKEN,
    }
  }
  return {
    endpoint: process.env.TMONEY_API_URL,
    token: process.env.TMONEY_API_TOKEN,
  }
}

export async function initiateMobileMoneyPayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
  const cfg = providerConfig(input.method)

  if (!cfg.endpoint || !cfg.token) {
    return {
      providerRef: `sandbox_${input.method}_${Date.now()}`,
      status: 'PENDING',
      rawResponse: { sandbox: true, message: 'Missing provider credentials' },
    }
  }

  const payload = {
    amount: Math.round(input.amount),
    phone: input.phone,
    externalId: input.externalId,
    currency: 'XOF',
  }

  const res = await fetch(cfg.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return {
      providerRef: `failed_${input.method}_${Date.now()}`,
      status: 'FAILED',
      rawResponse: data,
    }
  }

  return {
    providerRef: String(data.reference || data.transactionId || `provider_${Date.now()}`),
    status: 'PENDING',
    rawResponse: data,
  }
}

export function signWebhookPayload(payload: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export function verifyWebhookSignature(payload: string, signature: string | null, secret: string) {
  if (!signature) return false
  const expected = signWebhookPayload(payload, secret)
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
