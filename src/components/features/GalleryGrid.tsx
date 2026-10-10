import { useMemo, useState } from 'react';
import { Expand, ImageOff } from 'lucide-react';
import { Reveal } from '../ui';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';
import { Lightbox } from './Lightbox';
import type { GalleryCategory, GalleryImage } from '../../data/gallery';

interface GalleryGridProps {
  images: GalleryImage[];
  categories: Array<'All' | GalleryCategory>;
  /** Shows the category filter row. */
  showFilters?: boolean;
  /** Rendered when a category has no entries. */
  emptyMessage?: string;
  className?: string;
}

const aspectClass: Record<GalleryImage['aspect'], string> = {
  tall: 'aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[4/3]',
};

export function GalleryGrid({
  images,
  categories,
  showFilters = true,
  emptyMessage = 'No images have been published in this category yet.',
  className = '',
}: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? images : images.filter((img) => img.category === activeCategory)),
    [images, activeCategory]
  );

  const lightboxItems = useMemo(
    () =>
      filtered.map((img) => ({
        src: img.fullSrc ?? img.src,
        alt: img.alt,
        caption: img.alt,
      })),
    [filtered]
  );

  return (
    <div className={className}>
      {showFilters && (
        <div
          className="no-scrollbar -mx-5 mb-9 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
          role="tablist"
          aria-label="Filter gallery by category"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={[
                  'shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-navy text-white shadow-lift'
                    : 'bg-white text-ink-muted shadow-lift hover:bg-navy-50 hover:text-navy',
                ].join(' ')}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {/* Masonry-style columns via CSS multi-column for genuine masonry. */}
      {filtered.length > 0 ? (
        <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {filtered.map((image, index) => (
            <Reveal as="li" key={image.id} delay={Math.min(index, 8) * 0.05} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative block w-full overflow-hidden rounded-2xl card-base text-left transition-shadow duration-300 hover:shadow-lift-lg"
                aria-label={`Open image: ${image.alt}`}
              >
                {image.src ? (
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className={`w-full ${aspectClass[image.aspect]} object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                  />
                ) : (
                  <ImagePlaceholder
                    label={image.alt}
                    tone="light"
                    className={`w-full ${aspectClass[image.aspect]}`}
                  />
                )}

                {/* Hover scrim */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-sm font-medium leading-snug text-white">{image.alt}</span>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                    <Expand className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>

                <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                  {image.category}
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-navy-50/60 py-16 text-center">
          <ImageOff className="h-10 w-10 text-ink-muted/50" aria-hidden="true" />
          <p className="max-w-sm text-sm text-ink-muted">{emptyMessage}</p>
        </div>
      )}

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
