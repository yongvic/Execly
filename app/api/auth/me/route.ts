import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/session'
import { withRetry } from '@/lib/database-connection'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Decode JWT session token to get userId
    const decoded = await decrypt(sessionToken)

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }
    const userId = decoded.id

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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
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
