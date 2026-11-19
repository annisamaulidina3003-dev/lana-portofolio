import { experienceTypes } from '@/data';
import { formatPeriod } from './format';

export const getTypeMeta = (key) => experienceTypes.find((t) => t.key === key);

/** Urutkan terbaru dulu; entri tanpa tanggal ditaruh paling bawah. */
export const sortByStartDesc = (list) =>
  [...list].sort((a, b) => (b.start ?? '').localeCompare(a.start ?? ''));

/** Ubah satu data pengalaman menjadi props <TimelineEntry />. */
export function toEntryProps(exp, { withTag = false } = {}) {
  const meta = getTypeMeta(exp.type);
  const subtitle = [exp.role, exp.organization, exp.location].filter(Boolean).join(' · ') || null;
  return {
    period: formatPeriod(exp.start, exp.end),
    title: exp.title,
    titleHint: meta?.titleHint,
    subtitle,
    description: exp.description,
    highlights: exp.highlights ?? [],
    tag: withTag ? meta?.label : undefined,
    placeholder: exp.placeholder,
  };
}
