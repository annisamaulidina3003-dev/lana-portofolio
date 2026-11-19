/**
 * Data halaman /proyek dan /proyek/:slug.
 *
 * ATURAN: hanya isi proyek yang benar-benar dikerjakan. Entri bertanda
 * `placeholder: true` hanyalah contoh struktur — semua field faktual dibiarkan
 * kosong (null / []) dan tampil sebagai placeholder di halaman.
 *
 * Cara mengisi: 1) isi field, 2) ubah `placeholder` menjadi false,
 * 3) salin objek untuk menambah proyek lain, hapus placeholder yang tak terpakai.
 *
 * Struktur ini sengaja datar dan JSON-friendly agar bisa dipetakan langsung
 * ke tabel Supabase `projects` pada Phase 07:
 *   - kolom skalar  : id, slug, name, category, description, problem, objective,
 *                     role, demo_url, github_url, placeholder
 *   - kolom array   : technologies (text[]), features (text[])
 *   - kolom jsonb   : images, documentation, feedback
 *
 * @typedef {Object} ProjectImage
 * @property {string} src
 * @property {string} alt
 * @property {string} [caption]
 *
 * @typedef {Object} ProjectDocStep
 * @property {string} title
 * @property {string} description
 * @property {string} [date]        // 'YYYY-MM'
 * @property {string} [image]
 *
 * @typedef {Object} ProjectFeedback
 * @property {string} name
 * @property {string} [role]
 * @property {string} message
 *
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} slug                    // dipakai di URL: /proyek/:slug
 * @property {string} name
 * @property {string|null} category           // salah satu key di projectCategories
 * @property {string|null} description        // boleh beberapa paragraf (pisahkan dengan baris kosong)
 * @property {string|null} problem
 * @property {string|null} objective
 * @property {string|null} role
 * @property {string[]} technologies
 * @property {string[]} features
 * @property {{ cover: ProjectImage|null, screenshots: ProjectImage[] }} images
 * @property {string|null} demoUrl
 * @property {string|null} githubUrl
 * @property {ProjectDocStep[]} documentation
 * @property {ProjectFeedback[]} feedback     // hanya feedback asli dari pengguna
 * @property {boolean} placeholder
 */

/** Taksonomi kategori untuk filter. Tambah/ubah sesuai kebutuhan. */
export const projectCategories = [
  { key: 'web', label: 'Aplikasi Web' },
  { key: 'mobile', label: 'Aplikasi Mobile' },
  { key: 'desktop', label: 'Aplikasi Desktop' },
  { key: 'game', label: 'Gim' },
  { key: 'desain', label: 'Desain UI/UX' },
  { key: 'lainnya', label: 'Lainnya' },
];

const blank = {
  category: null,
  description: null,
  problem: null,
  objective: null,
  role: null,
  technologies: [],
  features: [],
  images: { cover: null, screenshots: [] },
  demoUrl: null,
  githubUrl: null,
  documentation: [],
  feedback: [],
  placeholder: true,
};

/** @type {Project[]} */
export const projects = [
  {
    ...blank, id: 'tari-tradisional', slug: 'website-pembelajaran-tari-tradisional', name: 'Website Pembelajaran Tari Tradisional',
    category: 'web', description: 'Website pembelajaran tari tradisional.', placeholder: false,
  },
  {
    ...blank, id: 'profil-guru-pai', slug: 'website-profil-guru-pai', name: 'Website Profil Guru PAI (Bu Ratna Dewi)',
    category: 'web', description: 'Website profil Guru PAI, Bu Ratna Dewi.', placeholder: false,
  },
  {
    ...blank, id: 'e-learning-nova', slug: 'website-e-learning-nova', name: 'Website E-Learning Nova',
    category: 'web', description: 'Website e-learning Nova.', placeholder: false,
  },
  {
    ...blank, id: 'absensi-siswa', slug: 'website-absensi-siswa', name: 'Website Absensi Siswa',
    category: 'web', description: 'Website absensi siswa.', placeholder: false,
  },
  {
    ...blank, id: 'profil-team-nova', slug: 'website-profil-team-nova-startup', name: 'Website Profil Team Nova Startup',
    category: 'web', description: 'Website profil Team Nova Startup.', placeholder: false,
  },
  {
    ...blank, id: 'refleksi', slug: 'website-refleksi', name: 'Website Refleksi',
    category: 'web', description: 'Website refleksi yang dibuat menggunakan PHP dan Tailwind CSS.',
    technologies: ['PHP', 'Tailwind CSS'], placeholder: false,
  },
];
