'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Youtube, Github, ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { type Video } from '@/types'
import Badge from '@/components/ui/Badge'
import { formatDate, truncate, getYouTubeThumbnail } from '@/lib/utils'

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbnail =
    video.thumbnail_url ||
    (video.youtube_url ? getYouTubeThumbnail(video.youtube_url) : null)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-card-light dark:shadow-card-dark transition-shadow duration-300 hover:shadow-glow-blue"
    >
      {/* Thumbnail */}
      <Link href={`/videos/${video.slug}`} className="relative block aspect-video overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-blue/20 to-brand-orange/20">
            <Youtube className="h-10 w-10 text-brand-muted/40" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
          <div className="flex h-12 w-12 scale-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-100">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
        </div>
        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {video.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {video.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/videos/${video.slug}`}>
          <h3 className="font-bold leading-tight text-[rgb(var(--foreground))] transition-colors hover:text-brand-blue line-clamp-2">
            {video.title}
          </h3>
        </Link>

        {/* Description */}
        {video.description && (
          <p className="flex-1 text-sm text-brand-muted leading-relaxed line-clamp-2">
            {truncate(video.description, 120)}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-brand-muted/60">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(video.published_at)}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {video.youtube_url && (
            <a
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500/10 hover:border-red-500/40"
            >
              <Youtube className="h-3.5 w-3.5" />
              Watch
            </a>
          )}
          {video.github_url && (
            <a
              href={video.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--border))]/30 px-3 py-1.5 text-xs font-medium text-brand-muted transition-all hover:bg-[rgb(var(--border))]/60 hover:text-[rgb(var(--foreground))]"
            >
              <Github className="h-3.5 w-3.5" />
              Code
            </a>
          )}
          <Link
            href={`/videos/${video.slug}`}
            className="ml-auto flex items-center gap-1 text-xs text-brand-blue hover:underline"
          >
            Details <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
