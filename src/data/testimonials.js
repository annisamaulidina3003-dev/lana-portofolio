/**
 * Data testimoni (halaman /sertifikat, bagian 03).
 *
 * ATURAN KERAS: hanya isi testimoni asli dari orang yang benar-benar memberikannya
 * (dan sudah setuju dipublikasikan). Tidak ada testimoni bawaan. Entri
 * `placeholder: true` hanyalah slot kosong per jenis; hapus atau isi.
 *
 * Foto: letakkan di public/images/testimonials/ lalu isi `photo` (opsional).
 *
 * Tabel Supabase yang disarankan: `testimonials`
 * (id, type, name, role, organization, message, photo, placeholder).
 *
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {'guru'|'teman'|'pengguna'|'plk'} type
 * @property {string|null} name
 * @property {string|null} role           // peran / hubungan
 * @property {string|null} organization   // opsional (mis. nama sekolah / perusahaan)
 * @property {string|null} message
 * @property {string|null} photo          // opsional
 * @property {boolean} placeholder
 */

export const testimonialTypes = [
  { key: 'guru', label: 'Guru Pembimbing', roleHint: 'Guru pembimbing' },
  { key: 'teman', label: 'Teman', roleHint: 'Teman' },
  { key: 'pengguna', label: 'Pengguna', roleHint: 'Pengguna aplikasi' },
  { key: 'plk', label: 'Tempat PLK', roleHint: 'Pembimbing / pihak tempat PLK' },
];

const blank = { name: null, role: null, organization: null, message: null, photo: null, placeholder: true };

/** @type {Testimonial[]} */
export const testimonials = testimonialTypes.map((t) => ({ ...blank, id: `testimoni-${t.key}`, type: t.key }));
