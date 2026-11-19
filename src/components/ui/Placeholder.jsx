import { cn } from '@/lib/cn';

/** Penanda inline untuk data yang belum diisi (garis putus-putus, warna redup). */
export default function Placeholder({ children = 'Belum diisi', className }) {
  return (
    <span className={cn('inline-block border-b border-dashed border-mute text-mute', className)}>
      {children}
    </span>
  );
}
