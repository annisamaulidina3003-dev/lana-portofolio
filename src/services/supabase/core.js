import { requireSupabase } from '@/lib/supabase';

/** Nama bucket Storage (harus sama dengan supabase/migrations/…_storage.sql). */
export const BUCKETS = {
  profile: 'profile-images',
  project: 'project-images',
  certificate: 'certificate-images',
  testimonial: 'testimonial-images',
  blog: 'blog-images',
};

/** Nilai { data, error } dari supabase-js → data, atau lempar Error berkode. */
export function unwrap({ data, error }) {
  if (error) {
    const err = new Error(error.message || 'Permintaan ke Supabase gagal.');
    err.code = error.code;
    err.details = error.details;
    throw err;
  }
  return data;
}

/** Tabel/view tertentu dari klien bersama. */
export const table = (name) => requireSupabase().from(name);

/**
 * Path Storage → URL publik. URL absolut (https://…) dan path situs ('/images/…')
 * dibiarkan apa adanya, sehingga gambar lama di public/ tetap bisa dipakai.
 */
export function resolveImageUrl(bucket, src) {
  if (!src) return null;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return src;
  return requireSupabase().storage.from(bucket).getPublicUrl(src).data.publicUrl;
}

/** Hanya izinkan tautan http(s) — hindari skema berbahaya seperti javascript:. */
export const safeUrl = (value) => (typeof value === 'string' && /^https?:\/\//i.test(value) ? value : null);

/** '2026-01-31' → '2026-01' */
export const toYearMonth = (date) => (date ? String(date).slice(0, 7) : null);

/** Escape karakter khusus pola LIKE/ILIKE. */
export const escapeLike = (term) => term.replace(/[\\%_]/g, (c) => `\\${c}`);

/**
 * Permintaan identik yang sedang berjalan dipakai bersama (satu halaman sering memanggil
 * getSite/getAbout/getContact sekaligus → satu request, bukan empat). Tidak ada cache
 * setelah selesai, sehingga perubahan dari dashboard selalu terbaca pada pemuatan berikutnya.
 */
const inflight = new Map();
export function shared(key, fn) {
  if (!inflight.has(key)) {
    inflight.set(key, Promise.resolve().then(fn).finally(() => inflight.delete(key)));
  }
  return inflight.get(key);
}

/** 'YYYY-MM-DD' (UTC) — sama dengan current_date di server untuk aturan artikel terjadwal. */
export const todayIso = () => new Date().toISOString().slice(0, 10);
