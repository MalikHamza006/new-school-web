import { useState, useCallback, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HeroImageId } from '../../data/images';
import { heroImages } from '../../data/images';

export interface HeroSequenceBackdropProps {
  /**
   * Photographs to cycle through, in order. The first entry is the one that
   * belongs to the current page, so a visitor always sees a relevant photo
   * first; the rest follow in manifest order.
   */
  sequence: readonly HeroImageId[];
  /** Directional scrim strength — see `HeroBackdrop`. */
  scrim?: 'light' | 'medium' | 'strong';
  /** Milliseconds each photograph is held. */
  intervalMs?: number;
  /** Set on above-the-fold heroes so the LCP image is not deferred. */
  priority?: boolean;
  className?: string;
  /**
   * Controlled active index. Supplying this (together with
   * `onActiveIndexChange`) puts the component in controlled mode, which is what
   * lets a visitor click an indicator to jump to a photograph.
   */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

const scrimMap = {
  light:
    'bg-[linear-gradient(100deg,rgba(4,10,22,0.82)_0%,rgba(4,10,22,0.55)_38%,rgba(4,10,22,0.18)_68%,rgba(4,10,22,0.05)_100%)]',
  medium:
    'bg-[linear-gradient(100deg,rgba(4,10,22,0.78)_0%,rgba(4,10,22,0.48)_42%,rgba(4,10,22,0.14)_72%,rgba(4,10,22,0)_100%)]',
  strong:
    'bg-[radial-gradient(78%_62%_at_38%_50%,rgba(4,10,22,0.72)_0%,rgba(4,10,22,0.42)_55%,rgba(4,10,22,0.08)_100%)]',
} as const;

/**
 * Rotating photographic backdrop for interior page heroes.
 *
 * Every hero on the site now runs the same idea as the homepage: one
 * photograph at a time, cross-fading, drawn from the school's own set. The
 * page's own photo is always first, so the hero is never irrelevant to the
 * page it heads.
 *
 * Two things this deliberately does NOT do, both of which caused the softness
 * that used to plague the heroes:
 *
 * 1. No blur and no low-resolution placeholder layer. A thumbnail mounted
 *    underneath is part of the frame during every decode and across the whole
 *    cross-fade, which is exactly what made the photo look permanently soft.
 *    A slide is instead held at opacity 0 until its bytes are decoded, so the
 *    navy background shows for a moment instead of a blurry picture.
 * 2. No box/grid texture over the photo.
 *
 * `alt=""` throughout: these are decorative backgrounds, and the hero heading
 * already carries the meaning.
 */
export function HeroSequenceBackdrop({
  sequence,
  scrim = 'medium',
  intervalMs = 7000,
  priority = false,
  className = '',
  activeIndex,
  onActiveIndexChange,
}: HeroSequenceBackdropProps) {
  const reduceMotion = useReducedMotion();
  const [internalIndex, setInternalIndex] = useState(0);
  const [decoded, setDecoded] = useState<Record<string, boolean>>({});

  // Controlled when the parent passes an index, uncontrolled otherwise. Both
  // paths go through `setIndex`, so the auto-advance and the indicator clicks
  // can never disagree about which photograph is showing.
  const isControlled = activeIndex !== undefined;
  const index = isControlled ? activeIndex : internalIndex;

  const setIndex = useCallback(
    (next: number) => {
      if (!isControlled) setInternalIndex(next);
      onActiveIndexChange?.(next);
    },
    [isControlled, onActiveIndexChange]
  );

  // Guard against an empty or single-entry sequence: with nothing to rotate
  // there is no reason to mount an interval at all.
  const hasSequence = sequence.length > 1;
  const canAutoAdvance = hasSequence && !reduceMotion;

  const markDecoded = useCallback((id: string) => {
    setDecoded((previous) => (previous[id] ? previous : { ...previous, [id]: true }));
  }, []);

  /*
   * Warm the remaining photographs shortly after first paint.
   *
   * Sequential timeouts rather than all at once: the hero photo is the LCP
   * element, and kicking off four full-size fetches in the same tick competes
   * with it for bandwidth and can delay the thing the visitor is actually
   * looking at.
   */
  useEffect(() => {
    const timers = sequence.slice(1).map((id, position) =>
      window.setTimeout(
        () => {
          const preloader = new Image();
          preloader.onload = () => markDecoded(id);
          preloader.onerror = () => markDecoded(id);
          preloader.src = heroImages[id].fallbackSrc;
        },
        600 + position * 400
      )
    );

    return () => timers.forEach(window.clearTimeout);
  }, [sequence, markDecoded]);

  useEffect(() => {
    if (!canAutoAdvance) return;
    const timer = window.setInterval(() => {
      setIndex((index + 1) % sequence.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [canAutoAdvance, intervalMs, sequence.length, index, setIndex]);

  // Clamp in case the sequence shrinks between renders.
  const active = index < sequence.length ? index : 0;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 -z-20 overflow-hidden ${className}`}
    >
      {sequence.map((id, position) => {
        const image = heroImages[id];
        const isActive = position === active;
        // The first photograph is the LCP candidate. Later ones are mounted
        // eagerly too, because hiding them with `loading="lazy"` while they are
        // already in the viewport layer defeats the decode gate below.
        const isFirst = position === 0;

        return (
          <motion.img
            key={id}
            src={image.fallbackSrc}
            srcSet={image.srcSet}
            sizes="100vw"
            width={image.width}
            height={image.height}
            alt=""
            aria-hidden="true"
            loading={isFirst && priority ? 'eager' : 'lazy'}
            fetchPriority={isFirst && priority ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => markDecoded(id)}
            onError={() => markDecoded(id)}
            ref={(node) => {
              // A cached image can finish before React attaches onLoad.
              if (node?.complete) markDecoded(id);
            }}
            initial={false}
            animate={
              isActive && decoded[id]
                ? { opacity: 1, scale: reduceMotion ? 1 : [1, 1.04] }
                : { opacity: 0, scale: 1 }
            }
            transition={{
              opacity: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
              scale: {
                duration: reduceMotion ? 0 : intervalMs / 1000,
                ease: 'linear',
              },
            }}
            className="absolute inset-0 h-full w-full origin-center object-cover will-change-transform"
          />
        );
      })}

      <div className={`absolute inset-0 ${scrimMap[scrim]}`} />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy/85 to-transparent" />
    </div>
  );
}
