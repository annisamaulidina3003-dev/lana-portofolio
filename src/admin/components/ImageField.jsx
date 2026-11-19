import { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Loader2, RotateCcw, Trash2, Undo2 } from 'lucide-react';
import { FieldMessage } from '@/components/ui/Field';
import { IMAGE_ACCEPT, IMAGE_RULE_TEXT, formatBytes, isStoragePath, validateImageFile } from '@/lib/images';
import { BUCKETS, resolveImageUrl } from '@/services/supabase/core';
import { isPendingImage } from '@/services/admin/images';

const btn =
  'inline-flex h-10 items-center gap-2 border border-ink px-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors disabled:pointer-events-none disabled:opacity-40';

function storedUrl(bucket, value) {
  try {
    return resolveImageUrl(BUCKETS[bucket], value);
  } catch {
    return null;
  }
}

/**
 * Input gambar admin: pilih/seret file → validasi (format, ukuran, isi) → preview lokal.
 * File BELUM diunggah di sini; ia dikirim ke Storage saat form disimpan (lihat ResourceForm).
 * value: string (path/URL tersimpan) | PendingImage. onChange menerima nilai yang sama.
 */
export default function ImageField({
  id, label, hint, error, value, onChange, bucket, disabled, required, 'data-field': dataField,
}) {
  const inputRef = useRef(null);
  const previous = useRef('');
  const [checking, setChecking] = useState(false);
  const [problem, setProblem] = useState(null);
  const [broken, setBroken] = useState(false);
  const [dragging, setDragging] = useState(false);

  const pending = isPendingImage(value);
  const stored = !pending && typeof value === 'string' && value.trim() !== '';
  const src = useMemo(() => (pending ? value.previewUrl : stored ? storedUrl(bucket, value) : null), [pending, stored, value, bucket]);
  useEffect(() => setBroken(false), [src]);

  const revoke = (v) => { if (isPendingImage(v)) URL.revokeObjectURL(v.previewUrl); };

  const pick = async (file) => {
    if (!file || disabled) return;
    setProblem(null);
    setChecking(true);
    const check = await validateImageFile(file);
    setChecking(false);
    if (!check.ok) { setProblem(check.message); return; }
    if (!pending) previous.current = typeof value === 'string' ? value : '';
    revoke(value);
    onChange({
      kind: 'pending-image', file, previewUrl: URL.createObjectURL(file), width: check.width, height: check.height,
    });
  };

  const onInput = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // izinkan memilih file yang sama lagi
    pick(file);
  };

  const remove = () => { setProblem(null); revoke(value); previous.current = ''; onChange(''); };
  const undo = () => { setProblem(null); revoke(value); onChange(previous.current); };

  const status = pending
    ? `Belum diunggah · ${value.file.name} · ${formatBytes(value.file.size)}${value.width ? ` · ${value.width}×${value.height}px` : ''}`
    : stored
      ? isStoragePath(value) ? 'Tersimpan di Storage' : 'Gambar dari URL / berkas situs (bukan Storage)'
      : 'Belum ada gambar';
  const shownError = problem || error;

  return (
    <div>
      <p className="label text-ink">{label}{required && <span aria-hidden> *</span>}</p>

      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
        className={`mt-3 grid gap-4 border p-4 sm:grid-cols-[10rem_1fr] ${dragging ? 'border-ink bg-fog' : 'border-line-strong'}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-fog sm:w-40">
          {src && !broken ? (
            <img src={src} alt={pending ? `Pratinjau ${value.file.name}` : `Gambar tersimpan: ${label}`} onError={() => setBroken(true)} className="h-full w-full object-contain" />
          ) : (
            <div role="img" aria-label={broken ? 'Gambar tidak dapat dimuat' : 'Belum ada gambar'} className="flex h-full w-full items-center justify-center p-2 text-center">
              <span className="label">{broken ? 'Gambar tidak dapat dimuat' : 'Belum ada gambar'}</span>
            </div>
          )}
          {checking && (
            <div role="status" className="absolute inset-0 flex items-center justify-center bg-paper/80"><Loader2 size={20} aria-hidden className="animate-spin" /></div>
          )}
        </div>

        <div className="min-w-0">
          <p className="break-words text-small text-ink" aria-live="polite">{checking ? 'Memeriksa file…' : status}</p>
          {pending && <p className="mt-1 text-small text-mute">Akan diunggah ke Storage saat data disimpan.</p>}
          {!pending && broken && stored && <p className="mt-1 text-small text-mute">File di alamat ini tidak ditemukan. Ganti dengan gambar baru.</p>}

          <div className="mt-3 flex flex-wrap gap-2">
            <input ref={inputRef} type="file" accept={IMAGE_ACCEPT} onChange={onInput} className="sr-only" tabIndex={-1} aria-hidden disabled={disabled} />
            <button
              type="button" id={id} data-field={dataField} disabled={disabled || checking}
              onClick={() => inputRef.current?.click()}
              aria-describedby={shownError ? `${id}-error` : `${id}-hint`}
              className={`${btn} hover:bg-ink hover:text-paper`}
            >
              <ImagePlus size={14} aria-hidden /> {pending || stored ? 'Ganti gambar' : 'Pilih gambar'}
            </button>
            {pending && previous.current !== undefined && (
              <button type="button" onClick={undo} disabled={disabled} className={`${btn} hover:bg-fog`}>
                <Undo2 size={14} aria-hidden /> Batalkan pilihan
              </button>
            )}
            {(pending || stored) && (
              <button type="button" onClick={remove} disabled={disabled} className={`${btn} hover:bg-fog`}>
                <Trash2 size={14} aria-hidden /> Hapus gambar
              </button>
            )}
            {problem && (
              <button type="button" onClick={() => setProblem(null)} className={`${btn} border-transparent hover:border-ink`}>
                <RotateCcw size={14} aria-hidden /> Tutup pesan
              </button>
            )}
          </div>
          <p className="mt-3 text-small text-mute">{IMAGE_RULE_TEXT}. Bisa juga seret file ke kotak ini.</p>
        </div>
      </div>
      <FieldMessage id={id} error={shownError} hint={hint} />
    </div>
  );
}
