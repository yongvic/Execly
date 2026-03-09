import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN', 'MODERATOR'])

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const role = session?.role?.toString().toUpperCase()
    if (!session?.id || !role || !ADMIN_ROLES.has(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : {},
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        service: {
          select: { id: true, name: true, category: true },
        },
        template: {
          select: { id: true, name: true },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Admin orders GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
