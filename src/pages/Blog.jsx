import { useState } from 'react';
import { getPosts } from '@/services/portfolioService';
import { useAsyncData } from '@/hooks/useAsyncData';
import { collectPostCategories, sortPosts } from '@/lib/blog';
import PageHeader from '@/components/layout/PageHeader';
import Container from '@/components/ui/Container';
import DataBoundary from '@/components/ui/DataBoundary';
import Tabs from '@/components/ui/Tabs';
import Reveal from '@/components/motion/Reveal';
import PostCard from '@/components/blog/PostCard';

function BlogContent({ data }) {
  const [category, setCategory] = useState('all');
  const sorted = sortPosts(data);
  const tabs = [
    { key: 'all', label: 'Semua', count: sorted.length },
    ...collectPostCategories(sorted).map((c) => ({
      key: c,
      label: c,
      count: sorted.filter((p) => p.category === c).length,
    })),
  ];
  const shown = category === 'all' ? sorted : sorted.filter((p) => p.category === category);
  const [featured, ...rest] = shown;
  const hasDemo = data.some((p) => p.placeholder);

  return (
    <section className="pb-section pt-14 md:pt-20">
      <Container>
        {hasDemo && (
          <Reveal className="mb-12 border border-dashed border-line-strong p-4 md:mb-16 md:p-5">
            <p className="label">Artikel di halaman ini adalah <span className="text-ink">konten demonstrasi</span>.</p>
          </Reveal>
        )}

        <Tabs tabs={tabs} value={category} onChange={setCategory} label="Filter kategori artikel" layoutId="tab-blog" />

        <div className="mt-12 md:mt-16">
          {featured ? (
            <div key={category}>
              <PostCard post={featured} index={sorted.indexOf(featured)} variant="featured" />
              {rest.length > 0 && (
                <div className="mt-20 grid gap-x-8 gap-y-16 md:mt-32 md:grid-cols-2 md:gap-x-16">
                  {rest.map((post, i) => (
                    <PostCard key={post.id} post={post} index={sorted.indexOf(post)} offset={i % 2 === 1} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Reveal className="border border-dashed border-line-strong px-6 py-20 text-center">
              <p className="font-display text-display-sm uppercase">Belum ada artikel</p>
              <p className="mx-auto mt-4 max-w-md text-ink-soft">Artikel akan tampil di sini setelah dipublikasikan.</p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

export default function Blog() {
  const state = useAsyncData(getPosts);

  return (
    <>
      <PageHeader pageKey="blog" title="Blog" />
      <DataBoundary state={state}>{(data) => <BlogContent data={data} />}</DataBoundary>
    </>
  );
}
