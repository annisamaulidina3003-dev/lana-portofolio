/**
 * Struktur pesan (formulir kesan-pesan + buku tamu).
 *
 * ── Skema yang siap dipetakan ke Supabase (tabel `messages`, Phase 07) ──────────
 *   id          uuid        primary key (default gen_random_uuid())
 *   name        text        nama pengirim
 *   email       text        email pengirim — PRIVAT, jangan tampil di buku tamu
 *   category    text        'kesan' | 'pesan' | 'saran' | 'pertanyaan'
 *   subject     text
 *   message     text
 *   created_at  timestamptz default now()
 *   status      text        'new' | 'read' | 'archived'  (diubah hanya oleh admin)
 *
 * Pengunjung hanya dapat MENGIRIM pesan (status selalu 'new'); membaca, mengubah status,
 * dan menghapus pesan hanya bisa dilakukan admin lewat Dashboard (RLS).
 *
 * @typedef {'kesan'|'pesan'|'saran'|'pertanyaan'} MessageCategory
 * @typedef {'new'|'read'|'archived'} MessageStatus
 * @typedef {Object} GuestMessage
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {MessageCategory} category
 * @property {string} subject
 * @property {string} message
 * @property {string} created_at      // ISO 8601
 * @property {MessageStatus} status
 */

export const messageCategories = [
  { key: 'kesan', label: 'Kesan', hint: 'Cerita atau pendapatmu' },
  { key: 'pesan', label: 'Pesan', hint: 'Hal yang ingin disampaikan' },
  { key: 'saran', label: 'Saran', hint: 'Masukan untuk perbaikan' },
  { key: 'pertanyaan', label: 'Pertanyaan', hint: 'Sesuatu yang ingin ditanyakan' },
];

export const messageStatuses = [
  { key: 'new', label: 'Baru' },
  { key: 'read', label: 'Dibaca' },
  { key: 'archived', label: 'Diarsipkan' },
];

/**
 * DATA DEMONSTRASI — BUKAN pesan dari pengunjung sungguhan.
 * Hanya dipakai pada mode data lokal (tanpa Supabase) untuk memperlihatkan tampilan
 * buku tamu; antarmuka selalu memberi label "Demo". Mode Supabase tidak memakainya.
 *
 * @type {GuestMessage[]}
 */
export const demoMessages = [
  {
    id: 'demo-1',
    name: 'Contoh Pengunjung 1',
    email: 'contoh1@example.com',
    category: 'kesan',
    subject: 'Contoh tampilan kesan',
    message:
      'Ini contoh isi pesan kategori Kesan. Teks ini hanya untuk memperlihatkan tata letak buku tamu, bukan kesan dari pengunjung sungguhan.',
    created_at: '2026-01-05T09:00:00+08:00',
    status: 'read',
  },
  {
    id: 'demo-2',
    name: 'Contoh Pengunjung 2',
    email: 'contoh2@example.com',
    category: 'saran',
    subject: 'Contoh tampilan saran',
    message:
      'Ini contoh isi pesan kategori Saran. Pesan yang lebih panjang akan membungkus ke baris berikutnya dan tetap terbaca rapi di layar kecil maupun besar.',
    created_at: '2026-01-04T14:30:00+08:00',
    status: 'read',
  },
  {
    id: 'demo-3',
    name: 'Contoh Pengunjung 3',
    email: 'contoh3@example.com',
    category: 'pertanyaan',
    subject: 'Contoh tampilan pertanyaan',
    message: 'Ini contoh isi pesan kategori Pertanyaan. Tidak ada pertanyaan asli di sini.',
    created_at: '2026-01-03T10:15:00+08:00',
    status: 'read',
  },
  {
    id: 'demo-4',
    name: 'Contoh Pengunjung 4',
    email: 'contoh4@example.com',
    category: 'pesan',
    subject: 'Contoh tampilan pesan',
    message: 'Ini contoh isi pesan kategori Pesan. Data ini fiktif dan akan diganti pesan asli setelah backend terhubung.',
    created_at: '2026-01-02T19:45:00+08:00',
    status: 'read',
  },
];
