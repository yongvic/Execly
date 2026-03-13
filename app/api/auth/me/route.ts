import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { withRetry } from '@/lib/database-connection'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      const response = NextResponse.json(
        { error: 'Not authenticated or invalid session' },
        { status: 401 }
      )
      // Clear the invalid cookie
      response.cookies.delete('session')
      return response
    }

    const userId = session.id

    // Get user from database with retry logic
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          country: true,
          role: true,
        },
      })
    }, 3)

    if (!user) {
      const response = NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
      // Clear the cookie because the user no longer exists in DB
      response.cookies.delete('session')
      return response
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)

    // Check if it's a connection error
    if (error instanceof Error &&
      (error.message.includes('connection') ||
        error.message.includes('timeout') ||
        error.message.includes('ECONNREFUSED'))) {
      return NextResponse.json(
        { error: 'Database temporarily unavailable' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
