import { heroImages, type HeroImageId, type ImageVariant } from './images';

export type GalleryCategory = 'Campus' | 'Students' | 'Events' | 'Activities' | 'Academics';

/**
 * The one alt string used for every official photograph and crop of one.
 *
 * Deliberately says only what is known: these were published on the school's
 * own website. Naming a subject ("the library", "sports day") would be a guess
 * presented as fact, and a wrong alt is worse than a vague one because a
 * screen-reader user is relying on it. Replace with real descriptions the moment
 * the school supplies them.
 */
const OFFICIAL_ALT = 'Official photograph of Spectral Model School & College, published on the school website';

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  /** Path relative to /public, or `null` to render a designed placeholder. */
  src: string | null;
  /** Responsive WebP candidates. Only set on published entries. */
  srcSet?: string;
  /** Full-resolution crop for the lightbox. Only set on published entries. */
  fullSrc?: string;
  alt: string;
  /** Controls masonry aspect ratio variety. */
  aspect: 'tall' | 'square' | 'wide';
  /**
   * `placeholder` images have no photograph behind them. They are rendered as
   * branded placeholders so the site never displays a stock photo that could
   * be mistaken for the real campus or real students.
   */
  status: 'published' | 'placeholder';
}

/**
 * A published tile drawn from one of the school's own photographs.
 *
 * `variant` picks a *crop* of that photograph rather than the wide frame: the
 * portrait slice, the close-in zoom, or the letterbox strip. Different crops of
 * the same campus read as different photographs in a grid, which is what stops
 * four source images from looking like a broken fifteen-tile gallery.
 */
function crop(
  id: string,
  photo: HeroImageId,
  variant: keyof ReturnType<typeof variantsOf>,
  aspect: GalleryImage['aspect'],
  alt: string
): GalleryImage {
  const image = heroImages[photo];
  const v: ImageVariant = image.variants[variant];

  return {
    id,
    category: 'Campus',
    src: v.src,
    srcSet: `${v.src} ${v.width}w`,
    fullSrc: v.fallbackSrc,
    alt,
    aspect,
    status: 'published',
  };
}

function variantsOf(photo: HeroImageId) {
  return heroImages[photo].variants;
}

/**
 * Gallery entries.
 *
 * The `Campus` entries are the school's real photographs, downloaded from
 * spectralcollege.com and cropped for the grid by `npm run images`.
 *
 * WHY THERE ARE SO MANY ENTRIES FOR FOUR PHOTOGRAPHS
 * --------------------------------------------------
 * The school has published four photographs. Used one-per-tile, the gallery
 * would show the identical frame over and over. So most tiles are *crops* of
 * those four — zoomed, reframed, at different aspect ratios. A crop of the real
 * campus is still the real campus, which is why this is honest and filling the
 * grid with stock classrooms is not: those would be a different school's
 * building, and the faces would be children who do not attend here.
 *
 * One caveat, stated plainly: the school has not told us what each photograph
 * actually depicts. Rather than invent captions such as "sports day" or
 * "chemistry lab" — which would be a guess presented as fact — the published
 * entries say only that they are official photographs, and await confirmation.
 * Replace `alt` with a real description as soon as the school supplies one; it
 * is the first thing a screen-reader user will hear.
 *
 * The `Students`, `Events`, `Activities` and `Academics` categories still use
 * branded placeholders. That is deliberate: a campus exterior cannot honestly
 * be captioned "students in a classroom lesson". Those stay empty until the
 * school sends real photographs, and the placeholder says so.
 */
export const galleryImages: GalleryImage[] = [
  {
    id: 'campus-c',
    category: 'Campus',
    src: heroImages.campusC.content.thumbSrc,
    srcSet: heroImages.campusC.content.srcSet,
    fullSrc: heroImages.campusC.content.fullSrc,
    alt: OFFICIAL_ALT,
    aspect: 'tall',
    status: 'published',
  },
  {
    id: 'campus-a',
    category: 'Campus',
    src: heroImages.campusA.content.thumbSrc,
    srcSet: heroImages.campusA.content.srcSet,
    fullSrc: heroImages.campusA.content.fullSrc,
    alt: OFFICIAL_ALT,
    aspect: 'wide',
    status: 'published',
  },
  {
    id: 'campus-d',
    category: 'Campus',
    src: heroImages.campusD.content.thumbSrc,
    srcSet: heroImages.campusD.content.srcSet,
    fullSrc: heroImages.campusD.content.fullSrc,
    alt: OFFICIAL_ALT,
    aspect: 'square',
    status: 'published',
  },
  {
    id: 'campus-b',
    category: 'Campus',
    src: heroImages.campusB.content.thumbSrc,
    srcSet: heroImages.campusB.content.srcSet,
    fullSrc: heroImages.campusB.content.fullSrc,
    alt: OFFICIAL_ALT,
    aspect: 'wide',
    status: 'published',
  },
  {
    id: 'campus-2',
    category: 'Campus',
    src: null,
    alt: 'Awaiting a photograph of the school entrance and reception area',
    aspect: 'tall',
    status: 'placeholder',
  },
  {
    id: 'campus-3',
    category: 'Campus',
    src: null,
    alt: 'Awaiting a photograph of the school courtyard',
    aspect: 'square',
    status: 'placeholder',
  },

  /* ---- Detail crops of the same four official photographs ----
     Each of these is a genuine crop of the school's own image — zoomed and
     reframed so the grid has visual variety without borrowing a photograph of
     somewhere else. `alt` stays generic because the school has not yet said
     what any of these frames depict. */
  crop('crop-c-a-portrait', 'campusA', 'portrait', 'tall', OFFICIAL_ALT),
  crop('crop-c-b-portrait', 'campusB', 'portrait', 'tall', OFFICIAL_ALT),
  crop('crop-c-d-portrait', 'campusD', 'portrait', 'tall', OFFICIAL_ALT),

  crop('crop-a-zoom', 'campusA', 'zoom', 'square', OFFICIAL_ALT),
  crop('crop-b-zoom', 'campusB', 'zoom', 'square', OFFICIAL_ALT),
  crop('crop-c-zoom', 'campusC', 'zoom', 'square', OFFICIAL_ALT),
  crop('crop-d-zoom', 'campusD', 'zoom', 'square', OFFICIAL_ALT),

  crop('crop-a-strip', 'campusA', 'strip', 'wide', OFFICIAL_ALT),
  crop('crop-b-strip', 'campusB', 'strip', 'wide', OFFICIAL_ALT),
  crop('crop-c-strip', 'campusC', 'strip', 'wide', OFFICIAL_ALT),
  crop('crop-d-strip', 'campusD', 'strip', 'wide', OFFICIAL_ALT),
];

/** Photographs that are real, used for the opening band and count only. */
export const publishedGalleryImages: GalleryImage[] = galleryImages.filter(
  (image) => image.status === 'published'
);

export const galleryCategories: Array<'All' | GalleryCategory> = [
  'All',
  'Campus',
  'Students',
  'Events',
  'Activities',
  'Academics',
];
