import { Link } from 'react-router-dom';
import { Trophy, Star, Users, Zap } from 'lucide-react';
import {
  Container,
  PageHero,
  Section,
  SectionHeading,
  Reveal,
  Card,
  CardBody,
  IconTile,
  AchievementCard,
  CTASection,
  PhotoBand,
  cardPhotoFor,
} from '../components';
import { achievementCategories, pillars, schoolInfo } from '../data';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Achievements', path: '/achievements' },
  ])
);

/**
 * Areas of recognition.
 *
 * These describe the KINDS of achievement the school recognises. No specific
 * awards, positions, scores or percentages are stated, because none have been
 * supplied by the school. Add verified achievements to
 * `verifiedAchievements` below as they are confirmed.
 */
const verifiedAchievements: Array<{
  id: string;
  title: string;
  detail: string;
  year?: string;
}> = [];

export function AchievementsPage() {
  useSeo({
    title: `Achievements | ${schoolInfo.name}`,
    description: `Student achievement and recognition at ${schoolInfo.name}, Shahdara, Lahore: academic success, annual awards and co-curricular activities.`,
    path: '/achievements',
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="achievements"
        eyebrow="Achievements"
        title="Celebrating Student Achievement"
        description="Progress worth recognising, in the classroom, in competitions, in service and in personal growth."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Achievements' },
        ]}
      />

      {/* Categories */}
      <Section tone="canvas" aria-labelledby="categories-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="categories-heading"
              eyebrow="Recognition"
              title="What We Celebrate"
              description="Four areas where students are recognised for effort, improvement and achievement."
              align="center"
            />
          </Reveal>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {achievementCategories.map((category, index) => (
              <Reveal as="li" key={category.id} delay={index * 0.07} className="h-full">
                <AchievementCard feature={category} image={cardPhotoFor(index)} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Verified achievements */}
      <Section tone="white" aria-labelledby="verified-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="verified-heading"
              eyebrow="Highlights"
              title="Verified Achievements"
              description="Specific achievements, confirmed with the school, will appear here."
              align="center"
            />
          </Reveal>

          {verifiedAchievements.length > 0 ? (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {verifiedAchievements.map((achievement, index) => (
                <Reveal as="li" key={achievement.id} delay={index * 0.07} className="h-full">
                  <Card variant="base" padding="lg" fullHeight>
                    <div className="flex items-start justify-between gap-3">
                      <IconTile tone="gold" size="sm">
                        <Trophy className="h-4.5 w-4.5" strokeWidth={1.75} />
                      </IconTile>
                      {achievement.year && (
                        <span className="font-display text-sm font-semibold text-ink-muted">
                          {achievement.year}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-navy">
                      {achievement.title}
                    </h3>
                    <CardBody className="mt-2">{achievement.detail}</CardBody>
                  </Card>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
              <div className="rounded-2xl bg-white p-8 sm:p-10 text-center shadow-lift">
                <IconTile tone="gold" size="lg" className="mx-auto">
                  <Star className="h-7 w-7" strokeWidth={1.75} />
                </IconTile>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy">
                  Academic &amp; Student Honour Roll
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                  We celebrate hard work, consistency, and extracurricular contributions. Annual award listings,
                  examination recognitions, and distinction scrolls for the academic session are published
                  officially on the school notice boards and announced during our annual ceremonies.
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue"
                  >
                    View School Events &amp; Ceremonies
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* What drives achievement */}
      <Section tone="canvas" aria-labelledby="drivers-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="drivers-heading"
              eyebrow="What Makes It Possible"
              title="Achievement Starts With Support"
              description="Recognition is a result, not a starting point. These are the things that make achievement realistic for students."
              align="center"
            />
          </Reveal>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Reveal as="li" key={pillar.id} delay={index * 0.07} className="h-full">
                  <Card variant="interactive" padding="lg" fullHeight>
                    <IconTile tone="navy" size="md">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </IconTile>
                    <h3 className="mt-5 font-display text-base font-semibold text-navy">
                      {pillar.title}
                    </h3>
                    <CardBody className="mt-2 text-sm">{pillar.description}</CardBody>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Co-curricular spotlight */}
      <Section tone="white" aria-labelledby="cocurricular-heading">
        <Container size="default">
          <Reveal>
            <div className="grid gap-10 rounded-2xl bg-white p-8 shadow-lift sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-14">
              <div className="lg:col-span-7">
                <SectionHeading
                  id="cocurricular-heading"
                  eyebrow="Beyond the Classroom"
                  title="Co-Curricular Activities"
                  description="Sport, arts, debate and student-led activities give students the chance to apply their qualities somewhere other than an examination paper, and often discover something they are good at."
                />
              </div>
              <div className="lg:col-span-5">
                <ul className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Sports', icon: Trophy },
                    { label: 'Arts', icon: Star },
                    { label: 'Debate', icon: Users },
                    { label: 'Clubs', icon: Zap },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={item.label}
                        className="flex flex-col items-center gap-2 rounded-xl bg-navy-50/70 p-5 text-center"
                      >
                        <Icon className="h-6 w-6 text-gold-dark" strokeWidth={1.75} aria-hidden="true" />
                        <span className="text-sm font-semibold text-navy">{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-5 text-center text-xs leading-relaxed text-ink-muted">
                  Specific activities offered each year are confirmed with the school office.
                </p>
              </div>
            </div>
          </Reveal>

          <PhotoBand
            photo="campusB"
            alt="Official photograph of Spectral Model School & College"
            eyebrow="The People Behind It"
            title="Achievements come from students doing the work"
            description="These are the school's own photographs from Qazi Park, Shahdara."
            className="mt-16"
          />
        </Container>
      </Section>

      <CTASection
        eyebrow="Join Us"
        title="Give Your Child the Chance to Shine"
        description="Start an admission inquiry and find out how your child could be supported at Spectral."
        primary={{ label: 'Apply for Admission', to: '/admissions' }}
        secondary={{ label: 'Contact the School', to: '/contact' }}
      />
    </>
  );
}
