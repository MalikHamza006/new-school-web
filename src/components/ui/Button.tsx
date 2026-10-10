import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'whitestroke';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  /**
   * Render the child element (usually a react-router `Link` or an `<a>`)
   * instead of a `<button>`, while inheriting all button styling.
   * The single child must be able to accept className / ref.
   */
  asChild?: boolean;
}

const baseStyles =
  'group relative inline-flex items-center justify-center gap-2 font-medium rounded-xl ' +
  'whitespace-nowrap ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-px';

/*
 * Variant system.
 *
 * Flat by design: no layered shadows on buttons. Hierarchy is carried by fill
 * colour alone, which keeps a row of actions calm and consistent. `secondary`
 * and `outline` are deliberately the same soft navy tint — the old hard navy
 * 1px border on `outline` read as a wireframe and is gone. `whitestroke` is a
 * translucent white fill for navy bands, also borderless.
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-navy text-white hover:bg-blue focus-visible:ring-blue focus-visible:ring-offset-white',
  secondary:
    'bg-navy-50 text-navy hover:bg-navy-100 focus-visible:ring-navy',
  accent:
    'bg-gold text-navy hover:bg-gold-dark focus-visible:ring-gold',
  outline:
    'bg-navy-50 text-navy hover:bg-navy-100 focus-visible:ring-navy',
  ghost:
    'bg-transparent text-navy hover:bg-navy/5 focus-visible:ring-navy',
  /** For use on dark navy backgrounds. */
  whitestroke:
    'bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-6 py-3 text-base sm:text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    asChild = false,
    className = '',
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {isLoading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-25"
          />
          <path
            d="M4 12a8 8 0 018-8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {/*
        The label is its own span so that `gap-2` on the flex container actually
        reaches the icon, and so a long label can be contained instead of
        spilling out of the button.

        `truncate` is the important half. `whitespace-nowrap` stops the text
        wrapping, but a nowrap'd inline child still overflows its box — which
        painted label text straight over whatever sat beside the button. Paired
        with `min-w-0` (the span is a flex item, and flex items refuse to shrink
        below their content by default) the label now ellipsises within the
        button rather than overlapping it.
      */}
      <span className="min-w-0 truncate">{children}</span>
      {!isLoading && rightIcon}
    </>
  );

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error('<Button asChild> expects a single React element as its child.');
    }
    const child = children as React.ReactElement<{
      className?: string;
      'aria-busy'?: boolean | 'true' | 'false';
    }>;
    return cloneElement(child, {
      className: [classes, child.props.className].filter(Boolean).join(' '),
      'aria-busy': isLoading || undefined,
    });
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {content}
    </button>
  );
});
