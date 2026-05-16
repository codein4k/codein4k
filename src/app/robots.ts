import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Default: allow all crawlers ──
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/adminin4k/',   // admin panel
          '/adminin4k',
          '/api/',         // API routes — not useful to index
        ],
      },

      // ── Allow major search engines explicitly ──
      { userAgent: 'Googlebot',      allow: '/' },
      { userAgent: 'Bingbot',        allow: '/' },
      { userAgent: 'Slurp',          allow: '/' }, // Yahoo
      { userAgent: 'DuckDuckBot',    allow: '/' },
      { userAgent: 'Baiduspider',    allow: '/' },

      // ── Block AI training scrapers ──
      // These bots scrape content for LLM training without providing traffic.
      // Blocking them is standard practice as of 2024.
      { userAgent: 'GPTBot',         disallow: '/' },
      { userAgent: 'ChatGPT-User',   disallow: '/' },
      { userAgent: 'CCBot',          disallow: '/' },
      { userAgent: 'anthropic-ai',   disallow: '/' },
      { userAgent: 'Claude-Web',     disallow: '/' },
      { userAgent: 'cohere-ai',      disallow: '/' },
      { userAgent: 'Omgilibot',      disallow: '/' },
      { userAgent: 'FacebookBot',    disallow: '/' },
      { userAgent: 'ia_archiver',    disallow: '/' }, // Wayback Machine scraper
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
