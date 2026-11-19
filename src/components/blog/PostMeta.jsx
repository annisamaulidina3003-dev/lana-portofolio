import { formatDate } from '@/lib/format';
import { readingLabel } from '@/lib/blog';
import Placeholder from '@/components/ui/Placeholder';

/** Baris meta artikel: kategori · tanggal · waktu baca (+ penanda konten demonstrasi). */
export default function PostMeta({ post, className }) {
  return (
    <p className={`label flex flex-wrap items-center gap-x-3 gap-y-1 ${className ?? ''}`}>
      <span className="text-ink">{post.category}</span>
      <span aria-hidden>/</span>
      <span>{formatDate(post.publishedAt) ?? <Placeholder>Tanggal belum diisi</Placeholder>}</span>
      <span aria-hidden>/</span>
      <span>{readingLabel(post)}</span>
      {post.placeholder && <span className="border border-dashed border-ink px-2 py-1 text-ink">Konten demonstrasi</span>}
    </p>
  );
}
