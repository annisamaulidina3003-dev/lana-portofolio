import { Link } from 'react-router-dom';
import { useAdminTitle } from '../hooks/useAdminTitle';
import AdminPageHeader from '../components/PageHeader';

export default function AdminNotFound() {
  useAdminTitle('Tidak ditemukan');
  return (
    <>
      <AdminPageHeader index="404" title="Halaman tidak ada" description="Halaman admin yang Anda cari tidak ditemukan." />
      <Link to="/admin" className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.12em] underline">← Kembali ke Overview</Link>
    </>
  );
}
