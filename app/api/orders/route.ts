import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

function getUserIdFromSession(sessionToken: string): string | null {
  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
    return decoded.split(':')[0]
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = getUserIdFromSession(sessionToken)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
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
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = getUserIdFromSession(sessionToken)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items } = body // Array of { serviceId, quantity }

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

        const order = await prisma.order.create({
          data: {
            userId,
            serviceId: item.serviceId,
            quantity: item.quantity || 1,
            totalPrice: service.price * (item.quantity || 1),
            deliveryDate: new Date(Date.now() + service.deliveryDays * 24 * 60 * 60 * 1000),
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
