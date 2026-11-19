-- =============================================================================
-- Verifikasi RLS & hak akses (jalankan SETELAH semua migration).
--
--   psql "$DATABASE_URL" -q -o /dev/null -v ON_ERROR_STOP=1 -f supabase/tests/rls_verification.sql
--
-- Seluruh skrip berjalan dalam SATU transaksi dan di-ROLLBACK di akhir:
-- baris contoh di bawah hanyalah fixture uji sementara, TIDAK tersimpan.
-- Skrip berhenti pada kegagalan pertama (raise exception 'GAGAL: …').
-- Jalankan di database lokal / staging, bukan produksi.
-- (Catatan: insert ke auth.users memakai kolom minimal; bila versi Supabase-mu
--  mewajibkan kolom lain, sesuaikan bagian fixture.)
-- =============================================================================
begin;

create schema test_helpers;
grant usage on schema test_helpers to anon, authenticated;

-- Perintah harus DITOLAK (hak akses / RLS / constraint / kolom tak ada).
create function test_helpers.denied(q text, label text) returns void
language plpgsql as $$
begin
  begin
    execute q;
  exception when others then
    if sqlstate in ('42501', '23514', '23505', '42703') then
      raise notice 'ok    ditolak  : % [%]', label, sqlstate;
      return;
    end if;
    raise exception 'GAGAL: % — error tak terduga % %', label, sqlstate, sqlerrm;
  end;
  raise exception 'GAGAL: % — seharusnya ditolak tetapi berhasil', label;
end $$;

-- Perintah mengubah/menghapus tepat n baris (RLS memfilter baris lain secara senyap).
create function test_helpers.affects(q text, n int, label text) returns void
language plpgsql as $$
declare got int;
begin
  execute q;
  get diagnostics got = row_count;
  if got <> n then raise exception 'GAGAL: % — mengubah % baris, seharusnya %', label, got, n; end if;
  raise notice 'ok    % baris   : %', n, label;
end $$;

-- Query skalar bigint harus bernilai n.
create function test_helpers.count_is(q text, n bigint, label text) returns void
language plpgsql as $$
declare got bigint;
begin
  execute q into got;
  if got is distinct from n then raise exception 'GAGAL: % — hasil %, seharusnya %', label, got, n; end if;
  raise notice 'ok    = %        : %', n, label;
end $$;

create function test_helpers.as_user(uid uuid, extra jsonb default '{}') returns void
language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    (jsonb_build_object('sub', uid, 'role', 'authenticated') || extra)::text, true);
end $$;
grant execute on all functions in schema test_helpers to anon, authenticated;

-- ── Fixture (sebagai pemilik database) ──────────────────────────────────────
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin-uji@example.com'),
  ('00000000-0000-0000-0000-0000000000b2', 'pengguna-uji@example.com');
insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-0000000000a1');

insert into public.profiles (full_name, is_published) values ('Profil Uji Terbit', true), ('Profil Uji Draf', false);
insert into public.projects (slug, name, description, is_published) values
  ('uji-terbit', 'Proyek Uji Terbit', 'kata kunci pencarian', true),
  ('uji-draf',   'Proyek Uji Draf',   null, false);
insert into public.skills (name, category, group_name, is_published) values ('Skill Uji', 'hard', 'Uji', true), ('Skill Draf', 'hard', 'Uji', false);
insert into public.experiences (type, title, is_published) values ('plk', 'Pengalaman Uji', true), ('plk', 'Pengalaman Draf', false);
insert into public.certificates (title, is_published) values ('Sertifikat Uji', true), ('Sertifikat Draf', false);
insert into public.testimonials (type, name, message, is_published) values ('teman', 'T Uji', 'Pesan uji', true), ('teman', 'T Draf', 'Pesan draf', false);
insert into public.blog (slug, title, is_published, published_at) values
  ('uji-terbit',    'Blog Terbit',    true,  null),
  ('uji-lampau',    'Blog Lampau',    true,  current_date - 1),
  ('uji-terjadwal', 'Blog Terjadwal', true,  current_date + 30),
  ('uji-draf',      'Blog Draf',      false, null);
insert into public.messages (name, email, category, subject, message, status) values
  ('Pengirim Dibaca', 'dibaca@example.com', 'kesan', 'Subjek uji 1', 'Isi pesan uji yang sudah dibaca.', 'read'),
  ('Pengirim Baru',   'baru@example.com',   'saran', 'Subjek uji 2', 'Isi pesan uji yang masih baru.', 'new');
insert into storage.buckets (id, name, public) values ('bucket-lain-uji', 'bucket-lain-uji', false);

-- trigger updated_at: nilai yang diisi manual harus ditimpa dengan now()
update public.projects set updated_at = '2000-01-01' where slug = 'uji-draf';
select test_helpers.count_is($$select count(*) from public.projects where slug = 'uji-draf' and updated_at > '2000-01-01'$$, 1, 'trigger updated_at');
select test_helpers.count_is($$select count(*) from public.projects where search @@ plainto_tsquery('simple','kata')$$, 1, 'full-text search (tsvector)');

-- ════════════════════════ PENGUNJUNG (anon) ════════════════════════
set local role anon;
select test_helpers.count_is('select count(*) from public.profiles', 1, 'anon: hanya profil terbit');
select test_helpers.count_is('select count(*) from public.projects', 1, 'anon: hanya proyek terbit');
select test_helpers.count_is('select count(*) from public.skills', 1, 'anon: hanya skill terbit');
select test_helpers.count_is('select count(*) from public.experiences', 1, 'anon: hanya pengalaman terbit');
select test_helpers.count_is('select count(*) from public.certificates', 1, 'anon: hanya sertifikat terbit');
select test_helpers.count_is('select count(*) from public.testimonials', 1, 'anon: hanya testimoni terbit');
select test_helpers.count_is('select count(*) from public.blog', 2, 'anon: blog terbit (tanpa draf & terjadwal)');
select test_helpers.denied($$insert into public.projects (slug, name, is_published) values ('x', 'x', true)$$, 'anon: INSERT projects');
select test_helpers.denied($$update public.projects set name = 'diretas'$$, 'anon: UPDATE projects');
select test_helpers.denied($$delete from public.blog$$, 'anon: DELETE blog');
select test_helpers.denied($$insert into public.testimonials (type, name, message, is_published) values ('teman','x','x',true)$$, 'anon: INSERT testimonials');
select test_helpers.denied('select * from public.messages', 'anon: SELECT messages (tabel)');
select test_helpers.denied('select * from public.admin_users', 'anon: SELECT admin_users');
select test_helpers.denied('select public.is_admin()', 'anon: panggil is_admin()');
select test_helpers.count_is($$select count(*) from pg_views where schemaname = 'public' and viewname = 'guestbook_messages'$$, 0, 'anon: view guestbook_messages sudah tidak ada');
select test_helpers.denied('select name, message from public.messages', 'anon: tak bisa membaca isi pesan siapa pun');
select test_helpers.denied('select * from public.messages where status = ''new''', 'anon: tak bisa membaca pesan baru');
-- kirim pesan
select test_helpers.affects($$insert into public.messages (name, email, category, subject, message) values ('Pengunjung Uji','uji@example.com','pertanyaan','Subjek uji','Isi pesan uji yang valid.')$$, 1, 'anon: INSERT pesan valid');
select test_helpers.denied($$insert into public.messages (name, email, category, subject, message, status) values ('Pengunjung Uji','uji@example.com','kesan','Subjek uji','Isi pesan uji yang valid.','read')$$, 'anon: INSERT pesan dengan status read');
select test_helpers.denied($$insert into public.messages (name, email, category, subject, message, status) values ('Pengunjung Uji','uji@example.com','kesan','Subjek uji','Isi pesan uji yang valid.','pending')$$, 'anon: status lama (pending) tidak valid lagi');
select test_helpers.denied($$insert into public.messages (name, email, category, subject, message, reviewed_at) values ('Pengunjung Uji','uji@example.com','kesan','Subjek uji','Isi pesan uji yang valid.', now())$$, 'anon: INSERT dengan reviewed_at');
select test_helpers.denied($$insert into public.messages (id, name, email, category, subject, message) values (gen_random_uuid(),'Pengunjung Uji','uji@example.com','kesan','Subjek uji','Isi pesan uji yang valid.')$$, 'anon: INSERT pesan dengan id kustom');
select test_helpers.denied($$insert into public.messages (name, email, category, subject, message) values ('Pengunjung Uji','bukan-email','kesan','Subjek uji','Isi pesan uji yang valid.')$$, 'anon: email tidak valid');
select test_helpers.denied($$insert into public.messages (name, email, category, subject, message) values ('Pengunjung Uji','uji@example.com','kesan','Subjek uji','pendek')$$, 'anon: pesan terlalu pendek');
select test_helpers.denied($$insert into public.messages (name, email, category, subject, message) values ('Pengunjung Uji','uji@example.com','iklan','Subjek uji','Isi pesan uji yang valid.')$$, 'anon: kategori tidak dikenal');
select test_helpers.denied($$insert into public.messages (name, email, category, subject, message) values ('Pengunjung Uji','uji@example.com','kesan','Subjek uji',repeat('x',1001))$$, 'anon: pesan > 1000 karakter');
select test_helpers.denied($$update public.messages set status = 'archived'$$, 'anon: UPDATE messages');
select test_helpers.denied($$delete from public.messages$$, 'anon: DELETE messages');
select test_helpers.denied($$insert into storage.objects (bucket_id, name) values ('project-images', 'x.png')$$, 'anon: upload storage');
select test_helpers.count_is('select count(*) from storage.objects', 0, 'anon: tak bisa mendaftar isi storage');
reset role;

-- ═══════════════ PENGGUNA LOGIN BUKAN ADMIN (authenticated) ═══════════════
set local role authenticated;
select test_helpers.as_user('00000000-0000-0000-0000-0000000000b2');
select test_helpers.count_is('select count(*) from public.projects', 1, 'user: hanya proyek terbit');
select test_helpers.count_is('select public.is_admin()::int', 0, 'user: is_admin() = false');
select test_helpers.denied($$insert into public.projects (slug, name, is_published) values ('y', 'y', true)$$, 'user: INSERT projects');
select test_helpers.affects($$update public.projects set name = 'diretas'$$, 0, 'user: UPDATE projects');
select test_helpers.affects($$delete from public.skills$$, 0, 'user: DELETE skills');
select test_helpers.count_is('select count(*) from public.messages', 0, 'user: tak melihat pesan siapa pun');
select test_helpers.affects($$update public.messages set status = 'archived'$$, 0, 'user: UPDATE messages');
select test_helpers.affects($$delete from public.messages$$, 0, 'user: DELETE messages');
select test_helpers.count_is('select count(*) from public.admin_users', 0, 'user: admin_users hanya baris sendiri (bukan admin)');
select test_helpers.denied($$insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-0000000000b2')$$, 'user: menjadikan diri admin');
select test_helpers.count_is($$select count(*) from pg_views where schemaname = 'public' and viewname = 'guestbook_messages'$$, 0, 'user: view guestbook_messages sudah tidak ada');
select test_helpers.affects($$insert into public.messages (name, email, category, subject, message) values ('Pengguna Uji','uji2@example.com','saran','Subjek uji','Isi pesan uji yang valid.')$$, 1, 'user: kirim pesan');
select test_helpers.denied($$insert into storage.objects (bucket_id, name) values ('project-images', 'x.png')$$, 'user: upload storage');
-- Klaim palsu di JWT / metadata tidak membuat siapa pun menjadi admin
select test_helpers.as_user('00000000-0000-0000-0000-0000000000b2',
  '{"app_metadata":{"role":"admin"},"user_metadata":{"role":"admin","is_admin":true}}');
select test_helpers.count_is('select public.is_admin()::int', 0, 'user: klaim metadata palsu tidak berpengaruh');
select test_helpers.denied($$insert into public.projects (slug, name) values ('z', 'z')$$, 'user: INSERT dengan metadata palsu');
reset role;

-- ═════════════════════════ ADMIN (authenticated + admin_users) ═════════════════════════
set local role authenticated;
select test_helpers.as_user('00000000-0000-0000-0000-0000000000a1');
select test_helpers.count_is('select public.is_admin()::int', 1, 'admin: is_admin() = true');
select test_helpers.count_is('select count(*) from public.projects', 2, 'admin: melihat draf juga');
select test_helpers.count_is('select count(*) from public.blog', 4, 'admin: melihat semua artikel');
select test_helpers.count_is('select count(*) from public.profiles', 2, 'admin: melihat semua profil');
select test_helpers.affects($$insert into public.projects (slug, name) values ('admin-baru', 'Proyek Admin')$$, 1, 'admin: INSERT projects');
select test_helpers.affects($$update public.projects set is_published = true where slug = 'admin-baru'$$, 1, 'admin: UPDATE projects');
select test_helpers.affects($$delete from public.projects where slug = 'admin-baru'$$, 1, 'admin: DELETE projects');
select test_helpers.denied($$insert into public.projects (slug, name) values ('Slug Salah', 'x')$$, 'admin: slug tidak valid ditolak constraint');
select test_helpers.denied($$insert into public.projects (slug, name, demo_url) values ('js-url', 'x', 'javascript:alert(1)')$$, 'admin: URL javascript: ditolak');
select test_helpers.denied($$insert into public.skills (name, category, group_name, level) values ('x','hard','x',101)$$, 'admin: level skill > 100 ditolak');
select test_helpers.denied($$insert into public.profiles (full_name, is_published) values ('Profil Terbit Kedua', true)$$, 'admin: hanya satu profil terbit');
select test_helpers.count_is('select count(*) from public.messages', 4, 'admin: melihat semua pesan (termasuk email)');
select test_helpers.affects($$update public.messages set status = 'read', reviewed_by = auth.uid(), reviewed_at = now() where name = 'Pengirim Baru'$$, 1, 'admin: tandai pesan dibaca');
select test_helpers.count_is($$select count(*) from public.messages where name = 'Pengirim Baru' and reviewed_by = auth.uid() and reviewed_at is not null$$, 1, 'trigger: reviewed_by/at diisi database saat status berubah');
select test_helpers.affects($$update public.messages set reviewed_by = '00000000-0000-0000-0000-0000000000b2' where name = 'Pengirim Baru'$$, 1, 'admin: coba memalsukan reviewed_by');
select test_helpers.count_is($$select count(*) from public.messages where name = 'Pengirim Baru' and reviewed_by = auth.uid()$$, 1, 'trigger: pemalsuan reviewed_by diabaikan');
select test_helpers.affects($$update public.messages set status = 'archived' where name = 'Pengirim Baru'$$, 1, 'admin: arsipkan pesan');
select test_helpers.count_is($$select count(*) from public.messages where status = 'archived'$$, 1, 'admin: pesan diarsipkan');
select test_helpers.denied($$update public.messages set status = 'approved' where name = 'Pengirim Baru'$$, 'admin: status lama (approved) ditolak constraint');
select test_helpers.affects($$update public.messages set status = 'new' where name = 'Pengirim Baru'$$, 1, 'admin: kembalikan ke baru');
select test_helpers.count_is($$select count(*) from public.messages where name = 'Pengirim Baru' and reviewed_by is null and reviewed_at is null and status = 'new'$$, 1, 'trigger: status baru mengosongkan reviewed_by/at');
select test_helpers.affects($$delete from public.messages where name = 'Pengguna Uji'$$, 1, 'admin: hapus pesan');
select test_helpers.count_is('select count(*) from public.admin_users', 1, 'admin: melihat baris admin_users sendiri');
select test_helpers.denied($$insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-0000000000b2')$$, 'admin: tak bisa menambah admin lewat API');
select test_helpers.denied($$update public.admin_users set created_at = now()$$, 'admin: tak bisa ubah admin_users lewat API');
select test_helpers.affects($$insert into storage.objects (bucket_id, name) values ('project-images', 'uji.png')$$, 1, 'admin: upload ke bucket portofolio');
select test_helpers.denied($$insert into storage.objects (bucket_id, name) values ('bucket-lain-uji', 'uji.png')$$, 'admin: upload ke bucket di luar daftar');
select test_helpers.count_is('select count(*) from storage.objects', 1, 'admin: dapat melihat isi bucket');
select test_helpers.affects($$delete from storage.objects where name = 'uji.png'$$, 1, 'admin: hapus file');
reset role;

-- Bucket: kelima bucket ada, publik, dan dibatasi
select test_helpers.count_is($$select count(*) from storage.buckets where id in ('profile-images','project-images','certificate-images','testimonial-images','blog-images') and public and file_size_limit = 5242880 and 'image/svg+xml' <> all (allowed_mime_types)$$, 5, 'storage: 5 bucket publik, 5 MB, tanpa SVG');
-- Semua tabel public ber-RLS
select test_helpers.count_is($$select count(*) from pg_tables where schemaname = 'public' and not rowsecurity$$, 0, 'semua tabel public mengaktifkan RLS');

do $$ begin raise notice '══ SEMUA PENGUJIAN LULUS ══'; end $$;
rollback;
