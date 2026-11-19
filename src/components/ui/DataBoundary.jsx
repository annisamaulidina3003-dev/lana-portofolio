import { RotateCw } from 'lucide-react';
import { describePublicError } from '@/lib/publicError';
import Container from './Container';
import Loading from './Loading';

/**
 * Menangani state hasil useAsyncData: memuat → kesalahan (dengan "Coba lagi") → konten.
 * <DataBoundary state={state}>{(data) => <Konten data={data} />}</DataBoundary>
 */
export default function DataBoundary({ state, children }) {
  if (state.loading) return <Loading compact />;
  if (state.error) {
    return (
      <Container>
        <div role="alert" className="my-16 flex flex-col items-start gap-5 border border-ink p-6 md:my-24 md:p-10">
          <p className="label text-ink">Data gagal dimuat</p>
          <p className="max-w-lg text-lead text-ink-soft">{describePublicError(state.error)}</p>
          {state.reload && (
            <button
              type="button"
              onClick={state.reload}
              className="inline-flex h-11 items-center gap-2 border border-ink px-5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
            >
              <RotateCw size={14} aria-hidden /> Coba lagi
            </button>
          )}
        </div>
      </Container>
    );
  }
  return children(state.data);
}
