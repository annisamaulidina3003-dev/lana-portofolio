import { usePageTitle } from '@/hooks/usePageTitle';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function NotFound() {
  usePageTitle('Halaman tidak ditemukan');
  return (
    <section className="pb-section pt-16 md:pt-24">
      <Container>
        <p className="label text-ink">Galat 404</p>
        <h1 className="mt-6 text-display-xl uppercase">404</h1>
        <p className="mt-10 max-w-md text-lead text-ink-soft">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <Button to="/" withArrow className="mt-10">Kembali ke beranda</Button>
      </Container>
    </section>
  );
}
