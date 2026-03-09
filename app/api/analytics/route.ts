import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

const analyticsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  properties: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.id?.toString()

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const events = await prisma.analyticsEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = analyticsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid analytics payload' }, { status: 400 })
    }

    const session = await getSession()
    const userId = session?.id?.toString()

    await prisma.analyticsEvent.create({
      data: {
        name: parsed.data.name,
        properties: parsed.data.properties ? JSON.stringify(parsed.data.properties) : null,
        userId: userId || null,
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

