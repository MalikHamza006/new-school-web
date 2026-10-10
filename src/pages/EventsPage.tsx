import { useMemo, useState } from 'react';
import { Search, X, CalendarX } from 'lucide-react';
import {
  Container,
  PageHero,
  Section,
  Reveal,
  EventGrid,
  CTASection,
  PhotoFeature,
} from '../components';
import { events, eventCategories, sortEvents, schoolInfo, type EventCategory } from '../data';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
  ])
);

type CategoryFilter = 'All' | EventCategory;

export function EventsPage() {
  useSeo({
    title: `Events & News | ${schoolInfo.name}`,
    description: `Events, activities and announcements from ${schoolInfo.name}, Shahdara, Lahore. Browse school life, competitions and academic events.`,
    path: '/events',
    structuredData: PAGE_SCHEMA,
  });

  const [category, setCategory] = useState<CategoryFilter>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();

    return sortEvents(events).filter((event) => {
      const matchesCategory = category === 'All' || event.category === category;
      const matchesQuery =
        normalisedQuery.length === 0 ||
        event.title.toLowerCase().includes(normalisedQuery) ||
        event.description.toLowerCase().includes(normalisedQuery) ||
        event.category.toLowerCase().includes(normalisedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const hasFilters = category !== 'All' || query.trim().length > 0;

  const clearFilters = () => {
    setCategory('All');
    setQuery('');
  };

  return (
    <>
      <PageHero
        heroKey="events"
        eyebrow="Events & News"
        title="Life at Spectral"
        description="Competitions, academic events, cultural activities and the everyday moments that make up school life."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Events' },
        ]}
      />

      <Section tone="canvas" aria-labelledby="events-heading">
        <Container>
          <h2 id="events-heading" className="sr-only">
            Browse school events
          </h2>

          {/* Controls */}
          <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Category filter */}
            <div
              className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0"
              role="group"
              aria-label="Filter events by category"
            >
              {eventCategories.map((item) => {
                const isActive = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setCategory(item)}
                    className={[
                      'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-navy text-white shadow-lift'
                        : 'bg-white text-ink-muted shadow-lift hover:bg-navy-50 hover:text-navy',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-xs">
              <label htmlFor="event-search" className="sr-only">
                Search events
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
              />
              <input
                id="event-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events…"
                className="field-control pl-10"
              />
            </div>
          </Reveal>

          {/* Result count */}
          <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-3">
            <p aria-live="polite" className="text-sm text-ink-muted">
              Showing {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
              {category !== 'All' && ` in ${category}`}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy/8 px-3 py-1 text-xs font-semibold text-navy transition-colors hover:bg-navy/15"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Clear filters
              </button>
            )}
          </Reveal>

          {/* Results */}
          <div className="mt-10">
            {filtered.length > 0 ? (
              <EventGrid events={filtered} />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-navy-50/60 py-20 text-center">
                <CalendarX className="h-11 w-11 text-ink-muted/50" aria-hidden="true" />
                <div>
                  <p className="font-display text-lg font-semibold text-navy">
                    No events found
                  </p>
                  <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-muted">
                    Try a different category, or clear your search to see all events.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Official photograph beside the events list. */}
      <Section tone="white" aria-labelledby="events-photo-heading">
        <Container>
          <h2 id="events-photo-heading" className="sr-only">
            Events at the campus
          </h2>
          <PhotoFeature
            photo="campusC"
            alt="Official photograph of Spectral Model School & College"
            caption="Qazi Park, Shahdara, Lahore"
            eyebrow="Where It Happens"
            title="Events run on the Qazi Park campus"
            description="Academic events, competitions and cultural activities take place at the Shahdara campus. Dates and schedules are confirmed with the school office."
            bullets={[
              'Ask the office for the current academic calendar',
              'Competition and event dates are confirmed each session',
              'Families are notified about participation directly',
            ]}
            action={{ label: 'Browse the Photo Gallery', to: '/gallery' }}
            reverse
          />
        </Container>
      </Section>

      <CTASection
        eyebrow="Stay Informed"
        title="Want to Know What’s On?"
        description="Contact the school office to ask about upcoming events, or start an admission inquiry for your child."
        primary={{ label: 'Contact the School', to: '/contact' }}
        secondary={{ label: 'Apply for Admission', to: '/admissions' }}
      />
    </>
  );
}
