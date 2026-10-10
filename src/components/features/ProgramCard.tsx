import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, IconTile, Reveal } from '../ui';
import { CardPhoto } from './CampusPhotos';
import { cardPhotoFor } from '../../data/cardPhotos';
import type { HeroImageId } from '../../data/images';
import type { Program } from '../../data/programs';

/**
 * ProgramCard — an academic programme tile.
 *
 * `details` is rendered as a short bullet list, which makes it easy to add real
 * curriculum information later without changing the component.
 *
 * `image` is optional and defaults to none. Callers that render a grid pass
 * `cardPhotoFor(index)` so the programme tiles carry a photograph like every
 * other card on the site; the school can later name a real photograph per
 * programme without touching this component.
 */
export function ProgramCard({
  program,
  headingLevel = 'h3',
  image,
  imageAlt,
  className = '',
}: {
  program: Program;
  headingLevel?: 'h2' | 'h3';
  image?: HeroImageId;
  imageAlt?: string;
  className?: string;
}) {
  const Icon = program.icon;

  return (
    <Card
      variant="interactive"
      padding="none"
      fullHeight
      className={`group flex flex-col overflow-hidden ${className}`}
    >
      {image && (
        <CardPhoto
          photo={image}
          alt={imageAlt ?? `An official photograph of ${program.title} at the school`}
        />
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <IconTile tone="navy" size="lg">
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </IconTile>
          <span className="rounded-full bg-gold/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-gold-dark">
            {program.level}
          </span>
        </div>

        <CardHeader className="mt-6 gap-2">
          <CardTitle as={headingLevel}>{program.title}</CardTitle>
        </CardHeader>

        <CardBody>{program.description}</CardBody>

        {program.details.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {program.details.map((detail) => (
              <li
                key={detail}
                className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
              >
                <span
                  className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                  aria-hidden="true"
                />
                {detail}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 pt-1">
          <Link
            to={`/academics#${program.anchor}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue transition-colors hover:text-navy"
          >
            Explore this programme
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function ProgramGrid({
  programs,
  className = '',
}: {
  programs: Program[];
  className?: string;
}) {
  return (
    <ul className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {programs.map((program, index) => (
        <Reveal as="li" key={program.id} delay={index * 0.08} className="h-full">
          {/* Cycled from the official set — see `cardPhotoFor`. */}
          <ProgramCard program={program} image={cardPhotoFor(index)} />
        </Reveal>
      ))}
    </ul>
  );
}
