import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { validatePassword } from '@/lib/security'

const resetPasswordSchema = z.object({
  token: z.string().trim().min(1).max(512),
  password: z.string().min(8, 'Password must be at least 8 characters').max(256),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Token and password are required'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }
    const { token, password } = parsed.data

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.errors[0] }, { status: 400 })
    }

    // Hash the incoming token to compare against the stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        passwordChangedAt: new Date(), // Invalidates all existing sessions
      },
    })

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
