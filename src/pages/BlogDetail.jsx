import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug, getPosts } from '@/services/portfolioService';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePageTitle } from '@/hooks/usePageTitle';
import { sortPosts } from '@/lib/blog';
import { padIndex } from '@/lib/projects';
import Container from '@/components/ui/Container';
import DataBoundary from '@/components/ui/DataBoundary';
import TextLink from '@/components/ui/TextLink';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import ProjectImage from '@/components/project/ProjectImage';
import PostMeta from '@/components/blog/PostMeta';
import PostBlocks from '@/components/blog/PostBlocks';

function Adjacent({ all, current }) {
  if (all.length < 2) return null;
  const i = all.findIndex((p) => p.id === current.id);
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const cell = 'group block p-6 transition-colors duration-300 hover:bg-fog md:p-10';
  const title = 'mt-3 font-display text-[clamp(1.25rem,2.8vw,2.25rem)] font-extrabold uppercase leading-none tracking-[-0.03em] transition-transform duration-500 ease-editorial';
  return (
    <nav aria-label="Artikel lainnya" className="mt-24 grid border-y border-ink md:mt-36 md:grid-cols-2 md:divide-x md:divide-ink">
      <Link to={`/blog/${prev.slug}`} className={cell}>
        <p className="label">← Sebelumnya</p>
        <p className={`${title} group-hover:-translate-x-2`}>{prev.title}</p>
      </Link>
      <Link to={`/blog/${next.slug}`} className={`${cell} border-t border-ink text-right md:border-t-0`}>
        <p className="label">Berikutnya →</p>
        <p className={`${title} group-hover:translate-x-2`}>{next.title}</p>
      </Link>
    </nav>
  );
}

function NotFoundPost() {
  usePageTitle('Artikel tidak ditemukan');
  return (
    <section className="pb-section pt-16 md:pt-24">
      <Container>
        <p className="label text-ink">Galat 404</p>
        <h1 className="mt-6 text-display-lg uppercase">Artikel tidak ditemukan</h1>
        <p className="mt-10 max-w-md text-lead text-ink-soft">Artikel yang kamu cari tidak ada atau tautannya sudah berubah.</p>
        <Button to="/blog" withArrow className="mt-10">Kembali ke blog</Button>
      </Container>
    </section>
  );
}

function Article({ post, all }) {
  usePageTitle(post.title);
  const index = Math.max(0, all.findIndex((p) => p.id === post.id));

  return (
    <article className="pb-section pt-10 md:pt-16">
      <Container>
        <Reveal variant="fade">
          <TextLink to="/blog" className="label inline-flex items-center gap-2">
            <ArrowLeft aria-hidden size={14} /> Semua artikel
          </TextLink>
        </Reveal>

        <header className="mt-10 border-t border-ink pt-4">
          <PostMeta post={post} />
          <Reveal>
            <h1 className="mt-6 max-w-5xl font-display text-display-md uppercase font-stretch-display">{post.title}</h1>
          </Reveal>
        </header>

        <Reveal className="group mt-12 md:mt-16">
          <ProjectImage
            src={post.cover?.src}
            alt={post.cover?.alt ?? `Sampul ${post.title} (belum tersedia)`}
            number={padIndex(index + 1)}
            ratio="aspect-[21/9]"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-12 gap-x-4 gap-y-10 md:mt-20">
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-24">
              <p className="label text-ink">Ringkasan</p>
              <p className="mt-3 text-ink-soft">{post.excerpt}</p>
              {post.placeholder && (
                <p className="label mt-6 border border-dashed border-line-strong p-3">
                  Konten demonstrasi — bukan tulisan asli. Ganti di <span className="text-ink">src/data/posts.js</span>.
                </p>
              )}
            </div>
          </aside>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <PostBlocks blocks={post.content} />
          </div>
        </div>

        <Adjacent all={all} current={post} />
      </Container>
    </article>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const state = useAsyncData(() => getPostBySlug(slug), [slug]);
  const list = useAsyncData(getPosts);

  return (
    <DataBoundary state={state}>
      {(post) => (post ? <Article post={post} all={sortPosts(list.data ?? [])} /> : <NotFoundPost />)}
    </DataBoundary>
  );
}
