import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            deliveryDays: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 120,
    })

    return NextResponse.json({ templates }, { status: 200 })
  } catch (error) {
    console.error('Templates GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
