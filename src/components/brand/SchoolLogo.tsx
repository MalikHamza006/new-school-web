import { siteLogo } from '../../data/images';

export interface SchoolLogoProps {
  /**
   * Which variant of the school's logo to render.
   *
   * `solid`   — navy-and-gold artwork, for light backgrounds.
   * `overlay` — white-and-gold artwork, for dark backgrounds such as the
   *             transparent navbar over the homepage hero.
   *
   * Both are the school's real logo. The overlay variant is the same artwork
   * recoloured pixel by pixel at build time (see scripts/optimize-images.mjs),
   * so the gold detailing is preserved rather than flattened to white.
   */
  tone?: 'solid' | 'overlay';
  className?: string;
}

/**
 * The school's own logo, taken from spectralcollege.com.
 *
 * The intrinsic artwork is 1387x778 with a transparent background, served at
 * 520px wide — ample for the navbar slot and about 41 KB as WebP.
 */
export function SchoolLogo({ tone = 'solid', className = '' }: SchoolLogoProps) {
  const overlay = tone === 'overlay';

  return (
    <img
      src={overlay ? siteLogo.inverseSrc : siteLogo.src}
      srcSet={overlay ? siteLogo.inverseSrcSet : siteLogo.srcSet}
      width={siteLogo.width}
      height={siteLogo.height}
      alt="Spectral Model School &amp; College"
      decoding="async"
      className={`h-11 sm:h-12 xl:h-14 w-auto max-w-[clamp(128px,11.5vw,190px)] object-contain transition-transform duration-200 ${className}`}
    />
  );
}
