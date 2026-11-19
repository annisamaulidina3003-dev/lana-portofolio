import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Loader2, RotateCcw, Send } from 'lucide-react';
import { ease } from '@/lib/motion';
import { describePublicError } from '@/lib/publicError';
import {
  FIELD_ORDER, LIMITS, emptyDraft, normalizeDraft, validateDraft,
} from '@/lib/messages';
import Button from '@/components/ui/Button';
import ChoiceGroup from '@/components/ui/ChoiceGroup';
import Field from '@/components/ui/Field';
import TextLink from '@/components/ui/TextLink';

const panel = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease } },
};

function SuccessPanel({ result, subject, onReset, guestbookHref }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const simulated = result?.simulated !== false;

  return (
    <motion.div ref={ref} tabIndex={-1} role="status" {...panel} className="border border-ink p-6 outline-none sm:p-10">
      <span className="flex h-12 w-12 items-center justify-center bg-ink text-paper">
        <Check size={22} strokeWidth={2} aria-hidden />
      </span>
      <h3 className="mt-8 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] font-stretch-display">
        {simulated ? 'Pesan tersimpan sementara' : 'Pesan terkirim'}
      </h3>
      <p className="mt-5 max-w-lg text-ink-soft">
        {simulated ? (
          <>
            <strong className="font-semibold text-ink">Ini mode simulasi.</strong> Pesanmu
            {subject ? <> “{subject}”</> : null} <strong className="font-semibold text-ink">belum dikirim ke server mana pun</strong> —
            hanya muncul di buku tamu pada browser ini sampai halaman dimuat ulang.
          </>
        ) : (
          <>Terima kasih. Pesanmu{subject ? <> “{subject}”</> : null} sudah terkirim dan akan dibaca oleh pemilik portofolio. Pesan tidak ditampilkan untuk publik.</>
        )}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw size={14} strokeWidth={1.75} aria-hidden />
          Tulis pesan lain
        </Button>
        <TextLink href={guestbookHref} className="label">Lihat di buku tamu ↓</TextLink>
      </div>
    </motion.div>
  );
}

/**
 * Formulir kesan & pesan. TIDAK tahu ke mana data dikirim:
 * seluruh pengiriman dilakukan lewat prop `onSubmit(draft) => Promise<{ simulated?: boolean }>`.
 * Phase 07 cukup mengganti fungsi service yang dipasok halaman — komponen ini tidak diubah.
 */
export default function MessageForm({ categories, onSubmit, simulated = true, guestbookHref = '#buku-tamu', className }) {
  const [values, setValues] = useState(emptyDraft);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [result, setResult] = useState(null);
  const [sentSubject, setSentSubject] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const errors = useMemo(() => validateDraft(values), [values]);
  const shownError = (field) => (touched[field] ? errors[field] : undefined);
  const submitting = status === 'submitting';
  const pristine = FIELD_ORDER.every((f) => !values[f]);

  const touch = (field) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
  const setValue = (field, value) => setValues((v) => ({ ...v, [field]: value }));
  const bind = (field) => ({
    value: values[field],
    onChange: (e) => setValue(field, e.target.value),
    onBlur: () => touch(field),
    'data-field': field,
  });

  const focusField = useCallback((field) => {
    requestAnimationFrame(() => formRef.current?.querySelector(`[data-field="${field}"]`)?.focus());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Tandai semua field "disentuh" agar semua error tampil sekaligus.
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      setStatus('idle');
      focusField(firstInvalid);
      return;
    }

    setStatus('submitting');
    const draft = normalizeDraft(values);
    try {
      const res = await onSubmit(draft);
      if (!mounted.current) return;
      setResult(res);
      setSentSubject(draft.subject);
      setStatus('success');
    } catch (err) {
      if (!mounted.current) return;
      setErrorMessage(describePublicError(err));
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(emptyDraft);
    setTouched({});
    setResult(null);
    setSentSubject('');
    setErrorMessage('');
    setStatus('idle');
    focusField('name');
  };

  const errorCount = Object.keys(errors).filter((f) => touched[f]).length;

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <SuccessPanel key="success" result={result} subject={sentSubject} onReset={reset} guestbookHref={guestbookHref} />
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            aria-label="Formulir kesan dan pesan"
            {...panel}
          >
            <fieldset disabled={submitting} className="space-y-9 disabled:opacity-70">
              <legend className="sr-only">Isi formulir kesan dan pesan</legend>

              <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
                <Field
                  id="msg-name" label="Nama lengkap" required autoComplete="name" placeholder="Nama kamu"
                  maxLength={LIMITS.name.max * 2} error={shownError('name')} {...bind('name')}
                />
                <Field
                  id="msg-email" label="Email" required type="email" inputMode="email" autoComplete="email"
                  placeholder="nama@domain.com" error={shownError('email')}
                  hint="Tidak pernah ditampilkan untuk publik." {...bind('email')}
                />
              </div>

              <ChoiceGroup
                id="msg-category" name="category" legend="Kategori pesan" required fieldName="category"
                options={categories} value={values.category} error={shownError('category')}
                onChange={(v) => { setValue('category', v); touch('category'); }}
                onBlur={() => touch('category')}
              />

              <Field
                id="msg-subject" label="Subjek" required placeholder="Ringkasan singkat"
                maxLength={LIMITS.subject.max * 2} error={shownError('subject')}
                counter={{ current: values.subject.length, max: LIMITS.subject.max }} {...bind('subject')}
              />

              <Field
                id="msg-message" as="textarea" rows={6} label="Isi pesan" required placeholder="Tulis kesan atau pesanmu di sini…"
                maxLength={LIMITS.message.max * 2} error={shownError('message')}
                counter={{ current: values.message.length, max: LIMITS.message.max }} {...bind('message')}
              />
            </fieldset>

            {/* Ringkasan error untuk pembaca layar */}
            <p className="sr-only" role="alert" aria-live="assertive">
              {errorCount > 0 ? `Ada ${errorCount} isian yang perlu diperbaiki.` : ''}
            </p>

            {status === 'error' && (
              <p role="alert" className="mt-8 flex items-start gap-2 border border-ink p-4 text-small font-medium">
                <AlertCircle size={16} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
                <span>{errorMessage || 'Pesan belum berhasil diproses.'} Isianmu masih tersimpan — coba kirim lagi.</span>
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                aria-busy={submitting}
                className="disabled:pointer-events-none disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} strokeWidth={2} aria-hidden className="animate-spin" />
                    Memproses…
                  </>
                ) : (
                  <>
                    <Send size={14} strokeWidth={1.75} aria-hidden />
                    Kirim pesan
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={reset}
                disabled={submitting || (pristine && status === 'idle' && !Object.keys(touched).length)}
                className="disabled:pointer-events-none disabled:opacity-40"
              >
                <RotateCcw size={14} strokeWidth={1.75} aria-hidden />
                Reset formulir
              </Button>
            </div>

            <p className="mt-6 max-w-md text-small text-mute">
              {simulated
                ? 'Mode simulasi: pesan belum dikirim ke server. Setelah “Kirim pesan”, isinya hanya tampil di buku tamu pada browser ini.'
                : 'Pesan hanya dibaca oleh pemilik portofolio dan tidak ditampilkan untuk publik.'}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
