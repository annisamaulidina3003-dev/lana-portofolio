import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Navigasi halaman sederhana: Sebelumnya / Berikutnya + ringkasan rentang. */
export default function Pagination({ page, pageSize, total, onChange, disabled }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn =
    'inline-flex h-10 items-center gap-1 border border-ink px-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-35';

  return (
    <nav aria-label="Paginasi" className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p className="label tabular-nums text-ink" aria-live="polite">
        {from}–{to} dari {total} · Hal. {page}/{pages}
      </p>
      <div className="flex gap-2">
        <button type="button" className={btn} disabled={disabled || page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={14} aria-hidden /> Sebelumnya
        </button>
        <button type="button" className={btn} disabled={disabled || page >= pages} onClick={() => onChange(page + 1)}>
          Berikutnya <ChevronRight size={14} aria-hidden />
        </button>
      </div>
    </nav>
  );
}
