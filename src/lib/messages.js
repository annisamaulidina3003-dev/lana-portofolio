import { messageCategories } from '@/data/messages';

/** Batas panjang input — dipakai validasi, atribut maxLength, dan penghitung karakter. */
export const LIMITS = {
  name: { min: 2, max: 60 },
  email: { max: 120 },
  subject: { min: 3, max: 100 },
  message: { min: 10, max: 1000 },
};

/** Urutan field di formulir (dipakai untuk fokus ke error pertama). */
export const FIELD_ORDER = ['name', 'email', 'category', 'subject', 'message'];

export const emptyDraft = { name: '', email: '', category: '', subject: '', message: '' };

// local@domain.tld — tanpa spasi, domain punya titik, TLD minimal 2 huruf.
const EMAIL_RE = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/;
export const isValidEmail = (value) => EMAIL_RE.test(value);

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/** Mengembalikan pesan error (string) atau undefined bila valid. */
export function validateField(field, rawValue) {
  const value = clean(rawValue);

  switch (field) {
    case 'name':
      if (!value) return 'Nama lengkap wajib diisi.';
      if (value.length < LIMITS.name.min) return `Nama minimal ${LIMITS.name.min} karakter.`;
      if (value.length > LIMITS.name.max) return `Nama maksimal ${LIMITS.name.max} karakter.`;
      return undefined;
    case 'email':
      if (!value) return 'Email wajib diisi.';
      if (value.length > LIMITS.email.max) return `Email maksimal ${LIMITS.email.max} karakter.`;
      if (!isValidEmail(value)) return 'Format email tidak valid. Contoh: nama@domain.com';
      return undefined;
    case 'category':
      if (!value) return 'Pilih salah satu kategori pesan.';
      if (!messageCategories.some((c) => c.key === value)) return 'Kategori tidak dikenal.';
      return undefined;
    case 'subject':
      if (!value) return 'Subjek wajib diisi.';
      if (value.length < LIMITS.subject.min) return `Subjek minimal ${LIMITS.subject.min} karakter.`;
      if (value.length > LIMITS.subject.max) return `Subjek maksimal ${LIMITS.subject.max} karakter.`;
      return undefined;
    case 'message':
      if (!value) return 'Isi pesan wajib diisi.';
      if (value.length < LIMITS.message.min) {
        return `Isi pesan minimal ${LIMITS.message.min} karakter (baru ${value.length}).`;
      }
      if (value.length > LIMITS.message.max) return `Isi pesan maksimal ${LIMITS.message.max} karakter.`;
      return undefined;
    default:
      return undefined;
  }
}

/** { field: 'pesan error' } — objek kosong berarti seluruh input valid. */
export function validateDraft(draft) {
  const errors = {};
  FIELD_ORDER.forEach((field) => {
    const error = validateField(field, draft[field]);
    if (error) errors[field] = error;
  });
  return errors;
}

/** Rapikan spasi di tepi sebelum dikirim / disimpan. */
export function normalizeDraft(draft) {
  return {
    name: clean(draft.name),
    email: clean(draft.email),
    category: clean(draft.category),
    subject: clean(draft.subject),
    message: clean(draft.message),
  };
}

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Bentuk satu baris pesan sesuai skema tabel `messages`.
 * Pesan baru selalu 'new' (belum dibaca admin).
 * @returns {import('@/data/messages').GuestMessage}
 */
export function createMessageRecord(draft) {
  return {
    id: makeId(),
    ...normalizeDraft(draft),
    created_at: new Date().toISOString(),
    status: 'new',
  };
}

export const getCategoryLabel = (key) => messageCategories.find((c) => c.key === key)?.label ?? key;

/** Urutkan terbaru di atas. */
export const sortByCreatedDesc = (list) =>
  [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
