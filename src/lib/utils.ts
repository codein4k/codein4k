import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PRODUCTION_STEPS, type ProductionStep } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProgressPercentage(currentStep: ProductionStep): number {
  const step = PRODUCTION_STEPS.find((s) => s.key === currentStep)
  if (!step) return 0
  return Math.round((step.step / PRODUCTION_STEPS.length) * 100)
}

export function getStepLabel(currentStep: ProductionStep): string {
  return PRODUCTION_STEPS.find((s) => s.key === currentStep)?.label ?? ''
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (!match) return null
  return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (!match) return null
  return `https://www.youtube.com/embed/${match[1]}`
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '...'
}
