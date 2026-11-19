import { useCallback, useMemo, useState } from 'react';
import { messageCategories } from '@/data';
import { getContact, getMessages, submitMessage } from '@/services/portfolioService';
import { usesSupabaseData } from '@/lib/supabaseConfig';
import { useAsyncData } from '@/hooks/useAsyncData';
import PageHeader from '@/components/layout/PageHeader';
import Container from '@/components/ui/Container';
import ContentBlock from '@/components/ui/ContentBlock';
import DataBoundary from '@/components/ui/DataBoundary';
import Ornament from '@/components/ui/Ornament';
import Switch from '@/components/ui/Switch';
import Reveal from '@/components/motion/Reveal';
import ContactChannels from '@/components/contact/ContactChannels';
import GuestbookList from '@/components/contact/GuestbookList';
import MailtoCta from '@/components/contact/MailtoCta';
import MessageForm from '@/components/contact/MessageForm';

function ContactContent({ data: [contact, serverMessages] }) {
  // Pesan yang diketik di sesi ini (state lokal). Tidak pernah dianggap "terkirim".
  const [localMessages, setLocalMessages] = useState([]);
  const [showDemo, setShowDemo] = useState(true);

  const handleSubmit = useCallback(async (draft) => {
    const result = await submitMessage(draft);
    // Pesan yang baru dikirim ditampilkan kembali HANYA kepada pengirimnya (state sesi ini, bukan hasil baca
    // database). Pesan sungguhan masuk sebagai 'new' dan hanya dapat dibaca admin; pengunjung lain tidak
    // dapat melihatnya.
    if (result.message) {
      setLocalMessages((prev) => [{ ...result.message, origin: result.simulated ? 'local' : 'sent' }, ...prev]);
    }
    return result;
  }, []);

  // Data demo diberi penanda `origin: 'demo'` agar selalu berlabel di antarmuka.
  const messages = useMemo(
    () => [
      ...localMessages,
      ...(showDemo ? serverMessages.map((m) => ({ ...m, origin: m.id.startsWith('demo-') ? 'demo' : undefined })) : []),
    ],
    [localMessages, serverMessages, showDemo],
  );

  const hasDemo = serverMessages.some((m) => m.id.startsWith('demo-'));

  return (
    <section className="pb-section pt-14 md:pt-20">
      <Container>
        {/* ── 01 Kanal + 02 Formulir (asimetris: kolom kiri lengket) ── */}
        <div className="grid grid-cols-12 gap-x-4 gap-y-24">
          <aside className="col-span-12 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <ContentBlock index="01" title="Kanal">
              <ContactChannels contact={contact} />
              <Reveal className="mt-10" delay={0.2}>
                <MailtoCta email={contact.email} />
              </Reveal>
            </ContentBlock>
          </aside>

          <div id="formulir" className="col-span-12 scroll-mt-24 lg:col-span-6 lg:col-start-7">
            <ContentBlock index="02" title="Kesan & Pesan">
              <p className="mb-10 max-w-md text-ink-soft">
                Tulis kesan, pesan, saran, atau pertanyaan. Semua isian bertanda * wajib diisi.
              </p>
              <MessageForm categories={messageCategories} onSubmit={handleSubmit} simulated={!usesSupabaseData} />
            </ContentBlock>
          </div>
        </div>

        {/* ── 03 Buku Tamu ── */}
        <div id="buku-tamu" className="mt-28 scroll-mt-24 md:mt-44">
          <ContentBlock index="03" title="Buku Tamu" size="lg">
            <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-start md:justify-between">
              {!hasDemo && usesSupabaseData && (
                <p className="max-w-xl border border-dashed border-ink p-4 text-small text-ink-soft">
                  <strong className="font-semibold text-ink">Privasi pesan.</strong> Pesan yang kamu kirim hanya dibaca
                  oleh pemilik portofolio. Daftar di bawah hanya menampilkan pesan yang kamu tulis di sesi ini; pesan
                  pengunjung lain tidak ditampilkan.
                </p>
              )}
              {hasDemo && (
                <p className="max-w-xl border border-dashed border-ink p-4 text-small text-ink-soft">
                  <strong className="font-semibold text-ink">Data demonstrasi.</strong> Pesan berlabel “Demo” adalah contoh
                  tampilan, bukan dari pengunjung sungguhan. Pesan yang kamu tulis di atas berlabel “Lokal” karena belum
                  dikirim ke server.
                </p>
              )}
              {hasDemo && <Switch checked={showDemo} onChange={setShowDemo} label="Tampilkan data demo" className="shrink-0" />}
            </div>
            <GuestbookList messages={messages} categories={messageCategories} emptyText={usesSupabaseData ? 'Pesan yang kamu kirim di sesi ini akan tampil di sini.' : undefined} />
          </ContentBlock>
        </div>
      </Container>
    </section>
  );
}

export default function Contact() {
  const state = useAsyncData(() => Promise.all([getContact(), getMessages()]));

  return (
    <>
      <div className="relative">
        <PageHeader
          pageKey="kontak"
          title="Mari bicara"
          description="Punya kesan, saran, atau pertanyaan? Hubungi lewat kanal di bawah atau tinggalkan pesan di formulir."
        />
        {/* Elemen visual editorial */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-16 hidden md:top-24 md:block">
          <Container className="flex justify-end">
            <Ornament className="mt-2 h-40 w-40 text-line-strong lg:h-56 lg:w-56" duration={80} />
          </Container>
        </div>
      </div>
      <DataBoundary state={state}>{(data) => <ContactContent data={data} />}</DataBoundary>
    </>
  );
}
