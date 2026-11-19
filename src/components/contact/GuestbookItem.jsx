import { cn } from '@/lib/cn';
import { formatIsoDate } from '@/lib/format';
import { getCategoryLabel } from '@/lib/messages';
import Reveal from '@/components/motion/Reveal';

const origins = {
  demo: { tag: 'Demo', note: 'Data demonstrasi — bukan dari pengunjung sungguhan' },
  local: { tag: 'Lokal · belum terkirim', note: 'Hanya ada di browser ini' },
  sent: { tag: 'Terkirim', note: 'Pesan yang kamu kirim di sesi ini — hanya terlihat olehmu' },
};

/**
 * Satu pesan di buku tamu. `origin`: 'demo' | 'local' (simulasi) | 'sent' (terkirim ke database, hanya terlihat pengirimnya).
 * Email pengirim sengaja TIDAK ditampilkan.
 */
export default function GuestbookItem({ item, index }) {
  const origin = origins[item.origin];
  const date = formatIsoDate(item.created_at);

  return (
    <Reveal
      as="li"
      className={cn(
        'grid grid-cols-12 gap-x-4 gap-y-4 border-t py-8 md:py-10',
        item.origin === 'local' ? 'border-dashed border-ink' : 'border-ink',
      )}
    >
      <div className="col-span-12 flex items-baseline justify-between gap-4 md:col-span-3 md:block">
        <p className="label text-ink">{String(index + 1).padStart(2, '0')} · {getCategoryLabel(item.category)}</p>
        {date && (
          <time dateTime={item.created_at} className="label md:mt-3 md:block">{date}</time>
        )}
      </div>

      <div className="col-span-12 md:col-span-8 md:col-start-5">
        {origin && (
          <p className="mb-4">
            <span
              title={origin.note}
              className="inline-block border border-dashed border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink"
            >
              {origin.tag}
            </span>
          </p>
        )}
        <h3 className="break-words font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.025em] font-stretch-display">
          {item.subject}
        </h3>
        <p className="mt-4 max-w-2xl whitespace-pre-line break-words text-lead text-ink-soft">{item.message}</p>
        <p className="mt-6 flex items-center gap-3 font-display text-lg font-bold uppercase tracking-tight">
          <span aria-hidden className="h-px w-8 bg-ink" />
          {item.name}
        </p>
      </div>
    </Reveal>
  );
}
