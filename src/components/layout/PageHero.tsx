import { useCallback, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, HeroSequenceBackdrop, SectionHeading } from '../ui';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';
import { pageHeroSequence, type PageKey } from '../../data/images';

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional breadcrumb trail rendered above the title. */
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
  /**
   * Visual treatment of the hero panel.
   * - `centered` (default) — one centred column, the site's standard.
   * - `plain` — a single column aligned to the left edge.
   * - `split` — copy on the left, a decorative photograph panel on the right.
   */
  variant?: 'split' | 'plain' | 'centered';
  /**
   * Which official photograph set to rotate behind the whole hero, looked up
   * from the manifest in `data/images`. The page's own photograph leads, then
   * the rest of the official set follows. Omit for a purely graphic hero.
   */
  heroKey?: PageKey;
  /**
   * Milliseconds each photograph is held before the next one cross-fades in.
   */
  heroIntervalMs?: number;
  /**
   * Background photograph for the `split` variant's side panel.
   * Falls back to a branded placeholder.
   */
  image?: string | null;
  imageLabel?: string;
  children?: ReactNode;
}

/**
 * Shared hero for every interior page. Keeps a consistent navy band,
 * heading scale and breadcrumb treatment across the site.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
  /**
   * `centered` is the default on purpose. Centring the hero copy is a
   * site-wide decision, so it is made once here rather than repeated as
   * `variant="centered"` on every page — a per-page opt-in is how half the
   * pages quietly end up left-aligned. `split` and `plain` stay available for
   * the rare page that genuinely wants them.
   */
  variant = 'centered',
  heroKey,
  heroIntervalMs = 7000,
  image,
  imageLabel = 'Placeholder for an official photograph of the school',
  children,
}: PageHeroProps) {
  const reduceMotion = useReducedMotion();
  const [slide, setSlide] = useState(0);

  const isCentered = variant === 'centered';
  const sequence = heroKey ? pageHeroSequence[heroKey] : undefined;

  // Only the indicator row for a hero that actually rotates. A static hero
  // showing dots would be a lie about behaviour.
  const showIndicators = Boolean(sequence && sequence.length > 1);
  const handleSlideChange = useCallback((index: number) => setSlide(index), []);

  return (
    <section
      className="on-dark relative isolate overflow-hidden bg-navy pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-40"
      aria-labelledby="page-hero-title"
    >
      {/* Official photographs rotating behind everything, led by this page's
          own. `strong` for centred copy, `medium` when the text sits left. */}
      {sequence && (
        <HeroSequenceBackdrop
          sequence={sequence}
          scrim={variant === 'centered' ? 'strong' : 'medium'}
          intervalMs={heroIntervalMs}
          priority
          activeIndex={slide}
          onActiveIndexChange={handleSlideChange}
        />
      )}

      {/* Only the decorative flourish is kept when a photo is present. The old
          full-width radial gradient used to be painted on top of the
          photograph at 35% opacity, which is what stopped the image from ever
          reading as an image. */}
      {!sequence && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_15%_0%,#174EA6_0%,#0B1F3A_55%,#081428_100%)]"
        />
      )}

      {/* Two soft brand glows for depth. The grid/graph-paper pattern that used
          to sit here has been removed: over a photograph it read as a wall of
          small boxes, which is exactly the "template" look the hero should not
          have. */}
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full border border-gold/10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-52 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/[0.05]"
      />

      <Container>
        {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}

        <div
          className={
            variant === 'split'
              ? 'grid items-center gap-10 lg:grid-cols-2 lg:gap-14'
              : isCentered
                ? 'mx-auto max-w-3xl text-center'
                : 'max-w-3xl'
          }
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={isCentered ? 'flex flex-col items-center' : ''}
          >
            {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}

            {/* Text shadow as a contrast backstop, so the heading survives even
                a bright photograph without needing the image darkened. */}
            <h1
              id="page-hero-title"
              className="text-display-xl text-white [text-shadow:0_2px_18px_rgba(4,10,22,0.55)]"
            >
              {title}
            </h1>

            {description && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(4,10,22,0.5)] sm:text-lg">
                {description}
              </p>
            )}

            {actions && <div className="mt-8">{actions}</div>}
            {children}
          </motion.div>

          {variant === 'split' && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="overflow-hidden rounded-2xl shadow-lift-lg">
                {image ? (
                  <img
                    src={image}
                    alt={imageLabel}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder label={imageLabel} className="aspect-[4/3]" />
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Rotation indicators. Clicking one jumps straight to that
            photograph, which is also how a visitor stops the rotation. */}
        {showIndicators && sequence && (
          <div
            className={`mt-11 flex items-center gap-2.5 ${isCentered ? 'justify-center' : ''}`}
            role="group"
            aria-label="Choose hero photograph"
          >
            {sequence.map((id, index) => {
              const isActive = index === slide;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Show photograph ${index + 1} of ${sequence.length}`}
                  aria-current={isActive}
                  className="group/dot py-2"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                      isActive
                        ? 'w-8 bg-gold'
                        : 'w-3 bg-white/35 group-hover/dot:bg-white/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7">
      {/* Centred with the rest of the hero copy. */}
      <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/55">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-gold-light"
                >
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
  );
}

/* ------------------------------------------------------------------ */
/* Section — a thin wrapper that applies consistent vertical rhythm      */
/* ------------------------------------------------------------------ */

export interface SectionProps {
  children: ReactNode;
  className?: string;
  /** Visual background for the band. */
  tone?: 'canvas' | 'white' | 'navy' | 'muted';
  id?: string;
  'aria-labelledby'?: string;
  'aria-label'?: string;
  size?: 'default' | 'sm';
}

const toneMap = {
  canvas: 'bg-canvas',
  white: 'bg-white',
  muted: 'bg-navy-50/60',
  navy: 'on-dark bg-navy text-white',
} as const;

export function Section({
  children,
  className = '',
  tone = 'canvas',
  id,
  size = 'default',
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${size === 'sm' ? 'py-section-sm md:py-14' : 'section'} ${toneMap[tone]} ${className}`}
      {...aria}
    >
      {children}
    </section>
  );
}

/** Re-exported so pages can compose headings without deep imports. */
export { SectionHeading };
