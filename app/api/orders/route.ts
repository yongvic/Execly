import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

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
    const { items, phone, paymentMethod } = body // items: { serviceId, quantity, isExpress }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      )
    }

    // Create orders for each item
    const orders = await Promise.all(
      items.map(async (item) => {
        const service = await prisma.service.findUnique({
          where: { id: item.serviceId },
        })

        if (!service) {
          throw new Error(`Service ${item.serviceId} not found`)
        }

        const isExpress = item.isExpress || false
        const quantity = item.quantity || 1
        const basePrice = service.price * quantity
        const totalPrice = isExpress ? basePrice * 1.5 : basePrice

        // Calculate deadline date
        const deliveryDays = isExpress
          ? Math.max(1, Math.floor(service.deliveryDays / 2))
          : service.deliveryDays
        const deadlineDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000)

        const order = await prisma.order.create({
          data: {
            userId,
            serviceId: item.serviceId,
            quantity,
            totalPrice,
            isExpress,
            deadlineDate,
            status: 'pending',
            notes: `Paid via ${paymentMethod || 'Mobile Money'} (${phone || 'No phone provided'})`
          },
          include: { service: true },
        })

        return order
      })
    )

    // Clear cart items
    await prisma.cartItem.deleteMany({
      where: { userId },
    })

    return NextResponse.json(
      {
        message: 'Orders created successfully',
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
