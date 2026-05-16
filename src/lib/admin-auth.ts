import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from './constants'

export async function verifyAdminRequest(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!token) return false
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}
