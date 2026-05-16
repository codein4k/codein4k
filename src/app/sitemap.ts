import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/constants'
import { getYouTubeThumbnail } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Gracefully handle Supabase being unavailable at build time
  let videoEntries: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()
    const { data: videos } = await supabase
      .from('videos')
      .select('slug, title, description, thumbnail_url, youtube_url, updated_at, published_at')
      .order('published_at', { ascending: false })

    videoEntries = (videos ?? []).map((v) => {
      // Resolve best available thumbnail for the image sitemap extension
      const thumbnail =
        v.thumbnail_url ||
        (v.youtube_url ? getYouTubeThumbnail(v.youtube_url) : null)

      return {
        url: `${SITE_URL}/videos/${v.slug}`,
        lastModified: new Date(v.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        // Next.js sitemap images extension (helps Google index video thumbnails)
        ...(thumbnail && {
          images: [thumbnail],
        }),
      }
    })
  } catch {
    // Supabase not configured yet — sitemap still works with static pages
    videoEntries = []
  }

  return [
    // ── Static pages ──
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // ── Dynamic video pages ──
    ...videoEntries,
  ]
}
