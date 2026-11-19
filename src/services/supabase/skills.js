import { table, unwrap } from './core';

export async function getSkills() {
  const rows = unwrap(
    await table('skills')
      .select('id, name, category, group_name, level')
      .eq('is_published', true)
      .order('category')
      .order('group_name')
      .order('sort_order')
      .order('name'),
  );
  return rows.map((r) => ({ id: r.id, name: r.name, category: r.category, group: r.group_name, level: r.level }));
}
