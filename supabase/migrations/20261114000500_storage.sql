-- =============================================================================
-- 05 · STORAGE — bucket gambar + policy
--
-- • Kelima bucket bersifat PUBLIC: file dapat diakses lewat URL publik
--   (/storage/v1/object/public/<bucket>/<path>) TANPA policy SELECT. Karena itu
--   sengaja tidak ada policy baca untuk anon — pengunjung tidak bisa mendaftar
--   (list) isi bucket, hanya membuka file yang URL-nya diketahui.
-- • Upload / ubah / hapus / daftar file: hanya admin (public.is_admin()).
-- • Batas 5 MB per file; hanya gambar raster (SVG tidak diizinkan: dapat memuat skrip).
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile-images',     'profile-images',     true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('project-images',     'project-images',     true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('certificate-images', 'certificate-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('testimonial-images', 'testimonial-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('blog-images',        'blog-images',        true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects sudah ber-RLS pada Supabase; cukup tambahkan policy.
create policy portfolio_images_admin_select on storage.objects
  for select to authenticated
  using (
    bucket_id in ('profile-images', 'project-images', 'certificate-images', 'testimonial-images', 'blog-images')
    and (select public.is_admin())
  );

create policy portfolio_images_admin_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('profile-images', 'project-images', 'certificate-images', 'testimonial-images', 'blog-images')
    and (select public.is_admin())
  );

create policy portfolio_images_admin_update on storage.objects
  for update to authenticated
  using (
    bucket_id in ('profile-images', 'project-images', 'certificate-images', 'testimonial-images', 'blog-images')
    and (select public.is_admin())
  )
  with check (
    bucket_id in ('profile-images', 'project-images', 'certificate-images', 'testimonial-images', 'blog-images')
    and (select public.is_admin())
  );

create policy portfolio_images_admin_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('profile-images', 'project-images', 'certificate-images', 'testimonial-images', 'blog-images')
    and (select public.is_admin())
  );
