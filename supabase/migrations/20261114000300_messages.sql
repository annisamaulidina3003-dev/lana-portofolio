-- =============================================================================
-- 03 · MESSAGES — kesan & pesan pengunjung (formulir /kontak + buku tamu)
-- Skema sama dengan src/data/messages.js; batas panjang sama dengan src/lib/messages.js.
-- =============================================================================

create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,                          -- PRIVAT: tidak pernah tampil di buku tamu
  category    text not null,
  subject     text not null,
  message     text not null,
  status      text not null default 'pending',        -- pending → approved | rejected (oleh admin)
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint messages_category_valid check (category in ('kesan', 'pesan', 'saran', 'pertanyaan')),
  constraint messages_status_valid   check (status in ('pending', 'approved', 'rejected')),
  constraint messages_name_len       check (char_length(btrim(name)) between 2 and 60),
  constraint messages_email_format   check (char_length(email) <= 120 and email ~* '^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$'),
  constraint messages_subject_len    check (char_length(btrim(subject)) between 3 and 100),
  constraint messages_message_len    check (char_length(btrim(message)) between 10 and 1000)
);

create index messages_status_created_idx on public.messages (status, created_at desc);
create index messages_category_idx on public.messages (category) where status = 'approved';
create index messages_email_idx on public.messages (lower(email));

create trigger messages_set_updated_at
  before update on public.messages
  for each row execute function public.set_updated_at();

-- ── View publik untuk buku tamu ─────────────────────────────────────────────
-- RLS bekerja per BARIS, bukan per kolom, sehingga pengunjung tidak diberi akses
-- SELECT ke tabel `messages` sama sekali (email ikut terbaca). Buku tamu membaca
-- view ini: hanya pesan 'approved' dan tanpa kolom email/moderasi.
-- View berjalan dengan hak pemilik (security_invoker = off) — memang disengaja,
-- karena isinya sudah dibatasi pada baris & kolom yang aman dipublikasikan.
create view public.guestbook_messages
with (security_barrier = true, security_invoker = false)
as
select id, name, category, subject, message, created_at
from public.messages
where status = 'approved';

comment on view public.guestbook_messages is
  'Pesan buku tamu yang sudah disetujui, tanpa email. Satu-satunya jalur baca publik untuk messages.';
