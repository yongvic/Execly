import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'
import { initiateMobileMoneyPayment, type MobileMoneyMethod } from '@/lib/payments'
import { dispatchNotifications } from '@/lib/notifications'
import { publishRealtimeEvent } from '@/lib/realtime'

const createOrdersSchema = z.object({
  items: z.array(
    z.object({
      serviceId: z.string().min(1),
      quantity: z.number().int().min(1).max(20).default(1),
      deliveryOptionId: z.string().optional(),
      templateId: z.string().optional(),
      customizationBrief: z.string().trim().max(3000).optional(),
    })
  ).min(1),
  phone: z.string().trim().min(8),
  paymentMethod: z.enum(['flooz', 'tmoney']),
  paymentId: z.string().optional(),
  otpCode: z.string().trim().length(6).optional(),
})

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

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
        template: true,
        payment: true,
        review: true,
        deliverables: {
          orderBy: { uploadedAt: 'desc' },
          take: 5,
        },
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
    const { items, phone, paymentMethod, paymentId, otpCode } = parsed.data

    if (paymentId && otpCode) {
      const existingPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
      })
      if (!existingPayment || existingPayment.userId !== userId) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
      }
      if (existingPayment.status === 'CONFIRMED') {
        const existingOrders = await prisma.order.findMany({
          where: { paymentId: existingPayment.id, userId },
          include: { service: true, template: true },
          orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(
          {
            message: 'Payment already confirmed',
            paymentStatus: existingPayment.status,
            paymentReference: existingPayment.providerRef,
            orders: existingOrders,
          },
          { status: 200 }
        )
      }
      if (existingPayment.otpCode !== otpCode) {
        return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 })
      }
      if (existingPayment.otpExpiresAt && existingPayment.otpExpiresAt.getTime() < Date.now()) {
        return NextResponse.json({ error: 'OTP code expired' }, { status: 400 })
      }

      const metadata = existingPayment.metadata ? JSON.parse(existingPayment.metadata) : null
      const lockedItems = metadata?.items as typeof items | undefined
      if (!Array.isArray(lockedItems) || lockedItems.length === 0) {
        return NextResponse.json({ error: 'Invalid payment metadata' }, { status: 400 })
      }

      const pricedItems = await Promise.all(
        lockedItems.map(async (item) => {
          const service = await prisma.service.findUnique({ where: { id: item.serviceId } })
          if (!service) throw new Error(`Service ${item.serviceId} not found`)

          const options = await prisma.serviceDeliveryOption.findMany({
            where: { serviceId: item.serviceId },
            orderBy: { turnaroundDays: 'asc' },
          })
          const selectedOption =
            options.find((option) => option.id === item.deliveryOptionId) ??
            options.find((option) => option.isDefault) ??
            options[0]
          if (!selectedOption) throw new Error(`Delivery option missing for ${item.serviceId}`)

          if (item.templateId) {
            const template = await prisma.template.findUnique({ where: { id: item.templateId } })
            if (!template || template.serviceId !== item.serviceId) {
              throw new Error(`Template not linked to service ${item.serviceId}`)
            }
          }

          const quantity = item.quantity
          const totalPrice = service.price * quantity * selectedOption.priceMultiplier
          const deadlineDate = new Date(Date.now() + selectedOption.turnaroundDays * 24 * 60 * 60 * 1000)
          return { item, selectedOption, quantity, totalPrice, deadlineDate }
        })
      )

      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          status: 'CONFIRMED',
          otpConfirmedAt: new Date(),
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
              isExpress: entry.selectedOption.priceMultiplier > 1,
              templateId: entry.item.templateId,
              customizationBrief: entry.item.customizationBrief,
              deadlineDate: entry.deadlineDate,
              status: 'CONFIRMED',
              notes: `Payment CONFIRMED via ${paymentMethod.toUpperCase()} (${existingPayment.phone}) - ${entry.selectedOption.label}`,
              paymentId: existingPayment.id,
            },
            include: { service: true, template: true },
          })
        )
      )
      await Promise.all(
        orders.map((order) =>
          publishRealtimeEvent(`user-${userId}`, 'order_update', {
            type: 'order_update',
            orderId: order.id,
            status: order.status,
          })
        )
      )

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phone: true },
      })
      await dispatchNotifications({
        userId,
        title: 'Paiement confirme',
        body: 'Ton paiement a ete confirme. La commande est visible dans ton dashboard.',
        email: user?.email,
        phone: user?.phone,
        metadata: { paymentId: existingPayment.id, providerRef: existingPayment.providerRef },
      })

      await prisma.cartItem.deleteMany({ where: { userId } })

      return NextResponse.json(
        {
          message: 'Payment confirmed. Orders created successfully.',
          paymentStatus: 'CONFIRMED',
          paymentReference: existingPayment.providerRef,
          orders,
        },
        { status: 201 }
      )
    }

    const pricedItems = await Promise.all(
      items.map(async (item) => {
        const service = await prisma.service.findUnique({ where: { id: item.serviceId } })
        if (!service) throw new Error(`Service ${item.serviceId} not found`)

        const options = await prisma.serviceDeliveryOption.findMany({
          where: { serviceId: item.serviceId },
          orderBy: { turnaroundDays: 'asc' },
        })
        const selectedOption =
          options.find((option) => option.id === item.deliveryOptionId) ??
          options.find((option) => option.isDefault) ??
          options[0]

        if (!selectedOption) throw new Error(`Delivery option missing for ${item.serviceId}`)

        const quantity = item.quantity
        const basePrice = service.price * quantity
        const totalPrice = basePrice * selectedOption.priceMultiplier
        const deliveryDays = selectedOption.turnaroundDays
        const deadlineDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000)

        if (item.templateId) {
          const template = await prisma.template.findUnique({ where: { id: item.templateId } })
          if (!template || template.serviceId !== item.serviceId) {
            throw new Error(`Template not linked to service ${item.serviceId}`)
          }
        }

        return { item, service, selectedOption, quantity, totalPrice, deadlineDate }
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
        status: 'OTP_SENT',
        providerRef: paymentGateway.providerRef,
        otpCode: generateOtpCode(),
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        metadata: JSON.stringify({ items }),
        providerResponse: JSON.stringify(paymentGateway.rawResponse || {}),
      },
    })

    return NextResponse.json(
      {
        message: 'OTP sent to phone. Confirm code to finalize payment and create orders.',
        paymentStatus: 'OTP_SENT',
        paymentReference: payment.providerRef,
        paymentId: payment.id,
        otpHint: process.env.NODE_ENV === 'production' ? undefined : payment.otpCode,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Create orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
