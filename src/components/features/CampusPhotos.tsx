import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, MapPin } from 'lucide-react';
import { Reveal, Button } from '../ui';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';
import { heroImages, type HeroImageId } from '../../data/images';

interface CampusPhotoProps {
  /** Which official photograph to render. */
  photo: HeroImageId;
  /**
   * What the photograph shows. Generic on purpose — the school has not yet
   * supplied real descriptions, and an invented one would be a false claim
   * about the campus.
   */
  alt: string;
  /** Optional small caption under the photo. */
  caption?: string;
  /** Aspect ratio utility class. */
  className?: string;
  sizes?: string;
  /** Above-the-fold photos should not lazy-load. */
  priority?: boolean;
}

/**
 * A single official photograph, framed the way the rest of the site frames
 * media: borderless card surface, soft elevation, gentle zoom on hover.
 *
 * Every page that previously had no imagery at all now uses this so the
 * photographs actually published by the school appear across the site rather
 * than only in the gallery.
 */
export function CampusPhoto({
  photo,
  alt,
  caption,
  className = 'aspect-[4/3]',
  sizes = '(min-width: 1024px) 55vw, 100vw',
  priority = false,
}: CampusPhotoProps) {
  const image = heroImages[photo];
  const { content } = image;

  return (
    <figure
      className={`group overflow-hidden rounded-2xl bg-navy-50 shadow-lift transition-shadow duration-300 hover:shadow-lift-lg ${className}`}
    >
      <img
        src={content.fallbackSrc}
        srcSet={content.srcSet}
        sizes={sizes}
        width={content.width}
        height={content.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      {caption && (
        <figcaption className="flex items-center gap-2 bg-white/95 px-4 py-3 text-xs font-medium text-ink-muted backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
          <span className="truncate">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* CardPhoto — the photograph band that tops a content card            */
/* ------------------------------------------------------------------ */

interface CardPhotoProps {
  photo: HeroImageId;
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * Photograph band for the top of a content card — programmes, features,
 * achievements.
 *
 * These cards previously had no imagery at all, which left a long run of
 * text-only tiles down the Academics and Achievements pages while every other
 * page carried photographs. This puts the school's own pictures back on them.
 *
 * A note on repetition, stated plainly: the school has published exactly four
 * photographs, so a grid of eight cards is necessarily showing those four more
 * than once. Cycling through the official set is the honest option — the
 * alternative, borrowing stock images of other schools, would be a false claim
 * about the campus. Once the school supplies a real photo library, pass a
 * specific `photo` per card and the repetition disappears with no code change.
 *
 * `sizes` defaults to a narrow tile because that is the only shape this is used
 * in; cards sit three or four across, so over-fetching a full-width image per
 * tile would download several megabytes nobody sees.
 */
export function CardPhoto({
  photo,
  alt,
  className = 'aspect-[16/10]',
  sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw',
}: CardPhotoProps) {
  const { content } = heroImages[photo];

  return (
    <div className={`relative overflow-hidden bg-navy-50 ${className}`}>
      <img
        src={content.fallbackSrc}
        srcSet={content.srcSet}
        sizes={sizes}
        width={content.width}
        height={content.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {/* Keeps the card's text legible if a photograph ever turns out to be
          bright, and gives the band a finished edge where it meets the card. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Photo feature: copy beside a photograph                             */
/* ------------------------------------------------------------------ */

interface PhotoFeatureProps {
  photo: HeroImageId;
  alt: string;
  caption?: string;
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  action?: { label: string; to: string };
  /** Which side the copy sits on. */
  reverse?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Split section: an official photograph on one side, copy on the other.
 *
 * The photo column uses `order-*` rather than a second markup tree, so the
 * layout reverses on large screens without duplicating content for screen
 * readers or breaking the mobile stacking order.
 */
export function PhotoFeature({
  photo,
  alt,
  caption,
  eyebrow,
  title,
  description,
  bullets = [],
  action,
  reverse = false,
  className = '',
  children,
}: PhotoFeatureProps) {
  return (
    <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${className}`}>
      <Reveal
        className={reverse ? 'lg:order-2' : 'lg:order-1'}
        delay={0.05}
      >
        <CampusPhoto
          photo={photo}
          alt={alt}
          caption={caption}
          className="aspect-[4/3] w-full"
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
      </Reveal>

      <Reveal className={reverse ? 'lg:order-1' : 'lg:order-2'} delay={0.12}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">{description}</p>

        {bullets.length > 0 && (
          <ul className="mt-7 space-y-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
                  aria-hidden="true"
                />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {children}

        {action && (
          <Button variant="primary" size="md" asChild className="mt-8">
            <Link to={action.to}>
              {action.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Photo strip: a row of photographs                                  */
/* ------------------------------------------------------------------ */

interface PhotoStripProps {
  photos: Array<{ id: HeroImageId; alt: string; caption?: string }>;
  /** Renders the second and fourth tiles taller, for a masonry feel. */
  stagger?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
  /** Shows the lightbox when a tile is clicked. */
  clickable?: boolean;
}

const columnClass: Record<NonNullable<PhotoStripProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * A row of official photographs, each opening in the lightbox when clickable.
 * Used where a page needs visual weight but has no other imagery.
 */
export function PhotoStrip({
  photos,
  stagger = false,
  columns = 3,
  className = '',
  clickable = false,
}: PhotoStripProps) {
  return (
    <ul className={`grid gap-5 ${columnClass[columns]} ${className}`}>
      {photos.map((entry, index) => {
        const offset = stagger && index % 2 === 1 ? 'lg:mt-10' : '';

        const figure = (
          <CampusPhoto
            photo={entry.id}
            alt={entry.alt}
            caption={entry.caption}
            className={stagger ? 'aspect-[3/4] w-full' : 'aspect-square w-full'}
            sizes={clickable ? '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw' : undefined}
          />
        );

        return (
          <Reveal as="li" key={entry.id} delay={Math.min(index, 6) * 0.07} className={offset}>
            {figure}
          </Reveal>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Photo band: full-bleed strip under a heading                        */
/* ------------------------------------------------------------------ */

interface PhotoBandProps {
  photo: HeroImageId;
  alt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * A wide photographic band with a navy scrim and centred copy — the standard
 * "pause" between two text-heavy sections. Deliberately not a hero: no
 * navigation, smaller type, and it sits mid-page.
 */
export function PhotoBand({
  photo,
  alt,
  eyebrow,
  title,
  description,
  className = '',
}: PhotoBandProps) {
  const { content } = heroImages[photo];

  return (
    <Reveal className={`overflow-hidden rounded-3xl shadow-lift-lg ${className}`}>
      <figure className="group relative isolate">
        <img
          src={content.fallbackSrc}
          srcSet={content.srcSet}
          sizes="100vw"
          width={content.width}
          height={content.height}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="aspect-[21/9] max-h-[26rem] min-h-[16rem] w-full object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/25"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent"
        />

        <figcaption className="absolute inset-0 flex flex-col items-center justify-center px-6 py-12 text-center sm:px-12">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-3 max-w-3xl font-display text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
          )}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Photo slots: labelled placeholders for pending official photos      */
/* ------------------------------------------------------------------ */

interface PhotoSlotProps {
  label: string;
  className?: string;
  caption?: string;
}

/**
 * A reserved slot for a photograph the school has not supplied yet.
 *
 * This is deliberately not a generic stock image. Until the school provides
 * the real classroom, activity or event photograph, an honest empty slot reads
 * better on a school website than a picture of somebody else's school.
 */
export function PhotoSlot({ label, className = 'aspect-[4/3]', caption }: PhotoSlotProps) {
  return (
    <div className={`overflow-hidden rounded-2xl shadow-lift ${className}`}>
      <ImagePlaceholder label={label} tone="light" className="h-full w-full" caption={caption} />
    </div>
  );
}

interface PhotoSlotGridProps {
  slots: Array<{ id: string; label: string; caption?: string }>;
  className?: string;
}

/** A grid of pending-photo slots, for pages that need a gallery shape. */
export function PhotoSlotGrid({ slots, className = '' }: PhotoSlotGridProps) {
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {slots.map((slot, index) => (
        <Reveal as="li" key={slot.id} delay={Math.min(index, 6) * 0.06}>
          <PhotoSlot label={slot.label} caption={slot.caption} />
        </Reveal>
      ))}
    </ul>
  );
}

/** Small icon tile used by pending-slot headings. */
export function PhotoSlotIcon() {
  return <Camera className="h-5 w-5" aria-hidden="true" />;
}
