import { Quote } from 'lucide-react';
import { Card, IconTile } from '../ui';
import { testimonials } from '../../data/content';

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  quote: string;
  /** Optional avatar path. A placeholder is shown when absent. */
  avatar?: string | null;
}

/**
 * Testimonial card.
 *
 * The `testimonials` data array in src/data/content.ts is intentionally empty —
 * no parent or student reviews have been supplied, and inventing them would be
 * dishonest. Add real, permissioned testimonials to that file and they will
 * appear here automatically.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <Card variant="base" padding="lg" fullHeight className="relative">
      <Quote
        className="absolute right-5 top-5 h-8 w-8 text-navy/6"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      {testimonial.avatar ? (
        <img
          src={testimonial.avatar}
          alt=""
          loading="lazy"
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <IconTile tone="navy" size="md" className="font-display text-sm font-bold">
          {initials || <Quote className="h-5 w-5" aria-hidden="true" />}
        </IconTile>
      )}

      <blockquote className="mt-5 flex-1">
        <p className="text-[0.95rem] leading-relaxed text-ink-muted">“{testimonial.quote}”</p>
      </blockquote>

      <footer className="mt-6">
        <p className="font-display text-sm font-semibold text-navy">{testimonial.name}</p>
        {testimonial.role && (
          <p className="mt-0.5 text-xs text-ink-muted">{testimonial.role}</p>
        )}
      </footer>
    </Card>
  );
}

export function TestimonialGrid({ items = testimonials }: { items?: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id} className="h-full">
          <TestimonialCard testimonial={item} />
        </li>
      ))}
    </ul>
  );
}
