import { useCallback, useEffect, useState } from 'react';

/**
 * Hook sederhana untuk memanggil fungsi di services.
 * const { data, loading, error, reload } = useAsyncData(getProjects);
 * `reload()` mengulang permintaan (dipakai tombol "Coba lagi" di DataBoundary).
 */
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (active) {
          console.error('[data] Gagal memuat data:', error);
          setState({ data: null, loading: false, error });
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
