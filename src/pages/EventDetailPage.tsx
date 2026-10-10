import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MessageCircle } from 'lucide-react';
import {
  Container,
  Section,
  Reveal,
  Button,
  Card,
  EventMeta,
  formatEventDate,
  ImagePlaceholder,
  CTASection,
  NotFoundContent,
  HeroSequenceBackdrop,
} from '../components';
import { getEventById, events, schoolInfo } from '../data';
import { pageHeroSequence } from '../data/images';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : undefined;

  useSeo({
    title: event ? `${event.title} | ${schoolInfo.name}` : `Event Not Found | ${schoolInfo.name}`,
    description: event
      ? event.description
      : 'The event you are looking for could not be found.',
    path: event ? `/events/${event.id}` : '/events',
    noIndex: !event,
    structuredData: event
      ? buildGraph(
          buildOrganizationSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Events', path: '/events' },
            { name: event.title, path: `/events/${event.id}` },
          ])
        )
      : undefined,
  });

  if (!event) {
    return (
      <>
        <Section tone="white" className="pt-36 sm:pt-44">
          <Container>
            <NotFoundContent
              title="Event Not Found"
              description="The event you are looking for may have been removed, or the link may be incorrect."
              primaryLabel="Browse All Events"
              primaryTo="/events"
            />
          </Container>
        </Section>
      </>
    );
  }

  const date = formatEventDate(event.date);
  const related = events.filter((item) => item.id !== event.id).slice(0, 3);

  return (
    <>
      {/* Article header, over the events rotation — the same official
          photographs every other hero cycles through. No grid overlay here: it
          layered two box patterns over the photo and the result read as graph
          paper rather than as a photograph. */}
      <section className="on-dark relative isolate overflow-hidden bg-navy pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pt-36">
        <HeroSequenceBackdrop sequence={pageHeroSequence.events} scrim="medium" priority />

        <Container>
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-x-2 text-sm text-white/55">
              {[
                { label: 'Home', href: '/' },
                { label: 'Events', href: '/events' },
                { label: event.title },
              ].map((item, index, array) => {
                const isLast = index === array.length - 1;
                return (
                  <li key={item.label} className="flex items-center gap-2">
                    {item.href && !isLast ? (
                      <Link to={item.href} className="transition-colors hover:text-gold-light">
                        {item.label}
                      </Link>
                    ) : (
                      <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-white/85' : ''}>
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <span aria-hidden="true" className="text-white/30">
                        /
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <Reveal>
            <span className="inline-flex rounded-full bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/15">
              {event.category}
            </span>

            <h1 className="mt-5 max-w-3xl text-display-xl text-white [text-shadow:0_2px_18px_rgba(4,10,22,0.55)]">
              {event.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(4,10,22,0.5)] sm:text-lg">
              {event.description}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Body */}
      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <article className="lg:col-span-8">
              <Reveal>
                <div className="overflow-hidden rounded-2xl bg-white shadow-lift">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder
                      label={`Placeholder for an official photograph of “${event.title}”`}
                      className="aspect-[16/9] w-full"
                    />
                  )}
                </div>
              </Reveal>

              {event.status === 'placeholder' && (
                <Reveal delay={0.05}>
                  <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm leading-relaxed text-navy">
                    <strong className="font-semibold text-gold-dark">Session Announcement:</strong>{' '}
                    Specific dates, times, and venue circulars for this activity are confirmed by the
                    school administration office. Please consult school notices or contact the
                    administration desk for the latest calendar schedule.
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.1} className="mt-8 space-y-5">
                {(event.body ?? [event.description]).map((paragraph, index) => (
                  <p key={index} className="text-base leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </Reveal>

              <Reveal delay={0.15} className="mt-10">
                <Button variant="outline" asChild>
                  <Link to="/events">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to All Events
                  </Link>
                </Button>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <Reveal delay={0.1}>
                <div className="lg:sticky lg:top-28 lg:space-y-6">
                  <Card variant="base" padding="lg">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-navy">
                      Event Details
                    </h2>
                    <div className="mt-5">
                      <EventMeta event={event} />
                    </div>
                  </Card>

                  <Card variant="dark" padding="lg">
                    <h2 className="font-display text-base font-semibold text-white">
                      Enquire About This Event
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/70">
                      Contact the school office for confirmation, timings or any questions about
                      attending.
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                      <Button variant="accent" size="md" asChild fullWidth>
                        <a
                          href={schoolInfo.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          WhatsApp the School
                        </a>
                      </Button>
                      <Button variant="whitestroke" size="md" asChild fullWidth>
                        <a href={`tel:${schoolInfo.phone.primary.replace(/\D/g, '')}`}>
                          <CalendarDays className="h-4 w-4" aria-hidden="true" />
                          {schoolInfo.phone.primary}
                        </a>
                      </Button>
                    </div>
                  </Card>

                  {date && (
                    <p className="text-center text-xs text-ink-muted">
                      Published for{' '}
                      <time dateTime={date.iso}>{date.display}</time>
                    </p>
                  )}
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="white" aria-labelledby="related-heading">
          <Container>
            <Reveal>
              <h2 id="related-heading" className="text-display-md text-navy">
                More from Spectral
              </h2>
            </Reveal>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal as="li" key={item.id} delay={index * 0.07}>
                  <Link
                    to={`/events/${item.id}`}
                    className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:shadow-lift-lg"
                  >
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-gold-dark">
                      {item.category}
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold text-navy transition-colors group-hover:text-blue">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
                      Read more
                      <ArrowLeft className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CTASection
        eyebrow="Admissions"
        title="Interested in Joining Us?"
        description="Start an admission inquiry and our team will answer your questions about the school."
        primary={{ label: 'Apply for Admission', to: '/admissions' }}
        secondary={{ label: 'View All Events', to: '/events' }}
      />
    </>
  );
}
