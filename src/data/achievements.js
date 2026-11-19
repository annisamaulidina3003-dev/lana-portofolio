/**
 * Data prestasi (halaman /sertifikat, bagian 02).
 *
 * ATURAN: hanya isi prestasi yang benar-benar diraih. Entri `placeholder: true`
 * hanyalah contoh struktur. Ubah `placeholder` ke false setelah diisi.
 *
 * Tabel Supabase yang disarankan: `achievements`
 * (id, title, organizer, rank, achieved_at, category, description, placeholder, image jsonb).
 *
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string|null} title
 * @property {string|null} organizer      // penyelenggara
 * @property {string|null} rank           // mis. 'Juara 2' (opsional)
 * @property {string|null} achievedAt     // 'YYYY-MM' atau 'YYYY-MM-DD'
 * @property {string|null} category       // key di achievementCategories
 * @property {{ src: string, alt: string }|null} image
 * @property {string|null} description
 * @property {boolean} placeholder
 */

export const achievementCategories = [
  { key: 'lomba', label: 'Lomba' },
  { key: 'akademik', label: 'Akademik' },
  { key: 'organisasi', label: 'Organisasi' },
  { key: 'lainnya', label: 'Lainnya' },
];

const blank = {
  title: null,
  organizer: null,
  rank: null,
  achievedAt: null,
  category: null,
  image: null,
  description: null,
  placeholder: true,
};

/** @type {Achievement[]} */
export const achievements = [
  { ...blank, id: 'prestasi-1' },
  { ...blank, id: 'prestasi-2' },
];
