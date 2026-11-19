const MENIT = 60_000;

/** '5 Jan 2026, 14.30' (zona waktu perangkat). */
export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** 'baru saja', '5 menit lalu', '3 hari lalu'; lebih dari 7 hari → tanggal. */
export function formatRelative(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const diff = Date.now() - d.getTime();
  if (diff < MENIT) return 'baru saja';
  if (diff < 60 * MENIT) return `${Math.floor(diff / MENIT)} menit lalu`;
  if (diff < 24 * 60 * MENIT) return `${Math.floor(diff / (60 * MENIT))} jam lalu`;
  if (diff < 7 * 24 * 60 * MENIT) return `${Math.floor(diff / (24 * 60 * MENIT))} hari lalu`;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const truncate = (text, max = 140) => (text && text.length > max ? `${text.slice(0, max).trimEnd()}…` : text ?? '');
