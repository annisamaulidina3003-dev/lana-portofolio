import { useMemo, useState } from 'react';
import { sortByCreatedDesc } from '@/lib/messages';
import Tabs from '@/components/ui/Tabs';
import GuestbookEmpty from './GuestbookEmpty';
import GuestbookItem from './GuestbookItem';

/**
 * Daftar pesan + filter kategori + empty state. Murni presentasional:
 * menerima `messages` (sudah difilter status/moderasi oleh sumber datanya).
 */
export default function GuestbookList({ messages, categories, emptyText }) {
  const [category, setCategory] = useState('all');
  const sorted = useMemo(() => sortByCreatedDesc(messages), [messages]);

  const tabs = [
    { key: 'all', label: 'Semua', count: sorted.length },
    ...categories.map((c) => ({ key: c.key, label: c.label, count: sorted.filter((m) => m.category === c.key).length })),
  ];
  const shown = category === 'all' ? sorted : sorted.filter((m) => m.category === category);

  if (sorted.length === 0) return <GuestbookEmpty emptyText={emptyText} />;

  return (
    <>
      <Tabs tabs={tabs} value={category} onChange={setCategory} label="Filter kategori pesan" layoutId="tab-buku-tamu" />
      <div className="mt-10 md:mt-14" aria-live="polite">
        {shown.length ? (
          <ol key={category} className="border-b border-ink">
            {shown.map((item, i) => <GuestbookItem key={item.id} item={item} index={i} />)}
          </ol>
        ) : (
          <GuestbookEmpty categoryLabel={categories.find((c) => c.key === category)?.label} />
        )}
      </div>
    </>
  );
}
