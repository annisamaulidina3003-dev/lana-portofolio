import { Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import Placeholder from '@/components/ui/Placeholder';

/**
 * Tombol kirim email (mailto:). Bila email belum diisi, tombol dinonaktifkan
 * dan diberi keterangan — bukan alamat karangan.
 */
export default function MailtoCta({ email, subject = 'Halo dari portofolio' }) {
  if (!email) {
    return (
      <div>
        <span
          aria-disabled="true"
          className="inline-flex h-14 cursor-not-allowed items-center gap-2 border border-dashed border-line-strong px-8 font-mono text-xs uppercase tracking-[0.12em] text-mute"
        >
          <Mail size={14} strokeWidth={1.75} aria-hidden />
          Kirim email
        </span>
        <p className="mt-3 text-small">
          <Placeholder>Email kontak belum tersedia</Placeholder>
        </p>
      </div>
    );
  }

  return (
    <Button size="lg" href={`mailto:${email}?subject=${encodeURIComponent(subject)}`} withArrow>
      <Mail size={14} strokeWidth={1.75} aria-hidden />
      Kirim email
    </Button>
  );
}
