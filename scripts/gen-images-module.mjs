import { readFileSync, writeFileSync } from "node:fs";

const lqip = JSON.parse(readFileSync("assets/lqip.json", "utf8"));

const SIZES = ["sm", "md", "lg"];
const SLUG = { "campus-a": "campusA", "campus-b": "campusB", "campus-c": "campusC", "campus-d": "campusD" };

/**
 * Detail crops of the same photograph: portrait slice, close-in zoom, and a
 * wide letterbox strip. Emitted by \`npm run images\` and used to give the
 * gallery visual variety without borrowing photography of another school.
 */
const VARIANT_MAP = [
  ["portrait", 600, 800],
  ["zoom", 700, 700],
  ["strip", 1200, 450],
];

/**
 * Detail crops of the same photograph: portrait slice, close-in zoom, and a
 * wide letterbox strip. Emitted by `npm run images` and used to give the
 * gallery visual variety without borrowing photography of another school.
 *
 * Built per slug, inside the entry callback, because the file names carry the
 * slug.
 */
function variantsFor(slug) {
  return VARIANT_MAP.map(([suffix, w, h]) => {
    const file = `/images/site/${slug}-${suffix}.webp`;
    return `    ${suffix}: {
      src: '${file}',
      /** Only the strip is wide enough to earn a JPEG twin. */
      fallbackSrc: '${suffix === "strip" ? `/images/site/${slug}-${suffix}.jpg` : file}',
      width: ${w},
      height: ${h},
    },`;
  }).join("\n");
}

const entries = Object.keys(SLUG).map((slug) => {
  const key = SLUG[slug];
  const srcSet = SIZES.map((s) => `/images/site/${slug}-${s}.webp ${s === "lg" ? 1600 : s === "md" ? 960 : 640}w`).join(", ");
  return `  ${key}: {
    id: '${slug}',
    srcSet:
      '${srcSet}',
    fallbackSrc: '/images/site/${slug}-lg.jpg',
    width: 1600,
    height: 900,
    lqip:
      '${lqip[slug]}',
    content: {
      /** 4:3 crop for gallery grids, facility cards and the about section. */
      srcSet:
        '/images/site/${slug}-thumb.webp 480w, /images/site/${slug}-square.webp 900w, /images/site/${slug}-wide.webp 1200w',
      fallbackSrc: '/images/site/${slug}-wide.jpg',
      thumbSrc: '/images/site/${slug}-thumb.webp',
      squareSrc: '/images/site/${slug}-square.webp',
      /** Full-bleed 1200x900, used by the lightbox. */
      fullSrc: '/images/site/${slug}-wide.webp',
      width: 1200,
      height: 900,
    },
    /**
     * Reframed crops of THIS photograph. A crop is still the real campus; a
     * stock photo of somewhere else would not be. See the gallery data for why
     * this exists.
     */
    variants: {
${variantsFor(slug)}
    },
  },`;
}).join("\n");

const pageMap = {
  about: "campusA",
  academics: "campusC",
  admissions: "campusD",
  campus: "campusA",
  achievements: "campusB",
  events: "campusC",
  gallery: "campusB",
  contact: "campusD",
};

const pages = Object.entries(pageMap)
  .map(([page, key]) => `  ${page}: '${key}',`)
  .join("\n");

/**
 * Per-page hero rotation order.
 *
 * Each page leads with its own photograph, then cycles the rest of the
 * official set. There are only four photographs, so pages necessarily share
 * them — the leading entry is what keeps a hero relevant to its page.
 */
const allIds = ["campusA", "campusB", "campusC", "campusD"];

const pageSequences = Object.entries(pageMap)
  .map(([page, key]) => {
    const ordered = [key, ...allIds.filter((id) => id !== key)];
    return `  ${page}: ['${ordered.join("', '")}'] as const,`;
  })
  .join("\n");

const file = `/**
 * Official image manifest.
 *
 * Every photograph here was downloaded from the school's own website
 * (spectralcollege.com) into \`assets/official/\`. Do not add imagery from any
 * other source: the school has not supplied a wider photo library, and stock
 * photography would misrepresent the campus.
 *
 * Run \`npm run images\` to regenerate the derivatives after replacing a file
 * in \`assets/official/\`.
 *
 * Two conventions matter here:
 *
 * 1. Hero photographs are used as *decorative* backgrounds behind a text
 *    heading, so they render with an empty \`alt\`. Screen readers get the
 *    heading instead of a redundant description.
 * 2. The same photographs are reused as *content* images in the gallery, where
 *    an empty \`alt\` would be wrong. Use \`content.alt\` there. Because the
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
${entries}
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
 * This is the first entry of \`pageHeroSequence\`, which drives the rotation.
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
${pageSequences}
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
`;

writeFileSync("src/data/images.ts", file, "utf8");
console.log("wrote src/data/images.ts (" + file.length + " chars)");
