-- =============================================================================
-- 07 · KOTAK MASUK PESAN — status baru / dibaca / diarsipkan, tanpa baca publik
--
-- Alasan perubahan (Phase 07C):
--   1. Dashboard mengelola pesan sebagai kotak masuk: status `new`, `read`,
--      `archived` (sebelumnya alur moderasi pending/approved/rejected).
--   2. Pengunjung TIDAK boleh membaca pesan pengunjung lain. Karena itu view
--      publik `guestbook_messages` dihapus; tabel `messages` kini hanya dapat
--      dibaca admin. Pengunjung tetap dapat MENGIRIM pesan (INSERT lima kolom).
--
-- Data lama dipetakan: pending → new · approved → read · rejected → archived.
-- Seluruh langkah idempotent terhadap data kosong; aman dijalankan satu kali.
-- =============================================================================

-- 1. Tutup jalur baca publik ---------------------------------------------------
drop view if exists public.guestbook_messages;

-- 2. Status baru -------------------------------------------------------------
-- Constraint dilepas lebih dulu agar nilai lama boleh dipetakan.
alter table public.messages drop constraint if exists messages_status_valid;

update public.messages
set status = case status
  when 'pending'  then 'new'
  when 'approved' then 'read'
  when 'rejected' then 'archived'
  else status
end
where status in ('pending', 'approved', 'rejected');

alter table public.messages alter column status set default 'new';
alter table public.messages
  add constraint messages_status_valid check (status in ('new', 'read', 'archived'));

comment on column public.messages.status is
  'new = belum dibaca · read = sudah dibaca · archived = diarsipkan. Diubah hanya oleh admin.';

-- 3. Index: indeks parsial lama merujuk status "approved" (buku tamu publik) ---
drop index if exists public.messages_category_idx;
create index messages_category_idx on public.messages (category);

-- 4. Pengunjung hanya boleh membuat pesan berstatus `new` ---------------------
drop policy if exists messages_visitor_insert on public.messages;
create policy messages_visitor_insert on public.messages
  for insert to anon, authenticated
  with check (status = 'new' and reviewed_by is null and reviewed_at is null);

-- 5. Trigger penelusuran: kolom reviewed_* = "siapa & kapan menangani" ---------
--   • status berubah ke read/archived → reviewed_by = admin, reviewed_at = now()
--   • status kembali ke new           → keduanya dikosongkan
--   • status tidak berubah            → dipertahankan (isian klien diabaikan)
create or replace function public.messages_track_review()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if new.status = 'new' then
      new.reviewed_by := null;
      new.reviewed_at := null;
    else
      new.reviewed_by := (select auth.uid());
      new.reviewed_at := now();
    end if;
  else
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
  end if;
  return new;
end;
$$;
