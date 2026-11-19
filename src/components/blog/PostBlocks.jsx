import Reveal from '@/components/motion/Reveal';

/** Render isi artikel dari daftar blok (heading, paragraph, list, code, quote). */
export default function PostBlocks({ blocks }) {
  return (
    <div className="space-y-6 text-lead text-ink-soft">
      {blocks.map((b, i) => {
        const key = `${b.type}-${i}`;
        switch (b.type) {
          case 'heading':
            return (
              <Reveal as="h2" key={key} className="!mt-14 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] text-ink font-stretch-display">
                {b.text}
              </Reveal>
            );
          case 'list':
            return (
              <Reveal as="ul" key={key} className="space-y-2">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-4"><span aria-hidden className="text-ink">—</span><span>{item}</span></li>
                ))}
              </Reveal>
            );
          case 'code':
            return (
              <Reveal key={key} className="!my-8 border border-ink bg-fog">
                <p className="label flex justify-between border-b border-ink px-4 py-2"><span className="text-ink">Kode</span><span>{b.language}</span></p>
                <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-ink"><code>{b.code}</code></pre>
              </Reveal>
            );
          case 'quote':
            return (
              <Reveal as="blockquote" key={key} className="!my-10 border-l-2 border-ink pl-6 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.15] tracking-tight text-ink">
                {b.text}
              </Reveal>
            );
          default:
            return <Reveal as="p" key={key}>{b.text}</Reveal>;
        }
      })}
    </div>
  );
}
