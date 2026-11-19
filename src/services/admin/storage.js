import { requireSupabase } from '@/lib/supabase';
import { BUCKETS } from '@/services/supabase/core';
import { isStoragePath, validateImageFile } from '@/lib/images';
import { AUTH_EXPIRED_EVENT, AdminServiceError, describeError } from './core';

/**
 * Upload / hapus gambar di Supabase Storage (lima bucket publik, lihat migration 05).
 * Hak tulis hanya milik admin — ditegakkan oleh policy storage.objects (is_admin()),
 * bukan oleh kode ini. Aplikasi hanya memakai anon key + sesi admin.
 */

export const bucketName = (key) => {
  const name = BUCKETS[key];
  if (!name) throw new AdminServiceError(`Bucket tidak dikenal: ${key}`, { code: 'BUCKET' });
  return name;
};

const newId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

/** Error Storage → pesan Bahasa Indonesia. */
export function describeStorageError(error) {
  const raw = String(error?.message ?? '');
  const status = Number(error?.statusCode ?? error?.status);
  const base = describeError(error, status);
  if (base.authExpired || base.code === 'NETWORK') return base;
  if (status === 403 || /row-level security|unauthorized|not authorized/i.test(raw)) {
    return { code: '42501', message: 'Akses ditolak: hanya admin yang boleh mengunggah atau menghapus gambar.' };
  }
  if (status === 413 || /exceeded|too large|maximum allowed size/i.test(raw)) {
    return { code: 'TOO_LARGE', message: 'Ukuran file melebihi batas 5 MB yang diizinkan Storage.' };
  }
  if (/mime type|not supported|invalid.*type/i.test(raw)) {
    return { code: 'MIME', message: 'Format file ditolak oleh Storage. Gunakan JPG, PNG, WebP, atau AVIF.' };
  }
  if (status === 404 || /bucket not found/i.test(raw)) {
    return { code: 'BUCKET', message: 'Bucket Storage tidak ditemukan. Jalankan migration 20261114000500_storage.sql.' };
  }
  if (status === 409 || /already exists|duplicate/i.test(raw)) {
    return { code: 'EXISTS', message: 'File dengan nama yang sama sudah ada. Coba unggah ulang.' };
  }
  return { code: error?.code, message: raw || 'Upload gambar gagal. Coba lagi.' };
}

function fail(error) {
  const d = describeStorageError(error);
  if (d.authExpired && typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  return new AdminServiceError(d.message, { code: d.code, cause: error });
}

/**
 * Validasi ulang lalu unggah satu gambar. Nama file dibuat acak (uuid) dan ekstensi
 * diambil dari tipe hasil deteksi, bukan dari nama berkas pengguna.
 * @returns {Promise<string>} path di bucket (disimpan di kolom *_path / images jsonb)
 */
export async function uploadImage({ bucket, file, folder }) {
  const check = await validateImageFile(file, { decode: false });
  if (!check.ok) throw new AdminServiceError(check.message, { code: 'INVALID_IMAGE' });

  const name = bucketName(bucket);
  const safeFolder = String(folder ?? '').replace(/[^a-z0-9-]/gi, '').toLowerCase();
  const path = `${safeFolder ? `${safeFolder}/` : ''}${newId()}.${check.ext}`;

  let res;
  try {
    res = await requireSupabase().storage.from(name).upload(path, file, {
      contentType: check.type,
      cacheControl: '31536000', // nama unik per upload → aman di-cache lama
      upsert: false,
    });
  } catch (e) {
    throw fail(e);
  }
  if (res.error) throw fail(res.error);
  return path;
}

/**
 * Hapus gambar dari Storage (hanya path Storage; URL eksternal & /images/… diabaikan).
 * Tidak melempar: mengembalikan { removed, failed } supaya pemanggil memutuskan.
 * RLS yang menolak penghapusan muncul sebagai data kosong tanpa error, jadi dicek per path.
 * @param {Array<{ bucket: string, path: string }>} items
 */
export async function removeImages(items) {
  const byBucket = new Map();
  items.filter((i) => isStoragePath(i.path)).forEach((i) => {
    byBucket.set(i.bucket, [...new Set([...(byBucket.get(i.bucket) ?? []), i.path])]);
  });

  const removed = [];
  const failed = [];
  for (const [bucket, paths] of byBucket) {
    try {
      const { data, error } = await requireSupabase().storage.from(bucketName(bucket)).remove(paths);
      if (error) throw error;
      const gone = new Set((data ?? []).map((o) => o.name));
      paths.forEach((p) => (gone.has(p) ? removed : failed).push({ bucket, path: p }));
    } catch {
      paths.forEach((p) => failed.push({ bucket, path: p }));
    }
  }
  return { removed, failed };
}
