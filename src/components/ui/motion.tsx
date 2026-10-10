import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Shared Framer Motion primitives.
 *
 * Every animation here is gated behind `useReducedMotion` so visitors who have
 * asked their OS to reduce motion get instant, non-moving content instead.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
};

/** Parent wrapper that staggers its children's entrance. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating in. */
  delay?: number;
  /** Element or component to render as. */
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'p' | 'span' | 'ul' | 'dl' | 'figure';
}

/**
 * Scroll-reveal wrapper. Animates once when it enters the viewport.
 * `amount` is kept low so tall sections still trigger promptly.
 */
export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: 'div' | 'ul' | 'ol';
}

/**
 * Staggers direct `Reveal`-style children. Pair with `StaggerItem`.
 */
export function Stagger({ children, className = '', stagger = 0.08, delay = 0, as = 'div' }: StaggerProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </Component>
  );
}

/** Child of `Stagger` — inherits the parent's animation state. */
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export { EASE as motionEase };
