/**
 * Data sertifikat (halaman /sertifikat, bagian 01).
 *
 * ATURAN: hanya isi sertifikat yang benar-benar dimiliki. Entri `placeholder: true`
 * hanyalah contoh struktur (field kosong). Untuk mengisi: lengkapi field, ubah
 * `placeholder` ke false, salin objek untuk menambah entri.
 *
 * Gambar: letakkan di public/images/certificates/ lalu isi image.src
 * (mis. '/images/certificates/nama.jpg').
 *
 * Struktur datar & JSON-friendly → tabel Supabase `certificates`
 * (kolom: id, title, issuer, issued_at, category, description, credential_url,
 * placeholder; `image` sebagai jsonb atau dua kolom image_src / image_alt).
 *
 * @typedef {Object} Certificate
 * @property {string} id
 * @property {string|null} title
 * @property {string|null} issuer          // penyelenggara
 * @property {string|null} issuedAt        // 'YYYY-MM' atau 'YYYY-MM-DD'
 * @property {string|null} category        // key di certificateCategories
 * @property {{ src: string, alt: string }|null} image
 * @property {string|null} description
 * @property {string|null} credentialUrl   // tautan verifikasi (opsional)
 * @property {boolean} placeholder
 */

export const certificateCategories = [
  { key: 'kursus', label: 'Kursus' },
  { key: 'pelatihan', label: 'Pelatihan' },
  { key: 'kompetensi', label: 'Uji Kompetensi' },
  { key: 'lainnya', label: 'Lainnya' },
];

const blank = {
  title: null,
  issuer: null,
  issuedAt: null,
  category: null,
  image: null,
  description: null,
  credentialUrl: null,
  placeholder: true,
};

/** @type {Certificate[]} */
export const certificates = [
  { ...blank, id: 'sertifikat-1' },
  { ...blank, id: 'sertifikat-2' },
];
