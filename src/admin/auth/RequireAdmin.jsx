import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AlertTriangle, LogOut, RotateCw } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { useAdminTitle } from '../hooks/useAdminTitle';
import { useAuth } from './AuthContext';

function Notice({ title, children, actions }) {
  useAdminTitle(title);
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-gutter py-16">
      <div className="w-full max-w-lg border border-ink p-8 sm:p-10">
        <AlertTriangle size={28} strokeWidth={1.5} aria-hidden />
        <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] font-stretch-display">{title}</h1>
        <div className="mt-5 space-y-3 text-ink-soft">{children}</div>
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </main>
  );
}

const btn = 'inline-flex h-11 items-center gap-2 border border-ink px-5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper';

/**
 * Gerbang seluruh halaman admin. Status ditentukan database (is_admin()), bukan metadata pengguna.
 * Ini hanya lapisan UX — data tetap dilindungi RLS di setiap query.
 */
export default function RequireAdmin() {
  const { status, error, retryVerify, signOut } = useAuth();
  const location = useLocation();

  switch (status) {
    case 'loading':
    case 'checking':
      return <Loading fullscreen label="Memeriksa sesi" />;

    case 'unconfigured':
      return (
        <Notice title="Supabase belum dikonfigurasi">
          <p>Isi <code className="font-mono text-small">VITE_SUPABASE_URL</code> dan <code className="font-mono text-small">VITE_SUPABASE_ANON_KEY</code> di <code className="font-mono text-small">.env.local</code>, lalu jalankan ulang aplikasi.</p>
          <p className="text-small text-mute">Lihat README bagian Phase 07A.</p>
        </Notice>
      );

    case 'unauthenticated':
      return <Navigate to="/admin/login" replace state={{ from: `${location.pathname}${location.search}` }} />;

    case 'forbidden':
      return (
        <Notice
          title="Akses ditolak"
          actions={<button type="button" className={btn} onClick={() => signOut()}><LogOut size={14} aria-hidden /> Keluar</button>}
        >
          <p>Akun ini berhasil masuk, tetapi <strong className="font-semibold text-ink">bukan admin</strong> situs ini.</p>
          <p className="text-small text-mute">Admin didaftarkan lewat SQL Editor Supabase (tabel <code className="font-mono">admin_users</code>). Lihat README Phase 07A.</p>
        </Notice>
      );

    case 'error':
      return (
        <Notice
          title="Gagal memeriksa akses"
          actions={
            <>
              <button type="button" className={btn} onClick={retryVerify}><RotateCw size={14} aria-hidden /> Coba lagi</button>
              <button type="button" className={btn} onClick={() => signOut()}><LogOut size={14} aria-hidden /> Keluar</button>
            </>
          }
        >
          <p>Tidak dapat memverifikasi hak akses admin ke server.</p>
          {error && <p className="break-words text-small text-mute">{error}</p>}
        </Notice>
      );

    default:
      return <Outlet />;
  }
}
