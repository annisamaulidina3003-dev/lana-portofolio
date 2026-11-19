import { Search, X } from 'lucide-react';

const selectCls = 'h-11 border border-line-strong bg-transparent px-3 font-mono text-[11px] uppercase tracking-[0.1em] outline-none transition-colors hover:border-ink focus:border-ink';

/** Pencarian + filter. `filters`: [{ key, label, options: [{value,label}] }] */
export default function ListToolbar({ list, searchLabel = 'Cari…', filters = [], statusFilter = false }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input
          type="search"
          value={list.searchInput}
          onChange={(e) => list.setSearchInput(e.target.value)}
          placeholder={searchLabel}
          aria-label={searchLabel}
          className="h-11 w-full border border-line-strong bg-transparent pl-10 pr-3 outline-none transition-colors hover:border-ink focus:border-ink"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {statusFilter && (
          <select aria-label="Filter status terbit" value={list.published} onChange={(e) => list.setPublished(e.target.value)} className={selectCls}>
            <option value="">Semua status</option>
            <option value="published">Terbit</option>
            <option value="draft">Draf</option>
          </select>
        )}
        {filters.map((f) => (
          <select key={f.key} aria-label={`Filter ${f.label}`} value={list.filters[f.key] ?? ''} onChange={(e) => list.setFilter(f.key, e.target.value)} className={selectCls}>
            <option value="">{f.label}: semua</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
        {list.hasFilters && (
          <button type="button" onClick={list.reset} className="inline-flex h-11 items-center gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.1em] hover:underline">
            <X size={14} aria-hidden /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
