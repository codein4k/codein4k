import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { path } = body

  if (path) {
    revalidatePath(path)
  } else {
    revalidatePath('/')
    revalidatePath('/videos')
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
