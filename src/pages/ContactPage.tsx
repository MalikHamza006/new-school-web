import {
  Container,
  PageHero,
  Section,
  SectionHeading,
  Reveal,
  Card,
  ContactForm,
  ContactDetails,
  MapEmbed,
  FaqAccordion,
  CTASection,
  PhotoStrip,
} from '../components';
import { contactFaqs, schoolInfo } from '../data';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ])
);

export function ContactPage() {
  useSeo({
    title: `Contact Us | ${schoolInfo.name}`,
    description: `Contact ${schoolInfo.name} in Shahdara, Lahore. Call ${schoolInfo.phone.primary}, message on WhatsApp, or send an inquiry using our contact form.`,
    path: '/contact',
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="contact"
        eyebrow="Contact"
        title="Get in Touch With Spectral"
        description="Questions about admissions, the curriculum or visiting the campus? Our office is ready to help."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
      />

      {/* Contact details + form */}
      <Section tone="canvas" id="inquiry" aria-labelledby="form-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  id="form-heading"
                  eyebrow="Reach Us"
                  title="Contact the School"
                  description="Use whichever channel suits you: call, message, or send an inquiry below."
                />
              </Reveal>

              <Reveal delay={0.1} className="mt-9">
                <ContactDetails />
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <Card variant="base" padding="lg">
                  <h2 className="font-display text-xl font-semibold text-navy">Send an Inquiry</h2>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    Fill in the form and we will get back to you as soon as possible.
                  </p>

                  <div className="mt-7">
                    <ContactForm />
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Map */}
      <Section tone="white" aria-labelledby="map-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="map-heading"
              eyebrow="Find Us"
              title="Visit Spectral Model School & College"
              description={schoolInfo.address.full}
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <MapEmbed height="h-[22rem] sm:h-[28rem] lg:h-[32rem]" />
          </Reveal>

          <Reveal delay={0.15} className="mt-6">
            <p className="text-center text-xs leading-relaxed text-ink-muted">
              The map points to the school&rsquo;s address on Qazi Park Road, Shahdara, Lahore. For
              exact directions, please call the office before travelling.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-12">
            <h2 className="text-center font-display text-lg font-semibold text-navy">
              What the entrance looks like
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-muted">
              Official photographs of the campus, so you can recognise the building before you
              travel.
            </p>
          </Reveal>

          <PhotoStrip
            photos={[
              {
                id: 'campusD',
                alt: 'Official photograph of Spectral Model School & College',
                caption: 'Qazi Park, Shahdara',
              },
              {
                id: 'campusA',
                alt: 'Official photograph of Spectral Model School & College',
                caption: 'Qazi Park, Shahdara',
              },
              {
                id: 'campusB',
                alt: 'Official photograph of Spectral Model School & College',
                caption: 'Qazi Park, Shahdara',
              },
              {
                id: 'campusC',
                alt: 'Official photograph of Spectral Model School & College',
                caption: 'Qazi Park, Shahdara',
              },
            ]}
            columns={4}
            className="mt-10"
          />
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="canvas" aria-labelledby="faq-heading">
        <Container size="default">
          <Reveal>
            <SectionHeading
              id="faq-heading"
              eyebrow="Before You Call"
              title="Common Questions"
              description="Quick answers to questions families ask most often."
              align="center"
            />
          </Reveal>

          <FaqAccordion
            items={contactFaqs}
            className="mt-12"
            defaultOpenId={contactFaqs[0]?.id}
          />
        </Container>
      </Section>

      <CTASection
        eyebrow="Admissions"
        title="Ready to Take the Next Step?"
        description="If you are considering admission, start an inquiry and our admissions team will walk you through the process."
        primary={{ label: 'Apply for Admission', to: '/admissions' }}
        secondary={{ label: 'Explore Academics', to: '/academics' }}
      />
    </>
  );
}
