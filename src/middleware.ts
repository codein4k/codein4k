import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { ADMIN_COOKIE_NAME } from '@/lib/constants'

const ADMIN_PREFIX = '/adminin4k'
const ADMIN_LOGIN = '/adminin4k'
const ADMIN_DASHBOARD = '/adminin4k/dashboard'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next()
  }

  // Allow login page through
  if (pathname === ADMIN_LOGIN || pathname === `${ADMIN_LOGIN}/`) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
        await jwtVerify(token, secret)
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.url))
      } catch {
        // invalid token — show login
      }
    }
    return NextResponse.next()
  }

  // Protect all other /adminin4k/* routes
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL(ADMIN_LOGIN, request.url))
    response.cookies.delete(ADMIN_COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ['/adminin4k', '/adminin4k/:path*'],
}
