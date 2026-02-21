import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Parse included JSON if it exists
    const parsedService = {
      ...service,
      included: service.included ? JSON.parse(service.included) : [],
    }

    return NextResponse.json({ service: parsedService }, { status: 200 })
  } catch (error) {
    console.error('Get service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
