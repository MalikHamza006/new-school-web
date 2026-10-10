import { Link } from 'react-router-dom';
import { Info, ShieldAlert } from 'lucide-react';
import { Container, PageHero, Section, Reveal, Card, IconTile } from '../components';
import { DemoSignInButton } from '../components/portal';
import { portals, portalAuthNote, schoolInfo, primaryPhoneHref } from '../data';
import { useSeo, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' },
  ])
);

/**
 * Portal chooser — the parent of the four sign-in pages.
 *
 * This page contains NO forms. It is a directory: one card per portal, each one
 * a real link to that portal's own page (`/login/student`, `/login/parent`, …).
 * A single page holding all four forms was wrong for the people using it — a
 * student had to scroll past three credential sets that were not theirs, and
 * every form competed for attention at once. One page per portal is also how
 * the real thing works: each audience is sent to its own sign-in URL.
 *
 * NOT AN AUTHENTICATED AREA
 * -------------------------
 * Nothing behind these links authenticates anyone. The linked pages render a
 * demonstration form and never send credentials anywhere. `confirmed: false`
 * on every portal in `data/portals` is the single source of truth for that, and
 * the notice at the foot of this page says so in plain words.
 */
export function LoginPage() {
  useSeo({
    title: `Login | ${schoolInfo.name}`,
    description: `Choose the portal for your role at ${schoolInfo.name}: student, parents, teacher or admin.`,
    path: '/login',
    // Nothing here is useful in a search result, and the pages behind it have no
    // real content yet.
    noIndex: true,
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="contact"
        variant="centered"
        eyebrow="Portal Access"
        title="Sign in to your portal"
        description="Four portals, one for each group of users. Choose yours to reach your own sign-in page."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Login' },
        ]}
      />

      <Section tone="canvas" aria-labelledby="portals-heading">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="portals-heading" className="text-display-md">
                Choose your portal
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                Each group signs in differently and has its own page. Not sure
                which applies to you? Call the school office and we will point
                you the right way.
              </p>
            </div>
          </Reveal>

          {/* One card per portal.
              The card is a plain element, not a link, because it contains a
              real button and a link cannot legally contain interactive
              content. The name is the primary link and the button repeats it —
              two obvious ways in rather than one ambiguous full-card target. */}
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {portals.map((portal, index) => {
              const Icon = portal.icon;
              const requiredFields = portal.role.fields
                .filter((field) => field.required)
                .map((field) => field.label);

              return (
                <Reveal as="li" key={portal.id} delay={index * 0.07} className="h-full">
                  <Card
                    padding="none"
                    fullHeight
                    className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
                  >
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="flex items-start gap-4">
                        <IconTile tone="navy" size="lg">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </IconTile>

                        <div className="min-w-0 flex-1">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-dark">
                            {portal.category}
                          </p>
                          <h3 className="mt-1 font-display text-lg font-semibold text-navy">
                            {/* The heading is the link, so the accessible name
                                of the destination reads as the portal itself. */}
                            <Link
                              to={portal.path}
                              className="rounded-sm underline-offset-4 transition-colors hover:text-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
                            >
                              {portal.name}
                            </Link>
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                            {portal.summary}
                          </p>
                        </div>
                      </div>

                      {/* What you would sign in to see. A soft tint strip, not a
                          bordered list. */}
                      <div className="mt-6 rounded-xl bg-navy-50/60 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                          Sign in with
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-navy">
                          {requiredFields.join(' · ')}
                        </p>
                      </div>
                    </div>

                    {/* Two ways in: the demo opens the dashboard straight away;
                        the sign-in page shows what the real thing would look
                        like. The demo is primary because that is what most
                        visitors want from a preview. */}
                    <div className="flex flex-col gap-2.5 bg-navy-50/60 p-4 pt-0 sm:p-5 sm:pt-0">
                      <DemoSignInButton
                        role={portal.id}
                        label={`Open ${portal.name.replace(' Portal', '')} demo`}
                        fullWidth
                      />
                      <Link
                        to={portal.path}
                        className="text-center text-sm font-semibold text-blue underline-offset-4 transition-colors hover:text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
                      >
                        Or open the sign-in page
                      </Link>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/*
        Honesty notice. Not decoration: there is no backend, so a page that
        looked like working sign-in would be actively misleading to a parent
        trying to reach a child's attendance record.
      */}
      <Section tone="white" size="sm">
        <Container>
          <Reveal>
            <div className="flex max-w-3xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-lift sm:flex-row sm:p-7">
              <span
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark"
                aria-hidden="true"
              >
                <ShieldAlert className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-navy">
                  These portals are a demo, not a live system
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Each portal opens a demonstration dashboard filled with sample
                  data. Nothing is connected to any school system, so nothing you
                  type is checked, saved or sent anywhere. Please do not enter a
                  real password into them. For anything that needs an actual
                  record — a report card, attendance, an admission update — please
                  call the office on{' '}
                  <a
                    href={primaryPhoneHref}
                    className="font-semibold text-blue underline-offset-2 hover:underline"
                  >
                    {schoolInfo.phone.primary}
                  </a>
                  .
                </p>
                <p className="mt-3 inline-flex items-start gap-1.5 text-xs font-medium leading-relaxed text-gold-dark">
                  <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                  {portalAuthNote}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Quick reference, so someone unsure which portal they need does not
              have to open all four. */}
          <Reveal delay={0.1} className="mt-8">
            <Card padding="md">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <IconTile tone="navy" size="sm">
                  <Info className="h-4 w-4" aria-hidden="true" />
                </IconTile>
                <p className="text-sm text-ink-muted">
                  <span className="font-semibold text-navy">Not sure which one?</span>{' '}
                  Students use their roll number, parents the mobile number on
                  file, teachers their staff ID, and the office a username.
                </p>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
