import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, Lightbulb } from 'lucide-react';
import {
  Container,
  PageHero,
  Section,
  SectionHeading,
  SectionIntro,
  Reveal,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  IconTile,
  LeadershipMessage,
  CTASection,
  PhotoFeature,
} from '../components';
import {
  introduction,
  mission,
  vision,
  philosophy,
  studentDevelopment,
  schoolInfo,
} from '../data';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ])
);

export function AboutPage() {
  useSeo({
    title: `About Us | ${schoolInfo.name}`,
    description: `Learn about ${schoolInfo.name} in Shahdara, Lahore: our mission, vision, educational philosophy and approach to student development.`,
    path: '/about',
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="about"
        eyebrow="About Spectral"
        title="An Institution Focused on Education and Development"
        description="A school and college in Shahdara, Lahore, built around a simple idea: a good school develops a student academically and as a person."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />

      {/* Introduction */}
      <Section tone="canvas" aria-labelledby="about-intro-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionIntro
                id="about-intro-heading"
                eyebrow="Who We Are"
                title={introduction.title}
              />

              <div className="mt-7 max-w-prose space-y-4">
                {introduction.body.map((paragraph, index) => (
                  <Reveal as="p" key={index} delay={0.05 + index * 0.06}>
                    {paragraph}
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <Card variant="dark" padding="lg" className="lg:sticky lg:top-28">
                  <h2 className="font-display text-lg font-semibold text-white">At a Glance</h2>
                  <dl className="mt-6 space-y-5">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                        Institution
                      </dt>
                      <dd className="mt-1.5 text-sm text-white/80">{schoolInfo.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                        Levels
                      </dt>
                      <dd className="mt-1.5 text-sm text-white/80">
                        School Education &amp; College Education
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                        Location
                      </dt>
                      <dd className="mt-1.5 text-sm text-white/80">
                        {schoolInfo.address.area}, {schoolInfo.address.city},{' '}
                        {schoolInfo.address.province}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                        Contact
                      </dt>
                      <dd className="mt-1.5 text-sm text-white/80">
                        {schoolInfo.phone.primary}
                        <br />
                        {schoolInfo.phone.secondary}
                      </dd>
                    </div>
                  </dl>

                  <Button variant="accent" size="md" asChild className="mt-7 w-full">
                    <Link to="/contact">
                      Get in Touch
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Official photograph beside the introduction. */}
      <Section tone="white" aria-labelledby="about-photo-heading">
        <Container>
          <h2 id="about-photo-heading" className="sr-only">
            The School
          </h2>
          <PhotoFeature
            photo="campusA"
            alt="Official photograph of Spectral Model School & College, Shahdara, Lahore"
            caption="Qazi Park, Shahdara, Lahore"
            eyebrow="Our Campus"
            title="A Campus in Qazi Park, Shahdara"
            description="The school sits on Qazi Park Road in Shahdara, Lahore. The photographs on this site are the ones published by the school itself."
            bullets={[
              'School Education and College Education on one campus',
              'Open to families in Shahdara and across Lahore',
              'Office open for walk-in inquiries; call ahead to be sure',
            ]}
            action={{ label: 'See the Campus Page', to: '/campus' }}
          />
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section tone="canvas" aria-labelledby="mission-heading">
        <Container>
          <h2 id="mission-heading" className="sr-only">
            Our Mission and Vision
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <Reveal>
              <Card variant="interactive" padding="lg" fullHeight className="relative overflow-hidden">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10"
                />
                <div className="relative">
                  <IconTile tone="gold" size="lg">
                    <Compass className="h-7 w-7" strokeWidth={1.75} />
                  </IconTile>
                  <CardHeader className="mt-6">
                    <CardTitle>{mission.title}</CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    {mission.body.map((paragraph, index) => (
                      <CardBody key={index}>{paragraph}</CardBody>
                    ))}
                  </div>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card variant="interactive" padding="lg" fullHeight className="relative overflow-hidden">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue/10"
                />
                <div className="relative">
                  <IconTile tone="blue" size="lg">
                    <Lightbulb className="h-7 w-7" strokeWidth={1.75} />
                  </IconTile>
                  <CardHeader className="mt-6">
                    <CardTitle>{vision.title}</CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    {vision.body.map((paragraph, index) => (
                      <CardBody key={index}>{paragraph}</CardBody>
                    ))}
                  </div>
                </div>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Educational Philosophy */}
      <Section tone="white" aria-labelledby="philosophy-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionIntro
                id="philosophy-heading"
                eyebrow="Philosophy"
                title={philosophy.title}
                withRule
              />
              <div className="mt-6 max-w-prose space-y-4">
                {philosophy.body.map((paragraph, index) => (
                  <Reveal as="p" key={index} delay={0.05 + index * 0.06}>
                    {paragraph}
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <ul className="grid gap-5 sm:grid-cols-2">
                {philosophy.principles.map((principle, index) => (
                  <Reveal as="li" key={principle.id} delay={index * 0.08} className="h-full">
                    <Card variant="base" padding="md" fullHeight>
                      <h3 className="font-display text-base font-semibold text-navy">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {principle.description}
                      </p>
                    </Card>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Student Development */}
      <Section tone="white" aria-labelledby="development-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="development-heading"
              eyebrow="Beyond Academics"
              title={studentDevelopment.title}
              description={studentDevelopment.body[0]}
              align="center"
            />
          </Reveal>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {studentDevelopment.areas.map((area, index) => (
              <Reveal as="li" key={area.id} delay={index * 0.07} className="h-full">
                <Card variant="interactive" padding="md" fullHeight>
                  <IconTile tone="navy" size="sm">
                    <Heart className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </IconTile>
                  <h3 className="mt-5 font-display text-base font-semibold text-navy">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{area.description}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Leadership */}
      <Section tone="canvas" aria-labelledby="leadership-heading">
        <Container>
          <LeadershipMessage className="scroll-mt-28" />
        </Container>
      </Section>

      <CTASection
        eyebrow="Next Step"
        title="Want to See the School for Yourself?"
        description="Arrange a campus visit or start an admission inquiry, and our team will guide you through the process."
        primary={{ label: 'Apply for Admission', to: '/admissions' }}
        secondary={{ label: 'Contact the School', to: '/contact' }}
      />
    </>
  );
}
