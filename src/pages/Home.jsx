import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { sectionPages } from '@/data';
import { getProfile } from '@/services/portfolioService';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useSite } from '@/hooks/useSite';
import { getInitials, splitName } from '@/lib/site';
import { fade, fadeUp, stagger, withDelay } from '@/lib/motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import Ornament from '@/components/ui/Ornament';
import PortraitFrame from '@/components/ui/PortraitFrame';
import TextLink from '@/components/ui/TextLink';
import DataBoundary from '@/components/ui/DataBoundary';
import MaskLine from '@/components/motion/MaskLine';
import Marquee from '@/components/motion/Marquee';
import Reveal from '@/components/motion/Reveal';

function HomeContent({ profile }) {
  const site = useSite();
  const year = new Date().getFullYear();
  const [firstLine, secondLine] = splitName(site.shortName);

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="pb-16 pt-6 md:pb-24 md:pt-10">
        <Container>
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between gap-4 border-b border-line pb-4"
          >
            <span className="label text-ink">(00) Portofolio Digital</span>
            <span className="label hidden sm:block">{site.location} — Edisi {year}</span>
            <TextLink href="#keahlian" className="label text-ink">Gulir ↓</TextLink>
          </motion.div>

          {/* Judul oversized + potret yang menempati ruang kosong di sisi kanan */}
          <div className="relative mt-8 md:mt-12">
            <motion.h1
              aria-label={site.name}
              variants={stagger(0.12, 0.15)}
              initial="hidden"
              animate="visible"
              className="text-display-hero uppercase font-stretch-display md:[font-size:min(14vw,13rem)]"
            >
              <MaskLine>{firstLine}</MaskLine>
              {secondLine && <MaskLine className="md:pl-[8%]">{secondLine}</MaskLine>}
            </motion.h1>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              className="pointer-events-none absolute left-[54%] top-[3%] hidden items-start gap-3 text-ink md:flex"
            >
              <Ornament className="h-16 w-16" />
              <span className="label mt-1 text-ink">N°01</span>
            </motion.div>

            <motion.div
              variants={withDelay(fadeUp, 0.7)}
              initial="hidden"
              animate="visible"
              className="ml-auto mt-10 w-[46%] max-w-[16rem] md:absolute md:right-0 md:top-0 md:mt-0 md:w-[20%] md:max-w-none"
            >
              <PortraitFrame src={profile.photo} alt={profile.photoAlt} monogram={getInitials(site.shortName)} />
            </motion.div>
          </div>

          {/* Identitas · pernyataan · tombol — komposisi asimetris */}
          <motion.div
            variants={stagger(0.1, 0.8)}
            initial="hidden"
            animate="visible"
            className="mt-14 grid grid-cols-12 gap-x-4 gap-y-10 md:mt-24"
          >
            <motion.div variants={fadeUp} className="col-span-12 md:col-span-3">
              <p className="label text-ink">(01) Identitas</p>
              <p className="mt-3 text-small">
                {site.className} — {site.school}
              </p>
            </motion.div>

            <div className="col-span-12 md:col-span-8 md:col-start-5">
              {profile.statement && (
                <motion.p
                  variants={fadeUp}
                  className="font-display text-[clamp(1.5rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-tight"
                >
                  {profile.statement}
                </motion.p>
              )}

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
                <Button to="/proyek" size="lg" withArrow>Lihat Proyek</Button>
                <Button to="/cv" size="lg" variant="outline">Lihat CV</Button>
                <Button to="/kontak" size="lg" variant="ghost" withArrow>Hubungi Saya</Button>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ───────── PITA TEKS ───────── */}
      {profile.ticker.length > 0 && (
        <Reveal variant="fade" className="border-y border-ink py-4 md:py-6" aria-hidden>
          <Marquee
            items={profile.ticker}
            duration={45}
            className="font-display text-[clamp(2rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-[-0.03em] font-stretch-display"
          />
        </Reveal>
      )}

      {/* ───────── KEAHLIAN UTAMA ───────── */}
      <section id="keahlian" className="pb-section pt-section">
        <Container>
          <SectionHeading index="02" eyebrow="Fokus" title="Keahlian Utama" />

          {profile.focusSkills.length === 0 ? (
            <p className="mt-12 border border-dashed border-line-strong p-6 text-mute lg:mt-16">
              Keahlian belum ditambahkan. Daftar lengkap akan tampil di halaman{' '}
              <TextLink to="/keahlian">Keahlian</TextLink> setelah dipublikasikan.
            </p>
          ) : (
          <ul className="mt-12 grid gap-px border-y border-ink bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {profile.focusSkills.map((skill, i) => (
              <Reveal
                as="li"
                key={skill.id}
                delay={i * 0.08}
                className="group flex min-h-[13rem] flex-col justify-between bg-paper p-5 transition-colors duration-300 ease-editorial hover:bg-ink hover:text-paper md:min-h-[16rem] md:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="label text-ink transition-colors group-hover:text-paper">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="label transition-colors group-hover:text-paper/60">{skill.label}</span>
                </div>
                <div>
                  <p className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-extrabold uppercase leading-none tracking-[-0.03em] font-stretch-display">
                    {skill.name}
                  </p>
                  {skill.note && (
                    <p className="mt-3 text-small text-mute transition-colors group-hover:text-paper/70">
                      {skill.note}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
          )}

          <p className="label mt-6">
            Keahlian teknis dengan penguasaan tertinggi. Rincian lengkap di halaman{' '}
            <TextLink to="/keahlian">Keahlian</TextLink>.
          </p>
        </Container>
      </section>

      {/* ───────── INDEKS HALAMAN ───────── */}
      <section id="jelajahi" className="pb-section">
        <Container>
          <SectionHeading index="03" eyebrow="Indeks" title="Jelajahi" />
          <Reveal className="mt-12 md:mt-16" variant="fade">
            <ul>
              {sectionPages.map((item) => (
                <li key={item.key} className="border-t border-line last:border-b">
                  <Link
                    to={item.path}
                    className="group -mx-gutter flex items-baseline gap-4 px-gutter py-5 transition-colors duration-300 ease-editorial hover:bg-ink hover:text-paper md:gap-8 md:py-7"
                  >
                    <span className="label w-6 shrink-0 text-ink transition-colors group-hover:text-paper">
                      {item.index}
                    </span>
                    <span className="text-display-sm uppercase transition-transform duration-300 ease-editorial group-hover:translate-x-2">
                      {item.label}
                    </span>
                    <span className="ml-auto hidden max-w-xs text-small text-mute transition-colors group-hover:text-paper/70 lg:block">
                      {item.description}
                    </span>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      className="ml-auto shrink-0 self-center transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:ml-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

export default function Home() {
  usePageTitle();
  const state = useAsyncData(getProfile);
  return <DataBoundary state={state}>{(profile) => <HomeContent profile={profile} />}</DataBoundary>;
}
