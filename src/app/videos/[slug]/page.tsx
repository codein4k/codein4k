import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Youtube, Github, ArrowLeft, Share2, Calendar } from 'lucide-react'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Footer from '@/components/layout/Footer'
import Badge from '@/components/ui/Badge'
import VideoCard from '@/components/videos/VideoCard'
import YouTubeFacade from '@/components/videos/YouTubeFacade'
import JsonLd from '@/components/seo/JsonLd'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { formatDate, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/utils'
import {
  ORGANIZATION_SCHEMA_ID,
  PERSON_SCHEMA_ID,
  SITE_NAME,
  SITE_URL,
  WEBSITE_SCHEMA_ID,
} from '@/lib/constants'
import type { Video } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

// ── Data helpers ──────────────────────────────────────────────────────────────

async function getVideo(slug: string): Promise<Video | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('videos').select('*').eq('slug', slug).single()
  return data
}

async function getRelatedVideos(currentId: string, tags: string[]): Promise<Video[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('videos')
    .select('*')
    .neq('id', currentId)
    .overlaps('tags', tags)
    .limit(3)
  if (data && data.length > 0) return data
  const { data: fallback } = await supabase
    .from('videos')
    .select('*')
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(3)
  return fallback ?? []
}

// ── Metadata (generateMetadata = per-video dynamic SEO) ───────────────────────
// Each video page gets a unique, keyword-rich title + description.
// Google uses these for the search snippet — they're critical for CTR.

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const video = await getVideo(slug)
  if (!video) return { title: 'Not Found' }

  const thumbnail =
    video.thumbnail_url ||
    (video.youtube_url ? getYouTubeThumbnail(video.youtube_url) : null)

  const pageUrl = `${SITE_URL}/videos/${video.slug}`

  // Build a keyword string from video tags + generic terms
  // Tags like ["TypeScript", "Generics"] become "TypeScript tutorial, Generics tutorial, ..."
  const tagKeywords = (video.tags ?? []).flatMap((t) => [
    `${t} tutorial`,
    `learn ${t}`,
    `${t} for developers`,
  ])

  return {
    title:       video.title,
    description: video.description,
    keywords:    [...(video.tags ?? []), ...tagKeywords, 'programming tutorial', SITE_NAME],

    // Canonical — prevents duplicate content when pages are shared/embedded
    alternates: {
      canonical: pageUrl,
    },

    // Open Graph — drives rich link previews in Slack, Twitter, LinkedIn, Discord
    openGraph: {
      type:        'video.other',
      url:          pageUrl,
      title:       `${video.title} | ${SITE_NAME}`,
      description:  video.description,
      siteName:     SITE_NAME,
      images: thumbnail
        ? [{ url: thumbnail, width: 1280, height: 720, alt: video.title }]
        : [],
      videos: video.youtube_url
        ? [{ url: video.youtube_url, type: 'text/html' }]
        : [],
    },

    // Twitter / X Card
    twitter: {
      card:        'summary_large_image',
      site:        '@codein4k',
      creator:     '@codein4k',
      title:       `${video.title} | ${SITE_NAME}`,
      description:  video.description,
      images:       thumbnail ? [thumbnail] : [],
    },
  }
}

// Static params for ISR — pre-renders all video pages at build time
export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data } = await supabase.from('videos').select('slug')
  return (data ?? []).map((v) => ({ slug: v.slug }))
}

export const revalidate = 60

// ── JSON-LD builders ──────────────────────────────────────────────────────────

function buildVideoObjectSchema(video: Video, pageUrl: string, embedUrl: string | null, thumbnail: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type':    'VideoObject',
    '@id':      `${pageUrl}#video`,

    // ── Required by Google for Video rich results ──
    name:         video.title,
    description:  video.description,
    thumbnailUrl: thumbnail,
    uploadDate:   video.published_at,

    // ── Highly recommended ──
    url:          pageUrl,
    embedUrl:     embedUrl,

    // ── Publisher / author — links to Organization + Person schemas ──
    publisher: { '@id': ORGANIZATION_SCHEMA_ID },
    author:    { '@id': PERSON_SCHEMA_ID },

    // ── Educational metadata — helps Google surface in "learn X" queries ──
    inLanguage:           'en-US',
    educationalLevel:     'Intermediate',
    learningResourceType: ['tutorial', 'demonstration'],
    keywords:             (video.tags ?? []).join(', '),
    about: (video.tags ?? []).map((tag) => ({
      '@type': 'Thing',
      name:    tag,
    })),

    // ── Link back to the parent website ──
    isPartOf: { '@id': WEBSITE_SCHEMA_ID },

    // ── Content policy ──
    isFamilyFriendly: true,
    accessMode:       ['visual', 'auditory'],

    // ── Optional: if you add duration to DB later, format as ISO 8601 ──
    // duration: 'PT15M33S',  // e.g. 15 min 33 sec
  }
}

function buildBreadcrumbSchema(video: Video, pageUrl: string) {
  // BreadcrumbList shows the page path directly in Google search results,
  // e.g.: codein4k.com › Videos › Mastering TypeScript Generics
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    '@id':      `${pageUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Videos', item: `${SITE_URL}/videos` },
      { '@type': 'ListItem', position: 3, name: video.title, item: pageUrl },
    ],
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const video = await getVideo(slug)
  if (!video) notFound()

  const related    = await getRelatedVideos(video.id, video.tags ?? [])
  const embedUrl   = video.youtube_url ? getYouTubeEmbedUrl(video.youtube_url)  : null
  const thumbnail  = video.thumbnail_url || (video.youtube_url ? getYouTubeThumbnail(video.youtube_url) : null)
  const pageUrl    = `${SITE_URL}/videos/${video.slug}`
  const shareUrl   = pageUrl

  return (
    <>
      {/* ── Structured data ── */}
      <JsonLd data={buildVideoObjectSchema(video, pageUrl, embedUrl, thumbnail)} />
      <JsonLd data={buildBreadcrumbSchema(video, pageUrl)} />

      <NavbarWrapper />
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb nav — visual version matches the BreadcrumbList schema */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/videos"
              className="flex w-fit items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm text-brand-muted transition-all hover:border-brand-blue/40 hover:text-brand-blue"
            >
              <ArrowLeft className="h-4 w-4" />
              All Videos
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* ── Main content ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Video — uses YouTubeFacade for Core Web Vitals (LCP) */}
              <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-black">
                {embedUrl && thumbnail ? (
                  <YouTubeFacade
                    embedUrl={embedUrl}
                    thumbnail={thumbnail}
                    title={video.title}
                  />
                ) : embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full"
                      loading="lazy"
                    />
                  </div>
                ) : thumbnail ? (
                  <div className="relative aspect-video">
                    <Image
                      src={thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-blue/20 to-brand-orange/20">
                    <Youtube className="h-16 w-16 text-brand-muted/30" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                  {video.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-brand-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={video.published_at}>{formatDate(video.published_at)}</time>
                  </span>
                </div>
              </div>

              {/* Tags — each links to a filtered video search */}
              {video.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
                    <Link key={tag} href={`/videos?tag=${encodeURIComponent(tag)}`}>
                      <Badge variant="blue">{tag}</Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-muted">
                  About this video
                </h2>
                <p className="text-[rgb(var(--foreground))]/80 leading-relaxed whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-4">

              {/* Resources */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-muted">
                  Resources
                </h3>
                <div className="flex flex-col gap-3">
                  {video.youtube_url && (
                    <a
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10 hover:border-red-500/40"
                    >
                      <Youtube className="h-5 w-5" />
                      Watch on YouTube
                    </a>
                  )}
                  {video.github_url && (
                    <a
                      href={video.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--border))]/30 px-4 py-3 text-sm font-medium text-[rgb(var(--foreground))] transition-all hover:bg-[rgb(var(--border))]/60"
                    >
                      <Github className="h-5 w-5" />
                      View Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-muted">
                  Share
                </h3>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(video.title)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter/X"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs text-brand-muted transition-all hover:border-sky-400/40 hover:text-sky-400"
                  >
                    <Share2 className="h-4 w-4" />
                    Share on X
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related Videos ── */}
          {related.length > 0 && (
            <section className="mt-16" aria-label="Related tutorials">
              <h2 className="mb-6 text-2xl font-bold">More Videos</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
