import { useCallback, useRef, useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { collectStorageImages } from '@/services/admin/images';
import { removeImages } from '@/services/admin/storage';
import { rowToValues } from '@/lib/admin/formModel';
import { useResourceList } from '../hooks/useResourceList';
import { useToast } from './Toast';
import AdminPageHeader from './PageHeader';
import ConfirmDialog from './ConfirmDialog';
import Drawer from './Drawer';
import IconButton from './IconButton';
import ListToolbar from './ListToolbar';
import Pagination from './Pagination';
import ResourceForm from './ResourceForm';
import { PublishBadge } from './StatusBadge';
import StatusBadge from './StatusBadge';
import { EmptyState, ErrorState, ListSkeleton } from './States';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Halaman CRUD lengkap untuk satu resource (lihat src/admin/config/resources.js):
 * daftar + cari/filter + pagination, tambah/edit (drawer + form tervalidasi),
 * terbit/draf cepat, hapus dengan konfirmasi, serta notifikasi sukses/gagal.
 */
export default function ResourceManager({ resource, index }) {
  const toast = useToast();
  const list = useResourceList(resource.service, { pageSize: resource.pageSize ?? 10 });
  const [editing, setEditing] = useState(null); // { mode: 'create' } | { mode: 'edit', row }
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const dirty = useRef(false);
  const onDirtyChange = useCallback((v) => { dirty.current = v; }, []);

  const closeDrawer = () => { dirty.current = false; setDiscardOpen(false); setEditing(null); };
  const requestClose = () => (dirty.current ? setDiscardOpen(true) : closeDrawer());

  const Singular = resource.singular.charAt(0).toUpperCase() + resource.singular.slice(1);

  const handleSubmit = async (row) => {
    try {
      if (editing.mode === 'create') await resource.service.create(row);
      else await resource.service.update(editing.row.id, row);
    } catch (err) {
      toast.error(err.message);
      throw err; // ditampilkan juga di dalam form
    }
    toast.success(`${Singular} berhasil ${editing.mode === 'create' ? 'ditambahkan' : 'diperbarui'}.`);
    closeDrawer();
    list.reload();
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      // Gambar yang dipakai baris ini dicatat dulu; dihapus dari Storage hanya setelah baris terhapus.
      const images = collectStorageImages(
        resource.fields,
        rowToValues(resource.fields, resource.toForm ? resource.toForm(deleting) : deleting),
      );
      await resource.service.remove(deleting.id);
      toast.success(`${Singular} berhasil dihapus.`);
      setDeleting(null);
      list.reload();
      if (images.length) {
        const { failed } = await removeImages(images);
        if (failed.length) toast.error(`${Singular} terhapus, tetapi ${failed.length} gambar belum terhapus dari Storage.`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const togglePublish = async (row) => {
    setBusyId(row.id);
    try {
      await resource.service.update(row.id, { is_published: !row.is_published });
      toast.success(row.is_published ? `${Singular} dijadikan draf.` : `${Singular} diterbitkan.`);
      list.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const hasPublish = resource.hasPublish !== false;
  const offset = (list.page - 1) * list.pageSize;

  return (
    <>
      <AdminPageHeader
        index={index}
        title={resource.label}
        description={resource.description}
        actions={
          <button
            type="button"
            onClick={() => setEditing({ mode: 'create' })}
            className="inline-flex h-12 items-center gap-2 border border-ink bg-ink px-6 font-mono text-[11px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-ink-soft"
          >
            <Plus size={16} strokeWidth={1.75} aria-hidden /> Tambah {resource.singular}
          </button>
        }
      />

      <div className="mt-8">
        <ListToolbar list={list} searchLabel={`Cari ${resource.singular}…`} filters={resource.filters} statusFilter={hasPublish} />
        <p className="label mt-4 tabular-nums text-ink" aria-live="polite">
          {list.loading ? 'Memuat…' : `${list.total} data${list.hasFilters ? ' (terfilter)' : ''}`}
        </p>
      </div>

      <div className="mt-4">
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && list.rows.length === 0 ? (
          <ListSkeleton />
        ) : list.rows.length === 0 ? (
          <EmptyState
            title={list.hasFilters ? 'Tidak ada hasil' : `Belum ada ${resource.singular}`}
            description={list.hasFilters ? 'Ubah kata kunci atau filter pencarian.' : `Mulai dengan menambahkan ${resource.singular} pertama.`}
            action={
              list.hasFilters ? (
                <button type="button" onClick={list.reset} className="h-10 border border-ink px-4 font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-ink hover:text-paper">Reset filter</button>
              ) : (
                <button type="button" onClick={() => setEditing({ mode: 'create' })} className="h-10 border border-ink bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-paper">
                  Tambah {resource.singular}
                </button>
              )
            }
          />
        ) : (
          <ul className={`border-t border-ink transition-opacity ${list.loading ? 'opacity-50' : ''}`} aria-busy={list.loading}>
            {list.rows.map((row, i) => {
              const item = resource.listItem(row);
              return (
                <li key={row.id} data-row className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 border-b border-line py-5 sm:grid-cols-[auto_1fr_auto]">
                  <span className="label w-6 pt-1.5 text-ink">{pad(offset + i + 1)}</span>
                  <div className="min-w-0">
                    <p className="break-words font-display text-xl font-bold uppercase leading-tight tracking-tight">{item.title}</p>
                    {item.subtitle && <p className="mt-1 line-clamp-2 break-words text-small text-mute">{item.subtitle}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {hasPublish && <PublishBadge published={row.is_published} />}
                      {(item.badges ?? []).map((b) => <StatusBadge key={b.label} tone={b.tone ?? 'outline'}>{b.label}</StatusBadge>)}
                      {item.meta && <span className="label">{item.meta}</span>}
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end gap-1 sm:col-span-1">
                    {hasPublish && (
                      <IconButton
                        icon={row.is_published ? EyeOff : Eye}
                        label={row.is_published ? `Jadikan draf: ${item.title}` : `Terbitkan: ${item.title}`}
                        onClick={() => togglePublish(row)}
                        disabled={busyId === row.id}
                      />
                    )}
                    <IconButton icon={Pencil} label={`Ubah: ${item.title}`} onClick={() => setEditing({ mode: 'edit', row })} />
                    <IconButton icon={Trash2} label={`Hapus: ${item.title}`} danger onClick={() => setDeleting(row)} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <Pagination page={list.page} pageSize={list.pageSize} total={list.total} onChange={list.setPage} disabled={list.loading} />
      </div>

      <Drawer
        open={Boolean(editing)}
        subtitle={editing?.mode === 'create' ? 'Data baru' : 'Ubah data'}
        title={editing?.mode === 'create' ? `Tambah ${resource.singular}` : `Ubah ${resource.singular}`}
        onClose={requestClose}
        escapeDisabled={discardOpen}
      >
        {editing && (
          <ResourceForm
            key={editing.row?.id ?? 'new'}
            fields={resource.fields}
            initialRow={editing.row}
            mode={editing.mode}
            toForm={resource.toForm}
            fromForm={resource.fromForm}
            imageFolder={resource.key}
            onSubmit={handleSubmit}
            onCancel={requestClose}
            onDirtyChange={onDirtyChange}
          />
        )}
      </Drawer>

      <ConfirmDialog
        open={discardOpen}
        title="Buang perubahan?"
        description="Ada perubahan yang belum disimpan. Jika ditutup sekarang, perubahan itu akan hilang."
        confirmLabel="Buang perubahan"
        cancelLabel="Lanjut mengedit"
        onConfirm={closeDrawer}
        onCancel={() => setDiscardOpen(false)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Hapus ${resource.singular}?`}
        description={`“${deleting ? resource.listItem(deleting).title : ''}” akan dihapus permanen dan tidak bisa dikembalikan.${deleting && resource.deleteNote ? ` ${resource.deleteNote}` : ''}`}
        confirmLabel="Ya, hapus"
        loading={deleteBusy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
