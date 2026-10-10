import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  Button,
  Container,
  SectionHeading,
  Reveal,
  FeatureGrid,
  ProgramGrid,
  AchievementCard,
  EventGrid,
  CTASection,
  SectionIntro,
  PhotoFeature,
  cardPhotoFor,
} from '../components';
import { HomeHero, IntroductionSection } from '../sections/HomeSections';
import {
  achievementCategories,
  events,
  programs,
  sortEvents,
  whySpectral,
  seo,
} from '../data';
import { useSeo, buildOrganizationSchema, buildGraph } from '../hooks/useSeo';

const ORGANIZATION_SCHEMA = buildGraph(buildOrganizationSchema());

export function HomePage() {
  useSeo({
    title: seo.title,
    description: seo.description,
    path: '/',
    structuredData: ORGANIZATION_SCHEMA,
  });

  const latestEvents = sortEvents(events.filter((event) => event.status === 'published')).slice(
    0,
    3
  );

  return (
    <>
      <HomeHero />

      <IntroductionSection />

      {/* Why Choose Spectral */}
      <section className="section bg-white" aria-labelledby="why-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="why-heading"
              eyebrow="Why Spectral"
              title="Why Choose Spectral?"
              description="Four principles that shape how we teach and how we support each student."
              align="center"
            />
          </Reveal>

          <FeatureGrid features={whySpectral} columns={4} className="mt-14" />
        </Container>
      </section>

      {/* Academics */}
      <section className="section bg-canvas" aria-labelledby="academics-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="academics-heading"
              eyebrow="Academics"
              title="Learning Designed for Every Stage"
              description="Programmes supporting students at school and college level, alongside focused academic development."
              align="center"
            />
          </Reveal>

          <ProgramGrid programs={programs} className="mt-14" />

          <Reveal delay={0.1} className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/academics">
                Explore Academics
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Admissions */}
      <section className="section bg-white" aria-labelledby="admissions-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionIntro
                id="admissions-heading"
                eyebrow="Admissions"
                title="Begin Your Journey With Spectral"
                description="Take the next step toward an educational journey focused on learning, growth and opportunity."
              />

              <Reveal delay={0.1} className="mt-9">
                <Button variant="primary" size="lg" asChild>
                  <Link to="/admissions">
                    Apply for Admission
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <ol className="space-y-6 rounded-2xl bg-white p-6 shadow-lift sm:p-7">
                  {[
                    {
                      step: '01',
                      title: 'Submit Inquiry',
                      copy: 'Contact the admissions office to begin.',
                    },
                    {
                      step: '02',
                      title: 'Application',
                      copy: 'Complete the application with the required details.',
                    },
                    {
                      step: '03',
                      title: 'Admission Review',
                      copy: 'The team reviews your submission and follows up.',
                    },
                    {
                      step: '04',
                      title: 'Enrollment',
                      copy: 'Selected families receive enrolment guidance.',
                    },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <span
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 font-display text-sm font-bold text-navy"
                        aria-hidden="true"
                      >
                        {item.step}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="font-display text-sm font-semibold text-navy">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.copy}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <Button variant="outline" size="md" asChild className="mt-6 w-full">
                  <Link to="/admissions#inquiry">Contact Admissions</Link>
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Campus photograph beside the admissions steps. */}
      <section className="section bg-white" aria-labelledby="campus-heading">
        <Container>
          <h2 id="campus-heading" className="sr-only">
            The campus
          </h2>
          <PhotoFeature
            photo="campusA"
            alt="Official photograph of Spectral Model School & College"
            caption="Qazi Park, Shahdara, Lahore"
            eyebrow="The Campus"
            title="Come and See It for Yourself"
            description="School and college education on one campus at Qazi Park Road, Shahdara, Lahore. Call the office to arrange a visit before you decide."
            bullets={[
              'Both school and college levels at the same site',
              'Families from Shahdara and across Lahore',
              'Office open for walk-in inquiries; call ahead to be sure',
            ]}
            action={{ label: 'Explore the Campus', to: '/campus' }}
            reverse
          />
        </Container>
      </section>

      {/* Achievements */}
      <section className="section bg-canvas" aria-labelledby="achievements-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="achievements-heading"
              eyebrow="Student Success"
              title="Celebrating Student Achievement"
              description="Recognition across academics, personal progress, annual awards and co-curricular activities."
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

          <Reveal delay={0.1} className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/achievements">
                View Achievements
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Events */}
      <section className="section bg-white" aria-labelledby="events-heading">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <SectionHeading
                id="events-heading"
                eyebrow="Campus Life"
                title="Life at Spectral"
                description="Events, activities and announcements from across the school."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <Button variant="outline" asChild>
                <Link to="/events">
                  View All Events
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          </div>

          {latestEvents.length > 0 ? (
            <EventGrid events={latestEvents} className="mt-12" />
          ) : (
            <p className="mt-12 text-ink-muted">No events have been published yet.</p>
          )}
        </Container>
      </section>

      <CTASection
        title="Ready to Join the Spectral Family?"
        description="Start an admission inquiry and let our team answer your questions about the school."
        primary={{ label: 'Apply for Admission', to: '/admissions' }}
        secondary={{ label: 'Visit the Campus', to: '/contact' }}
      />
    </>
  );
}
