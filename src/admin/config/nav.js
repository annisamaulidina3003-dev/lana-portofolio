import { Inbox, LayoutDashboard, Settings } from 'lucide-react';
import { resources } from './resources';

/** Menu sidebar: Overview, 7 modul konten, Pesan masuk, Pengaturan (total 10). */
export const adminNav = [
  { key: 'overview', label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  ...resources.map((r) => ({ key: r.key, label: r.label, to: `/admin/${r.path}`, icon: r.icon })),
  { key: 'pesan', label: 'Pesan masuk', to: '/admin/pesan', icon: Inbox },
  { key: 'pengaturan', label: 'Pengaturan', to: '/admin/pengaturan', icon: Settings },
].map((item, i) => ({ ...item, index: String(i + 1).padStart(2, '0') }));
