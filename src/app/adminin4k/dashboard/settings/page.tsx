import type { Metadata } from 'next'
import { Settings } from 'lucide-react'
import SiteSettingsForm from '@/components/admin/SiteSettingsForm'
import { getSiteConfig } from '@/lib/site-config'

export const metadata: Metadata = { title: 'Site Settings' }
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const config = await getSiteConfig()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-brand-blue" />
          Site Settings
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          Edit the logo, name, tagline, and hero text shown on your website.
        </p>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 max-w-xl">
        <SiteSettingsForm config={config} />
      </div>
    </div>
  )
}
