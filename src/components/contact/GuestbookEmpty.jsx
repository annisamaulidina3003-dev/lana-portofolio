import { MessageSquareDashed } from 'lucide-react';
import TextLink from '@/components/ui/TextLink';

/** Tampil saat belum ada pesan (atau tidak ada pesan pada kategori terpilih). */
export default function GuestbookEmpty({ categoryLabel, emptyText, formHref = '#formulir' }) {
  return (
    <div role="status" className="flex flex-col items-center border border-dashed border-line-strong px-6 py-16 text-center md:py-24">
      <MessageSquareDashed size={36} strokeWidth={1.25} aria-hidden className="text-mute" />
      <p className="mt-6 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold uppercase leading-none tracking-tight">
        {categoryLabel ? `Belum ada ${categoryLabel.toLowerCase()}` : 'Belum ada pesan'}
      </p>
      <p className="mt-4 max-w-sm text-mute">
        {categoryLabel
          ? 'Belum ada pesan pada kategori ini.'
          : emptyText ?? 'Buku tamu masih kosong. Jadilah yang pertama menulis kesan atau pesan.'}
      </p>
      <TextLink href={formHref} className="label mt-8">Tulis pesan ↑</TextLink>
    </div>
  );
}
