import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'
import { initiateMobileMoneyPayment, type MobileMoneyMethod } from '@/lib/payments'

const createOrdersSchema = z.object({
  items: z.array(
    z.object({
      serviceId: z.string().min(1),
      quantity: z.number().int().min(1).max(20).default(1),
      isExpress: z.boolean().default(false),
    })
  ).min(1),
  phone: z.string().trim().min(8),
  paymentMethod: z.enum(['flooz', 'tmoney']),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        service: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = createOrdersSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }
    const { items, phone, paymentMethod } = parsed.data

    const pricedItems = await Promise.all(
      items.map(async (item) => {
        const service = await prisma.service.findUnique({ where: { id: item.serviceId } })
        if (!service) throw new Error(`Service ${item.serviceId} not found`)
        const isExpress = item.isExpress
        const quantity = item.quantity
        const basePrice = service.price * quantity
        const totalPrice = isExpress ? basePrice * 1.5 : basePrice
        const deliveryDays = isExpress ? Math.max(1, Math.floor(service.deliveryDays / 2)) : service.deliveryDays
        const deadlineDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000)
        return { item, service, isExpress, quantity, totalPrice, deadlineDate }
      })
    )

    const totalAmount = pricedItems.reduce((sum, it) => sum + it.totalPrice, 0)
    const paymentGateway = await initiateMobileMoneyPayment({
      amount: totalAmount,
      phone,
      method: paymentMethod as MobileMoneyMethod,
      externalId: `execly_${userId}_${Date.now()}`,
    })

    if (paymentGateway.status === 'FAILED') {
      return NextResponse.json({ error: 'Payment initialization failed' }, { status: 402 })
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: totalAmount,
        phone,
        method: paymentMethod === 'flooz' ? 'FLOOZ' : 'TMONEY',
        status: paymentGateway.status,
        providerRef: paymentGateway.providerRef,
        providerResponse: JSON.stringify(paymentGateway.rawResponse || {}),
      },
    })

    const orders = await Promise.all(
      pricedItems.map(async (entry) =>
        prisma.order.create({
          data: {
            userId,
            serviceId: entry.item.serviceId,
            quantity: entry.quantity,
            totalPrice: entry.totalPrice,
            isExpress: entry.isExpress,
            deadlineDate: entry.deadlineDate,
            status: paymentGateway.status === 'CONFIRMED' ? 'confirmed' : 'pending',
            notes: `Payment ${paymentGateway.status} via ${paymentMethod.toUpperCase()} (${phone})`,
            paymentId: payment.id,
          },
          include: { service: true },
        })
      )
    )

    await prisma.cartItem.deleteMany({
      where: { userId },
    })

    return NextResponse.json(
      {
        message: paymentGateway.status === 'CONFIRMED' ? 'Orders created successfully' : 'Payment request sent to mobile network',
        paymentStatus: paymentGateway.status,
        paymentReference: payment.providerRef,
        orders,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
