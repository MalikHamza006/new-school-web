import { FileText, Phone, MessageCircle, Info } from 'lucide-react';
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
  IconTile,
  AdmissionProcess,
  ContactForm,
  FaqAccordion,
  CTASection,
  PhotoFeature,
  PhotoBand,
} from '../components';
import { admissionFaqs, schoolInfo } from '../data';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Admissions', path: '/admissions' },
  ])
);

/**
 * Documents/information families.
 *
 * We deliberately do NOT list specific required documents, since the school
 * has not supplied its official checklist. These are the broad categories
 * typically discussed at the application stage, presented as a starting point
 * rather than a confirmed requirement list.
 */
const informationGroups = [
  {
    id: 'student-details',
    title: 'Student Details',
    description:
      'The prospective student’s full name, date of birth and the level or class being applied for.',
    icon: FileText,
  },
  {
    id: 'parent-guardian',
    title: 'Parent / Guardian Details',
    description:
      'Contact information for the parent or guardian who will be the point of contact.',
    icon: Phone,
  },
  {
    id: 'prior-education',
    title: 'Prior Education',
    description:
      'Previous school details and, where applicable, the results of the most recent examinations.',
    icon: Info,
  },
  {
    id: 'direct-contact',
    title: 'Direct Contact',
    description:
      'The quickest way to reach you, by phone or WhatsApp, so the admissions team can follow up promptly.',
    icon: MessageCircle,
  },
];

export function AdmissionsPage() {
  useSeo({
    title: `Admissions | ${schoolInfo.name}`,
    description: `Admission information and inquiry form for ${schoolInfo.name}, Shahdara, Lahore. Learn about the application process and start your admission inquiry.`,
    path: '/admissions',
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="admissions"
        eyebrow="Admissions"
        title="Begin Your Journey With Spectral"
        description="Take the next step toward an educational journey focused on learning, growth and opportunity."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Admissions' },
        ]}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="accent" size="lg" asChild>
              <a href="#inquiry">Start Your Inquiry</a>
            </Button>
            <Button variant="whitestroke" size="lg" asChild>
              <a href={schoolInfo.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp the School
              </a>
            </Button>
          </div>
        }
      />

      {/* Overview */}
      <Section tone="canvas" aria-labelledby="overview-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionIntro
                id="overview-heading"
                eyebrow="Overview"
                title="How Admission Works"
                withRule
              />
              <div className="mt-6 max-w-prose space-y-4">
                <Reveal as="p" delay={0.05}>
                  Admission at Spectral is handled personally. Families are guided through each
                  stage by the admissions team, and no application is processed without a direct
                  conversation with a parent or guardian.
                </Reveal>
                <Reveal as="p" delay={0.1}>
                  Availability varies by level and is confirmed directly with the school office. The
                  information below describes the general process; specific requirements, fees and
                  timelines are shared during counselling.
                </Reveal>
              </div>

              <Reveal delay={0.15} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <a href="#inquiry">Apply for Admission</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={`tel:${schoolInfo.phone.primary.replace(/\D/g, '')}`}>Call Admissions</a>
                </Button>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.12}>
                <Card variant="dark" padding="lg">
                  <h3 className="font-display text-lg font-semibold text-white">
                    Direct Admissions Guidance
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    To ensure every family receives precise and up-to-date guidance, the following details
                    are confirmed individually with our admissions counsellors:
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {[
                      'Tuition structure & payment schedules',
                      'Session enrolment dates & seat availability',
                      'Grade placement & age eligibility criteria',
                      'Required verification documents & past transcripts',
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-white/80">
                        <span
                          className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-light">
                      Personalized Counselling
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                      Our admissions team is available daily at the campus office to answer your questions
                      and provide official documentation checklists for your child.
                    </p>
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Official photograph beside the admissions overview. */}
      <Section tone="white" aria-labelledby="admissions-photo-heading">
        <Container>
          <h2 id="admissions-photo-heading" className="sr-only">
            Visiting the school
          </h2>
          <PhotoFeature
            photo="campusD"
            alt="Official photograph of Spectral Model School & College"
            caption="Qazi Park, Shahdara, Lahore"
            eyebrow="Before You Apply"
            title="Come and look at the campus first"
            description="The most useful first step is a visit. Call the office, arrange a walk-through, and ask whatever you need to know in person."
            bullets={[
              'Ask to see the classrooms your child would actually use',
              'Confirm the current fee structure directly with the office',
              'Discuss which level the student should enter at',
            ]}
          />
        </Container>
      </Section>

      {/* Process */}
      <Section tone="canvas" aria-labelledby="process-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="process-heading"
              eyebrow="The Process"
              title="Four Steps to Enrolment"
              description="A clear, straightforward path from first contact to a confirmed place."
              align="center"
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <AdmissionProcess className="lg:grid lg:grid-cols-4 lg:gap-8" />
          </Reveal>
        </Container>
      </Section>

      {/* Information needed */}
      <Section tone="canvas" aria-labelledby="information-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="information-heading"
              eyebrow="What to Have Ready"
              title="Information to Keep on Hand"
              description="These are the broad categories typically discussed at the application stage. The official checklist is shared with each family during counselling."
              align="center"
            />
          </Reveal>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {informationGroups.map((group, index) => {
              const Icon = group.icon;
              return (
                <Reveal as="li" key={group.id} delay={index * 0.07} className="h-full">
                  <Card variant="interactive" padding="md" fullHeight>
                    <IconTile tone="navy" size="sm">
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </IconTile>
                    <h3 className="mt-5 font-display text-base font-semibold text-navy">
                      {group.title}
                    </h3>
                    <CardBody className="mt-2 text-sm">{group.description}</CardBody>
                  </Card>
                </Reveal>
              );
            })}
          </ul>

          <PhotoBand
            photo="campusB"
            alt="Official photograph of Spectral Model School & College"
            eyebrow="Still Deciding"
            title="Talk to someone before you fill in anything"
            description="A call is often faster than a form. Ask about fees, the level your child should enter, and what documents to bring."
            className="mt-14"
          />
        </Container>
      </Section>

      {/* Inquiry form */}
      <Section tone="white" id="inquiry" aria-labelledby="inquiry-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  id="inquiry-heading"
                  eyebrow="Inquiry Form"
                  title="Start Your Admission Inquiry"
                  description="Fill in the form and our admissions team will get back to you. If you prefer to speak to someone directly, the phone and WhatsApp numbers below are the fastest route."
                />
              </Reveal>

              <Reveal delay={0.1} className="mt-9 space-y-3">
                <Button variant="primary" size="lg" asChild fullWidth>
                  <a href={`tel:${schoolInfo.phone.primary.replace(/\D/g, '')}`}>
                    Call {schoolInfo.phone.primary}
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild fullWidth>
                  <a
                    href={schoolInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    WhatsApp {schoolInfo.phone.secondary}
                  </a>
                </Button>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <Card variant="base" padding="lg">
                  <ContactForm />
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="canvas" aria-labelledby="faq-heading">
        <Container size="default">
          <Reveal>
            <SectionHeading
              id="faq-heading"
              eyebrow="Questions"
              title="Admissions FAQ"
              description="Common questions from families. Anything not yet confirmed by the school is clearly marked."
              align="center"
            />
          </Reveal>

          <FaqAccordion items={admissionFaqs} className="mt-12" defaultOpenId={admissionFaqs[0]?.id} />
        </Container>
      </Section>

      <CTASection
        eyebrow="Get Started"
        title="Prefer to Talk It Through First?"
        description="Call the school office or message on WhatsApp. The admissions team will be glad to help you decide."
        primary={{ label: 'Contact Admissions', to: '/admissions#inquiry' }}
        secondary={{ label: 'Visit the Campus', to: '/contact' }}
      />
    </>
  );
}
