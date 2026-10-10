import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Info, ShieldAlert, Sparkles } from 'lucide-react';
import {
  Container,
  PageHero,
  Section,
  Reveal,
  NotFoundContent,
} from '../components';
import { PortalLoginForm } from '../components/features/PortalLoginForm';
import { DemoSignInButton } from '../components/portal';
import { getPortalById, portalAuthNote, schoolInfo, primaryPhoneHref } from '../data';
import { useSeo, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

/**
 * One sign-in page per portal — `/login/student`, `/login/parent`,
 * `/login/teacher`, `/login/admin`.
 *
 * A single component serves all four because the *content* differs per portal
 * (fields, labels, guidance) but the *layout* does not, and the differences all
 * come from `data/portals`. Splitting this into four near-identical page files
 * would mean four places to fix the same layout bug.
 *
 * The URL segment is the portal `id`, and `id` is also the single source for the
 * portal's own `path`, so a link and its page can never disagree.
 *
 * An unknown segment renders the shared not-found block with a link back to the
 * chooser rather than a broken form — a half-rendered sign-in page is worse than
 * an honest "no such portal".
 */
export function PortalLoginPage() {
  const { portalId } = useParams<{ portalId: string }>();
  const portal = portalId ? getPortalById(portalId) : undefined;

  useSeo({
    title: portal
      ? `${portal.name} Login | ${schoolInfo.name}`
      : `Portal Not Found | ${schoolInfo.name}`,
    description: portal
      ? `${portal.role.description} This portal is a design preview and is not connected to any system yet.`
      : 'That sign-in page does not exist.',
    path: portal?.path ?? '/login',
    noIndex: true,
    structuredData: buildGraph(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login' },
        { name: portal?.name ?? 'Not found', path: portal?.path ?? '/login' },
      ])
    ),
  });

  if (!portal) {
    return (
      <>
        <PageHero
          heroKey="contact"
          variant="centered"
          eyebrow="Portal Access"
          title="No such portal"
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Login', href: '/login' },
          ]}
        />
        <Section tone="canvas">
          <Container>
            <NotFoundContent
              title="That portal does not exist"
              description="We could not match that sign-in link to any portal. Choose the one that applies to you."
              primaryLabel="Choose a portal"
              primaryTo="/login"
              secondaryLabel="Contact the School"
              secondaryTo="/contact"
              showQuickLinks={false}
            />
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        heroKey="contact"
        variant="centered"
        eyebrow={portal.category}
        title={portal.name}
        description={portal.role.description}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Login', href: '/login' },
          { label: portal.name },
        ]}
      />

      <Section tone="canvas" aria-labelledby="signin-heading">
        <Container>
          {/* Back to the chooser. On a page you can only reach deliberately,
              this is the way out. */}
          <Reveal>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-4 transition-colors hover:text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                aria-hidden="true"
              />
              All portals
            </Link>
          </Reveal>

          {/* Demo entry, first and unmissable. One click opens this portal's
              dashboard as the demo. The form below is then a preview of what the
              real sign-in will look like, kept for the design story. */}
          <Reveal delay={0.08} className="mx-auto mt-8 max-w-2xl">
            <div className="on-dark relative isolate overflow-hidden rounded-2xl bg-navy p-6 shadow-lift sm:p-7">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_85%_0%,#174EA6_0%,#0B1F3A_60%,#081428_100%)]"
              />
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 -z-10 size-40 rounded-full border border-gold/15"
              />
              <div className="flex flex-wrap items-center gap-3.5">
                <span
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-light"
                  aria-hidden="true"
                >
                  <Sparkles className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                    Demo access
                  </p>
                  <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
                    Open the {portal.name} dashboard
                  </h2>
                </div>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                Explore a working preview of this portal, filled with sample data.
                No login is required for the demo.
              </p>
              <div className="mt-5">
                <DemoSignInButton
                  role={portal.id}
                  label={`Enter ${portal.name.replace(' Portal', '')} demo`}
                  fullWidth
                />
              </div>
            </div>
          </Reveal>

          {/* The real sign-in form, shown as a preview. */}
          <Reveal delay={0.12} className="mx-auto mt-10 max-w-2xl">
            <h2 id="signin-heading" className="sr-only">
              Sign in to the {portal.name}
            </h2>
            <p className="mb-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Preview of the real sign-in form
            </p>
            <PortalLoginForm portal={portal} />
          </Reveal>
        </Container>
      </Section>

      {/*
        Honesty notice, repeated on every portal page. A parent who arrived
        directly at `/login/parent` from a bookmark or a message must see this
        too — they will never pass through the chooser.
      */}
      <Section tone="white" size="sm">
        <Container>
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-lift sm:flex-row sm:p-7">
              <span
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark"
                aria-hidden="true"
              >
                <ShieldAlert className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-navy">
                  This portal is a demo, not a live system
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  The demo dashboard opens with sample data and is not connected
                  to any school system, so nothing is checked, saved or sent
                  anywhere. The form above is a preview only — please do not enter
                  a real password. For anything that needs an actual record,
                  please call the office on{' '}
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
        </Container>
      </Section>
    </>
  );
}
