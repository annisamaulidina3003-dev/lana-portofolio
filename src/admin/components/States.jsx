import { AlertCircle, Inbox, Loader2, RotateCw } from 'lucide-react';

export function ListSkeleton({ rows = 5 }) {
  return (
    <div role="status" aria-label="Memuat data" className="border-t border-ink">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-line py-5">
          <div className="h-3 w-6 animate-pulse bg-fog" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 animate-pulse bg-fog" />
            <div className="h-3 w-1/3 animate-pulse bg-fog" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div role="status" className="flex flex-col items-center border border-dashed border-line-strong px-6 py-16 text-center">
      <Inbox size={34} strokeWidth={1.25} aria-hidden className="text-mute" />
      <p className="mt-5 font-display text-2xl font-bold uppercase leading-none tracking-tight">{title}</p>
      {description && <p className="mt-3 max-w-sm text-mute">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 border border-ink p-6">
      <p className="flex items-start gap-2 font-medium">
        <AlertCircle size={18} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
        {message || 'Data gagal dimuat.'}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="inline-flex h-10 items-center gap-2 border border-ink px-4 font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-ink hover:text-paper">
          <RotateCw size={14} aria-hidden /> Coba lagi
        </button>
      )}
    </div>
  );
}

export const Spinner = ({ className }) => <Loader2 size={16} aria-hidden className={`animate-spin ${className ?? ''}`} />;
