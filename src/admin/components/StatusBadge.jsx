import { cn } from '@/lib/cn';

const tones = {
  solid: 'border-ink bg-ink text-paper',
  outline: 'border-ink text-ink',
  dashed: 'border-dashed border-ink text-ink',
  muted: 'border-line-strong text-mute',
};

/** Lencana kecil bergaya mono untuk status/kategori. tone: solid | outline | dashed | muted */
export default function StatusBadge({ tone = 'outline', children, className }) {
  return (
    <span className={cn('inline-flex items-center border px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.12em]', tones[tone], className)}>
      {children}
    </span>
  );
}

export const PublishBadge = ({ published }) =>
  published ? <StatusBadge tone="solid">Terbit</StatusBadge> : <StatusBadge tone="dashed">Draf</StatusBadge>;
