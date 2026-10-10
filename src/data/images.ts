/**
 * Official image manifest.
 *
 * Every photograph here was downloaded from the school's own website
 * (spectralcollege.com) into `assets/official/`. Do not add imagery from any
 * other source: the school has not supplied a wider photo library, and stock
 * photography would misrepresent the campus.
 *
 * Run `npm run images` to regenerate the derivatives after replacing a file
 * in `assets/official/`.
 *
 * Two conventions matter here:
 *
 * 1. Hero photographs are used as *decorative* backgrounds behind a text
 *    heading, so they render with an empty `alt`. Screen readers get the
 *    heading instead of a redundant description.
 * 2. The same photographs are reused as *content* images in the gallery, where
 *    an empty `alt` would be wrong. Use `content.alt` there. Because the
 *    school has not yet confirmed what each photograph shows, those alt strings
 *    and captions are deliberately generic — refine them once the school
 *    supplies real descriptions.
 */

export interface ContentImage {
  /** Responsive WebP candidates for in-page use. */
  srcSet: string;
  fallbackSrc: string;
  /** Small, cheap variant for grid tiles. */
  thumbSrc: string;
  /** Square crop for portrait-ish slots. */
  squareSrc: string;
  /** Full-resolution crop for the lightbox. */
  fullSrc: string;
  width: number;
  height: number;
}

export interface ImageVariant {
  /** Single-file asset; these crops are small enough not to need a srcset. */
  src: string;
  /** JPEG twin where one exists, otherwise the WebP itself. */
  fallbackSrc: string;
  width: number;
  height: number;
}

export interface HeroImage {
  /** Slug matching the file name in public/images/site. */
  id: string;
  /** Responsive WebP candidates, smallest first. */
  srcSet: string;
  /** JPEG fallback for browsers without WebP support. */
  fallbackSrc: string;
  /** Intrinsic size of the largest derivative, used to avoid layout shift. */
  width: number;
  height: number;
  /** Inline 16px JPEG painted as the blur-up placeholder. */
  lqip: string;
  /** In-page derivatives, shared with the gallery and content sections. */
  content: ContentImage;
  /**
   * Reframed crops of this same photograph.
   *
   * Four photographs is not enough for a fifteen-tile gallery, and repeating
   * the identical frame is worse than a smaller gallery. These are real crops
   * of the school's own images - a crop cannot misrepresent a campus the way a
   * borrowed photograph of a different school would.
   */
  variants: {
    /** Tall slice for portrait slots. */
    portrait: ImageVariant;
    /** Close-in square for detail slots. */
    zoom: ImageVariant;
    /** Wide letterbox band for full-bleed strips. */
    strip: ImageVariant;
  };
}

export const heroImages = {
  campusA: {
    id: 'campus-a',
    srcSet:
      '/images/site/campus-a-sm.webp 640w, /images/site/campus-a-md.webp 960w, /images/site/campus-a-lg.webp 1600w',
    fallbackSrc: '/images/site/campus-a-lg.jpg',
    width: 1600,
    height: 900,
    lqip:
      'null',
    content: {
      /** 4:3 crop for gallery grids, facility cards and the about section. */
      srcSet:
        '/images/site/campus-a-thumb.webp 480w, /images/site/campus-a-square.webp 900w, /images/site/campus-a-wide.webp 1200w',
      fallbackSrc: '/images/site/campus-a-wide.jpg',
      thumbSrc: '/images/site/campus-a-thumb.webp',
      squareSrc: '/images/site/campus-a-square.webp',
      /** Full-bleed 1200x900, used by the lightbox. */
      fullSrc: '/images/site/campus-a-wide.webp',
      width: 1200,
      height: 900,
    },
    /**
     * Reframed crops of THIS photograph. A crop is still the real campus; a
     * stock photo of somewhere else would not be. See the gallery data for why
     * this exists.
     */
    variants: {
    portrait: {
      src: '/images/site/campus-a-portrait.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-a-portrait.webp',
      width: 600,
      height: 800,
    },
    zoom: {
      src: '/images/site/campus-a-zoom.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-a-zoom.webp',
      width: 700,
      height: 700,
    },
    strip: {
      src: '/images/site/campus-a-strip.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-a-strip.jpg',
      width: 1200,
      height: 450,
    },
    },
  },
  campusB: {
    id: 'campus-b',
    srcSet:
      '/images/site/campus-b-sm.webp 640w, /images/site/campus-b-md.webp 960w, /images/site/campus-b-lg.webp 1600w',
    fallbackSrc: '/images/site/campus-b-lg.jpg',
    width: 1600,
    height: 900,
    lqip:
      'null',
    content: {
      /** 4:3 crop for gallery grids, facility cards and the about section. */
      srcSet:
        '/images/site/campus-b-thumb.webp 480w, /images/site/campus-b-square.webp 900w, /images/site/campus-b-wide.webp 1200w',
      fallbackSrc: '/images/site/campus-b-wide.jpg',
      thumbSrc: '/images/site/campus-b-thumb.webp',
      squareSrc: '/images/site/campus-b-square.webp',
      /** Full-bleed 1200x900, used by the lightbox. */
      fullSrc: '/images/site/campus-b-wide.webp',
      width: 1200,
      height: 900,
    },
    /**
     * Reframed crops of THIS photograph. A crop is still the real campus; a
     * stock photo of somewhere else would not be. See the gallery data for why
     * this exists.
     */
    variants: {
    portrait: {
      src: '/images/site/campus-b-portrait.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-b-portrait.webp',
      width: 600,
      height: 800,
    },
    zoom: {
      src: '/images/site/campus-b-zoom.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-b-zoom.webp',
      width: 700,
      height: 700,
    },
    strip: {
      src: '/images/site/campus-b-strip.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-b-strip.jpg',
      width: 1200,
      height: 450,
    },
    },
  },
  campusC: {
    id: 'campus-c',
    srcSet:
      '/images/site/campus-c-sm.webp 640w, /images/site/campus-c-md.webp 960w, /images/site/campus-c-lg.webp 1600w',
    fallbackSrc: '/images/site/campus-c-lg.jpg',
    width: 1600,
    height: 900,
    lqip:
      'null',
    content: {
      /** 4:3 crop for gallery grids, facility cards and the about section. */
      srcSet:
        '/images/site/campus-c-thumb.webp 480w, /images/site/campus-c-square.webp 900w, /images/site/campus-c-wide.webp 1200w',
      fallbackSrc: '/images/site/campus-c-wide.jpg',
      thumbSrc: '/images/site/campus-c-thumb.webp',
      squareSrc: '/images/site/campus-c-square.webp',
      /** Full-bleed 1200x900, used by the lightbox. */
      fullSrc: '/images/site/campus-c-wide.webp',
      width: 1200,
      height: 900,
    },
    /**
     * Reframed crops of THIS photograph. A crop is still the real campus; a
     * stock photo of somewhere else would not be. See the gallery data for why
     * this exists.
     */
    variants: {
    portrait: {
      src: '/images/site/campus-c-portrait.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-c-portrait.webp',
      width: 600,
      height: 800,
    },
    zoom: {
      src: '/images/site/campus-c-zoom.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-c-zoom.webp',
      width: 700,
      height: 700,
    },
    strip: {
      src: '/images/site/campus-c-strip.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-c-strip.jpg',
      width: 1200,
      height: 450,
    },
    },
  },
  campusD: {
    id: 'campus-d',
    srcSet:
      '/images/site/campus-d-sm.webp 640w, /images/site/campus-d-md.webp 960w, /images/site/campus-d-lg.webp 1600w',
    fallbackSrc: '/images/site/campus-d-lg.jpg',
    width: 1600,
    height: 900,
    lqip:
      'null',
    content: {
      /** 4:3 crop for gallery grids, facility cards and the about section. */
      srcSet:
        '/images/site/campus-d-thumb.webp 480w, /images/site/campus-d-square.webp 900w, /images/site/campus-d-wide.webp 1200w',
      fallbackSrc: '/images/site/campus-d-wide.jpg',
      thumbSrc: '/images/site/campus-d-thumb.webp',
      squareSrc: '/images/site/campus-d-square.webp',
      /** Full-bleed 1200x900, used by the lightbox. */
      fullSrc: '/images/site/campus-d-wide.webp',
      width: 1200,
      height: 900,
    },
    /**
     * Reframed crops of THIS photograph. A crop is still the real campus; a
     * stock photo of somewhere else would not be. See the gallery data for why
     * this exists.
     */
    variants: {
    portrait: {
      src: '/images/site/campus-d-portrait.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-d-portrait.webp',
      width: 600,
      height: 800,
    },
    zoom: {
      src: '/images/site/campus-d-zoom.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-d-zoom.webp',
      width: 700,
      height: 700,
    },
    strip: {
      src: '/images/site/campus-d-strip.webp',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '/images/site/campus-d-strip.jpg',
      width: 1200,
      height: 450,
    },
    },
  },
} as const satisfies Record<string, HeroImage>;

export type HeroImageId = keyof typeof heroImages;

export const heroImageList: readonly HeroImage[] = Object.values(heroImages);

/** Rotates through the official set for the homepage carousel. */
export const homeHeroSequence: readonly HeroImageId[] = [
  'campusC',
  'campusA',
  'campusD',
  'campusB',
] as const;

/**
 * Which photograph LEADS each interior page's hero.
 *
 * Several pages share an image on purpose rather than inventing new ones.
 * This is the first entry of `pageHeroSequence`, which drives the rotation.
 */
export const pageHeroImage = {
  about: 'campusA',
  academics: 'campusC',
  admissions: 'campusD',
  campus: 'campusA',
  achievements: 'campusB',
  events: 'campusC',
  gallery: 'campusB',
  contact: 'campusD',
} as const satisfies Record<string, HeroImageId>;

export type PageKey = keyof typeof pageHeroImage;

/**
 * Rotation order for each interior page's hero.
 *
 * Every hero cycles through the official set, led by the page's own
 * photograph so the first frame is always relevant. There are only four
 * photographs available, so pages necessarily share them.
 */
export const pageHeroSequence = {
  about: ['campusA', 'campusB', 'campusC', 'campusD'] as const,
  academics: ['campusC', 'campusA', 'campusB', 'campusD'] as const,
  admissions: ['campusD', 'campusA', 'campusB', 'campusC'] as const,
  campus: ['campusA', 'campusB', 'campusC', 'campusD'] as const,
  achievements: ['campusB', 'campusA', 'campusC', 'campusD'] as const,
  events: ['campusC', 'campusA', 'campusB', 'campusD'] as const,
  gallery: ['campusB', 'campusA', 'campusC', 'campusD'] as const,
  contact: ['campusD', 'campusA', 'campusB', 'campusC'] as const,
} as const satisfies Record<PageKey, readonly HeroImageId[]>;

/**
 * The homepage "beyond the classroom" band and the About page introduction
 * both want a landscape crop that is not the hero frame.
 */
export const featureImage = heroImages.campusB;
export const aboutImage = heroImages.campusA;

export const siteLogo = {
  /** Original navy-and-gold artwork, for light backgrounds. */
  src: '/images/site/logo.webp',
  srcSet: '/images/site/logo.png',
  /** White-and-gold recolour, for dark backgrounds. Same real artwork. */
  inverseSrc: '/images/site/logo-inverse.webp',
  inverseSrcSet: '/images/site/logo-inverse.png',
  width: 520,
  height: 292,
} as const;
