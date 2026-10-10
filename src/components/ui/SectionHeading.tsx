import { type ElementType, type ReactNode } from 'react';

export interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Heading level. Set to match the page outline — h2 for sections, h1 for page heroes. */
  as?: ElementType;
  /** Applied to the heading element, for `aria-labelledby` on a parent <section>. */
  id?: string;
  /** Renders the title in white, for use on navy backgrounds. */
  onDark?: boolean;
  className?: string;
  /** Renders a gold rule under the title. */
  withRule?: boolean;
}

const alignMap = {
  left: 'text-left items-start',
  center: 'text-center items-center mx-auto',
} as const;

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
  id,
  onDark = false,
  className = '',
  withRule = false,
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col ${alignMap[align]} ${className}`}>
      {eyebrow && (
        <p className={`eyebrow ${onDark ? 'eyebrow-light' : ''}`}>{eyebrow}</p>
      )}

      <Heading id={id} className={`text-display-lg ${onDark ? 'text-white' : 'text-navy'}`}>
        {title}
      </Heading>

      {withRule && <span className="gold-rule mt-5" aria-hidden="true" />}

      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${
            onDark ? 'text-white/75' : 'text-ink-muted'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
