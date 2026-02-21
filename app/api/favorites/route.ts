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

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json({ favorites }, { status: 200 })
  } catch (error) {
    console.error('Get favorites error:', error)
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
    const { serviceId } = body

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

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_serviceId: { userId, serviceId },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already favorited' },
        { status: 409 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        serviceId,
      },
      include: { service: true },
    })

    return NextResponse.json(
      { message: 'Added to favorites', favorite },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
