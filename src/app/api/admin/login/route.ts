import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    if (password !== adminPassword) {
      // Small delay to mitigate brute-force
      await new Promise((r) => setTimeout(r, 400))
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(secret)

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ADMIN_COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
