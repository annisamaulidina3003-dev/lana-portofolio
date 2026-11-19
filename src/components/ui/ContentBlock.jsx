import { cn } from '@/lib/cn';
import Reveal from '@/components/motion/Reveal';

const sizes = {
  md: 'text-[clamp(1.75rem,4vw,3.25rem)]',
  lg: 'text-[clamp(2.5rem,7vw,6rem)]',
};

/** Blok konten bernomor: garis tebal, indeks mono, judul oversized. */
export default function ContentBlock({ index, title, size = 'md', className, children }) {
  return (
    <Reveal as="section" className={className}>
      <div className="flex items-baseline gap-4 border-t border-ink pt-4">
        <span className="label text-ink">{index}</span>
        <h2
          className={cn(
            'font-display font-extrabold uppercase leading-[0.95] tracking-[-0.03em] font-stretch-display',
            sizes[size],
          )}
        >
          {title}
        </h2>
      </div>
      <div className="mt-8 md:mt-10">{children}</div>
    </Reveal>
  );
}
