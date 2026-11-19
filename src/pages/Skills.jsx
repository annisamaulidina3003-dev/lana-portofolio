import { getSkills } from '@/services/portfolioService';
import { useAsyncData } from '@/hooks/useAsyncData';
import { hasNumber } from '@/lib/format';
import { groupSkills } from '@/lib/skills';
import PageHeader from '@/components/layout/PageHeader';
import Container from '@/components/ui/Container';
import ContentBlock from '@/components/ui/ContentBlock';
import DataBoundary from '@/components/ui/DataBoundary';
import CountUp from '@/components/ui/CountUp';
import ProgressBar from '@/components/ui/ProgressBar';
import RadialMeter from '@/components/ui/RadialMeter';
import Reveal from '@/components/motion/Reveal';

function EmptyNote({ children }) {
  return <p className="border border-dashed border-line-strong p-6 text-mute">{children}</p>;
}

function HardSkills({ skills }) {
  const groups = groupSkills(skills);

  return (
    <div className="space-y-12 md:space-y-16">
      {groups.map(({ group, items }, gi) => (
        <div key={group} className="grid grid-cols-12 gap-x-4 gap-y-4">
          <div className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-24">
              <p className="label text-ink">{String(gi + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold uppercase leading-none tracking-tight">
                {group}
              </h3>
              <p className="label mt-2">{items.length} keahlian</p>
            </div>
          </div>

          <ul className="col-span-12 md:col-span-9">
            {items.map((skill, i) => (
              <Reveal
                as="li"
                key={skill.id}
                delay={i * 0.06}
                className="group border-t border-line py-5 last:border-b md:py-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-none tracking-tight transition-transform duration-300 ease-editorial group-hover:translate-x-1">
                    {skill.name}
                  </span>
                  <CountUp
                    value={skill.level}
                    delay={i * 0.06}
                    className="font-mono text-lg tabular-nums text-ink"
                  />
                </div>
                <ProgressBar value={skill.level} label={skill.name} delay={i * 0.06} className="mt-5" />
              </Reveal>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SoftSkills({ skills }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line md:grid-cols-3 lg:grid-cols-5">
      {skills.map((skill, i) => (
        <Reveal
          as="li"
          key={skill.id}
          delay={i * 0.08}
          className="group flex flex-col items-center gap-5 border-b border-r border-line p-6 text-center transition-colors duration-300 hover:bg-fog md:p-8"
        >
          <RadialMeter value={skill.level} label={skill.name} delay={i * 0.08} className="max-w-[8rem]" />
          <p className="font-display text-base font-bold uppercase leading-tight tracking-tight md:text-lg">
            {skill.name}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}

function SkillsContent({ data }) {
  const hard = data.filter((s) => s.category === 'hard');
  const soft = data.filter((s) => s.category === 'soft');
  const hasEmpty = data.some((s) => !hasNumber(s.level));

  return (
    <section className="pb-section pt-14 md:pt-20">
      <Container>
        {hasEmpty && (
          <Reveal className="mb-16 border border-dashed border-line-strong p-4 md:mb-24 md:p-5">
            <p className="label">Beberapa keahlian belum memiliki persentase penguasaan.</p>
          </Reveal>
        )}

        <ContentBlock index="A" title="Hard Skills" size="lg">
          {hard.length ? <HardSkills skills={hard} /> : <EmptyNote>Belum ada hard skill yang dipublikasikan.</EmptyNote>}
        </ContentBlock>

        <ContentBlock index="B" title="Soft Skills" size="lg" className="mt-24 md:mt-36">
          {soft.length ? <SoftSkills skills={soft} /> : <EmptyNote>Belum ada soft skill yang dipublikasikan.</EmptyNote>}
        </ContentBlock>
      </Container>
    </section>
  );
}

export default function Skills() {
  const state = useAsyncData(getSkills);

  return (
    <>
      <PageHeader pageKey="keahlian" />
      <DataBoundary state={state}>{(data) => <SkillsContent data={data} />}</DataBoundary>
    </>
  );
}
