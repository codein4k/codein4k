'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Layers } from 'lucide-react'
import type { Video } from '@/types'
import VideoCard from '@/components/videos/VideoCard'
import Button from '@/components/ui/Button'

interface LatestVideosProps {
  videos: Video[]
}

export default function LatestVideos({ videos }: LatestVideosProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-20 bg-[rgb(var(--background))]" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
              <Layers className="h-3 w-3" />
              Latest Content
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">Recent Videos</h2>
            <p className="mt-1 text-brand-muted">Fresh tutorials added regularly.</p>
          </div>
          <Link href="/videos">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              View All
            </Button>
          </Link>
        </motion.div>

        {/* Grid */}
        {videos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] py-20 text-brand-muted"
          >
            <Layers className="h-10 w-10 opacity-30" />
            <p>No videos published yet — check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
