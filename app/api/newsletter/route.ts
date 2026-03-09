import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Veuillez fournir un email valide.' },
        { status: 400 }
      )
    }

    // Check if already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
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
          where: { email },
          data: { active: true },
        })
      }
    } else {
      // Create new
      await prisma.newsletterSubscriber.create({
        data: { email },
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
