import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Info, ListChecks, ShieldCheck } from 'lucide-react';
import {
  Button,
  Card,
  Container,
  CTASection,
  IconTile,
  PageHero,
  Reveal,
  Section,
  SectionHeading,
} from '../components';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';
import { schoolInfo } from '../data';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Academics', path: '/academics' },
    { name: 'AI Tools', path: '/academics/ai-tools' },
  ])
);

const tools = [
  {
    id: 'paper-generator',
    title: 'AI Paper Generator',
    href: '/academics/ai-tools/paper-generator',
    icon: FileText,
    description:
      'Build a class paper in seconds. Choose the class, subject, paper type and question mix, and the generator plans the marks so they add up exactly, then lays the paper out ready to print.',
    points: [
      'Marks planner that sums to your exact total',
      'Sections for MCQs, short and long questions',
      'Answer key you can reveal only when you want it',
      'Print-ready A4 layout',
    ],
  },
  {
    id: 'quiz-generator',
    title: 'AI Quiz Generator',
    href: '/academics/ai-tools/quiz-generator',
    icon: ListChecks,
    description:
      'Create a short, self-marking multiple-choice quiz for quick checks of understanding. Students attempt it on screen and see their score and explanations once they submit.',
    points: [
      'Between three and eight questions per quiz',
      'Optional time limit with an on-screen timer',
      'Answers hidden until the student submits',
      'Instant score with a per-question review',
    ],
  },
];

export function AiToolsPage() {
  useSeo({
    title: `AI Tools for Teachers | ${schoolInfo.name}`,
    description:
      'Demo AI paper and quiz generators for teachers at Spectral Model School & College. Build sample assessment papers and self-marking quizzes locally in your browser.',
    path: '/academics/ai-tools',
    noIndex: true,
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        eyebrow="For Teachers"
        title="AI Tools for Assessment"
        description="Two practical helpers for building assessment material: a paper generator and a self-marking quiz generator."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Academics', href: '/academics' },
          { label: 'AI Tools' },
        ]}
      />

      <Section tone="canvas" aria-labelledby="tools-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="tools-heading"
              eyebrow="Choose a tool"
              title="Paper Generator or Quiz Generator"
              description="Both run entirely in your browser and produce sample content. Pick a tool to begin."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Reveal key={tool.id} delay={index * 0.1} className="h-full">
                  <Card variant="interactive" padding="lg" fullHeight className="flex flex-col">
                    <IconTile tone={index === 0 ? 'navy' : 'blue'} size="lg">
                      <Icon className="h-7 w-7" strokeWidth={1.75} />
                    </IconTile>

                    <h3 className="mt-5 font-display text-display-sm text-navy">{tool.title}</h3>
                    <p className="mt-2 text-[0.975rem] leading-relaxed text-ink-muted">
                      {tool.description}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {tool.points.map((point) => (
                        <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                          <span
                            className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                            aria-hidden="true"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      <Button variant="primary" asChild>
                        <Link to={tool.href}>
                          Open {tool.title}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="how-it-works-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                id="how-it-works-heading"
                eyebrow="How it works"
                title="Honest About What This Is"
                withRule
              />
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-5">
                <div className="flex gap-4">
                  <IconTile tone="gold" size="md">
                    <Info className="h-5 w-5" aria-hidden="true" />
                  </IconTile>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy">Demo content, not a live model</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      These tools run entirely in your browser and draw on a bank of hand-written{' '}
                      <strong>sample</strong> questions. Nothing is sent to an AI service, and no
                      questions are syllabus-verified. Every generated item is labelled{' '}
                      <em>Demo Mode — Sample Questions</em>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <IconTile tone="navy" size="md">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </IconTile>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy">
                      A teacher stays in the loop
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      Always review and edit any generated paper or quiz before it is used with
                      students. The tools are a starting point that saves typing, not a replacement
                      for a teacher&rsquo;s judgement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        eyebrow="Academics"
        title="Looking for programme information instead?"
        description="Read about the programmes, curriculum approach and learning support offered at Spectral."
        primary={{ label: 'Back to Academics', to: '/academics' }}
        secondary={{ label: 'Contact Us', to: '/contact' }}
      />
    </>
  );
}
