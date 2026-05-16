import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: videos } = await supabase
    .from('videos')
    .select('slug, updated_at')
    .order('published_at', { ascending: false })

  const videoUrls = (videos ?? []).map((v) => ({
    url: `${SITE_URL}/videos/${v.slug}`,
    lastModified: new Date(v.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...videoUrls,
  ]
}
