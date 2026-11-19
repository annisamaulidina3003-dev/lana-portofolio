import { cn } from '@/lib/cn';
import Placeholder from './Placeholder';

/**
 * Satu entri riwayat (pendidikan / pengalaman).
 * variant="row"  → baris dengan periode di kiri, isi di kanan (dipakai di /tentang)
 * variant="bare" → tumpuk vertikal tanpa garis (dipakai di dalam timeline /pengalaman)
 */
export default function TimelineEntry({
  period,
  title,
  titleHint = 'Judul belum diisi',
  subtitle,
  description,
  highlights = [],
  tag,
  placeholder = false,
  variant = 'row',
  source,
}) {
  const bare = variant === 'bare';

  return (
    <article
      className={cn(
        'group/entry relative',
        !bare && 'border-t py-6',
        !bare && (placeholder ? 'border-dashed border-line-strong' : 'border-line'),
      )}
    >
      <div className={cn('grid gap-x-4 gap-y-3', bare ? 'grid-cols-1' : 'grid-cols-12')}>
        <div className={cn(!bare && 'col-span-12 md:col-span-4')}>
          <p className="label">{period ?? <Placeholder>Periode belum diisi</Placeholder>}</p>
          {tag && <p className="label mt-2 text-ink">{tag}</p>}
        </div>

        <div className={cn(!bare && 'col-span-12 md:col-span-8')}>
          <h3
            className={cn(
              'font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold uppercase leading-tight tracking-tight transition-transform duration-300 ease-editorial group-hover/entry:translate-x-1',
              placeholder && 'text-mute',
            )}
          >
            {title ?? <Placeholder>{titleHint}</Placeholder>}
          </h3>

          {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}

          {description ? (
            <p className="mt-3 max-w-xl text-ink-soft">{description}</p>
          ) : (
            placeholder && (
              <p className="mt-3 text-mute">
                <Placeholder>Deskripsi singkat belum diisi</Placeholder>
              </p>
            )
          )}

          {highlights.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3 text-small text-ink-soft">
                  <span aria-hidden className="text-ink">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {placeholder && source && <p className="label mt-4">Placeholder — ganti di {source}</p>}
        </div>
      </div>
    </article>
  );
}
