import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = newsletterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Veuillez fournir un email valide.' },
        { status: 400 }
      )
    }
    const normalizedEmail = parsed.data.email.toLowerCase()

    // Check if already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: 'Vous êtes déjà inscrit à notre newsletter !' },
          { status: 200 }
        )
      } else {
        // Re-activate
        await prisma.newsletterSubscriber.update({
          where: { email: normalizedEmail },
          data: { active: true },
        })
      }
    } else {
      // Create new
      await prisma.newsletterSubscriber.create({
        data: { email: normalizedEmail },
      })
    }

    return NextResponse.json(
      { message: 'Merci pour votre inscription !' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[NEWSLETTER_ERROR]', error)
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de l\'inscription.' },
      { status: 500 }
    )
  }
}
