const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** 'YYYY-MM' → 'Jan 2025' (atau 'YYYY' bila bulan tidak ada). */
export function formatMonth(value) {
  if (!value) return null;
  const [year, month] = String(value).split('-');
  if (!month) return year;
  return `${BULAN[Number(month) - 1] ?? ''} ${year}`.trim();
}

/** start/end 'YYYY-MM' → 'Jan 2025 — Jun 2025'. Tanpa start → null. Tanpa end → 'Sekarang'. */
export function formatPeriod(start, end) {
  const from = formatMonth(start);
  if (!from) return null;
  const to = end ? formatMonth(end) : 'Sekarang';
  return from === to ? from : `${from} — ${to}`;
}

export const hasNumber = (v) => typeof v === 'number' && !Number.isNaN(v);
export const clampPercent = (v) => Math.min(100, Math.max(0, v));

/** 'YYYY-MM-DD' → '14 Nov 2026'; 'YYYY-MM' → 'Nov 2026'; kosong → null. */
export function formatDate(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-');
  if (!month) return year;
  const m = `${BULAN[Number(month) - 1] ?? ''} ${year}`.trim();
  return day ? `${Number(day)} ${m}` : m;
}

/** ISO 8601 ('2026-01-05T09:00:00+08:00') → '5 Jan 2026' (zona waktu perangkat). Tidak valid → null. */
export function formatIsoDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}
