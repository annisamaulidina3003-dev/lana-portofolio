/**
 * Data khusus CV digital (/cv). Bagian lain CV diambil dari file data yang sudah ada:
 *   pendidikan → about.js · keahlian → skills.js · pengalaman → experiences.js
 *   proyek → projects.js · kontak → contact.js · foto → profile.js
 *
 * - headline : jabatan/julukan singkat. null → otomatis "Siswa PPLG · <sekolah>".
 * - summary  : deskripsi profesional. null → memakai `profile.statement` (naskah awal).
 * - cvFile   : berkas PDF untuk tombol unduh. Saat ini PLACEHOLDER; ganti file di
 *              public/files/cv-rizky-maulana.pdf (atau ubah `url`) lalu set placeholder: false.
 * - featuredProjectSlugs : slug proyek pilihan. Kosong → 3 proyek pertama.
 *
 * Supabase: satu baris tabel `resume` (kolom sama; featured_project_slugs text[], cv_file jsonb).
 *
 * @typedef {Object} Resume
 * @property {string|null} headline
 * @property {string|null} summary
 * @property {{ url: string, fileName: string, placeholder: boolean }} cvFile
 * @property {string[]} featuredProjectSlugs
 */

/** @type {Resume} */
export const resume = {
  headline: null,
  summary:
    'Saya adalah siswa SMK Negeri 2 Banjarmasin jurusan Pengembangan Perangkat Lunak dan Gim (PPLG). Saya memiliki ketertarikan di bidang teknologi, khususnya pengembangan website dan desain UI/UX. Saya senang mempelajari hal baru, mampu bekerja sama dalam tim, bertanggung jawab, dan memiliki kemauan untuk terus berkembang.',
  cvFile: {
    url: '/files/cv-rizky-maulana.pdf',
    fileName: 'CV-M-Rizky-Maulana.pdf',
    placeholder: false,
  },
  featuredProjectSlugs: [],
};
