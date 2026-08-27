import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminRequest } from '@/lib/admin-auth'
import type { SiteConfig } from '@/lib/site-config'

export async function PUT(request: NextRequest) {
  if (!(await verifyAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: Partial<SiteConfig> = await request.json()
  const supabase = await createServiceClient()

  const rows = Object.entries(body).map(([key, value]) => ({
    key,
    value: value ?? '',
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('site_config')
    .upsert(rows, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Bust the page cache so the next visitor gets fresh content immediately
  revalidatePath('/', 'layout')
  revalidatePath('/videos')

  return NextResponse.json({ ok: true })
}
