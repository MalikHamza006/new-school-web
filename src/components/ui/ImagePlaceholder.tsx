import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Branded image placeholder.
 *
 * Used wherever an official photograph has not been supplied yet. It is
 * intentionally abstract — soft brand washes, a gold arc and a camera glyph —
 * so it can never be mistaken for a real photo of the school, its staff or its
 * students. The box-grid texture that used to sit here was removed: it made
 * every pending photo look like a wireframe rather than part of the design.
 * Swapping in a real image is a one-line change at the call site.
 */
interface ImagePlaceholderProps {
  /** Accessible description of the image that will eventually live here. */
  label: string;
  /** Aspect ratio utility class, e.g. "aspect-[4/3]". */
  className?: string;
  tone?: 'navy' | 'light';
  /** Optional small caption shown under the label. */
  caption?: string;
}

export function ImagePlaceholder({ label, className = 'aspect-[4/3]', tone = 'navy', caption }: ImagePlaceholderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isNavy = tone === 'navy';

  return (
    <figure
      className={`group relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base wash */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isNavy
            ? 'bg-gradient-to-br from-navy via-navy-700 to-blue-800'
            : 'bg-gradient-to-br from-navy-50 via-navy-100 to-blue-100'
        } ${isHovered ? 'scale-105' : 'scale-100'}`}
        aria-hidden="true"
      />

      {/* Diagonal light sweep — the only texture left. Soft, directional, and
          never reads as a box or a tile. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-700 ${
          isNavy ? 'text-white' : 'text-navy'
        } ${isHovered ? 'opacity-[0.10]' : 'opacity-[0.06]'}`}
        style={{
          backgroundImage:
            'linear-gradient(115deg, currentColor 0%, transparent 45%, transparent 55%, currentColor 100%)',
        }}
      />

      {/* Gold accent arcs */}
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-gold/25"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-2xl"
      />

      {/* Label */}
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${isNavy ? 'bg-white/10 text-gold ring-1 ring-white/20' : 'bg-navy/8 text-navy'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true" focusable="false">
            <path
              d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2a1 1 0 0 0 .84-.46l.92-1.53A1 1 0 0 1 9.3 3.5h5.4a1 1 0 0 1 .84.51l.92 1.53a1 1 0 0 0 .84.46h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="12.4" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>

        <span
          className={`max-w-[22ch] text-xs font-medium leading-relaxed ${
            isNavy ? 'text-white/70' : 'text-navy/70'
          }`}
        >
          {label}
        </span>

        {caption && (
          <span
            className={`text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${
              isNavy ? 'text-gold/80' : 'text-gold-dark'
            }`}
          >
            {caption}
          </span>
        )}
      </div>

      {/* A11y: expose the fact that a real photo is pending. */}
      <figcaption className="sr-only">
        {label}. Official photograph pending.
      </figcaption>
    </figure>
  );
}

/**
 * Image with a soft navy gradient scrim. Falls back to the branded
 * placeholder until a real `src` is provided.
 */
interface ImageWithOverlayProps {
  src?: string | null;
  /** Responsive WebP candidates. Lets the browser pick the right crop. */
  srcSet?: string;
  /** Intrinsic size, used to reserve space and avoid layout shift. */
  width?: number;
  height?: number;
  label: string;
  alt: string;
  className?: string;
  tone?: 'navy' | 'light';
  children?: React.ReactNode;
}

export function ImageWithOverlay({
  src,
  srcSet,
  width,
  height,
  label,
  alt,
  className = 'aspect-[4/3]',
  tone = 'navy',
  children,
}: ImageWithOverlayProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <ImagePlaceholder label={label} tone={tone} className="h-full w-full" />
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1024px) 560px, 100vw"
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      {children}
    </div>
  );
}

/** Small downward chevron used as a "scroll" affordance in heroes. */
export function ScrollHint({ label = 'Scroll to explore' }: { label?: string }) {
  return (
    <span className="inline-flex flex-col items-center gap-1.5 text-xs font-medium text-white/60">
      <span>{label}</span>
      <ChevronDown
        className="h-4 w-4 animate-scroll-hint motion-reduce:animate-none"
        aria-hidden="true"
      />
    </span>
  );
}
