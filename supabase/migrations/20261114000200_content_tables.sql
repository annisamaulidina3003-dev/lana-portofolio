-- =============================================================================
-- 02 · TABEL KONTEN — profiles, projects, skills, experiences, certificates,
--                     testimonials, blog
-- Semua: PK uuid, created_at/updated_at (timestamptz), is_published (default
-- false → draf sampai admin menerbitkan). Tidak ada data awal / data fiktif.
-- Bentuk kolom mengikuti src/data/*.js (camelCase di JS ↔ snake_case di sini).
-- =============================================================================

-- ── profiles ────────────────────────────────────────────────────────────────
-- Profil pemilik portofolio (bukan profil pengunjung). Maksimal satu baris terbit.
-- Sumber untuk site.js, about.js, contact.js, dan resume.js.
create table public.profiles (
  id                     uuid primary key default gen_random_uuid(),
  full_name              text not null,
  headline               text,
  statement              text,
  bio                    text,
  photo_path             text,                       -- path di bucket profile-images
  photo_alt              text,
  school                 text,
  class_name             text,
  major                  text,
  location               text,
  email                  text,                       -- email kontak publik (opsional)
  social_links           jsonb not null default '[]'::jsonb,  -- [{ id, label, url, handle }]
  education              jsonb not null default '[]'::jsonb,  -- [{ id, level, institution, program, note, start, end }]
  interests              text[] not null default '{}',
  career_headline        text,
  career_description     text,
  resume_headline        text,
  resume_summary         text,
  featured_project_slugs text[] not null default '{}',
  cv_url                 text,                       -- URL / path berkas CV (PDF)
  is_published           boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint profiles_full_name_len   check (char_length(btrim(full_name)) between 1 and 120),
  constraint profiles_email_format    check (email is null or email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  constraint profiles_social_is_array check (jsonb_typeof(social_links) = 'array'),
  constraint profiles_edu_is_array    check (jsonb_typeof(education) = 'array'),
  constraint profiles_cv_url_scheme   check (cv_url is null or cv_url ~* '^(https?://|/)')
);

-- Hanya satu profil yang boleh berstatus terbit pada satu waktu.
create unique index profiles_single_published_idx on public.profiles ((true)) where is_published;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── projects ────────────────────────────────────────────────────────────────
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  name          text not null,
  category      text,                                 -- key taksonomi di projects.js (web, mobile, …)
  description   text,
  problem       text,
  objective     text,
  role          text,
  technologies  text[] not null default '{}',
  features      text[] not null default '{}',
  images        jsonb not null default '{"cover": null, "screenshots": []}'::jsonb,
                                                      -- { cover: {src,alt,caption}, screenshots: [...] }; src = path di bucket project-images
  documentation jsonb not null default '[]'::jsonb,   -- [{ title, description, date, image }]
  feedback      jsonb not null default '[]'::jsonb,   -- [{ name, role, message }] — hanya feedback asli
  demo_url      text,
  github_url    text,
  sort_order    integer not null default 0,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  search        tsvector generated always as (
                  setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
                  setweight(to_tsvector('simple', coalesce(description, '')), 'B')
                ) stored,

  constraint projects_slug_key        unique (slug),
  constraint projects_slug_format     check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_name_len        check (char_length(btrim(name)) between 1 and 160),
  constraint projects_images_is_obj   check (jsonb_typeof(images) = 'object'),
  constraint projects_doc_is_array    check (jsonb_typeof(documentation) = 'array'),
  constraint projects_feedback_array  check (jsonb_typeof(feedback) = 'array'),
  -- Tolak skema berbahaya (mis. javascript:) pada URL yang dirender sebagai href.
  constraint projects_demo_url_scheme check (demo_url is null or demo_url ~* '^https?://'),
  constraint projects_github_scheme   check (github_url is null or github_url ~* '^https?://')
);

create index projects_listing_idx on public.projects (sort_order, created_at desc) where is_published;
create index projects_category_idx on public.projects (category);
create index projects_technologies_gin on public.projects using gin (technologies);
create index projects_search_gin on public.projects using gin (search);
create index projects_name_trgm on public.projects using gin (name extensions.gin_trgm_ops);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ── skills ──────────────────────────────────────────────────────────────────
create table public.skills (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null,                         -- 'hard' | 'soft'
  group_name   text not null,                         -- pengelompokan tampilan (mis. Frontend)
  level        smallint,                              -- 0–100; null = belum diisi
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint skills_category_valid check (category in ('hard', 'soft')),
  constraint skills_level_range    check (level is null or level between 0 and 100),
  constraint skills_name_len       check (char_length(btrim(name)) between 1 and 80),
  constraint skills_unique         unique (category, name)
);

create index skills_listing_idx on public.skills (category, group_name, sort_order) where is_published;

create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

-- ── experiences ─────────────────────────────────────────────────────────────
create table public.experiences (
  id           uuid primary key default gen_random_uuid(),
  type         text not null,                         -- plk | organisasi | kepanitiaan | perlombaan
  title        text not null,
  role         text,
  organization text,
  location     text,
  start_date   date,
  end_date     date,                                  -- null = masih berjalan
  description  text,
  highlights   text[] not null default '{}',
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint experiences_type_valid  check (type in ('plk', 'organisasi', 'kepanitiaan', 'perlombaan')),
  constraint experiences_title_len   check (char_length(btrim(title)) between 1 and 160),
  constraint experiences_date_order  check (end_date is null or start_date is null or end_date >= start_date)
);

create index experiences_listing_idx on public.experiences (type, start_date desc nulls last) where is_published;

create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

-- ── certificates ────────────────────────────────────────────────────────────
-- Menampung sertifikat DAN prestasi (kolom `kind`), karena bentuknya hampir sama:
--   kind = 'sertifikat' → issuer = penyelenggara, issued_at = tanggal terbit
--   kind = 'prestasi'   → issuer = penyelenggara lomba, issued_at = tanggal diraih,
--                         `rank` = peringkat (mis. "Juara 2")
create table public.certificates (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null default 'sertifikat',
  title          text not null,
  issuer         text,
  rank           text,
  issued_at      date,
  category       text,                                -- key di certificateCategories / achievementCategories
  description    text,
  credential_url text,
  image_path     text,                                -- path di bucket certificate-images
  image_alt      text,
  sort_order     integer not null default 0,
  is_published   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint certificates_kind_valid  check (kind in ('sertifikat', 'prestasi')),
  constraint certificates_title_len   check (char_length(btrim(title)) between 1 and 200),
  constraint certificates_cred_scheme check (credential_url is null or credential_url ~* '^https?://')
);

create index certificates_listing_idx on public.certificates (kind, issued_at desc nulls last) where is_published;
create index certificates_category_idx on public.certificates (category);

create trigger certificates_set_updated_at
  before update on public.certificates
  for each row execute function public.set_updated_at();

-- ── testimonials ────────────────────────────────────────────────────────────
-- Hanya testimoni asli yang sudah disetujui pemberinya (aturan Phase 05).
create table public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  type         text not null,                         -- guru | teman | pengguna | plk
  name         text not null,
  role         text,
  organization text,
  message      text not null,
  photo_path   text,                                  -- path di bucket testimonial-images
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint testimonials_type_valid  check (type in ('guru', 'teman', 'pengguna', 'plk')),
  constraint testimonials_name_len    check (char_length(btrim(name)) between 1 and 120),
  constraint testimonials_message_len check (char_length(btrim(message)) between 1 and 2000)
);

create index testimonials_listing_idx on public.testimonials (type, sort_order, created_at desc) where is_published;

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ── blog ────────────────────────────────────────────────────────────────────
create table public.blog (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  title        text not null,
  category     text,
  excerpt      text,
  cover_path   text,                                  -- path di bucket blog-images
  cover_alt    text,
  content      jsonb not null default '[]'::jsonb,    -- blok: heading | paragraph | list | code | quote
  published_at date,                                  -- null = langsung tampil bila is_published; tanggal masa depan = terjadwal
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  search       tsvector generated always as (
                 setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
                 setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B')
               ) stored,

  constraint blog_slug_key        unique (slug),
  constraint blog_slug_format     check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint blog_title_len       check (char_length(btrim(title)) between 1 and 200),
  constraint blog_content_array   check (jsonb_typeof(content) = 'array')
);

create index blog_listing_idx on public.blog (published_at desc nulls last, created_at desc) where is_published;
create index blog_category_idx on public.blog (category);
create index blog_search_gin on public.blog using gin (search);
create index blog_title_trgm on public.blog using gin (title extensions.gin_trgm_ops);

create trigger blog_set_updated_at
  before update on public.blog
  for each row execute function public.set_updated_at();
