import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/payments'
import { z } from 'zod'

const webhookSchema = z.object({
  reference: z.string().min(1),
  status: z.enum(['CONFIRMED', 'FAILED', 'PENDING']),
  provider: z.string().optional(),
  payload: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET
    const rawBody = await request.text()

    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const signature = request.headers.get('x-signature')
    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const parsed = webhookSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
    }

    const { reference, status, payload } = parsed.data
    const payment = await prisma.payment.findUnique({ where: { providerRef: reference } })
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        callbackPayload: JSON.stringify(payload || {}),
      },
    })

    const orderStatus = status === 'CONFIRMED' ? 'confirmed' : status === 'FAILED' ? 'cancelled' : 'pending'
    await prisma.order.updateMany({
      where: { paymentId: payment.id },
      data: { status: orderStatus },
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Payment webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
