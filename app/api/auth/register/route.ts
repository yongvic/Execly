import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { isValidEmail, validatePassword } from '@/lib/security'

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(256),
  country: z.string().trim().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid registration data'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { email, password, name, phone, country } = parsed.data
    const normalizedEmail = email?.toLowerCase().trim()
    const normalizedPhone = phone?.replace(/\s+/g, '')

    if (!normalizedEmail && !normalizedPhone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      )
    }

    if (normalizedEmail && !isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (normalizedPhone && normalizedPhone.length < 8) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.errors[0] }, { status: 400 })
    }

    if (normalizedEmail) {
      const existingUserByEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } })
      if (existingUserByEmail) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
      }
    }

    if (normalizedPhone) {
      const existingUserByPhone = await prisma.user.findFirst({ where: { phone: normalizedPhone } })
      if (existingUserByPhone) {
        return NextResponse.json({ error: 'Phone already used' }, { status: 409 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail || `phone_${normalizedPhone}@execly.local`,
        password: hashedPassword,
        name,
        phone: normalizedPhone,
        country,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    })

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
