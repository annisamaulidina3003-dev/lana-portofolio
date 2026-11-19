# Portofolio — M. Rizky Maulana

Phase 01: Project Setup & Design Foundation.
Phase 02: Homepage & Navigation (konten beranda ada di `src/data/profile.js`).
Phase 03: Tentang, Keahlian, Pengalaman.
Phase 04: Galeri Proyek (`/proyek`), Detail Proyek (`/proyek/:slug`), pencarian & filter, pratinjau.
Phase 05: Sertifikat, Prestasi & Testimoni (`/sertifikat`), Blog (`/blog`, `/blog/:slug`), CV Digital (`/cv`).
Phase 06: Kontak, Formulir Kesan & Pesan, dan Buku Tamu (`/kontak`) — frontend saja, siap Supabase.
Phase 07A: Fondasi backend Supabase — klien, migration SQL, RLS, Storage, repository.
Phase 07B: Autentikasi & Dashboard Admin (`/admin`) — login, rute terlindungi, CRUD 7 modul, moderasi pesan.
Phase 07C: Storage & integrasi frontend — upload gambar, seluruh halaman publik dari Supabase, kotak masuk pesan.

## Menjalankan
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Tech stack
React 18 + Vite · Tailwind CSS 3 · Framer Motion · Lucide React · React Router DOM 6

## Struktur
```
src/
├─ components/
│  ├─ layout/   Navbar, Footer, PageShell, GridGuides, ScrollToTop
│  ├─ ui/       Button, Container, SectionHeading, Loading
│  └─ motion/   Reveal, MaskLine
├─ data/        data lokal (kosong sampai diisi pemilik) + navigation.js
├─ hooks/       useAsyncData, usePageTitle
├─ layouts/     MainLayout
├─ lib/         cn, motion (variants & easing)
├─ pages/       satu file per route (Phase 01: kerangka)
├─ routes/      konfigurasi React Router (lazy-loaded)
└─ services/    portfolioService — lapisan data siap-Supabase
```

## Design system
- **Warna**: `paper #FAFAFA`, `ink #111111`, `ink-soft`, `mute`, `fog`, `line`. Tanpa dark mode.
- **Font**: Archivo (display, bold & sedikit condensed) · Inter Tight (teks) · IBM Plex Mono (label).
- **Tipografi**: `text-display-xl/lg/md/sm`, `text-lead`, `text-body`, `text-small`, `text-label` (fluid via `clamp`).
- **Spacing**: `px-gutter`, `py-section`, `pt-nav`; lebar `max-w-page` (90rem) / `max-w-narrow`.
- **Breakpoint**: `xs 480 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- **Gerak**: `src/lib/motion.js` (easing editorial, `fadeUp`, `maskUp`, `lineGrow`, `stagger`); menghormati *reduced motion*.

## Data → Supabase
Halaman mengambil data lewat `src/services/portfolioService.js`. Sekarang bersumber dari `src/data/*`;
untuk Supabase cukup ganti isi fungsi service. Variabel lingkungan ada di `.env.example`.

## Catatan deploy
Karena memakai `BrowserRouter`, host perlu fallback ke `index.html` untuk semua route (SPA rewrite).

## Foto profil
Letakkan foto (rasio 4:5) di `public/images/`, lalu isi `photo: '/images/nama-file.jpg'` di `src/data/profile.js`.

## Mengisi data Phase 03
Semua nilai kosong (`null`) tampil sebagai placeholder; tidak ada data bawaan yang dikarang.
- `src/data/about.js` — biodata, pendidikan, minat, cita-cita karier (`careerGoals`: `headline`, `description`, `dream`, `shortTerm`, `longTerm`).
  Mode Supabase: isi lewat `/admin/profil` → bagian "Tujuan karier & CV" (jalankan migration `20261118000200_career_goals.sql` lebih dulu).
- `src/data/skills.js` — `level` 0–100 per keahlian (`null` = belum diisi)
- `src/data/experiences.js` — PLK, organisasi, kepanitiaan, perlombaan (ubah `placeholder` ke `false` setelah diisi)

Untuk Supabase, tabel yang disarankan: `about_biodata`, `education`, `interests`, `skills`, `experiences`
(kolom mengikuti field di file data). Cukup ganti fungsi di `src/services/portfolioService.js`.

## Mengisi data Phase 04
Semua proyek ada di `src/data/projects.js`. Tiga entri bertanda `placeholder: true` hanyalah contoh struktur
(field faktual kosong). Untuk mengisi: lengkapi field, ubah `placeholder` ke `false`, salin objek untuk proyek lain.
- `slug` dipakai di URL (`/proyek/<slug>`), harus unik dan tanpa spasi.
- `category` memakai salah satu `key` di `projectCategories` (file yang sama).
- Filter teknologi dibuat otomatis dari `technologies` seluruh proyek.
- `images`: `{ cover: { src, alt, caption }, screenshots: [{ src, alt, caption }] }` — letakkan gambar di `public/images/projects/`.
- `documentation`: `[{ title, description, date: 'YYYY-MM', image }]` · `feedback`: `[{ name, role, message }]` (hanya feedback asli).

Supabase (Phase 07), tabel `projects`: kolom skalar `id, slug, name, category, description, problem, objective, role, demo_url, github_url, placeholder`;
`technologies` & `features` sebagai `text[]`; `images`, `documentation`, `feedback` sebagai `jsonb`. Cukup ganti `getProjects` / `getProjectBySlug`
di `src/services/portfolioService.js` (petakan `demo_url → demoUrl`, `github_url → githubUrl`).

## Mengisi data Phase 05
Semua entri bertanda `placeholder: true` hanyalah contoh struktur (field kosong) — tidak ada sertifikat, prestasi, testimoni,
atau pengalaman bawaan. Isi field, ubah `placeholder` ke `false`, salin objek untuk menambah entri.
- `src/data/certificates.js` — sertifikat (`issuer`, `issuedAt`, `category`, `image`, `credentialUrl`). Gambar: `public/images/certificates/`.
- `src/data/achievements.js` — prestasi (`organizer`, `rank`, `achievedAt`, `category`, `image`).
- `src/data/testimonials.js` — testimoni per jenis (`guru`, `teman`, `pengguna`, `plk`); `photo` opsional. Hanya testimoni asli.
- `src/data/posts.js` — artikel blog. Tiga artikel bawaan adalah **konten demonstrasi** (tanggal sengaja kosong); ganti/hapus.
  `content` berupa blok (`heading`, `paragraph`, `list`, `code`, `quote`); waktu baca dihitung otomatis.
- `src/data/resume.js` — `headline`, `summary`, `cvFile`, `featuredProjectSlugs` (kosong = 3 proyek pertama).
  Bagian CV lain diambil dari `about.js`, `skills.js`, `experiences.js`, `projects.js`, `contact.js`, `profile.js`.
- **PDF CV**: berkas `public/files/cv-rizky-maulana.pdf` hanyalah placeholder. Ganti dengan CV asli (nama sama) lalu set `cvFile.placeholder: false`.

Supabase (Phase 07): tabel `certificates`, `achievements`, `testimonials`, `posts`, `resume`. Kolom mengikuti field di tiap file data
(snake_case); `image`/`cover`/`content`/`cv_file` sebagai `jsonb`. Cukup ganti fungsi di `src/services/portfolioService.js`
(`getCertificates`, `getAchievements`, `getTestimonials`, `getPosts`, `getPostBySlug`, `getResume`).

## Mengisi data Phase 06
- `src/data/contact.js` — `email` dan `channels` (GitHub, Instagram, LinkedIn) masih `null` → tampil placeholder dan tidak bisa diklik.
  Isi `url` lengkap (`https://…`) dan `email` asli; tombol `mailto:` aktif otomatis. Lokasi: Banjarmasin, Indonesia.
  `socials` (dipakai `/cv`) diturunkan otomatis dari `channels` yang sudah berisi URL.
- `src/data/messages.js` — kategori pesan, skema, dan **data demonstrasi** (`demo-*`, selalu berlabel "Demo" di UI). Hapus `demoMessages` saat pesan asli ada.

### Perilaku sementara (simulasi)
Formulir **tidak mengirim apa pun ke server**. `submitMessage` (di `portfolioService.js`) hanya menunggu ±0,9 detik dan mengembalikan
`{ simulated: true, message }`. Pesan tampil di buku tamu dengan label "Lokal · belum terkirim" dan hilang saat halaman dimuat ulang.

### Arsitektur
- `components/contact/MessageForm.jsx` — formulir murni; tidak tahu backend, hanya memanggil prop `onSubmit(draft)`.
- `components/contact/GuestbookList|Item|Empty.jsx` — daftar murni; menerima array `messages`.
- `lib/messages.js` — batas input, validasi, `createMessageRecord` (bentuk sama dengan tabel).
- `components/ui/Field|ChoiceGroup|Switch.jsx` — komponen reusable.

### Supabase (Phase 07)
Tabel `messages`: `id uuid pk, name, email, category, subject, message, created_at timestamptz default now(), status` (`pending|approved|rejected`).
Ganti `getMessages` (select `status='approved'`, **tanpa kolom email**) dan `submitMessage` (insert, kembalikan `simulated: false`) di service — komponen tidak berubah.
RLS: anon boleh `insert` (status dipaksa `pending`) dan `select` hanya baris `approved`.

## Phase 07A — Fondasi backend Supabase

Hanya fondasi: **belum ada** login, Dashboard Admin, atau upload dari UI (itu Phase 07B). Tampilan tidak berubah, dan secara
bawaan situs tetap memakai data lokal `src/data/*`.

### Struktur baru
```
supabase/
├─ migrations/   5 file SQL, jalankan berurutan (lihat di bawah)
└─ tests/        rls_verification.sql — uji RLS (transaksi yang di-rollback)
src/
├─ lib/supabaseConfig.js   deteksi env (tanpa supabase-js) + penolakan service_role key
├─ lib/supabase.js         klien Supabase tunggal (null bila belum dikonfigurasi)
├─ services/supabase/      repository per tabel (query DB + mapping → bentuk data lokal)
├─ services/portfolioService.js   memilih sumber data: local (default) | supabase
├─ hooks/useSupabaseStatus.js
└─ types/database.js       tipe baris (JSDoc)
```
Komponen/halaman tetap hanya memanggil `portfolioService`; tidak ada query database di komponen UI.

### 1. Konfigurasi
```bash
cp .env.example .env.local     # .env.local sudah di-.gitignore
```
Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (Dashboard → Project Settings → API).
- Pakai **anon / publishable key saja**. Keamanan data berasal dari RLS, bukan dari kerahasiaan kunci ini.
- **Jangan pernah** memakai `service_role` / `sb_secret_…` di variabel `VITE_*` (ikut terbundel ke browser dan melewati RLS).
  `lib/supabaseConfig.js` menolak kunci semacam itu, mencatat error, dan situs tetap jalan dengan data lokal.
  Jika kunci rahasia pernah ter-commit/terbagi, putar (rotate) di dashboard.
- `VITE_DATA_SOURCE=local` (default) atau `supabase`. Biarkan `local` sampai konten sudah dimasukkan dan diterbitkan (Phase 07B);
  mode `supabase` menampilkan isi database apa adanya (daftar kosong bila belum ada konten terbit).
  Catatan: Beranda, Navbar, Footer, dan judul halaman masih membaca `site`/`profile` lokal secara langsung (disambungkan di 07B).

### 2. Menjalankan migration
Urutan (nama file sudah berurutan):
1. `20261114000100_foundation.sql` — ekstensi `pg_trgm`, trigger `updated_at`, tabel `admin_users`, fungsi `is_admin()`
2. `20261114000200_content_tables.sql` — `profiles, projects, skills, experiences, certificates, testimonials, blog`
3. `20261114000300_messages.sql` — `messages` + view publik `guestbook_messages`
4. `20261114000400_rls_policies.sql` — RLS + hak akses
5. `20261114000500_storage.sql` — 5 bucket + policy

Pilih salah satu cara:
```bash
# Supabase CLI
supabase link --project-ref <ref>
supabase db push
# atau: SQL Editor di dashboard → tempel & jalankan tiap file berurutan
```
Opsional (database lokal/staging, bukan produksi): `psql "$DATABASE_URL" -q -o /dev/null -v ON_ERROR_STOP=1 -f supabase/tests/rls_verification.sql`

### 3. Menjadikan akun admin
Admin = akun Supabase Auth yang ada di `public.admin_users` (bukan `user_metadata`, yang bisa diubah pengguna).
1. Dashboard → **Authentication → Users → Add user** (email + password milikmu).
2. **Authentication → Sign In / Providers**: matikan **Allow new users to sign up** (hanya kamu yang perlu akun).
   Walau pendaftaran terbuka, pendaftar baru bukan admin dan tidak punya hak tulis.
3. Di **SQL Editor** (hanya bisa lewat sini / service role — tidak ada jalur API):
```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'EMAIL_ADMIN_KAMU';
```
Disarankan mengaktifkan MFA untuk akun admin.

### 4. Model keamanan (ringkas)
| Pelaku | Boleh |
|---|---|
| Pengunjung (`anon`) | Membaca konten **terbit** (`is_published`; blog juga menghormati `published_at`). Mengirim pesan (INSERT lima kolom; status selalu `pending`). Membaca buku tamu lewat view `guestbook_messages`. |
| Pengguna login biasa | Sama seperti pengunjung. Tidak bisa menulis konten, tidak bisa membaca pesan. |
| Admin (`is_admin()`) | Baca semua (termasuk draf), kelola semua konten, moderasi/hapus pesan, upload/ubah/hapus gambar. |
| Siapa pun via API | Tidak bisa menambah/mengubah `admin_users`. |

- Semua tabel `public` ber-RLS; tidak ada policy `using (true)` untuk operasi tulis. Hak tabel (`GRANT`) dipersempit sebagai lapisan kedua.
- **Email pengirim pesan tidak pernah terbaca publik**: RLS bekerja per baris, jadi pengunjung tidak diberi SELECT ke `messages`;
  buku tamu membaca view `guestbook_messages` (approved saja, tanpa email).
- Kolom URL (`demo_url`, `github_url`, `credential_url`, `cv_url`) dibatasi skema `http(s)://` (atau `/`) lewat constraint, dan mapper juga membuang skema lain.
- Belum ada anti-spam/rate limit pada formulir pesan. Pertimbangkan CAPTCHA (mis. Turnstile) + Edge Function di fase berikutnya.

### 5. Storage
Bucket publik: `profile-images`, `project-images`, `certificate-images`, `testimonial-images`, `blog-images` (maks. 5 MB; JPEG/PNG/WebP/AVIF; SVG tidak diizinkan).
Bucket publik dapat dibuka lewat URL publik tanpa policy; sengaja **tidak ada** policy baca untuk `anon` sehingga isi bucket tidak bisa didaftar.
Upload/ubah/hapus/daftar file hanya untuk admin. Kolom `*_path` menyimpan path di bucket (mis. `halo/cover.webp`); repository mengubahnya
menjadi URL publik. URL absolut (`https://…`) dan path situs (`/images/…`) juga diterima, jadi gambar lokal lama tetap berfungsi.

### 6. Pemetaan tabel ↔ data lokal
| Tabel | Sumber data lokal | Catatan |
|---|---|---|
| `profiles` | `site.js`, `about.js`, `contact.js`, `resume.js` | Satu baris terbit (dijamin unique index). |
| `projects` | `projects.js` | `images/documentation/feedback` = `jsonb`; `search` (tsvector) + trigram pada `name`. |
| `skills` | `skills.js` | `group` → `group_name`. |
| `experiences` | `experiences.js` | `start/end 'YYYY-MM'` → `start_date/end_date` (date). |
| `certificates` | `certificates.js` + `achievements.js` | Kolom `kind` = `sertifikat` \| `prestasi` (`rank` untuk peringkat). |
| `testimonials` | `testimonials.js` | Hanya testimoni asli. |
| `blog` | `posts.js` | `content` = `jsonb` (blok); `published_at` bertipe `date`. |
| `messages` | `messages.js` | `status`: `pending → approved \| rejected`. |

Tidak ada data awal (seed) maupun data fiktif di migration. Entri `placeholder` lokal tidak dipindahkan ke database.

### Verifikasi yang sudah dijalankan
- Seluruh migration + `rls_verification.sql` (68 pengecekan: anon, pengguna biasa, admin, klaim metadata palsu, constraint, Storage)
  dijalankan pada **PostgreSQL 16 lokal** dengan stub schema `auth`/`storage` dan role `anon`/`authenticated`.
  **Belum dijalankan pada proyek Supabase sungguhan** — jalankan skrip uji di staging setelah `db push`.
- Jalur kode Supabase diuji di browser dengan respons PostgREST tiruan (query, mapping, INSERT 5 kolom, URL Storage, penolakan service_role key).


## Phase 07B — Autentikasi & Dashboard Admin

### File yang dibuat
- `src/admin/AdminApp.jsx` — router `/admin/*` (dimuat lazy, tidak masuk bundel publik). Hanya 1 baris rute ditambahkan di `src/routes/index.jsx`.
- `src/admin/auth/` — `AuthProvider`, `RequireAdmin`, `AuthContext`, pemetaan error auth.
- `src/admin/layout/` — `AdminLayout`, `Sidebar` (drawer di mobile).
- `src/admin/pages/` — Login, Overview, Pesan masuk, Pengaturan, ResourcePage, 404.
- `src/admin/components/` — ResourceManager, ResourceForm, Repeater, TagsInput, Drawer, ConfirmDialog, Toast, Pagination, States, dll.
- `src/admin/config/resources.js` — definisi 7 modul (Profil, Proyek, Keahlian, Pengalaman, Sertifikat, Testimoni, Blog); `nav.js` — 10 menu.
- `src/services/admin/` — `core`, `crud`, `messages`, `overview` (semua lewat klien Supabase Phase 07A).
- `src/lib/admin/` — `formModel` (validasi), `format`.

### Perubahan database
Satu migration baru: `supabase/migrations/20261115000100_admin_moderation.sql` — trigger `messages_track_review` yang mengisi `reviewed_by`/`reviewed_at` di sisi server saat status pesan berubah (tidak bisa dipalsukan klien). 4 pengecekan baru di `supabase/tests/rls_verification.sql`. Jalankan `supabase db push`.

### Keamanan
- Admin ditentukan oleh tabel `admin_users` lewat RPC `is_admin()` — **bukan** `user_metadata`/klaim JWT.
- Gerbang di frontend hanyalah UX; perlindungan sebenarnya adalah RLS. Tanpa pendaftaran publik; hanya anon key di klien.
- Sesi kedaluwarsa → kembali ke `/admin/login` dengan pemberitahuan.

### Membuat akun admin
1. Supabase Dashboard → Authentication → Users → *Add user* (email + password).
2. SQL Editor: `insert into public.admin_users (user_id) select id from auth.users where email = 'email-anda';`
3. Isi `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), lalu buka `/admin`.

### Cara menguji
**Autentikasi:** buka `/admin` tanpa login → diarahkan ke login · sandi salah → pesan error · login pengguna non-admin → "Akses ditolak" · refresh → sesi bertahan · Keluar → kembali ke login.
**CRUD:** per modul — Tambah → isi (validasi tampil bila kosong) → Simpan → muncul di daftar dan di tabel Supabase; Edit → ubah → Simpan; Hapus → dialog konfirmasi. Uji pencarian, filter, dan halaman (10 baris/halaman). Pesan masuk: setujui/tolak/kembalikan, lalu cek buku tamu publik.
**RLS:** jalankan `supabase/tests/rls_verification.sql` di staging.

### Batasan
- Kolom gambar berupa input path/URL teks — unggah Storage belum dikerjakan.
- Situs publik tetap memakai `VITE_DATA_SOURCE=local`; integrasi halaman publik belum dilakukan.
- Diuji pada PostgREST + PostgreSQL 16 + RLS asli dengan shim GoTrue (bukan proyek Supabase sungguhan): 78 pengecekan Playwright lulus.


## Phase 07C — Storage & Integrasi Frontend

### Ringkasan
- **Upload gambar** dari dashboard ke 5 bucket (`profile-/project-/certificate-/testimonial-/blog-images`): pilih/seret file → validasi → **pratinjau lokal** → diunggah saat *Simpan*.
- **Seluruh halaman publik** (Beranda, Tentang, Keahlian, Pengalaman, Proyek, Detail Proyek, Sertifikat & Testimoni, Blog, Detail Artikel, CV, Kontak) membaca database. `VITE_DATA_SOURCE` kini **default `supabase`**; `local` hanya cadangan pengembangan.
- **Pesan masuk**: formulir `/kontak` → tabel `messages` (status `new`); admin mengelola `baru / dibaca / diarsipkan`.
- **State UI**: loading, kosong, error + "Coba lagi", fallback gambar, validasi formulir, notifikasi (toast di admin; panel sukses di formulir publik).

### Upload gambar
| Hal | Perilaku |
|---|---|
| Validasi | Maks. 5 MB; JPG/PNG/WebP/AVIF; tipe dicek dari **byte awal berkas** (bukan ekstensi); gambar harus bisa didekode; sisi terpanjang ≤ 8000 px. SVG/GIF ditolak. Bucket menegakkan batas yang sama di server. |
| Alur simpan | unggah file baru → simpan ke database → hapus file lama yang tak terpakai. Bila simpan gagal, file yang baru diunggah **dihapus kembali** (tanpa file yatim). |
| Ganti / hapus | Mengganti atau menghapus gambar di form, atau menghapus baris, menghapus file lamanya dari Storage. URL eksternal dan `/images/…` **tidak pernah** dihapus. |
| Penamaan | `<modul>/<uuid>.<ext>`; ekstensi dari tipe terdeteksi. Path disimpan di kolom `*_path` / `images` jsonb (skema tidak berubah). |
| Keamanan | Hanya admin (policy `storage.objects` + `is_admin()`); tak ada service role di klien. UI hanyalah UX. |
| Field | Profil `photo_path` · Proyek `cover`, `screenshots[].src`, `documentation[].image` · Sertifikat `image_path` · Testimoni `photo_path` · Blog `cover_path`. |

Gagal membersihkan file lama (mis. jaringan putus) tidak membatalkan simpan; admin diberi tahu lewat toast.

### Perubahan database (1 migration, dengan alasan)
`supabase/migrations/20261116000100_messages_inbox.sql` — jalankan `supabase db push`.
- Status pesan `pending/approved/rejected` → **`new/read/archived`** (data lama dipetakan; dapat dijalankan ulang).
- **View `guestbook_messages` dihapus**: pengunjung tidak boleh membaca pesan pengunjung lain. Tabel `messages` kini hanya terbaca oleh admin. INSERT pengunjung tetap lima kolom, status dipaksa `new`.
- Trigger `reviewed_by/reviewed_at` disesuaikan (diisi server saat dibaca/diarsipkan; dikosongkan saat kembali `new`).

### Dampak pada Kontak / Buku Tamu (perlu persetujuan Anda)
Karena pesan bersifat privat, bagian **Buku Tamu** di `/kontak` kini hanya menampilkan **pesan yang dikirim pengunjung itu sendiri di sesi tersebut** (label "Terkirim"; hilang saat dimuat ulang) — bukan pesan orang lain. Mode data lokal tetap menampilkan data demo seperti sebelumnya. Jika ingin buku tamu publik kembali, perlu kolom persetujuan eksplisit (mis. `is_public`) + view publik — tidak dikerjakan karena bertentangan dengan aturan privasi di Phase 07C.

### Integrasi halaman publik
- Repository (`src/services/supabase/*`) memfilter `is_published` **dan** mengandalkan RLS. Filter eksplisit penting: admin yang sedang login memakai klien yang sama, sehingga tanpa filter ia akan melihat draf di situs publik. Blog juga menghormati `published_at` (terjadwal).
- Profil: `getProfile` (foto, headline, pernyataan) menggantikan `profile.js` lokal. "Keahlian Utama" dan pita teks Beranda diturunkan dari tabel `skills` (hard skill terbit, level tertinggi) — bukan teks karangan.
- Nama/sekolah di Navbar, Footer, judul tab, dan judul Beranda dari profil terbit (`useSite`); selama memuat memakai data lokal yang sudah dikonfirmasi pemilik.
- CV: `cv_url` kosong → tombol unduh disembunyikan (tidak mengarah ke PDF placeholder). Ringkasan CV: `resume_summary` → `bio` → `statement`.
- Request identik pada satu halaman digabung (`shared()`); tidak ada cache, jadi perubahan dashboard terlihat pada pemuatan/navigasi berikutnya.
- Pencarian/filter proyek tetap di klien atas data dari DB; detail memakai `slug`; slug draf → "tidak ditemukan".
- Teks petunjuk pengembang (`src/data/…`) dihapus dari tampilan publik.

### Daftar file
**Baru:** `supabase/migrations/20261116000100_messages_inbox.sql` · `src/lib/images.js` · `src/lib/site.js` · `src/lib/publicError.js` · `src/services/admin/storage.js` · `src/services/admin/images.js` · `src/admin/components/ImageField.jsx` · `src/components/ui/SafeImage.jsx` · `src/hooks/useSite.jsx` · `tests/e2e/*`
**Diubah:** `.env.example` · `supabase/tests/rls_verification.sql` · `src/lib/{supabaseConfig,messages,admin/formModel}.js` · `src/data/messages.js` · `src/types/database.js` · `src/hooks/{useAsyncData,usePageTitle}.js` · `src/layouts/MainLayout.jsx` · `src/services/portfolioService.js` · `src/services/supabase/{core,blog,certificates,experiences,messages,profiles,projects,skills,testimonials}.js` · `src/services/admin/overview.js` · `src/admin/components/{Repeater,ResourceForm,ResourceManager}.jsx` · `src/admin/config/resources.js` · `src/admin/pages/{MessagesPage,OverviewPage,SettingsPage}.jsx` · `src/components/ui/{DataBoundary,PortraitFrame}.jsx` · `src/components/{layout/Navbar,layout/Footer,project/ProjectImage,project/ProjectFilters,credential/CredentialLightbox,credential/TestimonialItem,contact/*}.jsx` · `src/pages/{Home,About,Skills,Projects,Blog,CV,Contact}.jsx`

### Checklist pengujian akhir
Hasil uji otomatis di PostgreSQL 16 + PostgREST + RLS asli (shim Auth/Storage; lihat `tests/e2e/README.md`) ditandai ✅. Item ⬜ perlu Anda cek di Supabase sungguhan.
- ✅ RLS: `rls_verification.sql` 78 pengecekan lulus (anon, pengguna biasa, admin, status pesan baru, bucket); migration idempoten & memetakan data lama.
- ✅ Login salah sandi, non-admin ditolak, login admin, sesi bertahan setelah refresh, logout, rute admin terkunci.
- ✅ CRUD UI: profil, proyek, keahlian, pengalaman, sertifikat, testimoni, blog (terbit & draf), terbit/draf cepat, hapus.
- ✅ Gambar: tolak txt→png, file kosong, GIF, SVG, >5 MB; preview sebelum simpan; tak ada upload sebelum Simpan; ganti → file lama terhapus; batal → tak ada upload; hapus baris → gambar terhapus; gambar modul lain aman; AVIF (uji unit).
- ✅ Publik: seluruh 11 halaman + 404 slug; konten dashboard tampil; draf proyek/artikel tersembunyi (juga saat admin login); slug detail; search/filter; CV menampilkan data terbaru; ubah profil/terbit-draf langsung tercermin.
- ✅ Pesan: validasi formulir; kirim → `messages` (status `new`); error jaringan menjaga isian; admin melihat/membaca/ubah status/arsip/hapus; pesan dibuka → otomatis dibaca; pengunjung lain & anon & pengguna biasa tidak bisa baca/ubah/hapus; anon tak bisa insert status selain `new`.
- ✅ Storage: anon & pengguna biasa tidak bisa upload/hapus (403).
- ✅ State: loading, kosong (DB kosong, tanpa halaman putih), error + "Coba lagi" pulih, foto/cover rusak → fallback.
- ✅ Responsif 375/768/1440 px publik & admin: tanpa scroll horizontal. Konsol tanpa error (selain pemutusan jaringan yang disimulasikan dan Google Fonts yang tak terjangkau di sandbox).
- ⬜ Jalankan migration + `rls_verification.sql` di proyek Supabase staging; uji upload nyata (termasuk bucket policy, URL publik, CORS), login Supabase Auth, dan Realtime tidak dipakai.
- ⬜ Tinjau tampilan visual di browser nyata (Safari/Firefox, perangkat sentuh) — hanya Chromium yang diuji.

### Batasan yang diketahui
- Belum ada anti-spam/rate limit pada formulir pesan (catatan 07A; disarankan Turnstile + Edge Function).
- Halaman publik membaca ulang saat navigasi/muat ulang, bukan realtime push.
- File di Storage yang tertinggal (mis. jaringan putus saat pembersihan) tidak ada pemulung otomatis; dapat dihapus manual lewat dashboard Storage.
- `bio` hanya dipakai sebagai cadangan ringkasan CV (belum punya seksi sendiri di halaman Tentang).
- Dokumen CV masih berupa URL (`cv_url`); tidak ada bucket khusus PDF (di luar lima bucket yang ditentukan).
# lana-portofolio
