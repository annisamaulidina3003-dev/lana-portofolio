import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { padIndex } from '@/lib/projects';
import Reveal from '@/components/motion/Reveal';
import ProjectImage from '@/components/project/ProjectImage';
import PostMeta from './PostMeta';

/**
 * variant="featured" → artikel utama: sampul panorama + judul oversized.
 * variant="card"     → artikel biasa; `offset` menurunkan kartu agar kolom bergeser.
 */
export default function PostCard({ post, index, variant = 'card', offset = false }) {
  const to = `/blog/${post.slug}`;
  const number = padIndex(index + 1);
  const cover = post.cover;

  if (variant === 'featured') {
    return (
      <Reveal as="article">
        <Link to={to} className="group block" aria-label={`Baca artikel: ${post.title}`}>
          <ProjectImage src={cover?.src} alt={cover?.alt ?? `Sampul ${post.title} (belum tersedia)`} number={number} ratio="aspect-[21/9]" />
          <div className="mt-6 grid grid-cols-12 gap-x-4 gap-y-4 border-t border-ink pt-4">
            <p className="label col-span-12 md:col-span-3"><span className="text-ink">{number}</span> — Terbaru</p>
            <div className="col-span-12 md:col-span-9">
              <PostMeta post={post} />
              <h2 className="mt-4 font-display text-display-md uppercase transition-transform duration-500 ease-editorial group-hover:translate-x-2">
                {post.title}
              </h2>
              <p className="mt-6 max-w-xl text-lead text-ink-soft">{post.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-[11px] uppercase tracking-[0.12em]">
                Baca artikel <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal as="article" className={cn(offset && 'md:mt-24')}>
      <Link to={to} className="group block" aria-label={`Baca artikel: ${post.title}`}>
        <ProjectImage src={cover?.src} alt={cover?.alt ?? `Sampul ${post.title} (belum tersedia)`} number={number} ratio="aspect-[4/3]" />
        <div className="mt-5 border-t border-ink pt-4">
          <PostMeta post={post} />
          <h2 className="mt-3 font-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] transition-transform duration-500 ease-editorial group-hover:translate-x-1.5 font-stretch-display">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 max-w-md text-ink-soft">{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-[11px] uppercase tracking-[0.12em]">
            Baca artikel <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
