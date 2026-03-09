import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { publishRealtimeEvent } from '@/lib/realtime'

type DispatchInput = {
  userId: string
  title: string
  body: string
  email?: string | null
  phone?: string | null
  metadata?: Record<string, unknown>
}

async function trySendEmail(input: DispatchInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from || !input.email) {
    return false
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: input.email,
    subject: input.title,
    text: input.body,
  })

  return !error
}

async function trySendWhatsApp(input: DispatchInput) {
  if (!process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_API_TOKEN || !input.phone) {
    return false
  }

  const res = await fetch(process.env.WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
    },
    body: JSON.stringify({
      to: input.phone,
      title: input.title,
      body: input.body,
    }),
  }).catch(() => null)

  return Boolean(res?.ok)
}

export async function dispatchNotifications(input: DispatchInput) {
  const metadata = JSON.stringify(input.metadata || {})

  await prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      body: input.body,
      channel: 'IN_APP',
      metadata,
    },
  })
  await publishRealtimeEvent(`user-${input.userId}`, 'notification', {
    type: 'notification',
    title: input.title,
    body: input.body,
  })

  const [emailSent, whatsappSent] = await Promise.all([trySendEmail(input), trySendWhatsApp(input)])

  if (emailSent) {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: `${input.title} (Email)`,
        body: input.body,
        channel: 'EMAIL',
        metadata,
      },
    })
    await publishRealtimeEvent(`user-${input.userId}`, 'notification', {
      type: 'notification',
      title: `${input.title} (Email)`,
      body: input.body,
    })
  }

  if (whatsappSent) {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: `${input.title} (WhatsApp)`,
        body: input.body,
        channel: 'WHATSAPP',
        metadata,
      },
    })
    await publishRealtimeEvent(`user-${input.userId}`, 'notification', {
      type: 'notification',
      title: `${input.title} (WhatsApp)`,
      body: input.body,
    })
  }
}
