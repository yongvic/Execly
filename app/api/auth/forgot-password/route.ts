import { prisma } from '@/lib/prisma'
import { sendResetPasswordEmail } from '@/lib/email'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const normalizedEmail = parsed.data.email.toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Always return the same response to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
    }

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString('hex')
    // Store only the SHA-256 hash of the token in the database
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,        // Store the HASH, not the raw token
        resetTokenExpires: expires,
      },
    })

    // Send the RAW token in the email link (not the hash)
    await sendResetPasswordEmail(user.email, rawToken)

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
