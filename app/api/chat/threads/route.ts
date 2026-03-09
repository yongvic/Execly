import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const createThreadSchema = z.object({
  orderId: z.string().min(1),
})

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN', 'MODERATOR'])

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const isAdmin = session.role && ADMIN_ROLES.has(session.role.toString().toUpperCase())
    const threads = await prisma.chatThread.findMany({
      where: isAdmin ? {} : { customerId: session.id },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            service: { select: { id: true, name: true } },
          },
        },
        customer: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, body: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ threads }, { status: 200 })
  } catch (error) {
    console.error('Chat threads GET error:', error)
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
    const parsed = createThreadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      select: { id: true, userId: true },
    })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const isAdmin = session.role && ADMIN_ROLES.has(session.role.toString().toUpperCase())
    if (!isAdmin && order.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const thread = await prisma.chatThread.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        customerId: order.userId,
      },
      update: {},
    })

    return NextResponse.json({ thread }, { status: 201 })
  } catch (error) {
    console.error('Chat threads POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
