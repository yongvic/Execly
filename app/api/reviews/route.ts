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
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { serviceId },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reviews }, { status: 200 })
  } catch (error) {
    console.error('Get reviews error:', error)
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
    const { orderId, rating, comment } = body

    if (!orderId || !rating) {
      return NextResponse.json(
        { error: 'Order ID and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { orderId },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this order' },
        { status: 409 }
      )
    }

    const review = await prisma.review.create({
      data: {
        orderId,
        userId,
        serviceId: order.serviceId,
        rating,
        comment,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(
      { message: 'Review created successfully', review },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
