/**
 * Data kontak (halaman /kontak dan /cv).
 *
 * ATURAN KERAS: isi hanya dengan data yang sudah dikonfirmasi pemilik.
 * Nilai `null` tampil sebagai placeholder dan tidak dapat diklik.
 *
 * - location : dikonfirmasi pemilik (Banjarmasin, Indonesia).
 * - email    : isi dengan alamat asli, mis. 'nama@domain.com'.
 * - channels : isi `url` lengkap (https://…). `handle` opsional (mis. '@username');
 *              bila kosong, tampilan otomatis diturunkan dari URL.
 *
 * `socials` diturunkan otomatis dari `channels` yang sudah berisi URL
 * (bentuknya tetap sama seperti Phase 05, jadi halaman /cv tidak berubah).
 *
 * @typedef {{ id: string, label: string, url: string|null, handle: string|null, hint: string }} ContactChannel
 * @typedef {{ id: string, label: string, url: string }} SocialLink
 */

/** @type {ContactChannel[]} */
const channels = [
  { id: 'github', label: 'GitHub', url: null, handle: null, hint: 'URL profil GitHub belum diisi' },
  { id: 'instagram', label: 'Instagram', url: null, handle: null, hint: 'URL profil Instagram belum diisi' },
  { id: 'linkedin', label: 'LinkedIn', url: null, handle: null, hint: 'URL profil LinkedIn belum diisi' },
];

export const contact = {
  location: 'Banjarmasin, Indonesia',
  /** @type {string|null} */
  email: null,
  channels,
  /** @type {SocialLink[]} */
  socials: channels
    .filter((c) => c.url)
    .map(({ id, label, url }) => ({ id, label, url })),
};
