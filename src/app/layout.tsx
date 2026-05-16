import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_LINKS,
} from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',    // prevents invisible text during font load (CWV)
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  // ── Base URL — Next.js uses this to resolve relative URLs in metadata ──
  metadataBase: new URL(SITE_URL),

  // ── Title ──
  // template applies to all child pages; absolute overrides it on the homepage
  title: {
    default:  `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },

  // ── Core meta ──
  description: SITE_DESCRIPTION,
  keywords:    SITE_KEYWORDS,
  authors:     [{ name: SITE_NAME, url: SITE_URL }],
  creator:     SITE_NAME,
  publisher:   SITE_NAME,

  // ── Branding ──
  applicationName: SITE_NAME,
  category:        'Technology',

  // ── Prevent iOS from auto-linking phone numbers in code snippets ──
  formatDetection: { telephone: false, email: false, address: false },

  // ── Robots ──
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-image-preview': 'large',
      'max-snippet':       -1,
      'max-video-preview': -1,    // allow full video preview in search results
    },
  },

  // ── Canonical (default — overridden per-page) ──
  alternates: {
    canonical: SITE_URL,
  },

  // ── Open Graph ──
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url:    '/og-image.png',   // 1200×630 — place in /public/og-image.png
        width:  1200,
        height: 630,
        alt:    `${SITE_NAME} — ${SITE_TAGLINE}`,
        type:   'image/png',
      },
    ],
  },

  // ── Twitter / X Card ──
  twitter: {
    card:        'summary_large_image',
    site:        '@codein4k',
    creator:     '@codein4k',
    title:       `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images:      ['/og-image.png'],
  },

  // ── Icons ──
  icons: {
    icon:      [{ url: '/logo.png', type: 'image/png' }],
    shortcut:  '/logo.png',
    apple:     [{ url: '/logo.png', sizes: '180x180' }],
  },

  // ── Verification ── (add your tokens from Google Search Console / Bing Webmaster)
  verification: {
    google: 'oiqXYe11E5RRcv_7fcHIqxtP2L_-unQRVUC3KfO2oQg',
    other: {'msvalidate.01':['271A03E02C3A0477F2258BA04C9D7FB2']}
    // yandex: 'YOUR_YANDEX_TOKEN',
    // bing:   'YOUR_BING_TOKEN',
  },

  // ── Other ──
  referrer:        'origin-when-cross-origin',
  manifest:        '/manifest.json',   // PWA manifest (optional, improves mobile UX)

  // ── Social profile links (helps Google Knowledge Panel) ──
  // These appear in the <head> and help connect your pages to social profiles
  other: {
    'youtube-channel':   SOCIAL_LINKS.youtube,
    'github-profile':    SOCIAL_LINKS.github,
    'twitter-profile':   SOCIAL_LINKS.twitter,
    'instagram-profile': SOCIAL_LINKS.instagram,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0D1117' },
    { media: '(prefers-color-scheme: light)', color: '#F6F8FF' },
  ],
  width:          'device-width',
  initialScale:   1,
  maximumScale:   5,    // allow zoom for accessibility
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background:   '#1F2937',
                color:        '#F9FAFB',
                border:       '1px solid rgba(19,161,233,0.3)',
                borderRadius: '12px',
                fontSize:     '14px',
              },
              success: { iconTheme: { primary: '#13A1E9', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#E95213', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
