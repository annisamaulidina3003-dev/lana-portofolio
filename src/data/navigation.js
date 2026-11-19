/**
 * Sumber tunggal untuk navigasi, indeks halaman, dan meta halaman.
 * Deskripsi bersifat umum (fungsi halaman), bukan klaim tentang pemilik.
 */
export const pages = [
  { key: 'beranda', index: '00', label: 'Beranda', path: '/' },
  {
    key: 'tentang', index: '01', label: 'Tentang', path: '/tentang',
    eyebrow: 'Profil',
    description: 'Perkenalan singkat tentang latar belakang, minat, dan arah belajar.',
    dataSource: 'src/data/about.js',
  },
  {
    key: 'keahlian', index: '02', label: 'Keahlian', path: '/keahlian',
    eyebrow: 'Kompetensi',
    description: 'Kemampuan teknis dan nonteknis yang dikuasai.',
    dataSource: 'src/data/skills.js',
  },
  {
    key: 'proyek', index: '03', label: 'Proyek', path: '/proyek',
    eyebrow: 'Karya',
    description: 'Galeri karya dan proyek yang pernah dikerjakan.',
    dataSource: 'src/data/projects.js',
  },
  {
    key: 'pengalaman', index: '04', label: 'Pengalaman', path: '/pengalaman',
    eyebrow: 'Perjalanan',
    description: 'Rekam jejak pengalaman belajar, organisasi, dan praktik kerja.',
    dataSource: 'src/data/experiences.js',
  },
  {
    key: 'sertifikat', index: '05', label: 'Sertifikat', path: '/sertifikat',
    eyebrow: 'Pencapaian',
    description: 'Sertifikat, penghargaan, dan prestasi.',
    dataSource: 'src/data/certificates.js',
  },
  {
    key: 'blog', index: '06', label: 'Blog', path: '/blog',
    eyebrow: 'Tulisan',
    description: 'Artikel dan catatan seputar teknologi dan proses belajar.',
    dataSource: 'src/data/posts.js',
  },
  {
    key: 'kontak', index: '07', label: 'Kontak', path: '/kontak',
    eyebrow: 'Sapa',
    description: 'Cara menghubungi dan terhubung.',
    dataSource: 'src/data/contact.js',
  },
  {
    key: 'cv', index: '08', label: 'CV', path: '/cv',
    eyebrow: 'Dokumen',
    description: 'Ringkasan profil dalam format CV digital.',
    dataSource: 'src/data/site.js + src/data/experiences.js',
  },
];

export const getPage = (key) => pages.find((p) => p.key === key);

/** Link utama di navbar desktop (tanpa Beranda & CV; CV berupa tombol). */
export const primaryNav = pages.filter((p) => !['beranda', 'cv'].includes(p.key));

/** Halaman selain Beranda — untuk indeks & footer. */
export const sectionPages = pages.filter((p) => p.key !== 'beranda');
