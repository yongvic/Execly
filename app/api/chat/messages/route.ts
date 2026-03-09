import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'
import { dispatchNotifications } from '@/lib/notifications'
import { publishRealtimeEvent } from '@/lib/realtime'

const createMessageSchema = z.object({
  threadId: z.string().min(1),
  body: z.string().trim().min(1).max(3000),
})

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN', 'MODERATOR'])

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const threadId = searchParams.get('threadId')
    if (!threadId) {
      return NextResponse.json({ error: 'threadId is required' }, { status: 400 })
    }

    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      select: { id: true, customerId: true },
    })
    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }

    const isAdmin = session.role && ADMIN_ROLES.has(session.role.toString().toUpperCase())
    if (!isAdmin && thread.customerId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
      take: 500,
    })

    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    console.error('Chat messages GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createMessageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const thread = await prisma.chatThread.findUnique({
      where: { id: parsed.data.threadId },
      select: { id: true, customerId: true, orderId: true },
    })
    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }

    const isAdmin = session.role && ADMIN_ROLES.has(session.role.toString().toUpperCase())
    if (!isAdmin && thread.customerId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        threadId: parsed.data.threadId,
        senderId: session.id,
        body: parsed.data.body,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    })

    await prisma.chatThread.update({
      where: { id: parsed.data.threadId },
      data: { updatedAt: new Date() },
    })
    await publishRealtimeEvent(`thread-${thread.id}`, 'chat_message', {
      type: 'chat_message',
      threadId: thread.id,
      messageId: message.id,
      senderId: session.id,
    })

    if (isAdmin) {
      const customer = await prisma.user.findUnique({
        where: { id: thread.customerId },
        select: { id: true, email: true, phone: true },
      })
      if (customer) {
        await dispatchNotifications({
          userId: customer.id,
          title: 'Nouveau message support',
          body: 'Un admin a repondu a ta commande.',
          email: customer.email,
          phone: customer.phone,
          metadata: { threadId: thread.id, orderId: thread.orderId },
        })
      }
    } else {
      const admins = await prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'] } },
        select: { id: true, email: true, phone: true },
        take: 20,
      })
      await Promise.all(
        admins.map((admin) =>
          dispatchNotifications({
            userId: admin.id,
            title: 'Nouveau message client',
            body: 'Un client a envoye un nouveau message.',
            email: admin.email,
            phone: admin.phone,
            metadata: { threadId: thread.id, orderId: thread.orderId },
          })
        )
      )
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Chat messages POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
