-- =============================================================================
-- 04 · ROW LEVEL SECURITY — seluruh tabel
--
-- Prinsip:
--   • RLS aktif di semua tabel; tanpa policy = akses ditolak.
--   • Pengunjung (anon) hanya MEMBACA konten yang diterbitkan.
--   • Admin (public.is_admin()) mengelola semua konten.
--   • Pengunjung boleh MENGIRIM pesan, tapi tidak boleh membaca pesan siapa pun.
--   • Tidak ada policy `using (true)` untuk operasi tulis.
-- Selain RLS, hak tabel (GRANT) juga dipersempit sebagai lapisan kedua, karena
-- Supabase secara bawaan memberi anon/authenticated hak penuh pada tabel baru.
-- (select …) dibungkus agar fungsi dievaluasi sekali per query, bukan per baris.
-- =============================================================================

-- ── admin_users ─────────────────────────────────────────────────────────────
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- Pengguna login hanya dapat melihat barisnya sendiri (untuk cek "apakah saya admin").
create policy admin_users_select_self on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));
-- Tidak ada policy insert/update/delete → hanya SQL Editor / service role.

-- ── Tabel konten: pola sama ─────────────────────────────────────────────────
-- profiles ──────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update, delete on public.profiles to authenticated;

create policy profiles_public_read on public.profiles
  for select to anon, authenticated
  using (is_published);
create policy profiles_admin_all on public.profiles
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- projects ──────────────────────────────────────────────────────────────────
alter table public.projects enable row level security;
revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

create policy projects_public_read on public.projects
  for select to anon, authenticated
  using (is_published);
create policy projects_admin_all on public.projects
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- skills ────────────────────────────────────────────────────────────────────
alter table public.skills enable row level security;
revoke all on public.skills from anon, authenticated;
grant select on public.skills to anon, authenticated;
grant insert, update, delete on public.skills to authenticated;

create policy skills_public_read on public.skills
  for select to anon, authenticated
  using (is_published);
create policy skills_admin_all on public.skills
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- experiences ───────────────────────────────────────────────────────────────
alter table public.experiences enable row level security;
revoke all on public.experiences from anon, authenticated;
grant select on public.experiences to anon, authenticated;
grant insert, update, delete on public.experiences to authenticated;

create policy experiences_public_read on public.experiences
  for select to anon, authenticated
  using (is_published);
create policy experiences_admin_all on public.experiences
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- certificates ──────────────────────────────────────────────────────────────
alter table public.certificates enable row level security;
revoke all on public.certificates from anon, authenticated;
grant select on public.certificates to anon, authenticated;
grant insert, update, delete on public.certificates to authenticated;

create policy certificates_public_read on public.certificates
  for select to anon, authenticated
  using (is_published);
create policy certificates_admin_all on public.certificates
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- testimonials ──────────────────────────────────────────────────────────────
alter table public.testimonials enable row level security;
revoke all on public.testimonials from anon, authenticated;
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;

create policy testimonials_public_read on public.testimonials
  for select to anon, authenticated
  using (is_published);
create policy testimonials_admin_all on public.testimonials
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- blog (artikel terbit; published_at di masa depan = terjadwal, belum tampil) ─
alter table public.blog enable row level security;
revoke all on public.blog from anon, authenticated;
grant select on public.blog to anon, authenticated;
grant insert, update, delete on public.blog to authenticated;

create policy blog_public_read on public.blog
  for select to anon, authenticated
  using (is_published and (published_at is null or published_at <= current_date));
create policy blog_admin_all on public.blog
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ── messages ────────────────────────────────────────────────────────────────
alter table public.messages enable row level security;
revoke all on public.messages from anon, authenticated;

-- Pengunjung: hanya INSERT, dan hanya lima kolom isian. id, status, created_at,
-- dan kolom moderasi tidak bisa diisi pengunjung (diisi default database).
grant insert (name, email, category, subject, message) on public.messages to anon, authenticated;
-- Admin: baca, moderasi (update), dan hapus.
grant select, update, delete on public.messages to authenticated;

create policy messages_visitor_insert on public.messages
  for insert to anon, authenticated
  with check (status = 'pending' and reviewed_by is null and reviewed_at is null);

create policy messages_admin_select on public.messages
  for select to authenticated
  using ((select public.is_admin()));
create policy messages_admin_update on public.messages
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy messages_admin_delete on public.messages
  for delete to authenticated
  using ((select public.is_admin()));

-- Buku tamu publik membaca lewat view (tanpa email), bukan tabel.
revoke all on public.guestbook_messages from anon, authenticated;
grant select on public.guestbook_messages to anon, authenticated;
