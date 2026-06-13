-- ============================================================================
--  EXECUTIVE PORTFOLIO PLATFORM — SUPABASE SCHEMA
-- ----------------------------------------------------------------------------
--  Run this file once in the Supabase SQL Editor (or via `supabase db push`).
--  It is idempotent: safe to re-run. It creates every table, index, trigger,
--  storage bucket and Row Level Security (RLS) policy the platform needs.
--
--  SECURITY MODEL
--  --------------
--  * Public visitors (anon role) may ONLY read published content and INSERT a
--    contact message. They can never update, delete or upload anything.
--  * Administrators are rows in `public.admins` (keyed by auth.users.id). The
--    helper `public.is_admin()` is used by every write policy.
--  * The service-role key (server-side only) bypasses RLS for trusted server
--    actions; it is never exposed to the browser.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- ADMIN REGISTRY + helper
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  created_at  timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- SECURE ADMIN BOOTSTRAP
-- ----------------------
-- There is deliberately NO "first user becomes admin" trigger: Supabase's
-- sign-up endpoint is public, so that pattern lets anyone who registers first
-- seize admin. Instead, admins are granted explicitly via one of:
--   1. The ADMIN_EMAILS env var — the app upserts a matching, authenticated
--      user into public.admins on login (see src/lib/auth.ts). Secure by
--      default: with ADMIN_EMAILS unset, nobody is auto-granted.
--   2. Manually, once, in this SQL editor after creating your auth user:
--        insert into public.admins (id, email, full_name)
--        select id, email, 'Your Name' from auth.users where email = 'you@example.com'
--        on conflict (id) do nothing;
-- Any clean-up of a legacy auto-promote trigger. Wrapped so that, when the
-- connecting role can't touch auth.users, it is skipped rather than aborting
-- the whole script (statements run in one implicit transaction).
do $$
begin
  begin
    drop trigger if exists on_auth_user_created on auth.users;
  exception when others then
    raise notice 'skipped legacy trigger cleanup: %', sqlerrm;
  end;
end$$;
drop function if exists public.handle_new_user();

-- ---------------------------------------------------------------------------
-- PROFILE (singleton)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id                uuid primary key default gen_random_uuid(),
  full_name         text,
  title             text,
  tagline           text,
  bio               text,
  mission           text,
  executive_summary text,
  philosophy        text,
  career_overview   text,
  email             text,
  phone             text,
  location          text,
  avatar_url        text,
  hero_image_url    text,
  cv_url            text,
  cv_filename       text,
  available         boolean not null default true,
  social_links      jsonb not null default '[]'::jsonb,
  stats             jsonb not null default '[]'::jsonb,
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- EXPERTISE
-- ---------------------------------------------------------------------------
create table if not exists public.expertise (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  icon        text,
  skills      text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CAREER TIMELINE
-- ---------------------------------------------------------------------------
create table if not exists public.timeline (
  id            uuid primary key default gen_random_uuid(),
  role          text not null,
  organization  text,
  location      text,
  start_date    text,
  end_date      text,
  is_current    boolean not null default false,
  description   text,
  achievements  text[] not null default '{}',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PROJECT CATEGORIES + PROJECTS
-- ---------------------------------------------------------------------------
create table if not exists public.project_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  summary       text,
  description   text,
  category_id   uuid references public.project_categories (id) on delete set null,
  cover_image   text,
  gallery       text[] not null default '{}',
  technologies  text[] not null default '{}',
  outcomes      text,
  case_study    text,
  demo_url      text,
  repo_url      text,
  year          text,
  featured      boolean not null default false,
  published     boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- AWARDS
-- ---------------------------------------------------------------------------
create table if not exists public.awards (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  organization  text,
  year          text,
  description   text,
  image_url     text,
  url           text,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CERTIFICATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.certifications (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  issuer          text,
  issue_date      text,
  expiry_date     text,
  credential_id   text,
  credential_url  text,
  image_url       text,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PUBLICATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.publications (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  type            text not null default 'article', -- research | article | whitepaper | technical
  publisher       text,
  authors         text,
  abstract        text,
  url             text,
  pdf_url         text,
  published_date  text,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PATENTS & INTELLECTUAL PROPERTY
-- ---------------------------------------------------------------------------
create table if not exists public.patents (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  patent_number text,
  status        text default 'granted', -- filed | pending | granted
  office        text,
  filing_date   text,
  grant_date    text,
  description   text,
  url           text,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- SPEAKING ENGAGEMENTS
-- ---------------------------------------------------------------------------
create table if not exists public.speaking_engagements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  event         text,
  type          text default 'keynote', -- keynote | workshop | panel | conference
  location      text,
  date          text,
  description   text,
  url           text,
  video_url     text,
  slides_url    text,
  image_url     text,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MEDIA & PRESS
-- ---------------------------------------------------------------------------
create table if not exists public.press (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  outlet      text,
  type        text default 'article', -- article | interview | feature | podcast | video
  date        text,
  excerpt     text,
  url         text,
  image_url   text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MEDIA LIBRARY (professional gallery + uploads)
-- ---------------------------------------------------------------------------
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  description text,
  type        text not null default 'image', -- image | video | document
  url         text not null,
  category    text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TESTIMONIALS
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  title       text,
  company     text,
  quote       text not null,
  avatar_url  text,
  rating      int default 5,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CONTACT MESSAGES
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  is_read     boolean not null default false,
  is_archived boolean not null default false,
  ip_address  text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- SEO SETTINGS (singleton)
-- ---------------------------------------------------------------------------
create table if not exists public.seo_settings (
  id               uuid primary key default gen_random_uuid(),
  meta_title       text,
  meta_description text,
  keywords         text,
  og_image         text,
  og_title         text,
  og_description   text,
  twitter_handle   text,
  canonical_url    text,
  structured_data  jsonb not null default '{}'::jsonb,
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- SITE SETTINGS (singleton) — theme, section visibility & ordering
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id              uuid primary key default gen_random_uuid(),
  site_name       text,
  accent_color    text default '#10b981',
  theme           text default 'dark',
  announcement    text,
  show_announcement boolean not null default false,
  sections        jsonb not null default '[]'::jsonb, -- [{key,label,visible,order}]
  footer_text     text,
  updated_at      timestamptz not null default now()
);

-- ============================================================================
--  TRIGGERS (updated_at)
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'profile','expertise','timeline','projects','awards','certifications',
    'publications','patents','speaking_engagements','press','media',
    'testimonials','seo_settings','site_settings'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at();', t);
  end loop;
end$$;

-- ============================================================================
--  INDEXES
-- ============================================================================
create index if not exists idx_projects_featured on public.projects (featured) where published;
create index if not exists idx_projects_category on public.projects (category_id);
create index if not exists idx_projects_sort on public.projects (sort_order);
create index if not exists idx_contact_unread on public.contact_messages (is_read) where not is_read;
create index if not exists idx_contact_created on public.contact_messages (created_at desc);
create index if not exists idx_media_type on public.media (type);

-- ============================================================================
--  SEED SINGLETONS (only if empty)
-- ============================================================================
insert into public.profile (full_name, title)
  select null, null where not exists (select 1 from public.profile);
insert into public.seo_settings (meta_title)
  select null where not exists (select 1 from public.seo_settings);
insert into public.site_settings (site_name)
  select 'Executive Portfolio' where not exists (select 1 from public.site_settings);

-- ============================================================================
--  ROW LEVEL SECURITY
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'admins','profile','expertise','timeline','project_categories','projects',
    'awards','certifications','publications','patents','speaking_engagements',
    'press','media','testimonials','contact_messages','seo_settings','site_settings'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end$$;

-- Public-readable content tables: anyone may SELECT, only admins may write.
do $$
declare t text;
begin
  foreach t in array array[
    'profile','expertise','timeline','project_categories','projects',
    'awards','certifications','publications','patents','speaking_engagements',
    'press','media','testimonials','seo_settings','site_settings'
  ]
  loop
    execute format('drop policy if exists "public_read_%1$s" on public.%1$s;', t);
    execute format('drop policy if exists "admin_write_%1$s" on public.%1$s;', t);
    execute format(
      'create policy "public_read_%1$s" on public.%1$s
         for select using (true);', t);
    execute format(
      'create policy "admin_write_%1$s" on public.%1$s
         for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end$$;

-- Admins table: only admins may read/manage it.
drop policy if exists "admin_select_admins" on public.admins;
drop policy if exists "admin_manage_admins" on public.admins;
create policy "admin_select_admins" on public.admins
  for select using (public.is_admin());
create policy "admin_manage_admins" on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

-- Contact messages: anyone may INSERT; only admins may read/update/delete.
drop policy if exists "public_insert_contact" on public.contact_messages;
drop policy if exists "admin_read_contact" on public.contact_messages;
drop policy if exists "admin_manage_contact" on public.contact_messages;
create policy "public_insert_contact" on public.contact_messages
  for insert with check (true);
create policy "admin_read_contact" on public.contact_messages
  for select using (public.is_admin());
create policy "admin_manage_contact" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
--  STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('documents', 'documents', true)
  on conflict (id) do nothing;

-- Public read for both buckets; only admins may upload / modify / delete.
do $$
declare b text;
begin
  foreach b in array array['media','documents']
  loop
    execute format('drop policy if exists "public_read_%1$s" on storage.objects;', b);
    execute format('drop policy if exists "admin_write_%1$s" on storage.objects;', b);
    execute format('drop policy if exists "admin_update_%1$s" on storage.objects;', b);
    execute format('drop policy if exists "admin_delete_%1$s" on storage.objects;', b);
    execute format(
      'create policy "public_read_%1$s" on storage.objects
         for select using (bucket_id = %1$L);', b);
    execute format(
      'create policy "admin_write_%1$s" on storage.objects
         for insert with check (bucket_id = %1$L and public.is_admin());', b);
    execute format(
      'create policy "admin_update_%1$s" on storage.objects
         for update using (bucket_id = %1$L and public.is_admin());', b);
    execute format(
      'create policy "admin_delete_%1$s" on storage.objects
         for delete using (bucket_id = %1$L and public.is_admin());', b);
  end loop;
end$$;

-- ============================================================================
--  DONE
-- ============================================================================
