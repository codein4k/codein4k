'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { Tag } from 'lucide-react'

interface VideoFiltersProps {
  tags: string[]
}

export default function VideoFilters({ tags }: VideoFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeTag = searchParams.get('tag') ?? ''

  const setTag = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (tag) {
        params.set('tag', tag)
      } else {
        params.delete('tag')
      }
      params.delete('page')
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams]
  )

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="h-4 w-4 text-brand-muted shrink-0" />
      <button
        onClick={() => setTag('')}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200',
          activeTag === ''
            ? 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue'
            : 'border-[rgb(var(--border))] text-brand-muted hover:border-brand-blue/30 hover:text-brand-blue'
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setTag(tag)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200',
            activeTag === tag
              ? 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue'
              : 'border-[rgb(var(--border))] text-brand-muted hover:border-brand-blue/30 hover:text-brand-blue'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
