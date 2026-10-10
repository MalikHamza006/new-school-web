/**
 * shadcn/ui + Radix primitives, restyled for Spectral's navy & gold system.
 *
 * These components are *copied into* the repo rather than installed as a
 * dependency, which is how shadcn is designed to work: you own the source and
 * can restyle it. Every file here has been changed away from shadcn's default
 * grey/neutral theme onto this project's tokens.
 *
 * Radix supplies the accessibility behaviour that is hard to get right by hand:
 * focus trapping, `aria-expanded` wiring, keyboard navigation and roving
 * tabindex. Nothing in this folder should be rewritten to drop Radix — only
 * the presentation layer is ours.
 *
 * Note on borders: the site's cards are borderless by design (see
 * `card-base` in index.css). Components here therefore reach for shadow and
 * fill for separation, and only genuine form controls keep a 1px `border-input`.
 */

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, X } from 'lucide-react';

import { cn } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card-base', className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-lg font-semibold text-navy', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-relaxed text-ink-muted', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-navy text-white',
        gold: 'bg-gold/15 text-gold-dark',
        muted: 'bg-navy-50 text-ink-muted',
        outline: 'bg-white text-navy shadow-lift',
        onDark: 'bg-white/10 text-gold-light',
      },
      size: {
        sm: 'px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.1em]',
        md: 'px-3 py-1.5 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'sm' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/* Accordion                                                           */
/* ------------------------------------------------------------------ */

/**
 * Radix supplies the keyboard and ARIA wiring. The trigger is a flat row that
 * gains a tinted fill on hover — no outline, matching the borderless card
 * language used across the site.
 */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        'overflow-hidden rounded-2xl bg-white shadow-lift transition-shadow duration-300',
        className
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex flex-1 items-center justify-between gap-4 p-5 text-left font-display text-base font-semibold text-navy transition-colors hover:bg-navy-50/60 sm:p-6 sm:text-lg',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="size-5 shrink-0 text-gold-dark transition-transform duration-300 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6 sm:pb-6', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog                                                              */
/* ------------------------------------------------------------------ */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Set false when the content renders its own close control. */
  showClose?: boolean;
  /** Style the scrim. `solid` is for image viewers, `navy` for menus. */
  overlayClassName?: string;
}

export function DialogContent({
  className,
  children,
  showClose = true,
  overlayClassName,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          // Opaque navy rather than a translucent blurred wash: a blur behind
          // the lightbox was softening the image being viewed.
          'fixed inset-0 z-[100] bg-navy-950/98 data-[state=open]:animate-fade-in',
          overlayClassName
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-navy-950 shadow-lift-lg focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-display text-lg font-semibold text-white', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-white/70', className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-navy-50 p-1.5',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-ink-muted transition-all duration-200 hover:text-navy data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-lift motion-reduce:transition-none',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-8 focus-visible:outline-none', className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Form primitives                                                     */
/* ------------------------------------------------------------------ */

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-semibold text-navy peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
        className
      )}
      {...props}
    />
  );
});

const fieldBase =
  'w-full rounded-xl bg-white px-4 py-3 text-sm text-ink shadow-lift transition-shadow duration-200 placeholder:text-ink-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-60';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
  }
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(fieldBase, 'resize-y', className)} {...props} />;
});

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-3', className)} {...props} />;
});

export function RadioGroupItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'size-5 rounded-full border-2 border-navy-300 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue data-[state=checked]:border-navy data-[state=checked]:bg-navy',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="size-2 rounded-full bg-white" aria-hidden="true" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
