'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Clapperboard, CheckCircle2, Circle, Zap, BadgeCheck, Youtube } from 'lucide-react'
import { type ProductionStatus, PRODUCTION_STEPS } from '@/types'
import { getProgressPercentage } from '@/lib/utils'

interface ProductionCardProps {
  production: ProductionStatus | null
}

const STEP_ICONS: Record<string, string> = {
  research: '🔍',
  script_writing: '✍️',
  recording: '🎬',
  editing: '✂️',
  thumbnail_design: '🎨',
  publishing: '🚀',
  published: '✅',
}

export default function ProductionCard({ production }: ProductionCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  if (!production || !production.is_active) return null

  const isPublished = production.current_step === 'published'
  const progress = isPublished ? 100 : getProgressPercentage(production.current_step)
  const currentStepObj = PRODUCTION_STEPS.find(
    (s) => s.key === production.current_step
  )

  return (
    <section className="relative overflow-hidden py-20">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${isPublished ? 'from-emerald-500/5 via-transparent to-emerald-500/5' : 'from-brand-blue/5 via-transparent to-brand-orange/5'}`} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-center text-center"
        >
          {isPublished ? (
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <BadgeCheck className="h-3.5 w-3.5" />
              Published on YouTube
            </span>
          ) : (
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-1.5 text-sm font-medium text-brand-orange">
              <Zap className="h-3.5 w-3.5" />
              Currently In Production
            </span>
          )}
          <h2 className="text-3xl font-bold sm:text-4xl">
            {isPublished ? 'Latest Release' : "What I'm Working On"}
          </h2>
          <p className="mt-2 text-brand-muted">
            {isPublished
              ? 'The latest video is live — go watch it!'
              : "Peek behind the scenes — here's what's coming next."}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl"
        >
          <div className="group relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-card-dark">
            {/* Top glow */}
            <div className={`absolute inset-x-0 top-0 h-px opacity-60 ${isPublished ? 'bg-emerald-400' : 'bg-gradient-brand'}`} />

            <div className="flex flex-col gap-0 sm:flex-row">
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden sm:aspect-auto sm:w-56 sm:shrink-0">
                {production.thumbnail_url ? (
                  <Image
                    src={production.thumbnail_url}
                    alt={production.video_title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[140px] w-full items-center justify-center bg-gradient-to-br from-brand-blue/20 to-brand-orange/20">
                    <Clapperboard className="h-12 w-12 text-brand-muted/50" />
                  </div>
                )}
                {/* Overlay badge */}
                <div className={`absolute right-2 top-2 rounded-lg px-2 py-1 text-xs font-medium text-white backdrop-blur-sm ${isPublished ? 'bg-emerald-600/80' : 'bg-black/60'}`}>
                  {isPublished ? '✅ Live' : `${progress}% Done`}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h3 className="text-lg font-bold leading-tight">{production.video_title}</h3>
                  {production.video_description && (
                    <p className="mt-1.5 text-sm text-brand-muted leading-relaxed">
                      {production.video_description}
                    </p>
                  )}
                </div>

                {/* Current step badge */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {STEP_ICONS[production.current_step] ?? '📌'}
                  </span>
                  <div>
                    <p className="text-xs text-brand-muted">Current stage</p>
                    <p className={`text-sm font-semibold ${isPublished ? 'text-emerald-400' : 'text-brand-blue'}`}>
                      {currentStepObj?.label}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-brand-muted">
                    <span>Overall progress</span>
                    <span className={`font-semibold ${isPublished ? 'text-emerald-400' : 'text-brand-blue'}`}>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${progress}%` } : { width: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      className={`h-full rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-gradient-brand'}`}
                    />
                  </div>
                </div>

                {/* Watch button — shown only when published and URL exists */}
                {isPublished && production.youtube_url && (
                  <a
                    href={production.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg active:scale-[0.98]"
                  >
                    <Youtube className="h-4 w-4" />
                    Watch on YouTube
                  </a>
                )}
              </div>
            </div>

            {/* Steps pipeline */}
            <div className="border-t border-[rgb(var(--border))] px-6 pb-4 pt-5">
              {(() => {
                const currentIndex = PRODUCTION_STEPS.findIndex(
                  (s) => s.key === production.current_step
                )
                return (
                  <>
                    {/* Row 1: nodes + connector lines only — always perfectly level */}
                    <div className="flex items-center">
                      {PRODUCTION_STEPS.map((step, index) => {
                        const isDone = index < currentIndex
                        const isActive = index === currentIndex
                        const isDoneOrActive = isDone || isActive
                        const lineColor = isPublished
                          ? 'bg-emerald-500/60'
                          : 'bg-brand-blue/60'

                        return (
                          <div key={step.key} className="flex flex-1 items-center">
                            {/* Left connector */}
                            {index !== 0 && (
                              <div
                                className={`h-0.5 flex-1 transition-colors duration-500 ${
                                  isDoneOrActive ? lineColor : 'bg-[rgb(var(--border))]'
                                }`}
                              />
                            )}

                            {/* Node */}
                            <div className="relative shrink-0">
                              {(isDone || (isPublished && isActive)) && (
                                <CheckCircle2
                                  className={`h-5 w-5 ${
                                    isPublished ? 'text-emerald-400' : 'text-brand-blue'
                                  }`}
                                />
                              )}
                              {isActive && !isPublished && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="relative"
                                >
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange">
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                  </div>
                                  <div className="absolute inset-0 animate-ping rounded-full bg-brand-orange opacity-30" />
                                </motion.div>
                              )}
                              {!isDone && !(isActive) && (
                                <Circle className="h-5 w-5 text-[rgb(var(--border))]" />
                              )}
                            </div>

                            {/* Right connector */}
                            {index !== PRODUCTION_STEPS.length - 1 && (
                              <div
                                className={`h-0.5 flex-1 transition-colors duration-500 ${
                                  isDone ? lineColor : 'bg-[rgb(var(--border))]'
                                }`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Row 2: labels only — free to wrap without touching the line row */}
                    <div className="mt-2 flex">
                      {PRODUCTION_STEPS.map((step, index) => {
                        const isDone = index < currentIndex
                        const isActive = index === currentIndex
                        return (
                          <div
                            key={step.key}
                            className="flex flex-1 justify-center"
                          >
                            <span
                              className={`text-center text-[10px] font-medium leading-tight ${
                                isActive && !isPublished
                                  ? 'text-brand-orange'
                                  : isDone || (isPublished && isActive)
                                  ? isPublished
                                    ? 'text-emerald-400'
                                    : 'text-brand-blue'
                                  : 'text-brand-muted/50'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
