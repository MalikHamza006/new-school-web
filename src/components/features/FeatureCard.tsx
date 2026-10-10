import { Card, CardBody, CardHeader, CardTitle, IconTile, Reveal } from '../ui';
import { CardPhoto } from './CampusPhotos';
import { cardPhotoFor } from '../../data/cardPhotos';
import type { HeroImageId } from '../../data/images';
import type { Feature } from '../../data/programs';

/* ------------------------------------------------------------------ */
/* FeatureCard — principle/feature card used by FeatureGrid             */
/* ------------------------------------------------------------------ */

interface FeatureCardProps {
  feature: Feature;
  index?: number;
  tone?: 'navy' | 'blue' | 'gold';
  onDark?: boolean;
  /**
   * Optional photograph band. When `onDark` is set the band is skipped: a
   * photograph above a card that is already sitting on a navy background
   * produces two competing edges and reads as a mistake.
   */
  image?: HeroImageId;
  imageAlt?: string;
  className?: string;
}

export function FeatureCard({
  feature,
  tone = 'navy',
  onDark = false,
  image,
  imageAlt,
  className = '',
}: FeatureCardProps) {
  const Icon = feature.icon;
  const showImage = Boolean(image) && !onDark;

  return (
    <Card
      variant={onDark ? 'dark' : 'interactive'}
      padding={showImage ? 'none' : 'lg'}
      fullHeight
      className={`group flex flex-col overflow-hidden ${className}`}
    >
      {showImage && image && (
        <CardPhoto photo={image} alt={imageAlt ?? `An official photograph of the school`} />
      )}

      <div className={`flex flex-1 flex-col ${showImage ? 'p-6' : ''}`}>
        <IconTile tone={onDark ? 'onDark' : tone} size="md">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </IconTile>

        <CardHeader className="mt-5 gap-2">
          <CardTitle as="h3" onDark={onDark}>
            {feature.title}
          </CardTitle>
        </CardHeader>

        <CardBody onDark={onDark}>{feature.description}</CardBody>
      </div>
    </Card>
  );
}

/** Grid wrapper that reveals its FeatureCards as one staggered group. */
export function FeatureGrid({
  features,
  columns = 4,
  onDark = false,
  withImages = true,
  className = '',
}: {
  features: Feature[];
  columns?: 2 | 3 | 4;
  onDark?: boolean;
  /** Turn off for tight four-across rows, where a photo band leaves no room
   *  for the copy. */
  withImages?: boolean;
  className?: string;
}) {
  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <ul className={`grid gap-5 sm:gap-6 ${cols} ${className}`}>
      {features.map((feature, index) => (
        <Reveal as="li" key={feature.id} delay={index * 0.07} className="h-full">
          <FeatureCard
            feature={feature}
            onDark={onDark}
            image={withImages ? cardPhotoFor(index) : undefined}
          />
        </Reveal>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* AchievementCard — square-ish tile with a gold accent                 */
/* ------------------------------------------------------------------ */

interface AchievementCardProps {
  feature: Feature;
  image?: HeroImageId;
  imageAlt?: string;
  className?: string;
}

export function AchievementCard({
  feature,
  image,
  imageAlt,
  className = '',
}: AchievementCardProps) {
  const Icon = feature.icon;

  return (
    <Card
      variant="interactive"
      padding="none"
      fullHeight
      className={`group relative flex flex-col overflow-hidden text-center ${className}`}
    >
      {image && (
        <CardPhoto
          photo={image}
          alt={imageAlt ?? `An official photograph related to ${feature.title}`}
          className="aspect-[16/9]"
        />
      )}

      {/* Gold wash that appears on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 h-32 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex flex-1 flex-col items-center p-6">
        <IconTile tone="gold" size="lg">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </IconTile>

        <h3 className="mt-5 font-display text-display-sm text-navy">{feature.title}</h3>

        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
          {feature.description}
        </p>
      </div>
    </Card>
  );
}
