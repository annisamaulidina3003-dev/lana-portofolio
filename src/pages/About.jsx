import { getAbout, getExperiences, getProfile, getSkills } from '@/services/portfolioService';
import { useSite } from '@/hooks/useSite';
import { getInitials } from '@/lib/site';
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatPeriod } from '@/lib/format';
import { groupSkills } from '@/lib/skills';
import { sortByStartDesc, toEntryProps } from '@/lib/experience';
import PageHeader from '@/components/layout/PageHeader';
import Container from '@/components/ui/Container';
import ContentBlock from '@/components/ui/ContentBlock';
import DataBoundary from '@/components/ui/DataBoundary';
import Placeholder from '@/components/ui/Placeholder';
import PortraitFrame from '@/components/ui/PortraitFrame';
import TimelineEntry from '@/components/ui/TimelineEntry';
import TextLink from '@/components/ui/TextLink';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';

const SOURCE_ABOUT = 'src/data/about.js';
const SOURCE_EXP = 'src/data/experiences.js';

function Biodata({ items }) {
  return (
    <dl className="mt-8 border-t border-ink">
      {items.map((item) => (
        <div
          key={item.id}
          className="-mx-2 border-b border-line px-2 py-3 transition-colors duration-300 hover:bg-fog"
        >
          <dt className="label">{item.label}</dt>
          <dd className="mt-1 font-display text-lg font-bold leading-tight tracking-tight">
            {item.value ?? <Placeholder>Belum diisi</Placeholder>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function EntryList({ entries, withTag = false, emptyText }) {
  if (!entries.length) {
    return (
      <p className="border border-dashed border-line-strong p-6 text-mute">
        <Placeholder>{emptyText}</Placeholder>
      </p>
    );
  }
  return (
    <ul>
      {entries.map((exp) => (
        <Reveal as="li" key={exp.id}>
          <TimelineEntry {...toEntryProps(exp, { withTag })} source={SOURCE_EXP} />
        </Reveal>
      ))}
    </ul>
  );
}

function MoreLink() {
  return (
    <p className="label mt-4">
      Selengkapnya di halaman <TextLink to="/pengalaman">Pengalaman</TextLink>
    </p>
  );
}

function AboutContent({ data: [about, skills, experiences, profile] }) {
  const site = useSite();
  const techFields = groupSkills(skills.filter((s) => s.category === 'hard')).map((g) => g.group);
  const orgEntries = sortByStartDesc(
    experiences.filter((e) => e.type === 'organisasi' || e.type === 'kepanitiaan'),
  );
  const plkEntries = sortByStartDesc(experiences.filter((e) => e.type === 'plk'));
  const { headline, description, dream, shortTerm, longTerm } = about.careerGoals;
  const hasCareer = Boolean(headline || dream || shortTerm || longTerm);

  return (
    <section className="pb-section pt-14 md:pt-20">
      <Container>
        <div className="grid grid-cols-12 gap-x-4 gap-y-16">
          {/* Kolom kiri: potret kecil + biodata (menempel saat scroll di desktop) */}
          <aside className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-24">
              <Reveal>
                <PortraitFrame
                  className="w-40 md:w-44"
                  src={profile.photo}
                  alt={profile.photoAlt}
                  monogram={getInitials(site.shortName)}
                  figure="Fig. 02"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <Biodata items={about.biodata} />
              </Reveal>
            </div>
          </aside>

          {/* Kolom kanan: blok konten bernomor */}
          <div className="col-span-12 space-y-20 md:col-span-7 md:col-start-6 md:space-y-28">
            {about.bio && (
              <ContentBlock index="01" title="Deskripsi Diri">
                <Reveal>
                  <p className="max-w-xl text-ink-soft">{about.bio}</p>
                </Reveal>
              </ContentBlock>
            )}

            <ContentBlock index="02" title="Pendidikan">
              <ul>
                {about.education.map((edu) => (
                  <Reveal as="li" key={edu.id}>
                    <TimelineEntry
                      period={formatPeriod(edu.start, edu.end)}
                      title={edu.institution}
                      titleHint={`Nama sekolah ${edu.level}`}
                      subtitle={[edu.level, edu.program].filter(Boolean).join(' · ') || null}
                      description={edu.note}
                      placeholder={edu.placeholder}
                      source={SOURCE_ABOUT}
                    />
                  </Reveal>
                ))}
              </ul>
            </ContentBlock>

            <ContentBlock index="03" title="Minat & Bidang Teknologi">
              <p className="label mb-4">Bidang teknologi</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {techFields.map((field, i) => (
                  <li key={field} className="group flex items-baseline gap-2">
                    <span className="label text-ink">{String(i + 1).padStart(2, '0')}</span>
                    <span className="border-b border-transparent font-display text-[clamp(1.75rem,3.6vw,3rem)] font-extrabold uppercase leading-none tracking-tight transition-colors duration-300 group-hover:border-ink">
                      {field}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="label mt-3">Dikelompokkan dari daftar keahlian</p>

              <p className="label mb-4 mt-12">Minat</p>
              <ul className="flex flex-wrap gap-3">
                {about.interests.map((interest) => (
                  <li
                    key={interest.id}
                    className={
                      interest.name
                        ? 'border border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 hover:bg-ink hover:text-paper'
                        : 'border border-dashed border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mute'
                    }
                  >
                    {interest.name ?? 'Minat belum diisi'}
                  </li>
                ))}
              </ul>
            </ContentBlock>

            <ContentBlock index="04" title="Organisasi & Kepanitiaan">
              <EntryList
                entries={orgEntries}
                withTag
                emptyText="Belum ada pengalaman organisasi / kepanitiaan"
              />
              <MoreLink />
            </ContentBlock>

            <ContentBlock index="05" title="Pengalaman PLK">
              <EntryList entries={plkEntries} emptyText="Belum ada pengalaman PLK" />
              <MoreLink />
            </ContentBlock>

            <ContentBlock index="06" title="Tujuan & Cita-cita Karier">
              {hasCareer ? (
                <>
                  {dream && (
                    <p className="mb-6 inline-block border border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                      Cita-cita · {dream}
                    </p>
                  )}
                  {headline && (
                    <p className="font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.1] tracking-tight">
                      {headline}
                    </p>
                  )}
                  {description && <p className="mt-6 max-w-xl text-ink-soft">{description}</p>}
                  {(shortTerm || longTerm) && (
                    <dl className="mt-10 grid gap-x-8 gap-y-8 border-t border-line pt-6 sm:grid-cols-2">
                      {shortTerm && (
                        <div>
                          <dt className="label">Jangka pendek</dt>
                          <dd className="mt-2 text-ink-soft">{shortTerm}</dd>
                        </div>
                      )}
                      {longTerm && (
                        <div>
                          <dt className="label">Jangka panjang</dt>
                          <dd className="mt-2 text-ink-soft">{longTerm}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </>
              ) : (
                <div className="border border-dashed border-line-strong p-6 md:p-8">
                  <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-mute">
                    Tujuan dan cita-cita karier belum diisi.
                  </p>
                  <p className="label mt-4">Akan diperbarui oleh pemilik portofolio.</p>
                </div>
              )}
            </ContentBlock>

            <Reveal className="flex flex-wrap gap-3 border-t border-line pt-8">
              <Button to="/keahlian" withArrow>Lihat Keahlian</Button>
              <Button to="/pengalaman" variant="outline">Lihat Pengalaman</Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function About() {
  const state = useAsyncData(() => Promise.all([getAbout(), getSkills(), getExperiences(), getProfile()]));

  return (
    <>
      <PageHeader pageKey="tentang" title="Tentang Saya" />
      <DataBoundary state={state}>{(data) => <AboutContent data={data} />}</DataBoundary>
    </>
  );
}
