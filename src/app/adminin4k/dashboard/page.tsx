import type { Metadata } from 'next'
import Link from 'next/link'
import { Video, Clapperboard, ArrowRight, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Dashboard' }

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: videoCount }, { data: production }] = await Promise.all([
    supabase.from('videos').select('*', { count: 'exact', head: true }),
    supabase
      .from('production_status')
      .select('video_title, current_step, is_active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const stats = [
    {
      label: 'Total Videos',
      value: videoCount ?? 0,
      icon: Video,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10',
      href: '/adminin4k/dashboard/videos',
    },
    {
      label: 'In Production',
      value: production?.is_active ? '1 Active' : 'None',
      icon: Clapperboard,
      color: 'text-brand-orange',
      bg: 'bg-brand-orange/10',
      href: '/adminin4k/dashboard/production',
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">
          Manage your CodeIn4K content from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 transition-all hover:border-brand-blue/30 hover:shadow-glow-blue">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-brand-muted">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-brand-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-muted flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/adminin4k/dashboard/videos"
            className="flex items-center gap-2 rounded-xl border border-brand-blue/30 bg-brand-blue/5 px-4 py-2.5 text-sm font-medium text-brand-blue transition-all hover:bg-brand-blue/10"
          >
            <Video className="h-4 w-4" />
            Manage Videos
          </Link>
          <Link
            href="/adminin4k/dashboard/production"
            className="flex items-center gap-2 rounded-xl border border-brand-orange/30 bg-brand-orange/5 px-4 py-2.5 text-sm font-medium text-brand-orange transition-all hover:bg-brand-orange/10"
          >
            <Clapperboard className="h-4 w-4" />
            Update Production
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--border))]/30 px-4 py-2.5 text-sm font-medium text-brand-muted transition-all hover:text-[rgb(var(--foreground))]"
          >
            <ArrowRight className="h-4 w-4" />
            View Site
          </Link>
        </div>
      </div>

      {/* Current production */}
      {production && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="mb-1 text-sm font-semibold text-brand-orange">
            Current Production
          </h2>
          <p className="font-medium">{production.video_title}</p>
          <p className="text-sm text-brand-muted capitalize mt-0.5">
            Step: {production.current_step.replace('_', ' ')} •{' '}
            {production.is_active ? 'Visible on homepage' : 'Hidden from homepage'}
          </p>
        </div>
      )}
    </div>
  )
}
