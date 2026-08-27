import { createStaticClient } from '@/lib/supabase/server'

export interface SiteConfig {
  site_name:        string
  site_tagline:     string
  hero_badge_text:  string
  hero_description: string
  logo_url:         string
}

const DEFAULTS: SiteConfig = {
  site_name:        'CodeIn4K',
  site_tagline:     'A Powerful Dose of Learning',
  hero_badge_text:  'Now Publishing Programming Tutorials',
  hero_description: 'Deep-dive programming tutorials, walkthroughs & project builds — crafted for developers who want to go beyond the surface.',
  logo_url:         '/logo.png',
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = createStaticClient()
    const { data } = await supabase.from('site_config').select('key, value')
    if (!data || data.length === 0) return DEFAULTS

    const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
    return {
      site_name:        map.site_name        ?? DEFAULTS.site_name,
      site_tagline:     map.site_tagline     ?? DEFAULTS.site_tagline,
      hero_badge_text:  map.hero_badge_text  ?? DEFAULTS.hero_badge_text,
      hero_description: map.hero_description ?? DEFAULTS.hero_description,
      logo_url:         map.logo_url         ?? DEFAULTS.logo_url,
    }
  } catch {
    return DEFAULTS
  }
}
