import { BUCKETS, escapeLike, resolveImageUrl, safeUrl, table, unwrap } from './core';

const COLUMNS =
  'id, slug, name, category, description, problem, objective, role, technologies, features, images, ' +
  'documentation, feedback, demo_url, github_url';

const image = (img) => (img ? { ...img, src: resolveImageUrl(BUCKETS.project, img.src) } : null);

/** Baris DB → bentuk sama dengan src/data/projects.js. */
export function mapProject(row) {
  const images = row.images ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    problem: row.problem,
    objective: row.objective,
    role: row.role,
    technologies: row.technologies ?? [],
    features: row.features ?? [],
    images: { cover: image(images.cover), screenshots: (images.screenshots ?? []).map(image) },
    demoUrl: safeUrl(row.demo_url),
    githubUrl: safeUrl(row.github_url),
    documentation: (row.documentation ?? []).map((d) => ({
      ...d,
      image: d.image ? resolveImageUrl(BUCKETS.project, d.image) : d.image,
    })),
    feedback: row.feedback ?? [],
    placeholder: false,
  };
}

/**
 * Visibilitas ditegakkan DUA kali: RLS di database dan filter `is_published` di sini. Filter ini penting
 * karena admin yang sedang login tetap memakai klien yang sama saat membuka situs publik — RLS memberi admin
 * akses ke draf, tetapi halaman publik tidak boleh menampilkannya.
 */
export async function getProjects() {
  const rows = unwrap(
    await table('projects')
      .select(COLUMNS)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
  );
  return rows.map(mapProject);
}

export async function getProjectBySlug(slug) {
  const row = unwrap(await table('projects').select(COLUMNS).eq('slug', slug).eq('is_published', true).maybeSingle());
  return row ? mapProject(row) : null;
}

/** Pencarian parsial pada nama proyek (memakai index trigram). */
export async function searchProjects(term) {
  const q = term?.trim();
  if (!q) return getProjects();
  const rows = unwrap(
    await table('projects').select(COLUMNS).eq('is_published', true).ilike('name', `%${escapeLike(q)}%`).order('sort_order').limit(50),
  );
  return rows.map(mapProject);
}
