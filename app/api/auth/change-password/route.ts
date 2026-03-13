import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { decrypt } from '@/lib/session'
import { validatePassword } from '@/lib/security'
import { z } from 'zod'

const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(256),
})

export async function POST(req: Request) {
    // Authenticate user via session cookie
    const cookieStore = await import('next/headers').then(m => m.cookies())
    const sessionCookie = cookieStore.get('session')?.value
    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
    const session = await decrypt(sessionCookie)
    if (!session?.id) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    const { currentPassword, newPassword } = parsed.data

    // Fetch user
    const user = await prisma.user.findUnique({ where: { id: session.id } })
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const passwordMatches = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatches) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Validate new password strength
    const validation = validatePassword(newPassword)
    if (!validation.isValid) {
        return NextResponse.json({ error: validation.errors[0] }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed, passwordChangedAt: new Date() },
    })

    return NextResponse.json({ message: 'Password updated successfully' })
}
