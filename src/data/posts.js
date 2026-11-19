/**
 * Data blog pengembang (/blog dan /blog/:slug).
 *
 * KONTEN DEMONSTRASI: tiga artikel di bawah bertanda `placeholder: true`. Isinya
 * catatan teknis umum untuk memperlihatkan tampilan blog — bukan tulisan Rizky,
 * dan tanggal terbitnya sengaja kosong. Ganti atau hapus saat artikel asli siap
 * (ubah `placeholder` ke false dan isi `publishedAt` 'YYYY-MM-DD').
 *
 * `content` berupa daftar blok sehingga mudah disimpan sebagai jsonb di Supabase:
 *   { type: 'heading',   text }
 *   { type: 'paragraph', text }
 *   { type: 'list',      items: string[] }
 *   { type: 'code',      language, code }
 *   { type: 'quote',     text }
 * Estimasi waktu membaca dihitung otomatis dari `content`.
 *
 * Gambar sampul: public/images/blog/ → cover: { src: '/images/blog/x.jpg', alt: '…' }.
 *
 * Tabel Supabase yang disarankan: `posts`
 * (id, slug, title, category, published_at, excerpt, cover jsonb, content jsonb, placeholder).
 *
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} category
 * @property {string|null} publishedAt      // 'YYYY-MM-DD'
 * @property {string} excerpt
 * @property {{ src: string, alt: string }|null} cover
 * @property {Array<Object>} content
 * @property {boolean} placeholder
 */

/** @type {Post[]} */
export const posts = [
  {
    id: 'artikel-1',
    slug: 'contoh-memahami-state-di-react',
    title: 'Contoh: Memahami State di React',
    category: 'React',
    publishedAt: null,
    excerpt: 'Catatan singkat tentang cara useState menyimpan data yang berubah pada sebuah komponen.',
    cover: null,
    placeholder: true,
    content: [
      { type: 'paragraph', text: 'State adalah data yang boleh berubah selama komponen tampil di layar. Setiap kali state berubah, React menggambar ulang komponen tersebut agar tampilan selalu sesuai dengan datanya.' },
      { type: 'heading', text: 'Memakai useState' },
      { type: 'paragraph', text: 'Hook useState mengembalikan dua hal: nilai saat ini dan fungsi untuk mengubahnya. Nilai awal ditulis sebagai argumen.' },
      { type: 'code', language: 'jsx', code: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Klik: {count}\n    </button>\n  );\n}" },
      { type: 'heading', text: 'Hal yang perlu diingat' },
      { type: 'list', items: ['Jangan ubah state secara langsung; selalu pakai fungsi setter.', 'Pembaruan state bersifat asinkron, jadi nilainya baru terlihat pada render berikutnya.', 'Simpan hanya data yang memang memengaruhi tampilan.'] },
    ],
  },
  {
    id: 'artikel-2',
    slug: 'contoh-dasar-tailwind-css',
    title: 'Contoh: Dasar Tailwind CSS',
    category: 'CSS',
    publishedAt: null,
    excerpt: 'Pengantar pendekatan utility-first: menyusun tampilan langsung dari kelas-kelas kecil di markup.',
    cover: null,
    placeholder: true,
    content: [
      { type: 'paragraph', text: 'Tailwind CSS menyediakan kelas utilitas kecil seperti px-4, border, dan text-lg. Tampilan disusun dengan menggabungkan kelas-kelas itu langsung pada elemen, tanpa berpindah ke berkas CSS terpisah.' },
      { type: 'code', language: 'html', code: '<button class="border border-black px-4 py-2 hover:bg-black hover:text-white">\n  Kirim\n</button>' },
      { type: 'quote', text: 'Konsistensi datang dari batasan: jarak, warna, dan ukuran diambil dari skala yang sama.' },
      { type: 'heading', text: 'Kelebihan' },
      { type: 'list', items: ['Tidak perlu memikirkan nama class untuk setiap elemen.', 'Gaya responsif ditulis dengan prefiks, misalnya md:px-8.', 'CSS yang tidak terpakai dibuang saat build.'] },
    ],
  },
  {
    id: 'artikel-3',
    slug: 'contoh-alur-kerja-git',
    title: 'Contoh: Alur Kerja Git yang Rapi',
    category: 'Git',
    publishedAt: null,
    excerpt: 'Tiga perintah dasar untuk menyimpan perubahan dan mengirimnya ke repositori GitHub.',
    cover: null,
    placeholder: true,
    content: [
      { type: 'paragraph', text: 'Git mencatat riwayat perubahan kode. Alur harian yang paling sederhana terdiri dari tiga langkah: tandai perubahan, simpan dengan pesan yang jelas, lalu kirim ke repositori jarak jauh.' },
      { type: 'code', language: 'bash', code: 'git add .\ngit commit -m "Tambah halaman galeri proyek"\ngit push origin main' },
      { type: 'heading', text: 'Menulis pesan commit' },
      { type: 'paragraph', text: 'Pesan commit yang baik singkat dan menjelaskan apa yang berubah. Dengan begitu riwayat proyek mudah dibaca, baik oleh diri sendiri maupun orang lain.' },
    ],
  },
];
