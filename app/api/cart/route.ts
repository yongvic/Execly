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

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { addedAt: 'desc' },
    })

    const total = cartItems.reduce(
      (sum, item) => sum + item.service.price * item.quantity,
      0
    )

    return NextResponse.json(
      {
        items: cartItems,
        total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get cart error:', error)
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
    const { serviceId, quantity = 1 } = body

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_serviceId: { userId, serviceId },
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { service: true },
      })

      return NextResponse.json(
        { message: 'Cart updated', item: updatedItem },
        { status: 200 }
      )
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        serviceId,
        quantity,
      },
      include: { service: true },
    })

    return NextResponse.json(
      { message: 'Item added to cart', item: cartItem },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
