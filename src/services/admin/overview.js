import { run, table } from './core';

const head = (name, apply) => {
  let q = table(name).select('id', { count: 'exact', head: true });
  if (apply) q = apply(q);
  return run(q).then((r) => r.count ?? 0);
};

// Tabel konten yang masuk ke daftar "aktivitas terbaru" (kolom judul berbeda-beda).
const ACTIVITY_SOURCES = [
  { table: 'profiles', title: 'full_name', label: 'Profil', path: '/admin/profil' },
  { table: 'projects', title: 'name', label: 'Proyek', path: '/admin/proyek' },
  { table: 'skills', title: 'name', label: 'Keahlian', path: '/admin/keahlian' },
  { table: 'experiences', title: 'title', label: 'Pengalaman', path: '/admin/pengalaman' },
  { table: 'certificates', title: 'title', label: 'Sertifikat', path: '/admin/sertifikat' },
  { table: 'testimonials', title: 'name', label: 'Testimoni', path: '/admin/testimoni' },
  { table: 'blog', title: 'title', label: 'Blog', path: '/admin/blog' },
];

/** Seluruh angka berasal dari COUNT di database — tidak ada nilai bawaan/palsu. */
export async function getOverview() {
  const [
    projects, projectsPublished, skills, skillsPublished,
    certificates, certificatesPublished, achievements,
    blog, blogPublished, messages, messagesUnread,
  ] = await Promise.all([
    head('projects'), head('projects', (q) => q.eq('is_published', true)),
    head('skills'), head('skills', (q) => q.eq('is_published', true)),
    head('certificates'), head('certificates', (q) => q.eq('is_published', true)),
    head('certificates', (q) => q.eq('kind', 'prestasi')),
    head('blog'), head('blog', (q) => q.eq('is_published', true)),
    head('messages'), head('messages', (q) => q.eq('status', 'new')),
  ]);

  const [{ data: recentMessages }, ...activityResults] = await Promise.all([
    run(
      table('messages')
        .select('id, name, category, subject, message, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ),
    ...ACTIVITY_SOURCES.map((s) =>
      run(
        table(s.table)
          .select(`id, ${s.title}, is_published, created_at, updated_at`)
          .order('updated_at', { ascending: false })
          .limit(5),
      ).then(({ data }) =>
        (data ?? []).map((r) => ({
          id: `${s.table}:${r.id}`,
          title: r[s.title],
          label: s.label,
          path: s.path,
          isPublished: r.is_published,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })),
      ),
    ),
  ]);

  const activity = activityResults
    .flat()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8);

  return {
    counts: {
      projects: { total: projects, published: projectsPublished },
      skills: { total: skills, published: skillsPublished },
      certificates: { total: certificates, published: certificatesPublished, achievements },
      blog: { total: blog, published: blogPublished },
      messages: { total: messages, unread: messagesUnread },
    },
    recentMessages: recentMessages ?? [],
    activity,
  };
}
