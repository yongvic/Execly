import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Use environment variable — required in all environments
const secretKey = process.env.AUTH_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SECRET environment variable is required in production')
    }
    console.warn('⚠️  Using fallback secret for development only. Set AUTH_SECRET in production!')
    return 'development_fallback_secret_change_in_production_123456789'
})()

const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.warn('JWT decryption failed:', error instanceof Error ? error.message : 'Unknown error')
        return null
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null

    const payload = await decrypt(session)
    if (!payload) return null

    // If the session was issued before the last password change, invalidate it
    if (payload.passwordChangedAt && payload.iat) {
        const issuedAt = payload.iat as number // seconds
        const passwordChangedAt = new Date(payload.passwordChangedAt).getTime() / 1000 // seconds
        if (issuedAt < passwordChangedAt) {
            return null // Session is no longer valid
        }
    }

    return payload
}

export async function updateSession(request: any) {
    const session = request.cookies.get('session')?.value
    if (!session) return null

    const parsed = await decrypt(session)
    if (!parsed) return null

    // Refresh expiry
    parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return parsed
}
