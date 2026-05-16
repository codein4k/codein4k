import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminRequest } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!(await verifyAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: 'Only JPG, PNG, WEBP, and GIF are allowed' },
      { status: 400 }
    )
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = await createServiceClient()

  const { data, error } = await supabase.storage
    .from('thumbnails')
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (error) {
    // Bucket likely doesn't exist yet — give a clear message
    if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
      return NextResponse.json(
        {
          error:
            'Storage bucket "thumbnails" not found. Create it in Supabase Dashboard → Storage → New bucket (name: thumbnails, public: on).',
        },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('thumbnails')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
