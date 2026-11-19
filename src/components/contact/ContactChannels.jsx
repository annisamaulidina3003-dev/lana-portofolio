import { ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';
import Placeholder from '@/components/ui/Placeholder';
import Reveal from '@/components/motion/Reveal';

const icons = { email: Mail, github: Github, instagram: Instagram, linkedin: Linkedin, location: MapPin };

/** 'https://github.com/nama/' → 'github.com/nama' */
const prettyUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** Susun baris dari data kontak: email → sosial media → lokasi. */
export function buildChannelRows(contact) {
  return [
    {
      id: 'email',
      label: 'Email',
      value: contact.email,
      href: contact.email ? `mailto:${contact.email}` : null,
      hint: 'Alamat email belum diisi',
    },
    ...contact.channels.map((c) => ({
      id: c.id,
      label: c.label,
      value: c.url ? c.handle ?? prettyUrl(c.url) : null,
      href: c.url,
      hint: c.hint,
    })),
    { id: 'location', label: 'Lokasi', value: contact.location, href: null, hint: 'Lokasi belum diisi' },
  ];
}

function Row({ row, index }) {
  const Icon = icons[row.id];
  const body = (
    <>
      <span className="label w-6 shrink-0 text-ink">{String(index + 1).padStart(2, '0')}</span>
      <span className="flex min-w-0 flex-1 items-center gap-4">
        <Icon size={20} strokeWidth={1.5} aria-hidden className="shrink-0" />
        <span className="min-w-0">
          <span className="label block">{row.label}</span>
          <span className="mt-1.5 block truncate font-display text-xl font-bold leading-tight tracking-tight sm:text-2xl">
            {row.value ?? <Placeholder className="font-sans text-base font-normal">{row.hint}</Placeholder>}
          </span>
        </span>
      </span>
      {row.href && (
        <ArrowUpRight
          size={20}
          strokeWidth={1.5}
          aria-hidden
          className="shrink-0 transition-transform duration-300 ease-editorial group-hover/row:-translate-y-1 group-hover/row:translate-x-1"
        />
      )}
    </>
  );

  const shared = 'group/row flex items-center gap-4 border-t border-line py-5';

  if (!row.href) {
    return <div className={cn(shared, !row.value && 'opacity-90')}>{body}</div>;
  }
  const isMail = row.href.startsWith('mailto:');
  return (
    <a
      href={row.href}
      {...(isMail ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
      aria-label={`${row.label}: ${row.value}${isMail ? '' : ' (tab baru)'}`}
      className={cn(shared, 'transition-[padding,background-color] duration-300 ease-editorial hover:bg-fog hover:pl-3 hover:pr-3')}
    >
      {body}
    </a>
  );
}

/** Daftar kanal kontak: ikon Lucide + tautan yang dapat diklik. Data kosong → placeholder. */
export default function ContactChannels({ contact }) {
  const rows = buildChannelRows(contact);
  return (
    <ul className="border-b border-line">
      {rows.map((row, i) => (
        <Reveal as="li" key={row.id} delay={i * 0.05}>
          <Row row={row} index={i} />
        </Reveal>
      ))}
    </ul>
  );
}
