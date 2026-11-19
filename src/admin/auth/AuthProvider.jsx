import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { AUTH_EXPIRED_EVENT } from '@/services/admin/core';
import { AuthContext } from './AuthContext';
import { mapAuthError } from './errors';

const ACTIVE = ['checking', 'authenticated', 'forbidden'];
const RECHECK_MS = 30_000;

/**
 * State autentikasi admin berbasis Supabase Auth.
 *
 * KEAMANAN: "admin" ditentukan oleh database — RPC `is_admin()` (membaca tabel
 * admin_users lewat auth.uid() dari JWT yang diverifikasi server). Role/metadata
 * yang bisa diedit pengguna TIDAK dipakai. Pengecekan ini hanya untuk UX; yang
 * benar-benar melindungi data adalah RLS pada setiap query.
 */
export default function AuthProvider({ children }) {
  const [status, setStatusState] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured');
  const [session, setSession] = useState(null);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState(null);

  const statusRef = useRef(status);
  const userIdRef = useRef(null);
  const explicitSignOut = useRef(false);
  const checkSeq = useRef(0);
  const lastValidated = useRef(Date.now());

  const setStatus = useCallback((next) => {
    statusRef.current = next;
    setStatusState(next);
  }, []);

  const verifyAdmin = useCallback(async () => {
    const seq = ++checkSeq.current;
    setError(null);
    setStatus('checking');
    const { data, error: rpcError, status: httpStatus } = await supabase.rpc('is_admin');
    if (seq !== checkSeq.current) return; // sudah digantikan pengecekan/logout yang lebih baru
    if (rpcError && (rpcError.code === 'PGRST301' || httpStatus === 401)) {
      // Token ditolak server (kedaluwarsa/dicabut) → akhiri sesi lokal; SIGNED_OUT menandai "sesi berakhir".
      supabase.auth.signOut({ scope: 'local' });
      return;
    }
    if (rpcError) {
      setError(rpcError.message);
      setStatus('error');
      return;
    }
    lastValidated.current = Date.now();
    setStatus(data === true ? 'authenticated' : 'forbidden');
  }, [setStatus]);

  const applySession = useCallback(
    (event, next) => {
      if (!next) {
        const wasActive = ACTIVE.includes(statusRef.current);
        if (event === 'SIGNED_OUT' && wasActive && !explicitSignOut.current) setExpired(true);
        explicitSignOut.current = false;
        checkSeq.current += 1;
        userIdRef.current = null;
        setSession(null);
        setStatus('unauthenticated');
        return;
      }
      setSession(next);
      const sameUser = userIdRef.current === next.user.id;
      userIdRef.current = next.user.id;
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;
      // SIGNED_IN juga dipicu saat tab kembali aktif: jangan cek ulang bila pengguna sama.
      if (sameUser && statusRef.current !== 'unauthenticated' && statusRef.current !== 'loading') return;
      setExpired(false);
      verifyAdmin();
    },
    [setStatus, verifyAdmin],
  );

  useEffect(() => {
    if (!supabase) return undefined;
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      // Jangan memanggil supabase.* secara sinkron di dalam callback (risiko deadlock) → tunda.
      setTimeout(() => applySession(event, next), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [applySession]);

  // Server menolak token di tengah operasi (mis. JWT expired) → akhiri sesi lokal.
  useEffect(() => {
    if (!supabase) return undefined;
    const onExpired = () => {
      if (ACTIVE.includes(statusRef.current)) supabase.auth.signOut({ scope: 'local' });
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  // Saat tab kembali aktif, validasi sesi ke server (menangkap sesi yang dicabut/akun dihapus).
  useEffect(() => {
    if (!supabase) return undefined;
    const recheck = async () => {
      if (document.visibilityState !== 'visible' || statusRef.current !== 'authenticated') return;
      if (Date.now() - lastValidated.current < RECHECK_MS) return;
      lastValidated.current = Date.now();
      const { error: userError } = await supabase.auth.getUser();
      if (userError && [401, 403].includes(userError.status)) supabase.auth.signOut({ scope: 'local' });
    };
    window.addEventListener('focus', recheck);
    document.addEventListener('visibilitychange', recheck);
    return () => {
      window.removeEventListener('focus', recheck);
      document.removeEventListener('visibilitychange', recheck);
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    return { error: mapAuthError(authError) };
  }, []);

  const signOut = useCallback(async ({ everywhere = false } = {}) => {
    explicitSignOut.current = true;
    const { error: outError } = await supabase.auth.signOut({ scope: everywhere ? 'global' : 'local' });
    if (outError) {
      // Gagal menghubungi server → tetap akhiri sesi di perangkat ini.
      await supabase.auth.signOut({ scope: 'local' });
    }
  }, []);

  const value = useMemo(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      isAdmin: status === 'authenticated',
      expired,
      error,
      signIn,
      signOut,
      retryVerify: verifyAdmin,
      dismissExpired: () => setExpired(false),
    }),
    [status, session, expired, error, signIn, signOut, verifyAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
