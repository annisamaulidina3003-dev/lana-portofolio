import { BUCKETS, escapeLike, resolveImageUrl, table, todayIso, unwrap } from './core';

const COLUMNS = 'id, slug, title, category, excerpt, cover_path, cover_alt, content, published_at';

/** Baris DB → bentuk sama dengan src/data/posts.js. */
export function mapPost(r) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    publishedAt: r.published_at,
    excerpt: r.excerpt ?? '',
    cover: r.cover_path ? { src: resolveImageUrl(BUCKETS.blog, r.cover_path), alt: r.cover_alt ?? r.title } : null,
    content: r.content ?? [],
    placeholder: false,
  };
}

/**
 * Hanya artikel terbit yang tanggalnya sudah tiba (kosong = langsung). Aturan yang sama dengan RLS
 * (blog_public_read), diulang di sini supaya admin yang login pun tidak melihat draf/terjadwal di situs publik.
 */
const visible = (q) => q.eq('is_published', true).or(`published_at.is.null,published_at.lte.${todayIso()}`);

export async function getPosts() {
  const rows = unwrap(
    await visible(table('blog').select(COLUMNS))
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
  return rows.map(mapPost);
}

export async function getPostBySlug(slug) {
  const row = unwrap(await visible(table('blog').select(COLUMNS)).eq('slug', slug).maybeSingle());
  return row ? mapPost(row) : null;
}

/** Pencarian parsial pada judul artikel (memakai index trigram). */
export async function searchPosts(term) {
  const q = term?.trim();
  if (!q) return getPosts();
  const rows = unwrap(await visible(table('blog').select(COLUMNS)).ilike('title', `%${escapeLike(q)}%`).limit(50));
  return rows.map(mapPost);
}
