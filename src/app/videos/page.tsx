import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VideoGrid from '@/components/videos/VideoGrid'
import VideoSearch from '@/components/videos/VideoSearch'
import VideoFilters from '@/components/videos/VideoFilters'
import { createClient } from '@/lib/supabase/server'
import { VIDEOS_PER_PAGE } from '@/lib/constants'
import { ChevronLeft, ChevronRight, PlaySquare } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Browse all CodeIn4K programming tutorials, walkthroughs, and deep dives.',
}

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>
}

async function getVideos(q: string, tag: string, page: number) {
  const supabase = await createClient()
  const from = (page - 1) * VIDEOS_PER_PAGE
  const to = from + VIDEOS_PER_PAGE - 1

  let query = supabase
    .from('videos')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data, count } = await query.range(from, to)

  // All tags for filter chips
  const { data: allVideos } = await supabase.from('videos').select('tags')
  const allTags = Array.from(
    new Set((allVideos ?? []).flatMap((v) => v.tags ?? []))
  ).sort()

  return {
    videos: data ?? [],
    total: count ?? 0,
    tags: allTags,
    totalPages: Math.ceil((count ?? 0) / VIDEOS_PER_PAGE),
  }
}

export default async function VideosPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const q = sp.q ?? ''
  const tag = sp.tag ?? ''
  const page = Math.max(1, parseInt(sp.page ?? '1', 10))

  const { videos, total, tags, totalPages } = await getVideos(q, tag, page)

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (tag) params.set('tag', tag)
    if (p > 1) params.set('page', String(p))
    const s = params.toString()
    return `/videos${s ? `?${s}` : ''}`
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Page Header */}
        <div className="relative border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-30 dark:opacity-60" />
          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <PlaySquare className="h-6 w-6 text-brand-blue" />
              <span className="text-sm font-medium text-brand-blue">All Videos</span>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Video Library
            </h1>
            <p className="mt-2 text-brand-muted text-lg">
              {total} tutorial{total !== 1 ? 's' : ''} and counting.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="mb-8 flex flex-col gap-4">
            <Suspense>
              <VideoSearch className="max-w-md" />
              <VideoFilters tags={tags} />
            </Suspense>
          </div>

          {/* Grid */}
          <VideoGrid videos={videos} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link
                href={buildHref(page - 1)}
                aria-disabled={page <= 1}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-brand-muted transition-all hover:border-brand-blue/40 hover:text-brand-blue',
                  page <= 1 && 'pointer-events-none opacity-30'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildHref(p)}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition-all',
                    p === page
                      ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                      : 'border-[rgb(var(--border))] text-brand-muted hover:border-brand-blue/40 hover:text-brand-blue'
                  )}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={buildHref(page + 1)}
                aria-disabled={page >= totalPages}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-brand-muted transition-all hover:border-brand-blue/40 hover:text-brand-blue',
                  page >= totalPages && 'pointer-events-none opacity-30'
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
