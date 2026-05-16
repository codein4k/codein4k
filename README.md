# CodeIn4K — "A Powerful Dose of Learning"

Production-ready website for the **CodeIn4K** YouTube channel.
Built with **Next.js 15 App Router**, **TypeScript**, **Supabase**, and **Tailwind CSS**.
Deployed on **Vercel**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Local Development](#local-development)
5. [Supabase Setup](#supabase-setup)
6. [Environment Variables](#environment-variables)
7. [Vercel Deployment](#vercel-deployment)
8. [Admin Panel](#admin-panel)
9. [Security](#security)
10. [Performance](#performance)
11. [Customization](#customization)

---

## Project Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, Production card, Latest videos |
| Videos | `/videos` | All videos with search, filter, pagination |
| Video Detail | `/videos/[slug]` | Embed, description, related videos |
| Admin Login | `/adminin4k` | Password-protected login |
| Admin Dashboard | `/adminin4k/dashboard` | Stats + quick actions |
| Admin Videos | `/adminin4k/dashboard/videos` | Create / edit / delete videos |
| Admin Production | `/adminin4k/dashboard/production` | Update homepage production card |
| 404 | `*` | Custom not-found page |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, RSC)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Database / Auth**: Supabase (PostgreSQL + Storage)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Auth tokens**: `jose` (JWT, HTTP-only cookies)
- **Deployment**: Vercel

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, ThemeProvider, Toaster
│   ├── page.tsx                # Home page
│   ├── globals.css
│   ├── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── videos/
│   │   ├── page.tsx            # All videos
│   │   └── [slug]/page.tsx     # Video detail
│   ├── adminin4k/
│   │   ├── page.tsx            # Login
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx      # Sidebar layout
│   │       ├── page.tsx        # Overview
│   │       ├── videos/page.tsx
│   │       └── production/page.tsx
│   └── api/
│       ├── admin/login/route.ts
│       ├── admin/logout/route.ts
│       └── revalidate/route.ts
├── components/
│   ├── layout/   Navbar, Footer
│   ├── ui/       Button, Badge, Input, Modal, Skeleton, ThemeToggle
│   ├── home/     HeroSection, ProductionCard, LatestVideos
│   ├── videos/   VideoCard, VideoGrid, VideoSearch, VideoFilters
│   └── admin/    AdminNav, VideoForm, ProductionForm, VideoTable
├── lib/
│   ├── supabase/ client.ts, server.ts
│   ├── utils.ts
│   └── constants.ts
├── types/index.ts
└── middleware.ts               # Admin route protection
```

---

## Local Development

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- A Supabase project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/codein4k/codein4k-website
cd codein4k-website
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Fill in all values (see [Environment Variables](#environment-variables)).

### 3. Set Up Supabase

See [Supabase Setup](#supabase-setup).

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel: [http://localhost:3000/adminin4k](http://localhost:3000/adminin4k)

---

## Supabase Setup

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, password, and region
3. Wait for the project to provision (~1 min)

### Step 2 — Run the Schema

1. Open **SQL Editor** in your Supabase dashboard
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

This creates:
- `videos` table with full-text search and tag indexes
- `production_status` table
- `updated_at` auto-update triggers
- RLS policies (public read)

### Step 3 — Create Storage Bucket (optional, for image uploads)

In your Supabase dashboard → **Storage** → **New bucket**:
- Name: `thumbnails`
- Public: ✅ enabled

Or run in SQL Editor:
```sql
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true);

create policy "Public read thumbnails"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

create policy "Service role can upload thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'thumbnails');
```

### Step 4 — Get Your Keys

Dashboard → **Settings** → **API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**keep secret**)

---

## Environment Variables

Create `.env.local` from `.env.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # NEVER expose publicly

# Admin panel
ADMIN_PASSWORD=choose-a-strong-password-here
ADMIN_JWT_SECRET=at-least-32-random-characters-here

# Site URL (no trailing slash)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# On-demand revalidation (optional)
REVALIDATION_SECRET=another-random-secret
```

Generate secrets:
```bash
# Admin JWT secret (32+ chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Vercel Deployment

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/codein4k
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)

### Step 3 — Add Environment Variables

In Vercel project → **Settings** → **Environment Variables**, add all variables from `.env.example`:

| Variable | Environment |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview |
| `ADMIN_PASSWORD` | Production |
| `ADMIN_JWT_SECRET` | Production |
| `NEXT_PUBLIC_SITE_URL` | Production → `https://www.codein4k.com` |
| `REVALIDATION_SECRET` | Production |

### Step 4 — Custom Domain

Vercel → **Domains** → Add `codein4k.com` + `www.codein4k.com`

Update your DNS registrar:
```
A     @       76.76.21.21
CNAME www     cname.vercel-dns.com
```

### Step 5 — Deploy

Click **Deploy** — Vercel auto-deploys on every push to `main`.

---

## Admin Panel

**URL**: `https://www.codein4k.com/adminin4k`

The admin route is:
- Hidden from all public navigation
- Excluded from `sitemap.xml` and `robots.txt`
- Protected by `src/middleware.ts` (JWT verification on every request)
- Session stored as an HTTP-only, `SameSite=strict`, `Secure` cookie

### What you can do

| Section | Actions |
|---------|---------|
| Videos | Create, Edit, Delete, view links |
| Production | Set title, description, thumbnail, step, toggle visibility |

### Production Steps

The production pipeline has 6 stages. Setting the current step
auto-calculates the progress percentage shown on the homepage:

| Step | % Complete |
|------|-----------|
| Research | 17% |
| Script Writing | 33% |
| Recording | 50% |
| Editing | 67% |
| Thumbnail Design | 83% |
| Publishing | 100% |

---

## Security

| Concern | Implementation |
|---------|---------------|
| Admin auth | JWT signed with `ADMIN_JWT_SECRET`, 8h expiry |
| Cookie | `httpOnly`, `Secure`, `SameSite=strict` |
| Route protection | Next.js middleware on `/adminin4k/*` |
| Admin hidden | Not linked anywhere, excluded from sitemap/robots |
| RLS | Supabase Row Level Security — public read only |
| Service role key | Server-side only, never exposed to client |
| HTTP headers | X-Frame-Options, X-Content-Type-Options, HSTS, etc. |
| Input validation | Zod schemas on all forms |
| Brute-force mitigation | 400ms delay on wrong password |

### Additional Recommendations

- Enable **2FA** on your Supabase account
- Rotate `ADMIN_PASSWORD` and `ADMIN_JWT_SECRET` periodically
- Add **rate limiting** via Vercel Edge middleware or Upstash Ratelimit for `/api/admin/login`
- Consider adding IP allowlisting for `/adminin4k` in production

---

## Performance

- **ISR**: Pages revalidate every 60 seconds (`export const revalidate = 60`)
- **Image optimization**: Next.js `<Image>` with remote pattern config
- **Code splitting**: Automatic via App Router
- **Server Components**: All data-fetching pages are RSC by default
- **Client Components**: Only where interactivity is needed (`'use client'`)
- **Lazy loading**: Images load with `loading="lazy"` by default

Target Lighthouse scores: **95+ Performance, 100 Accessibility, 100 SEO**

---

## Customization

### Change Brand Colors

Edit `tailwind.config.ts` → `theme.extend.colors.brand`:

```ts
brand: {
  blue:   '#13A1E9',   // primary
  orange: '#E95213',   // accent
  dark:   '#272D2D',
  light:  '#F6F8FF',
  muted:  '#8F9396',
}
```

### Replace Logo

Replace `public/logo.png` with your logo (recommended: 200×200px PNG with transparent background).
Also replace `public/favicon.ico` and `public/og-image.png` (1200×630px).

### Update Social Links

Edit `src/lib/constants.ts` → `SOCIAL_LINKS`.

### Add New Production Steps

Edit `src/types/index.ts` → `PRODUCTION_STEPS` array, then update the SQL schema `check` constraint in `supabase/schema.sql`.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm run format   # Prettier
```

---

## License

MIT © CodeIn4K
