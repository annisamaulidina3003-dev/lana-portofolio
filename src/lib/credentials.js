import { certificateCategories, achievementCategories } from '@/data';
import { formatDate } from './format';

const labelOf = (list, key) => list.find((c) => c.key === key)?.label ?? null;

/** Urut terbaru dulu; tanpa tanggal di paling bawah. */
export const sortByDateDesc = (list, field) =>
  [...list].sort((a, b) => (b[field] ?? '').localeCompare(a[field] ?? ''));

/** Samakan bentuk sertifikat & prestasi agar bisa dipakai komponen yang sama. */
export const certificateView = (c) => ({
  id: c.id,
  kind: 'sertifikat',
  title: c.title,
  titleHint: 'Nama sertifikat belum diisi',
  orgLabel: 'Penerbit',
  org: c.issuer,
  date: formatDate(c.issuedAt),
  category: labelOf(certificateCategories, c.category),
  tag: null,
  image: c.image,
  description: c.description,
  url: c.credentialUrl,
  placeholder: c.placeholder,
});

export const achievementView = (a) => ({
  id: a.id,
  kind: 'prestasi',
  title: a.title,
  titleHint: 'Nama prestasi belum diisi',
  orgLabel: 'Penyelenggara',
  org: a.organizer,
  date: formatDate(a.achievedAt),
  category: labelOf(achievementCategories, a.category),
  tag: a.rank,
  image: a.image,
  description: a.description,
  url: null,
  placeholder: a.placeholder,
});
