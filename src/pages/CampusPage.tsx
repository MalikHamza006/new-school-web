import {
  Container,
  PageHero,
  Section,
  SectionHeading,
  Reveal,
  FacilityGrid,
  CampusLocationCard,
  MapEmbed,
  ContactDetails,
  CTASection,
} from '../components';
import { MapPin } from 'lucide-react';
import { schoolInfo } from '../data';
import { heroImages } from '../data/images';
import type { HeroImageId } from '../data/images';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const campusPhotoSequence: HeroImageId[] = ['campusC', 'campusA', 'campusD', 'campusB'];

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Campus', path: '/campus' },
  ])
);

export function CampusPage() {
  useSeo({
    title: `Campus & Facilities | ${schoolInfo.name}`,
    description: `Explore the campus and facilities at ${schoolInfo.name} in Qazi Park, Shahdara, Lahore, and find directions to the school.`,
    path: '/campus',
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="campus"
        eyebrow="Campus"
        title="A Place to Learn, Grow & Thrive"
        description="A calm, purposeful learning environment in Qazi Park, Shahdara, designed so that students can focus, explore and take part."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Campus' },
        ]}
      />

      {/* Official photographs.
          These are the school's real images, taken from its own website. The
          school has not confirmed what each one shows, so the captions stay
          deliberately general rather than guessing at "the library" or "the
          science lab". */}
      <Section tone="canvas" aria-labelledby="campus-photos-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="campus-photos-heading"
              eyebrow="Around the Campus"
              title="The Campus in Photographs"
              description="Photographs published by the school. Detailed captions are awaiting confirmation from the school."
              align="center"
            />
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {campusPhotoSequence.map((id, index) => {
              const photo = heroImages[id];

              return (
                <Reveal
                  as="li"
                  key={id}
                  delay={index * 0.07}
                  className={index % 2 === 1 ? 'lg:mt-10' : ''}
                >
                  <figure className="group overflow-hidden rounded-2xl bg-navy-50 shadow-lift">
                    <img
                      src={photo.content.thumbSrc}
                      srcSet={photo.content.srcSet}
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
                      width={photo.content.width}
                      height={photo.content.height}
                      alt="Official photograph of Spectral Model School &amp; College"
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <figcaption className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
                      <span className="truncate">Qazi Park, Shahdara, Lahore</span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Facilities */}
      <Section tone="white" aria-labelledby="facilities-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="facilities-heading"
              eyebrow="Facilities"
              title="Spaces That Support Learning"
              description="Purposeful learning and activity environments designed to support students across academic, scientific, and recreational development."
              align="center"
            />
          </Reveal>

          <div className="mt-8 flex justify-center">
            <p className="max-w-2xl rounded-xl bg-navy-50/80 px-5 py-3.5 text-center text-sm leading-relaxed text-ink-muted">
              Campus tours and facility walk-throughs are available by appointment with our administrative desk.
              Call <a href="tel:04237932284" className="font-medium text-navy hover:text-blue">042-37932284</a> or visit our office to arrange a guided visit.
            </p>
          </div>

          <FacilityGrid className="mt-12" />
        </Container>
      </Section>

      {/* Location */}
      <Section tone="canvas" aria-labelledby="location-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  id="location-heading"
                  eyebrow="Location"
                  title="Finding the Campus"
                  description="Spectral Model School & College is on Qazi Park Road in Shahdara, Lahore, a short journey from the wider city."
                />
              </Reveal>

              <Reveal delay={0.1} className="mt-8">
                <ContactDetails />
              </Reveal>

              <Reveal delay={0.15} className="mt-6">
                <CampusLocationCard />
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <MapEmbed height="h-[24rem] sm:h-[32rem] lg:h-full lg:min-h-[34rem]" />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        eyebrow="Visit Us"
        title="Come and See for Yourself"
        description="A campus visit is the best way to understand the environment. Contact the school office to arrange a time."
        primary={{ label: 'Arrange a Campus Visit', to: '/contact' }}
        secondary={{ label: 'Apply for Admission', to: '/admissions' }}
      />
    </>
  );
}
