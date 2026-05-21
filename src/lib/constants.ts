export const SITE_NAME    = 'CodeIn4K'
export const SITE_TAGLINE = 'A Powerful Dose of Learning'
export const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL || 'https://codein4k.com'

// Keyword-rich description used in meta tags and JSON-LD
export const SITE_DESCRIPTION =
  'Deep-dive programming tutorials covering all major languages — JavaScript, TypeScript, Python, C, C++, C#, ' +
  'Java, Go, Rust, Node.js, and more. From REST APIs, Docker, Git, databases, CSS, and CI/CD to system design ' +
  'and software architecture. Free coding education on YouTube for all levels.'

// Full keyword list — used in <head> and helps crawlers understand topic coverage
export const SITE_KEYWORDS = [
  // ── High-intent tutorial searches ──
  'Node.js tutorial',
  'TypeScript tutorial',
  'TypeScript generics tutorial',
  'Docker tutorial',
  'Docker for developers',
  'REST API tutorial',
  'Express.js tutorial',
  'CSS Grid tutorial',
  'Git tutorial',
  'GitHub workflow tutorial',
  'PostgreSQL tutorial',
  'JavaScript tutorial',
  'Prisma ORM tutorial',
  'WebSockets tutorial',
  'CI/CD tutorial',
  'system design tutorial',
  // ── Category-level searches ──
  'programming tutorials',
  'coding tutorials',
  'web development tutorials',
  'backend development tutorials',
  'frontend development tutorials',
  'DevOps tutorials',
  'software engineering tutorials',
  'full stack development',
  'software architecture tutorials',
  'database tutorials',
  'API development tutorials',
  // ── Platform / brand ──
  'free programming tutorials',
  'programming YouTube channel',
  'learn to code',
  'coding deep dive',
  'production-ready code',
  'CodeIn4K',
]

// Schema.org anchor IDs — used across all JSON-LD graphs for cross-page consistency
export const ORGANIZATION_SCHEMA_ID = `${SITE_URL}/#organization`
export const WEBSITE_SCHEMA_ID      = `${SITE_URL}/#website`
export const PERSON_SCHEMA_ID       = `${SITE_URL}/#person`

export const SOCIAL_LINKS = {
  youtube:   'https://youtube.com/@codein4k',
  github:    'https://github.com/codein4k',
  instagram: 'https://instagram.com/codein4k',
  twitter:   'https://x.com/codein4k',
}

export const ADMIN_COOKIE_NAME    = 'codein4k_admin_session'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

export const VIDEOS_PER_PAGE      = 9
export const LATEST_VIDEOS_COUNT  = 3
