import { run, sanitizeSearch, table } from './core';

const COLUMNS = 'id, name, email, category, subject, message, status, reviewed_at, created_at';

/** Pesan masuk (admin melihat semua status, termasuk email). */
export const messagesAdmin = {
  async list({ page = 1, pageSize = 10, search = '', filters = {} } = {}) {
    let q = table('messages').select(COLUMNS, { count: 'exact' });
    if (filters.status) q = q.eq('status', filters.status);
    if (filters.category) q = q.eq('category', filters.category);
    const term = sanitizeSearch(search);
    if (term) q = q.or(['name', 'email', 'subject', 'message'].map((c) => `${c}.ilike.%${term}%`).join(','));
    const from = (page - 1) * pageSize;
    const { data, count } = await run(q.order('created_at', { ascending: false }).range(from, from + pageSize - 1));
    return { rows: data ?? [], total: count ?? 0 };
  },

  /** reviewed_by / reviewed_at diisi trigger database (migrasi 06), bukan klien. */
  async setStatus(id, status) {
    const { data } = await run(table('messages').update({ status }).eq('id', id).select(COLUMNS));
    if (!data?.length) throw new Error('Pesan tidak ditemukan atau Anda tidak memiliki izin mengubahnya.');
    return data[0];
  },

  async remove(id) {
    const { data } = await run(table('messages').delete().eq('id', id).select('id'));
    if (!data?.length) throw new Error('Pesan tidak ditemukan atau Anda tidak memiliki izin menghapusnya.');
  },
};
