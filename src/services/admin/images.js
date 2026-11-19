import { isStoragePath } from '@/lib/images';
import { uploadImage, removeImages } from './storage';

/**
 * Orkestrasi gambar untuk form admin. Nilai kolom gambar di form berupa:
 *   • string  — path Storage, URL, atau path situs yang sudah tersimpan
 *   • PendingImage { kind:'pending-image', file, previewUrl, … } — dipilih, belum diunggah
 * File baru baru diunggah saat admin menekan Simpan (preview lokal sebelum itu).
 */

export const isPendingImage = (v) => Boolean(v) && typeof v === 'object' && v.kind === 'pending-image';

/** Terapkan fn ke setiap nilai gambar (field datar maupun sub-field repeater) → objek nilai baru. */
export function mapImageValues(fields, values, fn) {
  const out = { ...values };
  fields.forEach((f) => {
    if (f.type === 'image') {
      out[f.name] = fn(values[f.name], f);
    } else if (f.type === 'repeater' && f.itemFields.some((sf) => sf.type === 'image')) {
      out[f.name] = (values[f.name] ?? []).map((item) => {
        const next = { ...item };
        f.itemFields.forEach((sf) => {
          if (sf.type === 'image') next[sf.name] = fn(item[sf.name], sf);
        });
        return next;
      });
    }
  });
  return out;
}

/** Semua path Storage yang direferensikan oleh nilai form → [{ bucket, path }]. */
export function collectStorageImages(fields, values) {
  const found = [];
  mapImageValues(fields, values, (v, f) => {
    if (typeof v === 'string' && isStoragePath(v)) found.push({ bucket: f.bucket, path: v.trim() });
    return v;
  });
  return found;
}

/**
 * Unggah semua gambar yang masih pending. Jika salah satu gagal, yang sudah terunggah
 * pada pemanggilan ini dihapus kembali (tidak meninggalkan file yatim).
 * @returns {Promise<{ values: object, uploaded: Array<{bucket:string, path:string}> }>}
 */
export async function uploadPendingImages(fields, values, folder) {
  const pending = [];
  mapImageValues(fields, values, (v, f) => {
    if (isPendingImage(v)) pending.push({ v, bucket: f.bucket });
    return v;
  });
  if (!pending.length) return { values, uploaded: [] };

  const paths = new Map();
  const uploaded = [];
  try {
    for (const { v, bucket } of pending) {
      const path = await uploadImage({ bucket, file: v.file, folder });
      paths.set(v, path);
      uploaded.push({ bucket, path });
    }
  } catch (err) {
    if (uploaded.length) await removeImages(uploaded);
    throw err;
  }
  return { values: mapImageValues(fields, values, (v) => (isPendingImage(v) ? paths.get(v) : v)), uploaded };
}

/** Path Storage yang ada di `before` tetapi sudah tidak dipakai di `after` (diganti / dihapus). */
export function findStaleImages(fields, before, after) {
  const keep = new Set(collectStorageImages(fields, after).map((i) => `${i.bucket}/${i.path}`));
  return collectStorageImages(fields, before).filter((i) => !keep.has(`${i.bucket}/${i.path}`));
}
