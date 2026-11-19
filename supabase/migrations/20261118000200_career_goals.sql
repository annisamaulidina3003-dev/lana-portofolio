-- Perluas "Tujuan & Cita-cita Karier": cita-cita/profesi impian, tujuan jangka pendek, dan jangka panjang.
-- Kolom opsional; hak tabel & RLS profiles yang ada sudah berlaku (grant dan policy tingkat tabel).
alter table public.profiles
  add column if not exists career_dream      text,
  add column if not exists career_short_term text,
  add column if not exists career_long_term  text;

alter table public.profiles
  add constraint profiles_career_dream_len      check (career_dream is null or char_length(career_dream) <= 160),
  add constraint profiles_career_short_term_len check (career_short_term is null or char_length(career_short_term) <= 1000),
  add constraint profiles_career_long_term_len  check (career_long_term is null or char_length(career_long_term) <= 1000);
