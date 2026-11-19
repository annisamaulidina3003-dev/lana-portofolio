import { cn } from '@/lib/cn';
import SafeImage from '@/components/ui/SafeImage';
import Placeholder from '@/components/ui/Placeholder';
import Reveal from '@/components/motion/Reveal';

/** Empat komposisi yang berputar agar daftar tidak monoton. */
const layouts = [
  { col: 'md:col-span-8', quote: 'text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.15] tracking-tight', big: true },
  { col: 'md:col-span-4 md:mt-24', quote: 'text-lead' },
  { col: 'md:col-span-5 md:col-start-2', quote: 'text-lead' },
  { col: 'md:col-span-6 md:col-start-7 md:-mt-6', quote: 'text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-snug tracking-tight' },
];

function Avatar({ photo, name }) {
  if (!photo) return null;
  // Foto gagal dimuat → tidak menampilkan apa pun (testimoni tetap terbaca tanpa avatar).
  return <SafeImage src={photo} alt={`Foto ${name ?? 'pemberi testimoni'}`} loading="lazy" className="h-14 w-14 shrink-0 border border-ink object-cover grayscale" />;
}

/** `typeLabel` = label jenis testimoni (mis. "Guru Pembimbing"). */
export default function TestimonialItem({ item, index, typeLabel, roleHint }) {
  const layout = layouts[index % layouts.length];

  return (
    <Reveal as="figure" className={cn('col-span-12', layout.col)}>
      <div className={cn('border-t border-ink pt-4', item.placeholder && 'border-dashed border-line-strong')}>
        <div className="flex items-baseline justify-between gap-4">
          <span className="label text-ink">{typeLabel}</span>
          {item.placeholder && <span className="label">Placeholder</span>}
        </div>

        <span aria-hidden className="mt-4 block font-display text-[5rem] font-extrabold leading-[0.6] tracking-tighter">“</span>

        <blockquote className={cn('mt-2', layout.quote, item.placeholder && 'text-mute')}>
          {item.message ?? <Placeholder>Isi testimoni belum diisi — hanya testimoni asli yang boleh ditampilkan.</Placeholder>}
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-4">
          <Avatar photo={item.photo} name={item.name} />
          <div>
            <p className="font-display text-lg font-bold uppercase leading-tight tracking-tight">
              {item.name ?? <Placeholder>Nama pemberi testimoni</Placeholder>}
            </p>
            <p className="label mt-1">
              {item.role ?? <Placeholder>{roleHint}</Placeholder>}
              {item.organization && ` · ${item.organization}`}
            </p>
          </div>
        </figcaption>
      </div>
    </Reveal>
  );
}
