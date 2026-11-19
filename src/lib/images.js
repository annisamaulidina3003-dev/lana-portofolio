/**
 * Aturan & validasi gambar untuk upload Storage.
 * Batas HARUS sama dengan bucket (supabase/migrations/…_storage.sql):
 * maks. 5 MB; JPEG / PNG / WebP / AVIF; SVG tidak diizinkan (dapat memuat skrip).
 * Database/Storage tetap penjaga terakhir — validasi di sini memberi umpan balik cepat.
 */

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_MAX_DIMENSION = 8000; // piksel, sisi terpanjang
export const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
export const IMAGE_ACCEPT = Object.keys(IMAGE_TYPES).join(',');
export const IMAGE_RULE_TEXT = 'JPG, PNG, WebP, atau AVIF · maks. 5 MB';

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Path Storage (mis. "proyek/ab12.webp") — BUKAN URL absolut, "//host", atau path situs ("/images/…").
 * Hanya path Storage yang boleh dihapus oleh aplikasi.
 */
export const isStoragePath = (value) =>
  typeof value === 'string' && value.trim() !== '' && !/^(https?:)?\/\//i.test(value) && !value.startsWith('/');

const ascii = (bytes, from, to) => String.fromCharCode(...bytes.slice(from, to));

/** Deteksi tipe sebenarnya dari byte awal berkas (bukan dari ekstensi / file.type yang bisa dipalsukan). */
export function sniffImageType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && ascii(bytes, 1, 4) === 'PNG' && bytes[4] === 0x0d && bytes[5] === 0x0a) {
    return 'image/png';
  }
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'image/webp';
  if (bytes.length >= 12 && ascii(bytes, 4, 8) === 'ftyp') {
    const brands = ascii(bytes, 8, Math.min(bytes.length, 32));
    if (brands.includes('avif') || brands.includes('avis')) return 'image/avif';
  }
  return null;
}

async function readHead(file) {
  const buf = await file.slice(0, 32).arrayBuffer();
  return new Uint8Array(buf);
}

/** Muat gambar untuk memastikan benar-benar dapat didekode dan mengambil dimensinya. */
export function readImageSize(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('decode'));
    };
    img.src = url;
  });
}

/**
 * @param {File} file
 * @param {{ decode?: boolean }} [options]
 * @returns {Promise<{ ok: true, type: string, ext: string, width: number|null, height: number|null } | { ok: false, message: string }>}
 */
export async function validateImageFile(file, { decode = true } = {}) {
  if (!file) return { ok: false, message: 'Pilih file gambar terlebih dahulu.' };
  if (file.size === 0) return { ok: false, message: 'File kosong (0 byte).' };
  if (file.size > IMAGE_MAX_BYTES) {
    return { ok: false, message: `Ukuran file ${formatBytes(file.size)} melebihi batas ${formatBytes(IMAGE_MAX_BYTES)}.` };
  }
  if (file.type && !IMAGE_TYPES[file.type]) {
    return { ok: false, message: `Format ${file.type.replace('image/', '').toUpperCase() || 'file'} tidak didukung. Gunakan ${IMAGE_RULE_TEXT.split(' · ')[0]}.` };
  }

  let sniffed;
  try {
    sniffed = sniffImageType(await readHead(file));
  } catch {
    return { ok: false, message: 'File tidak dapat dibaca. Coba pilih ulang.' };
  }
  if (!sniffed) return { ok: false, message: 'Isi file bukan gambar JPG, PNG, WebP, atau AVIF yang valid.' };
  if (file.type && file.type !== sniffed) {
    return { ok: false, message: 'Tipe file tidak sesuai dengan isinya. Pilih file gambar yang asli.' };
  }

  let width = null;
  let height = null;
  if (decode) {
    try {
      ({ width, height } = await readImageSize(file));
    } catch {
      return { ok: false, message: 'Gambar rusak atau tidak dapat ditampilkan oleh browser ini.' };
    }
    if (Math.max(width, height) > IMAGE_MAX_DIMENSION) {
      return { ok: false, message: `Dimensi ${width}×${height}px terlalu besar (maks. ${IMAGE_MAX_DIMENSION}px). Perkecil gambar terlebih dahulu.` };
    }
  }
  return { ok: true, type: sniffed, ext: IMAGE_TYPES[sniffed], width, height };
}
