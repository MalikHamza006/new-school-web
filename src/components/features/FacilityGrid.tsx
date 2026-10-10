import { MapPin } from 'lucide-react';
import { Reveal } from '../ui';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';
import { facilityCategories } from '../../data/campus';

/**
 * Campus / facilities grid.
 *
 * Every entry is currently `confirmed: false`, so each tile carries a visible
 * "to be confirmed" tag. Once the school verifies a facility, flip its
 * `confirmed` flag in src/data/campus.ts and the tag disappears automatically.
 */
export function FacilityGrid({ className = '' }: { className?: string }) {
  return (
    <ul className={`columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 ${className}`}>
      {facilityCategories.map((facility, index) => (
        <Reveal as="li" key={facility.id} delay={Math.min(index, 6) * 0.06} className="break-inside-avoid">
          <figure className="group overflow-hidden rounded-2xl bg-white shadow-lift transition-shadow duration-300 hover:shadow-lift-lg">
            <div className="relative">
              {facility.image ? (
                <img
                  src={facility.image}
                  alt={`${facility.title} at ${'Spectral Model School & College'}`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.04] motion-reduce:transition-none"
                />
              ) : (
                <ImagePlaceholder
                  label={`Placeholder for a photograph of the ${facility.title.toLowerCase()}`}
                  tone="light"
                  className="aspect-[4/3] w-full"
                />
              )}

              <span className="absolute left-3 top-3 rounded-full bg-navy/85 backdrop-blur-sm px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/90">
                Campus Space
              </span>
            </div>

            <figcaption className="p-5">
              <h3 className="font-display text-base font-semibold text-navy">{facility.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {facility.description}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}

/** Compact address card used on the campus page. */
export function CampusLocationCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-lift ${className}`}>
      <h3 className="flex items-center gap-2.5 font-display text-base font-semibold text-navy">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-navy/8" aria-hidden="true">
          <MapPin className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        Finding the campus
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Spectral Model School &amp; College is located on Qazi Park Road in Qazi Park, Shahdara,
        Lahore, Punjab 54950. Use the directions link below, or call the school office before
        travelling so someone can guide you to the correct entrance.
      </p>
    </div>
  );
}
