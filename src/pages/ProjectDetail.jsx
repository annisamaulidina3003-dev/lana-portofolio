import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@/services/portfolioService';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePageTitle } from '@/hooks/usePageTitle';
import { formatMonth } from '@/lib/format';
import { getCategoryLabel, padIndex, toParagraphs } from '@/lib/projects';
import Container from '@/components/ui/Container';
import ContentBlock from '@/components/ui/ContentBlock';
import DataBoundary from '@/components/ui/DataBoundary';
import Placeholder from '@/components/ui/Placeholder';
import TextLink from '@/components/ui/TextLink';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import ProjectImage from '@/components/project/ProjectImage';

const SOURCE = 'src/data/projects.js';

function Empty({ children }) {
  return (
    <p className="border border-dashed border-line-strong p-6 text-mute">
      <Placeholder>{children}</Placeholder>
    </p>
  );
}

function TextBlock({ text, emptyText }) {
  const paragraphs = toParagraphs(text);
  if (!paragraphs.length) return <Empty>{emptyText}</Empty>;
  return (
    <div className="max-w-2xl space-y-5 text-lead text-ink-soft">
      {paragraphs.map((p) => <p key={p}>{p}</p>)}
    </div>
  );
}

function TagList({ items, emptyText }) {
  if (!items.length) return <Empty>{emptyText}</Empty>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="border border-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 hover:bg-ink hover:text-paper">
          {item}
        </li>
      ))}
    </ul>
  );
}

function LinkRow({ label, url, emptyText }) {
  const inner = (
    <>
      <span className="font-display text-[clamp(1.75rem,5vw,4rem)] font-extrabold uppercase leading-none tracking-[-0.03em] font-stretch-display transition-transform duration-500 ease-editorial group-hover:translate-x-3">
        {label}
      </span>
      <span className="label hidden max-w-[40%] truncate sm:block">{url ?? <Placeholder>{emptyText}</Placeholder>}</span>
      {url && <ArrowUpRight aria-hidden size={32} strokeWidth={1.5} className="shrink-0 transition-transform duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1" />}
    </>
  );
  const cls = 'group flex items-center justify-between gap-4 border-b border-line py-6 md:py-8';
  return (
    <li>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer noopener" className={`${cls} transition-colors duration-300 hover:bg-fog`}>{inner}</a>
      ) : (
        <div className={`${cls} text-mute`} aria-disabled="true">{inner}</div>
      )}
    </li>
  );
}

function Screenshots({ images }) {
  if (!images.length) return <Empty>Screenshot aplikasi belum tersedia</Empty>;
  // Komposisi berselang: lebar penuh → dua kolom tak sama → ...
  const spans = ['md:col-span-12', 'md:col-span-7', 'md:col-span-5 md:mt-16', 'md:col-span-5', 'md:col-span-7 md:mt-16'];
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {images.map((img, i) => (
        <Reveal key={img.src} as="figure" className={`group col-span-12 ${spans[i % spans.length]}`}>
          <ProjectImage src={img.src} alt={img.alt} number={padIndex(i + 1)} ratio={i % 5 === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'} />
          <figcaption className="label mt-3 flex justify-between gap-2">
            <span className="text-ink">Fig. {padIndex(i + 1)}</span>
            <span>{img.caption ?? ''}</span>
          </figcaption>
        </Reveal>
      ))}
    </div>
  );
}

function Documentation({ steps }) {
  if (!steps.length) return <Empty>Dokumentasi proses pengerjaan belum diisi</Empty>;
  return (
    <ol className="relative">
      <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-ink" />
      {steps.map((step, i) => (
        <Reveal as="li" key={`${step.title}-${i}`} className="group relative pb-12 pl-8 md:pl-12">
          <span aria-hidden className="absolute left-0 top-2 h-2 w-2 -translate-x-1/2 bg-ink transition-transform duration-300 ease-editorial group-hover:scale-150" />
          <p className="label"><span className="text-ink">{padIndex(i + 1)}</span>{step.date && ` — ${formatMonth(step.date)}`}</p>
          <h3 className="mt-2 font-display text-[clamp(1.25rem,2.4vw,2rem)] font-bold uppercase leading-tight tracking-tight">{step.title}</h3>
          <p className="mt-3 max-w-xl text-ink-soft">{step.description}</p>
          {step.image && (
            <div className="group mt-5 max-w-2xl">
              <ProjectImage src={step.image} alt={`Dokumentasi: ${step.title}`} number={padIndex(i + 1)} ratio="aspect-[16/9]" />
            </div>
          )}
        </Reveal>
      ))}
    </ol>
  );
}

function Feedback({ items }) {
  if (!items.length) return <Empty>Belum ada feedback pengguna</Empty>;
  return (
    <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
      {items.map((f, i) => (
        <Reveal as="li" key={`${f.name}-${i}`} delay={i * 0.06} className="bg-paper p-6 md:p-8">
          <span aria-hidden className="font-display text-6xl font-extrabold leading-none">“</span>
          <blockquote className="-mt-2 text-lead">{f.message}</blockquote>
          <p className="mt-6 border-t border-line pt-4 font-display font-bold uppercase tracking-tight">{f.name}</p>
          {f.role && <p className="label mt-1">{f.role}</p>}
        </Reveal>
      ))}
    </ul>
  );
}

function Adjacent({ all, current }) {
  if (all.length < 2) return null;
  const i = all.findIndex((p) => p.id === current.id);
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const cell = 'group block p-6 transition-colors duration-300 hover:bg-fog md:p-10';
  return (
    <nav aria-label="Proyek lainnya" className="mt-24 grid border-y border-ink md:mt-36 md:grid-cols-2 md:divide-x md:divide-ink">
      <Link to={`/proyek/${prev.slug}`} className={cell}>
        <p className="label">← Sebelumnya</p>
        <p className="mt-3 font-display text-[clamp(1.5rem,3.5vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.03em] transition-transform duration-500 ease-editorial group-hover:-translate-x-2">{prev.name}</p>
      </Link>
      <Link to={`/proyek/${next.slug}`} className={`${cell} border-t border-ink text-right md:border-t-0`}>
        <p className="label">Berikutnya →</p>
        <p className="mt-3 font-display text-[clamp(1.5rem,3.5vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.03em] transition-transform duration-500 ease-editorial group-hover:translate-x-2">{next.name}</p>
      </Link>
    </nav>
  );
}

function NotFoundProject() {
  usePageTitle('Proyek tidak ditemukan');
  return (
    <section className="pb-section pt-16 md:pt-24">
      <Container>
        <p className="label text-ink">Galat 404</p>
        <h1 className="mt-6 text-display-lg uppercase">Proyek tidak ditemukan</h1>
        <p className="mt-10 max-w-md text-lead text-ink-soft">Proyek yang kamu cari tidak ada atau tautannya sudah berubah.</p>
        <Button to="/proyek" withArrow className="mt-10">Kembali ke galeri</Button>
      </Container>
    </section>
  );
}

function Detail({ project, all }) {
  usePageTitle(project.name);
  const number = padIndex(Math.max(0, all.findIndex((p) => p.id === project.id)) + 1);
  const category = getCategoryLabel(project.category);
  const { cover, screenshots } = project.images;
  const meta = [
    { label: 'Kategori', value: category },
    { label: 'Peran', value: project.role },
    { label: 'Teknologi', value: project.technologies.length ? `${project.technologies.length} teknologi` : null },
  ];

  return (
    <article>
      {/* 01 — Nama proyek */}
      <header className="pt-10 md:pt-16">
        <Container>
          <Reveal variant="fade">
            <TextLink to="/proyek" className="label inline-flex items-center gap-2">
              <ArrowLeft aria-hidden size={14} /> Semua proyek
            </TextLink>
          </Reveal>

          <div className="mt-10 flex items-baseline gap-4 border-t border-ink pt-4">
            <span className="label text-ink">{number}</span>
            <span className="label">{category ?? <Placeholder>Kategori belum diisi</Placeholder>}</span>
            {project.placeholder && <span className="label ml-auto">Placeholder</span>}
          </div>

          <Reveal>
            <h1 className="mt-6 font-display text-display-lg uppercase font-stretch-display">{project.name}</h1>
          </Reveal>

          <dl className="mt-12 grid grid-cols-2 border-t border-line md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label} className="border-b border-line py-4 pr-4">
                <dt className="label">{m.label}</dt>
                <dd className="mt-1 font-display text-lg font-bold leading-tight tracking-tight">{m.value ?? <Placeholder>Belum diisi</Placeholder>}</dd>
              </div>
            ))}
            <div className="col-span-2 flex flex-wrap items-center gap-3 border-b border-line py-4 md:col-span-1 md:justify-end">
              {project.demoUrl ? <Button href={project.demoUrl} size="sm" withArrow>Demo</Button> : null}
              {project.githubUrl ? <Button href={project.githubUrl} variant="outline" size="sm" withArrow>GitHub</Button> : null}
              {!project.demoUrl && !project.githubUrl && <span className="label"><Placeholder>Tautan belum diisi</Placeholder></span>}
            </div>
          </dl>
        </Container>
      </header>

      <Container className="pb-section pt-14 md:pt-20">
        <div className="space-y-24 md:space-y-36">
          {/* 02 — Gambar utama & screenshot */}
          <ContentBlock index="02" title="Tampilan">
            <Reveal className="group">
              <ProjectImage src={cover?.src} alt={cover?.alt ?? `Gambar utama ${project.name} (belum tersedia)`} number={number} ratio="aspect-[16/9]" />
              <p className="label mt-3 flex justify-between gap-2"><span className="text-ink">Gambar utama</span><span>{cover?.caption ?? ''}</span></p>
            </Reveal>
            <h3 className="label mb-6 mt-14 text-ink">Screenshot aplikasi</h3>
            <Screenshots images={screenshots} />
          </ContentBlock>

          {/* 03 — Deskripsi */}
          <ContentBlock index="03" title="Deskripsi">
            <TextBlock text={project.description} emptyText="Deskripsi lengkap belum diisi" />
          </ContentBlock>

          {/* 04 & 05 — Permasalahan & Tujuan, berdampingan */}
          <div className="grid gap-16 md:grid-cols-2 md:gap-12">
            <ContentBlock index="04" title="Masalah">
              <TextBlock text={project.problem} emptyText="Permasalahan belum diisi" />
            </ContentBlock>
            <ContentBlock index="05" title="Tujuan">
              <TextBlock text={project.objective} emptyText="Tujuan belum diisi" />
            </ContentBlock>
          </div>

          {/* 06 & 07 — Teknologi & Peran */}
          <div className="grid gap-16 md:grid-cols-2 md:gap-12">
            <ContentBlock index="06" title="Teknologi">
              <TagList items={project.technologies} emptyText="Teknologi belum diisi" />
            </ContentBlock>
            <ContentBlock index="07" title="Peran">
              <TextBlock text={project.role} emptyText="Peran belum diisi" />
            </ContentBlock>
          </div>

          {/* 08 — Fitur */}
          <ContentBlock index="08" title="Fitur">
            {project.features.length ? (
              <ol className="grid border-t border-line md:grid-cols-2 md:gap-x-12">
                {project.features.map((f, i) => (
                  <Reveal as="li" key={f} delay={(i % 2) * 0.06} className="group flex gap-5 border-b border-line py-5">
                    <span className="label pt-1 text-ink">{padIndex(i + 1)}</span>
                    <span className="text-lead transition-transform duration-300 ease-editorial group-hover:translate-x-1">{f}</span>
                  </Reveal>
                ))}
              </ol>
            ) : (
              <Empty>Daftar fitur belum diisi</Empty>
            )}
          </ContentBlock>

          {/* 09 & 10 — Demo & GitHub */}
          <ContentBlock index="09" title="Tautan">
            <ul className="border-t border-line">
              <LinkRow label="Demo" url={project.demoUrl} emptyText="Link demo belum tersedia" />
              <LinkRow label="Source Code" url={project.githubUrl} emptyText="Link GitHub belum tersedia" />
            </ul>
          </ContentBlock>

          {/* 11 — Dokumentasi */}
          <ContentBlock index="10" title="Proses Pengerjaan">
            <Documentation steps={project.documentation} />
          </ContentBlock>

          {/* 12 — Feedback */}
          <ContentBlock index="11" title="Feedback Pengguna">
            <Feedback items={project.feedback} />
          </ContentBlock>
        </div>

        {project.placeholder && (
          <p className="label mt-16 border border-dashed border-line-strong p-4">
            Placeholder — ganti isi proyek ini di <span className="text-ink">{SOURCE}</span>.
          </p>
        )}

        <Adjacent all={all} current={project} />
      </Container>
    </article>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const state = useAsyncData(() => getProjectBySlug(slug), [slug]);
  const list = useAsyncData(getProjects);

  return (
    <DataBoundary state={state}>
      {(project) => (project ? <Detail project={project} all={list.data ?? []} /> : <NotFoundProject />)}
    </DataBoundary>
  );
}
