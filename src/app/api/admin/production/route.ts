import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminRequest } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!(await verifyAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const supabase = await createServiceClient()

  if (body.id) {
    const { data, error } = await supabase
      .from('production_status')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('production_status')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
