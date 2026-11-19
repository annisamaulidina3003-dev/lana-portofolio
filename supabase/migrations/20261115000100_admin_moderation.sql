-- =============================================================================
-- 06 · MODERASI PESAN — kolom reviewed_by / reviewed_at diisi OLEH DATABASE
--
-- Dashboard Admin (Phase 07B) mengubah `messages.status`. Siapa yang menyetujui
-- dan kapan tidak boleh dipercayakan ke klien (yang bisa memalsukan nilainya),
-- jadi trigger ini yang mengisinya dari sesi Supabase Auth (auth.uid()):
--   • status berubah ke approved/rejected → reviewed_by = admin yang mengubah, reviewed_at = now()
--   • status kembali ke pending           → keduanya dikosongkan
--   • status tidak berubah                → keduanya dipertahankan (isian klien diabaikan)
-- Tidak mengubah RLS/GRANT yang sudah ada.
-- =============================================================================

create or replace function public.messages_track_review()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if new.status = 'pending' then
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

create trigger messages_track_review
  before update on public.messages
  for each row execute function public.messages_track_review();
