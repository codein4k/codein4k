'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import ImageUpload from '@/components/admin/ImageUpload'
import type { SiteConfig } from '@/lib/site-config'

interface SiteSettingsFormProps {
  config: SiteConfig
}

export default function SiteSettingsForm({ config }: SiteSettingsFormProps) {
  const [form, setForm] = useState<SiteConfig>({ ...config })
  const [saving, setSaving] = useState(false)

  const set = (key: keyof SiteConfig) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to save')
      } else {
        toast.success('Settings saved!')
      }
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Logo */}
      <ImageUpload
        label="Logo"
        value={form.logo_url}
        onChange={set('logo_url')}
      />

      {/* Site name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Site Name</label>
        <Input
          value={form.site_name}
          onChange={(e) => set('site_name')(e.target.value)}
          placeholder="CodeIn4K"
        />
      </div>

      {/* Tagline */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Tagline</label>
        <Input
          value={form.site_tagline}
          onChange={(e) => set('site_tagline')(e.target.value)}
          placeholder="A Powerful Dose of Learning"
        />
      </div>

      {/* Badge text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Hero Badge Text</label>
        <p className="text-xs text-brand-muted">The pill badge under the logo on the homepage.</p>
        <Input
          value={form.hero_badge_text}
          onChange={(e) => set('hero_badge_text')(e.target.value)}
          placeholder="Now Publishing Programming Tutorials"
        />
      </div>

      {/* Hero description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Hero Description</label>
        <p className="text-xs text-brand-muted">The paragraph under the tagline on the homepage.</p>
        <textarea
          value={form.hero_description}
          onChange={(e) => set('hero_description')(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2.5 text-sm placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/60 resize-none"
          placeholder="Deep-dive programming tutorials..."
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-blue/90 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  )
}
