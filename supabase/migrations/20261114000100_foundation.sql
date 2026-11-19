-- =============================================================================
-- 01 · FOUNDATION — ekstensi, trigger updated_at, dan identifikasi admin
-- =============================================================================

-- Ekstensi di schema `extensions` (konvensi Supabase). pg_trgm dipakai untuk
-- pencarian teks parsial (ILIKE '%kata%') pada nama proyek dan judul blog.
create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;

-- ── Trigger generik: perbarui kolom updated_at ──────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ── Identifikasi admin ──────────────────────────────────────────────────────
-- Admin = akun Supabase Auth yang terdaftar di tabel `admin_users`.
-- SENGAJA tidak memakai user_metadata / klaim JWT yang dapat diubah pengguna
-- sendiri. Baris admin_users hanya bisa ditambah lewat SQL Editor / service role
-- (tidak ada policy tulis untuk anon maupun authenticated).
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Daftar akun admin. Ditulis hanya lewat SQL Editor/service role; lihat README Phase 07A.';

-- SECURITY DEFINER agar bisa membaca admin_users walau pemanggil tidak punya akses
-- langsung. search_path dikosongkan untuk mencegah pembajakan fungsi/objek.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

-- Hanya pengguna yang sudah login yang boleh memanggil (anon tidak perlu).
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
