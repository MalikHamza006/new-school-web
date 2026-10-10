import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  Users2,
  Handshake,
  ClipboardCheck,
  FileText,
  ListChecks,
} from 'lucide-react';
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
  ProgramGrid,
  FaqAccordion,
  CTASection,
  PhotoFeature,
  PhotoBand,
} from '../components';
import { academicFaqs, programs, schoolInfo } from '../data';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Academics', path: '/academics' },
  ])
);

const learningApproach = [
  {
    id: 'structured',
    title: 'Structured Teaching',
    description:
      'Clear sequencing, defined learning outcomes and regular revision so knowledge builds on itself rather than coming in fragments.',
    icon: ClipboardCheck,
  },
  {
    id: 'understanding',
    title: 'Understanding Over Rote',
    description:
      'Students are asked to explain and apply what they learn, not simply reproduce it. That is where lasting understanding comes from.',
    icon: Brain,
  },
  {
    id: 'support',
    title: 'Individual Support',
    description:
      'A student who is struggling is noticed and helped. Progress is reviewed continuously rather than only at the end of a term.',
    icon: Users2,
  },
  {
    id: 'partnership',
    title: 'Family Partnership',
    description:
      'Parents receive regular, honest feedback so that what happens at home reinforces what happens in class.',
    icon: Handshake,
  },
];

export function AcademicsPage() {
  useSeo({
    title: `Academics | ${schoolInfo.name}`,
    description: `Explore the school, college and academic development programmes at ${schoolInfo.name}, Shahdara, Lahore, along with our learning approach.`,
    path: '/academics',
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="academics"
        eyebrow="Academics"
        title="Learning Designed for Every Stage"
        description="Programmes that build strong academic foundations at school level, support college-level study, and develop the skills students need for what comes next."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Academics' },
        ]}
      />

      {/* Academic philosophy */}
      <Section tone="canvas" aria-labelledby="philosophy-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionIntro
                id="philosophy-heading"
                eyebrow="Academic Philosophy"
                title="Serious About Learning, Practical About How It Happens"
                withRule
              />
              <div className="mt-6 max-w-prose space-y-4">
                <Reveal as="p" delay={0.05}>
                  Academic work at Spectral is built on a straightforward conviction: students learn
                  best when expectations are clear, teaching is well-sequenced, and progress is
                  reviewed honestly and often.
                </Reveal>
                <Reveal as="p" delay={0.1}>
                  We favour depth over coverage. It is better for a student to genuinely understand a
                  topic than to have skimmed many. Practical work such as explaining, applying and testing
                  turns knowledge into something a student can actually use.
                </Reveal>
                <Reveal as="p" delay={0.15}>
                  Alongside subject knowledge, we develop the habits that make learning sustainable:
                  attention, organisation, effort and the willingness to ask when something is not
                  understood.
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={0.12}>
                <Card variant="dark" padding="lg">
                  <IconTile tone="onDark" size="md">
                    <BookOpenCheck className="h-6 w-6" strokeWidth={1.75} />
                  </IconTile>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">
                    Curriculum Information
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Curriculum outlines, subject selections and examination board information for
                    each level are confirmed directly during admission counselling.
                  </p>
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-light">
                      Academic Prospectus &amp; Counselling
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      For detailed course outlines and admission requirements for School and College levels,
                      please contact our academic office or visit the campus at Qazi Park Road, Shahdara.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <Button variant="accent" size="sm" asChild>
                        <Link to="/contact">Contact Academic Desk</Link>
                      </Button>
                      <Button variant="whitestroke" size="sm" asChild>
                        <Link to="/admissions">Admissions Overview</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Programmes */}
      <Section tone="white" aria-labelledby="programs-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="programs-heading"
              eyebrow="Programmes"
              title="Programmes at Spectral"
              description="Each programme is designed around what students need at that stage, then built up carefully toward the next one."
              align="center"
            />
          </Reveal>

          <ProgramGrid programs={programs} className="mt-14" />
        </Container>
      </Section>

      {/* Official photograph beside the academic philosophy. */}
      <Section tone="canvas" aria-labelledby="academics-photo-heading">
        <Container>
          <h2 id="academics-photo-heading" className="sr-only">
            Where learning happens
          </h2>
          <PhotoFeature
            photo="campusC"
            alt="Official photograph of Spectral Model School & College"
            caption="Qazi Park, Shahdara, Lahore"
            eyebrow="Where Learning Happens"
            title="Teaching on one campus, from school to college"
            description="School Education and College Education run at the same site in Shahdara, so a student can move between levels without changing address."
            bullets={[
              'Both levels available at the Qazi Park campus',
              'Progression built up year by year, not switched abruptly',
              'Ask the office which programme fits a student’s current level',
            ]}
            action={{ label: 'Start an Admission Inquiry', to: '/admissions' }}
            reverse
          />
        </Container>
      </Section>

      {/* Detailed programme sections, for deep linking */}
      <Section tone="canvas">
        <Container>
          <div className="space-y-14">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <Reveal key={program.id}>
                  <article
                    id={program.anchor}
                    className="scroll-mt-28 rounded-2xl bg-white p-7 shadow-lift sm:p-9"
                  >
                    <div className="grid gap-8 lg:grid-cols-12">
                      <div className="lg:col-span-7">
                        <div className="flex items-center gap-4">
                          <IconTile tone="navy" size="md">
                            <Icon className="h-6 w-6" strokeWidth={1.75} />
                          </IconTile>
                          <div>
                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gold-dark">
                              {program.level}
                            </p>
                            <h3 className="font-display text-display-sm text-navy">
                              {program.title}
                            </h3>
                          </div>
                        </div>

                        <CardBody className="mt-5">{program.description}</CardBody>

                        <ul className="mt-6 space-y-3">
                          {program.details.map((detail) => (
                            <li key={detail} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                              <span
                                className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                                aria-hidden="true"
                              />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="lg:col-span-5">
                        <div className="rounded-2xl bg-navy-50/70 p-6">
                          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-navy">
                            Talk to us about {program.title.toLowerCase()}
                          </h4>
                          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                            Our admissions team can share the current curriculum, subject
                            combination and level requirements for this programme.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="mt-5 w-full"
                          >
                            <Link to="/admissions#inquiry">
                              Start an Inquiry
                              <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Learning approach */}
      <Section tone="white" aria-labelledby="approach-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="approach-heading"
              eyebrow="Learning Approach"
              title="How Learning Actually Happens Here"
              description="Four commitments that shape every classroom at Spectral."
              align="center"
            />
          </Reveal>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {learningApproach.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal as="li" key={item.id} delay={index * 0.08} className="h-full">
                  <Card variant="interactive" padding="lg" fullHeight>
                    <IconTile tone="blue" size="md">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </IconTile>
                    <h3 className="mt-5 font-display text-lg font-semibold text-navy">
                      {item.title}
                    </h3>
                    <CardBody className="mt-2">{item.description}</CardBody>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Student development */}
      <Section tone="canvas" aria-labelledby="development-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionIntro
                id="development-heading"
                eyebrow="Student Development"
                title="Academic Potential, Developed Further"
                withRule
              />
              <Reveal delay={0.1} className="mt-6">
                <p className="max-w-prose text-base leading-relaxed">
                  Academic potential is only part of a student&rsquo;s growth. Time is given to
                  communication, confidence, teamwork and self-management, so students leave
                  prepared not only for their next examination but for life beyond school.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <ul className="grid gap-5 sm:grid-cols-2">
                {[
                  { title: 'Communication', copy: 'Reading, writing and speaking practice that makes thinking visible.' },
                  { title: 'Confidence', copy: 'Students are encouraged to participate and contribute in class.' },
                  { title: 'Time Management', copy: 'Planning and study habits that make revision effective.' },
                  { title: 'Examination Technique', copy: 'Approaching papers methodically under realistic conditions.' },
                ].map((item, index) => (
                  <Reveal as="li" key={item.title} delay={index * 0.07} className="h-full">
                    <Card variant="base" padding="md" fullHeight>
                      <h3 className="font-display text-base font-semibold text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.copy}</p>
                    </Card>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>

          <PhotoBand
            photo="campusA"
            alt="Official photograph of Spectral Model School & College"
            eyebrow="Questions About Levels"
            title="Not sure which programme is the right fit?"
            description="Call the office with the student’s current class and we will tell you what the next step looks like."
            className="mt-16"
          />
        </Container>
      </Section>

      {/* Teacher AI tools */}
      <Section tone="navy" aria-labelledby="ai-tools-heading">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionHeading
                id="ai-tools-heading"
                eyebrow="For Teachers"
                title="AI Paper &amp; Quiz Tools"
                description="Two browser-based helpers for building assessment material: a paper generator that plans marks for you, and a self-marking quiz generator for quick checks of understanding."
                onDark
                withRule
              />
              <p className="mt-5 max-w-prose text-sm leading-relaxed text-white/70">
                Both tools work entirely in your browser on a bank of sample questions, and
                everything they produce is clearly labelled as demo content to review before use.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="accent" asChild>
                  <Link to="/academics/ai-tools">
                    Explore AI Tools
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="whitestroke" asChild>
                  <Link to="/academics/ai-tools/paper-generator">Paper Generator</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ul className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    title: 'Paper Generator',
                    copy: 'Build a full class paper with MCQs, short and long questions, with marks that add up exactly.',
                    icon: FileText,
                    to: '/academics/ai-tools/paper-generator',
                  },
                  {
                    title: 'Quiz Generator',
                    copy: 'Create a short multiple-choice quiz that marks itself and is scored instantly on submit.',
                    icon: ListChecks,
                    to: '/academics/ai-tools/quiz-generator',
                  },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <li key={tool.title}>
                      <Link to={tool.to} className="block h-full">
                        <Card variant="dark" padding="lg" fullHeight>
                          <IconTile tone="onDark" size="md">
                            <Icon className="h-6 w-6" strokeWidth={1.75} />
                          </IconTile>
                          <h3 className="mt-5 font-display text-lg font-semibold text-white">
                            {tool.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-white/70">{tool.copy}</p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light">
                            Open tool
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </Card>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="white" aria-labelledby="faq-heading">
        <Container size="default">
          <Reveal>
            <SectionHeading
              id="faq-heading"
              eyebrow="Questions"
              title="Frequently Asked Questions"
              description="Answers to common academic queries. Items still awaiting confirmation from the school are clearly marked."
              align="center"
            />
          </Reveal>

          <FaqAccordion items={academicFaqs} className="mt-12" defaultOpenId={academicFaqs[0]?.id} />
        </Container>
      </Section>

      <CTASection
        eyebrow="Admissions"
        title="Ready to Enquire About a Programme?"
        description="Tell us which level you are interested in and our admissions team will respond with the details you need."
        primary={{ label: 'Apply for Admission', to: '/admissions' }}
        secondary={{ label: 'Contact Admissions', to: '/admissions#inquiry' }}
      />
    </>
  );
}
