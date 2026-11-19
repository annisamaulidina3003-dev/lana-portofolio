# Uji integrasi Phase 07C (lokal, bukan Supabase sungguhan)

Menjalankan aplikasi terhadap **PostgreSQL 16 + PostgREST 12 + RLS asli** dengan shim kecil
untuk Auth (GoTrue) dan Storage (`gateway.mjs`). Shim bukan Supabase: ia meniru kontrak yang dipakai
`supabase-js` (login password, `/rest/v1`, upload/hapus/URL publik, kebijakan admin-only).

1. Buat DB, jalankan `pg_stub.sql` lalu seluruh `supabase/migrations/*.sql` berurutan.
   Tambahkan akun uji: `insert into auth.users …; insert into public.admin_users …` (lihat `gateway.mjs` untuk UUID).
2. Jalankan PostgREST (`postgrest.conf`), `node gateway.mjs` (port 54321), dan
   `VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=<jwt role anon> npx vite`.
3. `python3 t1_*.py`, `t2_*.py`, `t3_*.py` (Playwright). Skrip memakai data uji yang dibuat sendiri
   (bukan data portofolio) dan berasumsi path `/tmp/h/…` — sesuaikan.
4. `node images_unit.mjs` — uji deteksi format gambar (termasuk AVIF).

Kekurangan: Storage asli tidak diuji (hanya policy-nya lewat `supabase/tests/rls_verification.sql`).
Jalankan skrip RLS dan uji manual di proyek staging Supabase sebelum produksi.
