'use client'

import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import type { Video } from '@/types'
import VideoCard from './VideoCard'
import { VideoCardSkeleton } from '@/components/ui/Skeleton'

interface VideoGridProps {
  videos: Video[]
  loading?: boolean
}

export default function VideoGrid({ videos, loading = false }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] py-24 text-center"
      >
        <Layers className="h-12 w-12 text-brand-muted/20" />
        <div>
          <p className="text-lg font-semibold text-[rgb(var(--foreground))]">
            No videos found
          </p>
          <p className="text-sm text-brand-muted">
            Try adjusting your search or filter
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, i) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
        >
          <VideoCard video={video} />
        </motion.div>
      ))}
    </div>
  )
}
