import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../shadcn/primitives';

export interface LightboxItem {
  src: string | null;
  alt: string;
  /** Label shown under the image. */
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Accessible image lightbox.
 *
 * Focus trapping, `aria-modal`, the labelled dialog role and Escape-to-close
 * all come from the shadcn/Radix `Dialog` primitives. Radix also restores focus
 * to the trigger on close and locks background scroll, which the previous
 * hand-rolled version had to do by hand and did inconsistently.
 *
 * This component keeps only what Radix does not provide: previous/next
 * navigation, arrow-key paging, touch swipe, neighbour preloading, and the
 * animated image transition.
 */
export function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const isOpen = index !== null;
  const reduceMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const count = items.length;

  const goPrev = useCallback(() => {
    if (index === null || count === 0) return;
    onIndexChange((index - 1 + count) % count);
  }, [index, count, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null || count === 0) return;
    onIndexChange((index + 1) % count);
  }, [index, count, onIndexChange]);

  // Arrow keys page through images. Escape is handled by Radix.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, goPrev, goNext]);

  // Preload neighbours so navigation feels instant.
  useEffect(() => {
    if (!isOpen || index === null) return;
    [items[(index + 1) % count], items[(index - 1 + count) % count]].forEach((item) => {
      if (item?.src) new Image().src = item.src;
    });
  }, [isOpen, index, items, count]);

  if (typeof document === 'undefined' || index === null || !items[index]) return null;

  const current = items[index];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[92svh] flex-col border-0 bg-transparent p-0 shadow-none"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (startX === null || endX === undefined) return;
          const delta = endX - startX;
          // 50px threshold avoids accidental swipes.
          if (Math.abs(delta) < 50) return;
          if (delta < 0) goNext();
          else goPrev();
        }}
      >
        <DialogTitle className="sr-only">
          Image {(index + 1).toString()} of {count}
        </DialogTitle>
        <DialogDescription className="sr-only">{current.alt}</DialogDescription>

        {/* Counter */}
        <p
          className="shrink-0 px-4 py-4 text-sm font-medium tabular-nums text-white/70 sm:px-6"
          aria-live="polite"
        >
          {index + 1} / {count}
        </p>

        {/* Image */}
        <div className="flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${current.src ?? 'ph'}-${index}`}
              src={current.src ?? undefined}
              alt={current.alt}
              className="max-h-full max-w-full rounded-xl object-contain shadow-lift-lg"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.22 }}
            />
          </AnimatePresence>
        </div>

        {/* Caption + controls */}
        <div className="shrink-0 px-4 pb-6 pt-4 sm:px-6">
          <p className="mx-auto max-w-2xl text-center text-sm text-white/75">
            {current.caption ?? current.alt}
          </p>

          {count > 1 && (
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
