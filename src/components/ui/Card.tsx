import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export type CardVariant = 'base' | 'interactive' | 'outline' | 'dark';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Stretch to the full height of a CSS grid/flex row. */
  fullHeight?: boolean;
}

/**
 * Card variants.
 *
 * None of them draw a border. Borders were removed site-wide because a wall of
 * 1px outlines reads as a wireframe; separation comes from the shadow and the
 * soft tint gradient baked into `card-base`. `outline` is kept as an alias of
 * `base` so existing call sites keep working without a line appearing.
 */
const cardVariantMap: Record<CardVariant, string> = {
  base: 'card-base',
  interactive: 'card-interactive',
  outline: 'card-base',
  dark: 'card-on-dark',
};

const cardPaddingMap: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-7 sm:p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'base', padding = 'md', fullHeight = false, className = '', children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={[
        cardVariantMap[variant],
        cardPaddingMap[padding],
        fullHeight ? 'h-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* CardHeader / CardTitle / CardBody / CardFooter                      */
/* ------------------------------------------------------------------ */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  centered?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { centered = false, className = '', children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 ${centered ? 'items-center text-center' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4';
  /** Muted styling for cards on navy backgrounds. */
  onDark?: boolean;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Heading = 'h3', onDark = false, className = '', children, ...props },
  ref
) {
  return (
    <Heading
      ref={ref}
      className={`text-display-sm ${onDark ? 'text-white' : 'text-navy'} ${className}`}
      {...props}
    >
      {children}
    </Heading>
  );
});

export interface CardBodyProps extends HTMLAttributes<HTMLParagraphElement> {
  onDark?: boolean;
}

export const CardBody = forwardRef<HTMLParagraphElement, CardBodyProps>(function CardBody(
  { onDark = false, className = '', children, ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={`text-[0.975rem] leading-relaxed ${onDark ? 'text-white/70' : 'text-ink-muted'} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  centered?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { centered = false, className = '', children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`mt-auto pt-2 ${centered ? 'flex justify-center' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* IconTile — shared icon container for feature/program cards          */
/* ------------------------------------------------------------------ */

export interface IconTileProps {
  children: ReactNode;
  tone?: 'navy' | 'gold' | 'blue' | 'onDark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const tileToneMap = {
  navy: 'bg-navy/8 text-navy',
  blue: 'bg-blue/10 text-blue',
  gold: 'bg-gold/15 text-gold-dark',
  onDark: 'bg-white/10 text-gold-light',
} as const;

const tileSizeMap = {
  sm: 'h-10 w-10 rounded-lg',
  md: 'h-12 w-12 rounded-xl',
  lg: 'h-14 w-14 rounded-xl',
} as const;

export function IconTile({ children, tone = 'navy', size = 'md', className = '' }: IconTileProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${tileToneMap[tone]} ${tileSizeMap[size]} ${className}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
