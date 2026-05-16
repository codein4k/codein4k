-- ============================================================
-- CodeIn4K — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- VIDEOS TABLE
-- ============================================================
create table if not exists public.videos (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  description   text not null default '',
  thumbnail_url text,
  youtube_url   text,
  github_url    text,
  tags          text[] not null default '{}',
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists videos_published_at_idx on public.videos (published_at desc);
create index if not exists videos_slug_idx on public.videos (slug);
create index if not exists videos_tags_idx on public.videos using gin (tags);

-- Full-text search index
create index if not exists videos_search_idx on public.videos
  using gin (to_tsvector('english', title || ' ' || description));

-- ============================================================
-- PRODUCTION STATUS TABLE
-- Only one active row is shown on the homepage at a time
-- ============================================================
create table if not exists public.production_status (
  id                  uuid primary key default uuid_generate_v4(),
  video_title         text not null,
  video_description   text not null default '',
  thumbnail_url       text,
  current_step        text not null default 'research'
                        check (current_step in (
                          'research',
                          'script_writing',
                          'recording',
                          'editing',
                          'thumbnail_design',
                          'publishing'
                        )),
  is_active           boolean not null default true,
  updated_at          timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger videos_updated_at
  before update on public.videos
  for each row execute procedure public.handle_updated_at();

create or replace trigger production_status_updated_at
  before update on public.production_status
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on both tables
alter table public.videos enable row level security;
alter table public.production_status enable row level security;

-- PUBLIC: anyone can read videos and production_status
create policy "Public can read videos"
  on public.videos for select
  using (true);

create policy "Public can read production_status"
  on public.production_status for select
  using (true);

-- SERVICE ROLE: full access (used by admin API routes via service role key)
-- The service role bypasses RLS by default in Supabase,
-- so no additional policies are needed for authenticated inserts/updates/deletes
-- when using the service role key.

-- ============================================================
-- STORAGE BUCKET FOR THUMBNAILS
-- ============================================================

-- Create a public bucket for thumbnails
-- Run this separately or via the Supabase dashboard:
--
-- insert into storage.buckets (id, name, public)
-- values ('thumbnails', 'thumbnails', true);
--
-- create policy "Public read thumbnails"
--   on storage.objects for select
--   using (bucket_id = 'thumbnails');
--
-- create policy "Service role can upload thumbnails"
--   on storage.objects for insert
--   with check (bucket_id = 'thumbnails');

-- ============================================================
-- SEED DATA (optional — remove for production)
-- ============================================================

-- Sample video
insert into public.videos (
  title, slug, description, youtube_url, github_url, tags, published_at
) values (
  'Getting Started with Next.js 15 App Router',
  'getting-started-nextjs-15-app-router',
  'A complete walkthrough of Next.js 15 App Router. We cover layouts, Server Components, data fetching patterns, and how to ship a production-ready app from scratch.',
  'https://youtube.com/@codein4k',
  'https://github.com/codein4k',
  array['Next.js', 'React', 'Tutorial'],
  now()
) on conflict (slug) do nothing;

-- Sample production status
insert into public.production_status (
  video_title, video_description, current_step, is_active
) values (
  'Building a Full-Stack SaaS with Supabase',
  'End-to-end tutorial: auth, database, storage, and deployment — all in one video.',
  'editing',
  true
) on conflict do nothing;
