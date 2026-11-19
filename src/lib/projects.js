import { projectCategories } from '@/data';

export const getCategoryLabel = (key) => projectCategories.find((c) => c.key === key)?.label ?? null;

/** '1' → '01' */
export const padIndex = (n) => String(n).padStart(2, '0');

/** Pecah teks panjang menjadi paragraf (dipisah baris kosong). */
export const toParagraphs = (text) =>
  (text ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

/** Daftar teknologi unik dari seluruh proyek, urut abjad. */
export function collectTechnologies(list) {
  const set = new Set();
  list.forEach((p) => p.technologies.forEach((t) => set.add(t)));
  return [...set].sort((a, b) => a.localeCompare(b, 'id'));
}

export const countByCategory = (list, key) => list.filter((p) => p.category === key).length;
export const countByTechnology = (list, tech) => list.filter((p) => p.technologies.includes(tech)).length;

export const emptyFilters = { query: '', category: 'all', technology: 'all' };

export const hasActiveFilters = (f) =>
  f.query.trim() !== '' || f.category !== 'all' || f.technology !== 'all';

/** Cari berdasarkan nama (tanpa peka huruf besar/kecil) + kategori + teknologi. */
export function filterProjects(list, { query, category, technology }) {
  const q = query.trim().toLowerCase();
  return list.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (category === 'all' || p.category === category) &&
      (technology === 'all' || p.technologies.includes(technology)),
  );
}
