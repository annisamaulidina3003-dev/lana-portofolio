/**
 * Data halaman /pengalaman (dan ringkasannya di /tentang).
 *
 * ATURAN: hanya isi pengalaman yang benar-benar dialami.
 * Entri bertanda `placeholder: true` hanyalah contoh struktur. Untuk mengisi:
 *   1. isi field-nya, 2. ubah `placeholder` menjadi false,
 *   3. salin objek untuk menambah entri lain, hapus placeholder yang tak terpakai.
 *
 * @typedef {Object} Experience
 * @property {string} id
 * @property {'plk'|'organisasi'|'kepanitiaan'|'perlombaan'|'pekerjaan'} type
 * @property {string|null} title         // nama tempat PLK / organisasi / acara / lomba
 * @property {string|null} role          // peran / jabatan / hasil (mis. "Juara 2")
 * @property {string|null} organization  // instansi atau penyelenggara (opsional)
 * @property {string|null} location
 * @property {string|null} start         // 'YYYY-MM'
 * @property {string|null} end           // 'YYYY-MM'; null = masih berjalan
 * @property {string|null} description
 * @property {string[]} highlights       // poin-poin capaian (opsional)
 * @property {boolean} placeholder
 */

export const experienceTypes = [
  { key: 'plk', label: 'PLK', long: 'Praktik Kerja Lapangan', titleHint: 'Nama perusahaan / instansi PLK' },
  { key: 'organisasi', label: 'Organisasi', long: 'Keanggotaan dan jabatan organisasi', titleHint: 'Nama organisasi' },
  { key: 'kepanitiaan', label: 'Kepanitiaan', long: 'Kepanitiaan acara dan kegiatan', titleHint: 'Nama kepanitiaan / acara' },
  { key: 'perlombaan', label: 'Perlombaan', long: 'Lomba dan kompetisi yang diikuti', titleHint: 'Nama lomba' },
  { key: 'pekerjaan', label: 'Pekerjaan', long: 'Pengalaman kerja dan usaha', titleHint: 'Nama tempat / jenis pekerjaan' },
];

const blank = {
  title: null,
  role: null,
  organization: null,
  location: null,
  start: null,
  end: null,
  description: null,
  highlights: [],
  placeholder: true,
};

/** @type {Experience[]} */
export const experiences = [
  { ...blank, id: 'plk-1', type: 'plk' },
  { ...blank, id: 'organisasi-1', type: 'organisasi' },
  { ...blank, id: 'kepanitiaan-1', type: 'kepanitiaan' },
  { ...blank, id: 'perlombaan-1', type: 'perlombaan' },
  {
    ...blank,
    id: 'pekerjaan-1',
    type: 'pekerjaan',
    title: 'Membantu kegiatan berjualan',
    description: 'Pernah membantu kegiatan berjualan.',
    placeholder: false,
  },
];
