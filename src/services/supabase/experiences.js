import { table, toYearMonth, unwrap } from './core';

export async function getExperiences() {
  const rows = unwrap(
    await table('experiences')
      .select('id, type, title, role, organization, location, start_date, end_date, description, highlights')
      .eq('is_published', true)
      .order('start_date', { ascending: false, nullsFirst: false })
      .order('sort_order'),
  );
  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    role: r.role,
    organization: r.organization,
    location: r.location,
    start: toYearMonth(r.start_date),
    end: toYearMonth(r.end_date),
    description: r.description,
    highlights: r.highlights ?? [],
    placeholder: false,
  }));
}
