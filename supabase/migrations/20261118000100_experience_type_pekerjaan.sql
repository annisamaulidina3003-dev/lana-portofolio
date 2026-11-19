-- Tambah jenis pengalaman 'pekerjaan' (pengalaman kerja / usaha).
alter table public.experiences drop constraint experiences_type_valid;
alter table public.experiences
  add constraint experiences_type_valid
  check (type in ('plk', 'organisasi', 'kepanitiaan', 'perlombaan', 'pekerjaan'));
