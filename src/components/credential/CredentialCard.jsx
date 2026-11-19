import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { padIndex } from '@/lib/projects';
import Button from '@/components/ui/Button';
import Placeholder from '@/components/ui/Placeholder';
import Reveal from '@/components/motion/Reveal';
import ProjectImage from '@/components/project/ProjectImage';

/** Komposisi asimetris yang berputar; kelas ditulis utuh agar terbaca Tailwind. */
const layouts = [
  { col: 'md:col-span-7', ratio: 'aspect-[4/3]' },
  { col: 'md:col-span-5 md:mt-28', ratio: 'aspect-[4/3]' },
  { col: 'md:col-span-4', ratio: 'aspect-[4/3]' },
  { col: 'md:col-span-4 md:mt-16', ratio: 'aspect-[4/3]' },
  { col: 'md:col-span-4 md:mt-32', ratio: 'aspect-[4/3]' },
  { col: 'md:col-span-6 md:col-start-2', ratio: 'aspect-[16/10]' },
];

/** Kartu sertifikat/prestasi. Klik gambar → onOpen (lightbox). */
export default function CredentialCard({ item, index, onOpen }) {
  const layout = layouts[index % layouts.length];
  const number = padIndex(index + 1);

  return (
    <Reveal as="article" className={cn('col-span-12', layout.col)}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Lihat gambar: ${item.title ?? item.titleHint}`}
        className="group relative block w-full cursor-zoom-in text-left"
      >
        <ProjectImage
          src={item.image?.src}
          alt={item.image?.alt ?? `Gambar ${item.kind} belum tersedia`}
          number={number}
          ratio={layout.ratio}
        />
        <span className="absolute inset-0 flex items-end justify-end p-3">
          <span className="translate-y-2 bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            Perbesar +
          </span>
        </span>
      </button>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink pt-3">
        <span className="label text-ink">{number}</span>
        <span className="label text-right">
          {item.category ?? <Placeholder>Kategori</Placeholder>}
          {' · '}
          {item.date ?? <Placeholder>Tanggal</Placeholder>}
        </span>
      </div>

      <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] font-stretch-display">
        {item.title ?? <Placeholder className="font-bold">{item.titleHint}</Placeholder>}
      </h3>
      {item.tag && <p className="label mt-2 text-ink">{item.tag}</p>}

      <p className="mt-3 text-ink-soft">
        <span className="label mr-2">{item.orgLabel}</span>
        {item.org ?? <Placeholder>Belum diisi</Placeholder>}
      </p>
      <p className="mt-2 line-clamp-2 max-w-md text-small text-ink-soft">
        {item.description ?? <Placeholder>Deskripsi singkat belum diisi</Placeholder>}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={onOpen}>Lihat Gambar</Button>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
            className="label inline-flex items-center gap-1 text-ink hover:underline"
          >
            Verifikasi <ArrowUpRight size={12} />
          </a>
        )}
        {item.placeholder && <span className="label">Placeholder</span>}
      </div>
    </Reveal>
  );
}
