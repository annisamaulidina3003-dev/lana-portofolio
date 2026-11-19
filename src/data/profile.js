/**
 * Konten beranda. Silakan ubah sesuai keinginan.
 *
 * - photo: letakkan foto di public/images/ lalu isi, mis. '/images/rizky.jpg'
 *          (rasio 4:5 paling pas). Selama null, tampil placeholder monogram.
 * - statement: kalimat personal branding — ini naskah awal, bebas diganti.
 * - focusSkills: berasal dari jurusan (PPLG) dan teknologi yang dipakai membangun
 *          situs ini. Rincian keahlian sesungguhnya diisi nanti di skills.js.
 */
export const profile = {
  photo: '/images/rizky.jpg',
  photoAlt: 'Potret M. Rizky Maulana',
  statement:
    'Siswa SMK Negeri 2 Banjarmasin jurusan PPLG yang tertarik pada pengembangan website dan desain UI/UX.',
  focusSkills: [
    { id: 'pplg', name: 'PPLG', label: 'Jurusan', note: 'Pengembangan Perangkat Lunak dan Gim' },
    { id: 'react', name: 'React JS', label: 'Library', note: 'Antarmuka berbasis komponen' },
    { id: 'tailwind', name: 'Tailwind CSS', label: 'Styling', note: 'CSS utility-first' },
    { id: 'framer', name: 'Framer Motion', label: 'Animasi', note: 'Animasi antarmuka untuk React' },
  ],
  ticker: ['Portofolio Digital', 'PPLG', 'React JS', 'Tailwind CSS', 'Framer Motion', 'Banjarmasin'],
};
