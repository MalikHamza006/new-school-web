import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, IconTile, Reveal } from '../ui';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';
import type { SchoolEvent } from '../../data/events';

/** Formats an ISO date for display. Returns null when the date is unannounced. */
export function formatEventDate(iso: string | null): { display: string; iso: string } | null {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return {
    display: date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    iso,
  };
}

export function EventCard({ event, className = '' }: { event: SchoolEvent; className?: string }) {
  const date = formatEventDate(event.date);
  const isPlaceholder = event.status === 'placeholder';

  return (
    <Card
      variant="interactive"
      padding="none"
      fullHeight
      className={`group flex flex-col ${className}`}
    >
      {/* Media */}
      <div className="relative overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <ImagePlaceholder
            label={`Placeholder for an official photograph of “${event.title}”`}
            className="aspect-[16/10] w-full"
          />
        )}

        <span className="absolute left-4 top-4 rounded-full bg-navy/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
          {event.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
          {date ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-gold-dark" aria-hidden="true" />
              <time dateTime={date.iso}>{date.display}</time>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-ink-muted/80">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Date to be announced
            </span>
          )}
        </div>

        <h3 className="font-display text-display-sm text-navy">{event.title}</h3>

        <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">
          {event.description}
        </p>

        {isPlaceholder && (
          <p className="mt-4 rounded-md bg-gold/10 px-3 py-2 text-xs font-medium leading-relaxed text-gold-dark">
            Example listing. Dates and details are confirmed by the school office.
          </p>
        )}

        <Link
          to={`/events/${event.id}`}
          className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-blue transition-colors hover:text-navy"
        >
          Read more
          <span className="sr-only">about {event.title}</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </Link>
      </div>
    </Card>
  );
}

export function EventGrid({
  events,
  columns = 3,
  className = '',
}: {
  events: SchoolEvent[];
  columns?: 2 | 3;
  className?: string;
}) {
  const cols = columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <ul className={`grid gap-6 ${cols} ${className}`}>
      {events.map((event, index) => (
        <Reveal as="li" key={event.id} delay={Math.min(index, 5) * 0.06} className="h-full">
          <EventCard event={event} />
        </Reveal>
      ))}
    </ul>
  );
}

/** Compact one-line event row used on the homepage. */
export function EventRow({ event }: { event: SchoolEvent }) {
  const date = formatEventDate(event.date);

  return (
    <li>
      <Link
        to={`/events/${event.id}`}
        className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-navy-50"
      >
        <IconTile tone="navy" size="sm">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-navy group-hover:text-blue">
            {event.title}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
            {date ? (
              <time dateTime={date.iso}>{date.display}</time>
            ) : (
              'Date to be announced'
            )}
            <span aria-hidden="true">·</span>
            {event.category}
          </p>
        </div>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-blue motion-reduce:transition-none"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

/** Event meta used on the event detail page. */
export function EventMeta({ event }: { event: SchoolEvent }) {
  const date = formatEventDate(event.date);

  return (
    <dl className="flex flex-wrap items-center gap-x-8 gap-y-4">
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
          Category
        </dt>
        <dd className="mt-1 text-sm font-medium text-navy">{event.category}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
          Date
        </dt>
        <dd className="mt-1 text-sm font-medium text-navy">
          {date ? <time dateTime={date.iso}>{date.display}</time> : 'To be announced'}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
          Venue
        </dt>
        <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-navy">
          <MapPin className="h-3.5 w-3.5 text-gold-dark" aria-hidden="true" />
          School campus
        </dd>
      </div>
    </dl>
  );
}
