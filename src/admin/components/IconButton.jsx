import { cn } from '@/lib/cn';

/** Tombol ikon persegi dengan label aksesibel + tooltip. */
export default function IconButton({ icon: Icon, label, onClick, disabled, danger, className, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-10 w-10 items-center justify-center border border-transparent transition-colors disabled:pointer-events-none disabled:opacity-40',
        danger ? 'hover:border-ink hover:bg-ink hover:text-paper' : 'hover:border-ink',
        className,
      )}
      {...rest}
    >
      <Icon size={18} strokeWidth={1.6} aria-hidden />
    </button>
  );
}
