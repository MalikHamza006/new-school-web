import { Link } from 'react-router-dom';
import { Home, ArrowRight, Compass } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './motion';

interface NotFoundContentProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  /** Extra navigation shown below the two main actions. */
  showQuickLinks?: boolean;
  /**
   * `dark` renders white text for placement over the navy 404 hero photo.
   * `light` keeps the original dark-on-light styling.
   */
  tone?: 'light' | 'dark';
}

const QUICK_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Academics', to: '/academics' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Campus', to: '/campus' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
];

/**
 * Reusable "page not found" block, also used by the event detail route when an
 * event id does not match anything in the data.
 */
export function NotFoundContent({
  title = 'Page Not Found',
  description = 'The page you are looking for may have been moved, renamed, or may no longer exist.',
  primaryLabel = 'Back to Home',
  primaryTo = '/',
  secondaryLabel = 'Contact the School',
  secondaryTo = '/contact',
  showQuickLinks = true,
  tone = 'light',
}: NotFoundContentProps) {
  const dark = tone === 'dark';

  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <span
          className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${
            dark ? 'bg-white/10 text-gold-light' : 'bg-navy/8 text-navy'
          }`}
          aria-hidden="true"
        >
          <Compass className="h-7 w-7" strokeWidth={1.75} />
        </span>

        <p
          className={`mt-7 font-display text-6xl font-extrabold sm:text-7xl ${
            dark ? 'text-white/15' : 'text-navy/10'
          }`}
        >
          404
        </p>

        <h1
          id="notfound-heading"
          className={`mt-2 text-display-lg ${
            dark
              ? 'text-white [text-shadow:0_2px_18px_rgba(4,10,22,0.55)]'
              : 'text-navy'
          }`}
        >
          {title}
        </h1>

        <p
          className={`mx-auto mt-4 max-w-lg text-base leading-relaxed ${
            dark
              ? 'text-white/85 [text-shadow:0_1px_10px_rgba(4,10,22,0.5)]'
              : 'text-ink-muted'
          }`}
        >
          {description}
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button variant="primary" size="lg" asChild className="w-full sm:w-auto">
            <Link to={primaryTo}>
              <Home className="h-4 w-4" aria-hidden="true" />
              {primaryLabel}
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link to={secondaryTo}>
              {secondaryLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Reveal>

      {showQuickLinks && (
        <Reveal delay={0.1} className="mt-14 pt-8">
          <div
            aria-hidden="true"
            className={`mx-auto h-px w-24 ${dark ? 'bg-white/25' : 'bg-border'}`}
          />
          <h2
            className={`mt-8 font-display text-sm font-semibold uppercase tracking-[0.12em] ${
              dark ? 'text-white/70' : 'text-ink-muted'
            }`}
          >
            Popular Pages
          </h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`inline-block rounded-full px-4 py-2 text-sm font-medium shadow-lift transition-all duration-200 ${
                    dark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white text-navy hover:-translate-y-0.5 hover:shadow-lift-lg'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}
