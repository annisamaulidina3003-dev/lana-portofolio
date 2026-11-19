import { getPage } from '@/data';
import { usePageTitle } from '@/hooks/usePageTitle';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';

/**
 * Kerangka halaman Phase 01. Isi sesungguhnya dibangun di Phase 02+.
 * Meta (judul, deskripsi, sumber data) diambil dari src/data/navigation.js.
 */
export default function PageShell({ pageKey }) {
  const page = getPage(pageKey);
  usePageTitle(page.label);

  return (
    <section className="pb-section pt-16 md:pt-24">
      <Container>
        <SectionHeading
          as="h1"
          index={page.index}
          eyebrow={page.eyebrow}
          title={page.label}
          description={page.description}
        />

        <Reveal className="mt-16 md:mt-24" delay={0.2}>
          <div className="grid grid-cols-12 gap-x-4 border-t border-line pt-6">
            <p className="label col-span-12 md:col-span-3">Status</p>
            <div className="col-span-12 mt-4 md:col-span-9 md:mt-0">
              <p className="text-display-sm">Struktur halaman siap.</p>
              <p className="mt-4 max-w-xl text-ink-soft">
                Konten dan tata letak halaman ini disusun pada Phase 02.
              </p>
              <p className="label mt-8">
                Sumber data — <span className="text-ink">{page.dataSource}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
