'use client'

// YouTubeFacade — click-to-load YouTube embed.
//
// WHY: Loading a YouTube iframe immediately injects ~500 KB of third-party JS,
// kills Largest Contentful Paint (LCP), and tanks Core Web Vitals scores.
// This component renders a thumbnail image instead (fast, LCP-friendly),
// then swaps in the real iframe only when the user clicks play.
//
// Result: typically +15-30 points on PageSpeed Insights.

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface YouTubeFacadeProps {
  embedUrl: string    // e.g. https://www.youtube.com/embed/VIDEO_ID
  thumbnail: string   // full URL to preview image
  title: string       // used for aria-label + iframe title
}

export default function YouTubeFacade({ embedUrl, thumbnail, title }: YouTubeFacadeProps) {
  const [activated, setActivated] = useState(false)

  if (activated) {
    return (
      <div className="aspect-video w-full">
        <iframe
          // autoplay=1 starts the video immediately after user clicks
          src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden bg-black"
      onClick={() => setActivated(true)}
      aria-label={`Play: ${title}`}
    >
      {/* Thumbnail — Next.js Image for optimal loading & LCP */}
      <Image
        src={thumbnail}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
        priority
      />

      {/* Scrim */}
      <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/40" />

      {/* YouTube-style play button */}
      <div
        aria-hidden="true"
        className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-red-600 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500"
      >
        <Play className="h-8 w-8 text-white" fill="white" style={{ marginLeft: 4 }} />
      </div>

      {/* "Click to play" hint — fades in on hover */}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-4 py-1.5 text-xs font-medium text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        Click to play
      </span>
    </button>
  )
}
