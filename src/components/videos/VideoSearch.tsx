'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { cn } from '@/lib/utils'

interface VideoSearchProps {
  className?: string
}

export default function VideoSearch({ className }: VideoSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const query = searchParams.get('q') ?? ''

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set('q', term)
      } else {
        params.delete('q')
      }
      params.delete('page')
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted transition-colors',
          isPending && 'text-brand-blue animate-pulse'
        )}
      />
      <input
        type="search"
        placeholder="Search videos..."
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] pl-10 pr-9 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/60 placeholder:text-brand-muted/50"
      />
      {query && (
        <button
          onClick={() => handleSearch('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-[rgb(var(--foreground))]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
