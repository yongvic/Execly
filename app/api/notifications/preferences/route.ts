import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const preferenceSchema = z.object({
  inAppEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: session.id },
    })

    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: { userId: session.id },
      })
    }

    return NextResponse.json({ preferences }, { status: 200 })
  } catch (error) {
    console.error('Preferences GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = preferenceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: session.id },
      update: parsed.data,
      create: {
        userId: session.id,
        ...parsed.data,
      },
    })

    return NextResponse.json({ preferences }, { status: 200 })
  } catch (error) {
    console.error('Preferences PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
