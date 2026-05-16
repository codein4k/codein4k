import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminRequest } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!(await verifyAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from('videos').insert(body).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
