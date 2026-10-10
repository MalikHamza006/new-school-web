import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteLogo } from '../../data/images';

export interface WelcomeSplashProps {
  /**
   * Show the splash only on the first visit of a browser session.
   *
   * The brief asks for it "when the web loads", so this defaults to `false`
   * and the splash plays on every full page load. Set to `true` if a splash on
   * every refresh becomes tiring during development.
   */
  oncePerSession?: boolean;
}

const SESSION_KEY = 'spectral.splash.seen';

/** Total on-screen time before the exit animation starts. */
const HOLD_MS = 1250;

/**
 * Full-screen welcome splash / preloader.
 *
 * Plays on first load: a deep navy-blue gradient, the school's own logo, and an
 * animated "Welcome to Spectral Model School & College" reveal over a gold progress sweep.
 * Smooth, branded, fast, non-blocking.
 */
export function WelcomeSplash({ oncePerSession = false }: WelcomeSplashProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (oncePerSession && window.sessionStorage.getItem(SESSION_KEY) === '1') {
      return false;
    }
    return true;
  });

  // Mark as seen, then dismiss after the hold time.
  useEffect(() => {
    if (!visible) return;

    if (oncePerSession) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Private browsing fallback
      }
    }

    const timer = window.setTimeout(() => setVisible(false), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [visible, oncePerSession]);

  // Prevent scrolling behind the splash while it is up.
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">
        {visible ? 'Loading Spectral Model School & College' : ''}
      </p>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="welcome-splash"
            aria-hidden="true"
            onClick={() => setVisible(false)}
            className="on-dark fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-navy select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.03, filter: 'blur(4px)' }
            }
            transition={{ duration: reduceMotion ? 0.2 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient deep navy-to-blue radial wash */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(110% 110% at 50% 12%, #174EA6 0%, #0B1F3A 60%, #040A16 100%)',
              }}
            />

            {/* Subtle revolving orbital gold ring */}
            <motion.div
              className="absolute h-72 w-72 rounded-full border border-gold/20 sm:h-96 sm:w-96"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            >
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_8px_#D4A72C]" />
            </motion.div>

            {/* Content */}
            <div className="relative flex flex-col items-center px-6 text-center">
              {/* Responsive Prominent Logo */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-[clamp(145px,17vw,235px)] items-center justify-center"
              >
                <img
                  src={siteLogo.inverseSrc}
                  srcSet={siteLogo.inverseSrcSet}
                  width={siteLogo.width}
                  height={siteLogo.height}
                  alt="Spectral Model School &amp; College"
                  decoding="sync"
                  fetchPriority="high"
                  className="w-full h-auto object-contain drop-shadow-[0_6px_22px_rgba(0,0,0,0.45)]"
                />
              </motion.div>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-white/65"
              >
                Welcome to
              </motion.p>

              <motion.h2
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
              >
                Spectral Model School &amp; College
              </motion.h2>

              {/* Gold accent line */}
              <motion.span
                className="mt-4 block h-1 w-24 rounded-full bg-gold sm:w-32"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />

              <motion.p
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-4 text-xs font-medium tracking-wide text-white/50 sm:text-sm"
              >
                Qazi Park, Shahdara, Lahore
              </motion.p>
            </div>

            {/* Bottom Progress Bar */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-1 origin-left bg-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: reduceMotion ? 0.3 : HOLD_MS / 1000,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
