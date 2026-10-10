import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll management on route change.
 *
 * - Navigating to a new route scrolls to the top.
 * - Navigating to a hash (e.g. /academics#college) scrolls that section into
 *   view, offset by the fixed navbar height.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target element exists after the route renders.
      const id = hash.slice(1);
      const timer = window.setTimeout(() => {
        const target = document.getElementById(id);
        if (!target) return;

        const navOffset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      }, 60);

      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}
