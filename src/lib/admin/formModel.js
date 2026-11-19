import { isValidEmail } from '@/lib/messages';

/**
 * Model form generik untuk modul CRUD admin.
 *
 * Definisi field: { name, label, type, required, hint, placeholder, options | optionsFor(values),
 *   minLength, maxLength, min, max, integer, rows, defaultValue, validate(value, values),
 *   showIf(values), width: 'full'|'half', from (slug), allowRelative (url),
 *   itemFields / itemLabel / addLabel (repeater) }
 * type: text | textarea | email | url | number | date | select | switch | slug | image (+ bucket)
 *     | tags (string[]) | lines (string[] — satu per baris) | repeater (array objek) | section
 */

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const slugify = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

export const makeKey = () => Math.random().toString(36).slice(2, 10);
export const optionsOf = (field, values) => (field.optionsFor ? field.optionsFor(values) : field.options ?? []);
const trim = (v) => (typeof v === 'string' ? v.trim() : v);
const dataFields = (fields) => fields.filter((f) => f.type !== 'section');

function itemToValues(itemFields, item = {}) {
  const out = { _key: makeKey() };
  itemFields.forEach((f) => {
    const raw = item[f.name] ?? f.defaultValue;
    out[f.name] = raw == null ? '' : String(raw);
  });
  return out;
}

/** Baris database → nilai form (semua string/boolean/array yang aman untuk input). */
export function rowToValues(fields, row = {}) {
  const values = {};
  dataFields(fields).forEach((f) => {
    const raw = row[f.name] ?? f.defaultValue;
    switch (f.type) {
      case 'switch': values[f.name] = Boolean(raw); break;
      case 'tags': values[f.name] = Array.isArray(raw) ? [...raw] : []; break;
      case 'lines': values[f.name] = Array.isArray(raw) ? raw.join('\n') : ''; break;
      case 'repeater': values[f.name] = (Array.isArray(raw) ? raw : []).map((it) => itemToValues(f.itemFields, it)); break;
      default: values[f.name] = raw == null ? '' : String(raw);
    }
  });
  return values;
}

function itemToRow(itemFields, item) {
  const row = {};
  let meaningful = false;
  itemFields.forEach((f) => {
    if (f.showIf && !f.showIf(item)) return;
    const v = trim(item[f.name]);
    if (v === '' || v == null) return;
    row[f.name] = v;
    if (f.type !== 'select') meaningful = true;
  });
  return meaningful ? row : null;
}

/** Nilai form → objek siap kirim ke database (string kosong → null untuk kolom opsional). */
export function valuesToRow(fields, values) {
  const row = {};
  dataFields(fields).forEach((f) => {
    const v = values[f.name];
    switch (f.type) {
      case 'switch': row[f.name] = Boolean(v); break;
      case 'tags': row[f.name] = [...new Set(v.map(trim).filter(Boolean))]; break;
      case 'lines': row[f.name] = v.split('\n').map(trim).filter(Boolean); break;
      case 'repeater': row[f.name] = v.map((it) => itemToRow(f.itemFields, it)).filter(Boolean); break;
      case 'number': { const t = trim(v); row[f.name] = t === '' ? null : Number(t); break; }
      // Gambar pending sudah diganti path Storage oleh uploadPendingImages sebelum fungsi ini dipanggil.
      case 'image': { row[f.name] = typeof v === 'string' && v.trim() ? v.trim() : null; break; }
      default: { const t = trim(v); row[f.name] = t === '' ? (f.required ? '' : null) : t; }
    }
  });
  return row;
}

const isEmpty = (f, v) => {
  if (f.type === 'switch') return false;
  if (Array.isArray(v)) return v.length === 0;
  return trim(v) === '' || v == null;
};

/** Pesan error (string) atau undefined. Untuk repeater: array string. */
export function validateField(f, value, values) {
  if (f.showIf && !f.showIf(values)) return undefined;
  if (isEmpty(f, value)) return f.required ? `${f.label} wajib diisi.` : undefined;
  const t = trim(value);

  switch (f.type) {
    case 'email':
      if (!isValidEmail(t)) return 'Format email tidak valid. Contoh: nama@domain.com';
      break;
    case 'url':
      if (!(f.allowRelative ? /^(https?:\/\/|\/)/i : /^https?:\/\//i).test(t)) {
        return f.allowRelative ? 'URL harus diawali http://, https://, atau /' : 'URL harus diawali http:// atau https://';
      }
      break;
    case 'slug':
      if (!SLUG_RE.test(t)) return 'Slug hanya boleh huruf kecil, angka, dan tanda hubung. Contoh: proyek-saya';
      break;
    case 'number': {
      const n = Number(t);
      if (!Number.isFinite(n)) return `${f.label} harus berupa angka.`;
      if (f.integer && !Number.isInteger(n)) return `${f.label} harus bilangan bulat.`;
      if (f.min != null && n < f.min) return `${f.label} minimal ${f.min}.`;
      if (f.max != null && n > f.max) return `${f.label} maksimal ${f.max}.`;
      break;
    }
    case 'date':
      if (!/^\d{4}-\d{2}-\d{2}$/.test(t) || Number.isNaN(Date.parse(t))) return 'Tanggal tidak valid.';
      break;
    case 'select':
      if (!optionsOf(f, values).some((o) => o.value === t)) return 'Pilihan tidak valid.';
      break;
    case 'repeater': {
      const problems = [];
      value.forEach((item, i) => {
        f.itemFields.forEach((sf) => {
          const err = validateField(sf, item[sf.name], item);
          if (err) problems.push(`${f.itemLabel ?? 'Baris'} ${i + 1} · ${sf.label}: ${err}`);
        });
      });
      return problems.length ? problems : undefined;
    }
    default:
  }

  if (typeof t === 'string') {
    if (f.minLength != null && t.length < f.minLength) return `${f.label} minimal ${f.minLength} karakter.`;
    if (f.maxLength != null && t.length > f.maxLength) return `${f.label} maksimal ${f.maxLength} karakter.`;
  }
  return f.validate ? f.validate(t, values) : undefined;
}

/** { namaField: pesan | string[] } — kosong berarti valid. */
export function validateValues(fields, values) {
  const errors = {};
  dataFields(fields).forEach((f) => {
    const err = validateField(f, values[f.name], values);
    if (err) errors[f.name] = err;
  });
  return errors;
}

/** Perbandingan "ada perubahan?" yang mengabaikan kunci internal `_key`. */
export const snapshot = (values) =>
  JSON.stringify(values, (k, v) => {
    if (k === '_key' || k === 'previewUrl') return undefined;
    if (typeof File !== 'undefined' && v instanceof File) return `file:${v.name}:${v.size}:${v.lastModified}`;
    return v;
  });
