import type { Metadata } from 'next'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import ProductionCard from '@/components/home/ProductionCard'
import LatestVideos from '@/components/home/LatestVideos'
import JsonLd from '@/components/seo/JsonLd'
import { createClient } from '@/lib/supabase/server'
import { getSiteConfig } from '@/lib/site-config'
import {
  LATEST_VIDEOS_COUNT,
  ORGANIZATION_SCHEMA_ID,
  PERSON_SCHEMA_ID,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_LINKS,
  WEBSITE_SCHEMA_ID,
} from '@/lib/constants'

// Override the root template — homepage gets a fully custom, keyword-rich title
export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Programming Tutorials | Node.js, TypeScript, Docker & More`,
  },
  description: SITE_DESCRIPTION,
  keywords:    SITE_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url:         SITE_URL,
    title:       `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
}

export const revalidate = 60

async function getHomeData() {
  try {
    const supabase = await createClient()
    const [videosResult, productionResult] = await Promise.all([
      supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(LATEST_VIDEOS_COUNT),
      supabase
        .from('production_status')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])
    return {
      videos:     videosResult.data ?? [],
      production: productionResult.data ?? null,
    }
  } catch {
    return { videos: [], production: null }
  }
}

// ── JSON-LD Schemas ─────────────────────────────────────────
// Three interconnected schemas that Google uses to understand the site.

function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':       WEBSITE_SCHEMA_ID,
    name:        SITE_NAME,
    url:         SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage:  'en-US',
    publisher: { '@id': ORGANIZATION_SCHEMA_ID },
    // SearchAction enables the Sitelinks Searchbox in Google results.
    // When users search "codein4k docker", Google may show a search box
    // pointing directly to your videos page.
    potentialAction: {
      '@type':     'SearchAction',
      target: {
        '@type':      'EntryPoint',
        urlTemplate: `${SITE_URL}/videos?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

function buildOrganizationSchema() {
  return {
    '@context':   'https://schema.org',
    '@type':      'Organization',
    '@id':         ORGANIZATION_SCHEMA_ID,
    name:          SITE_NAME,
    url:           SITE_URL,
    description:   SITE_DESCRIPTION,
    logo: {
      '@type':     'ImageObject',
      url:         `${SITE_URL}/logo.png`,
      width:       512,
      height:      512,
      caption:     `${SITE_NAME} Logo`,
    },
    image: `${SITE_URL}/og-image.png`,
    // sameAs links all your social profiles so Google can associate them
    // with this site — critical for the Knowledge Panel
    sameAs: [
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.github,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.instagram,
    ],
    foundingDate: '2024',
    knowsAbout: [
      'Programming', 'Software Development', 'Web Development',
      'Node.js', 'TypeScript', 'Docker', 'REST APIs', 'CSS',
      'Git', 'PostgreSQL', 'DevOps', 'System Design', 'CI/CD',
    ],
  }
}

function buildPersonSchema() {
  // Person schema for the channel creator — connects content authorship
  // to a specific person which improves E-E-A-T signals for Google.
  return {
    '@context':  'https://schema.org',
    '@type':     'Person',
    '@id':        PERSON_SCHEMA_ID,
    name:         SITE_NAME,
    url:          SITE_URL,
    jobTitle:     'Programming Educator',
    description:   `Creator of ${SITE_NAME} — producing in-depth programming tutorials on YouTube.`,
    sameAs: [
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.github,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.instagram,
    ],
    worksFor: { '@id': ORGANIZATION_SCHEMA_ID },
    knowsAbout: [
      'Node.js', 'TypeScript', 'Docker', 'REST APIs', 'CSS Grid',
      'Git', 'PostgreSQL', 'WebSockets', 'System Design', 'DevOps',
      'Software Architecture', 'CI/CD',
    ],
  }
}

// ── Page ────────────────────────────────────────────────────

export default async function HomePage() {
  const [{ videos, production }, config] = await Promise.all([
    getHomeData(),
    getSiteConfig(),
  ])

  return (
    <>
      {/* Structured data — placed early in <body> for fast indexing */}
      <JsonLd data={buildWebSiteSchema()} />
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildPersonSchema()} />

      <NavbarWrapper />
      <main>
        <HeroSection config={config} />
        <ProductionCard production={production} />
        <LatestVideos videos={videos} />
      </main>
      <Footer />
    </>
  )
}
