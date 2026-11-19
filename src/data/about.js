import { site } from './site';

/**
 * Data halaman /tentang.
 *
 * ATURAN: hanya isi dengan fakta yang benar. Nilai `null` = belum diisi dan
 * otomatis tampil sebagai placeholder di halaman.
 *
 * Cara mengisi:
 * - biodata   : ganti `value: null` dengan teks.
 * - education : isi `start`/`end` ('YYYY-MM') untuk SMK; untuk jenjang sebelumnya
 *               isi institution/program, lalu ubah `placeholder` menjadi false.
 *               Tambah entri baru dengan menyalin salah satu objek.
 * - interests : isi `name`, tambah/hapus sesuai kebutuhan.
 * - careerGoals: isi `headline` (kalimat utama), `description` (opsional), `dream` (cita-cita /
 *               profesi impian), `shortTerm` (tujuan jangka pendek), `longTerm` (jangka panjang).
 *
 * Struktur ini datar (id + kolom) sehingga mudah dipindah ke tabel Supabase.
 */
export const about = {
  bio:
    'Saya adalah siswa SMK Negeri 2 Banjarmasin jurusan Pengembangan Perangkat Lunak dan Gim (PPLG). Saya memiliki ketertarikan di bidang teknologi, khususnya pengembangan website dan desain UI/UX. Saya senang mempelajari hal baru, mampu bekerja sama dalam tim, bertanggung jawab, dan memiliki kemauan untuk terus berkembang.',

  biodata: [
    { id: 'nama', label: 'Nama Lengkap', value: site.name },
    { id: 'sekolah', label: 'Sekolah', value: site.school },
    { id: 'kelas', label: 'Kelas', value: site.className },
    { id: 'jurusan', label: 'Jurusan', value: 'Pengembangan Perangkat Lunak dan Gim (PPLG)' },
    { id: 'domisili', label: 'Domisili', value: site.location },
  ],

  education: [
    {
      id: 'edu-smk',
      level: 'SMK',
      institution: site.school,
      program: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
      note: `Saat ini kelas ${site.className}.`,
      start: null, // isi 'YYYY-MM'
      end: null, // kosongkan jika masih berjalan
      placeholder: false,
    },
    {
      id: 'edu-smp',
      level: 'SMP',
      institution: 'SMP Darul Hijrah Martapura',
      program: null,
      note: null,
      start: null,
      end: null,
      placeholder: false,
    },
    {
      id: 'edu-mi',
      level: 'MI',
      institution: 'MI Al-Hamid Kayu Tangi',
      program: null,
      note: null,
      start: null,
      end: null,
      placeholder: false,
    },
  ],

  interests: [
    { id: 'minat-1', name: 'Pengembangan Website' },
    { id: 'minat-2', name: 'Desain UI/UX' },
  ],

  careerGoals: {
    headline: null,
    description: null,
    dream: null, // mis. 'Full-stack Developer'
    shortTerm: null, // mis. tujuan 1–2 tahun ke depan
    longTerm: null, // mis. tujuan 5–10 tahun ke depan
  },
};
