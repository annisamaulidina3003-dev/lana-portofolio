/** Judul halaman admin: indeks mono + judul besar bold + deskripsi + aksi. */
export default function AdminPageHeader({ index, title, description, actions }) {
  return (
    <header className="flex flex-col gap-6 border-b border-ink pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {index && <p className="label text-ink">{index}</p>}
        <h1 className="mt-3 break-words font-display text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] font-stretch-display">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-xl text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
