import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Button, Container, Reveal, SectionHeading } from '../ui';
import {
  primaryPhoneHref,
  schoolInfo,
  secondaryPhoneHref,
} from '../../data/school';

interface CTAAction {
  label: string;
  to?: string;
  href?: string;
}

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primary?: CTAAction;
  secondary?: CTAAction;
  /** Also render the call + WhatsApp shortcuts. */
  showContactShortcuts?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Reusable closing call-to-action band used at the bottom of most pages.
 */
export function CTASection({
  eyebrow = 'Admissions Open',
  title,
  description,
  primary,
  secondary,
  showContactShortcuts = true,
  children,
  className = '',
}: CTASectionProps) {
  return (
    <section className={`on-dark relative isolate overflow-hidden bg-navy ${className}`} aria-labelledby="cta-heading">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(110%_130%_at_85%_10%,#174EA6_0%,#0B1F3A_50%,#081428_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-gold/[0.07]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -right-24 -z-10 h-80 w-80 rounded-full bg-blue/10"
      />

      <Container className="py-section-sm md:py-section">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow eyebrow-light justify-center">{eyebrow}</p>
            <h2 id="cta-heading" className="text-display-lg text-white">
              {title}
            </h2>
            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {description}
              </p>
            )}
          </Reveal>

          {(primary || secondary) && (
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                {primary &&
                  (primary.to ? (
                    <Button variant="accent" size="lg" asChild className="w-full sm:w-auto">
                      <Link to={primary.to}>
                        {primary.label}
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="accent" size="lg" asChild className="w-full sm:w-auto">
                      <a href={primary.href}>
                        {primary.label}
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </a>
                    </Button>
                  ))}

                {secondary &&
                  (secondary.to ? (
                    <Button variant="whitestroke" size="lg" asChild className="w-full sm:w-auto">
                      <Link to={secondary.to}>{secondary.label}</Link>
                    </Button>
                  ) : (
                    <Button variant="whitestroke" size="lg" asChild className="w-full sm:w-auto">
                      <a href={secondary.href}>{secondary.label}</a>
                    </Button>
                  ))}
              </div>
            </Reveal>
          )}

          {showContactShortcuts && (
            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-7">
                <span className="text-sm text-white/55">Prefer to talk to us?</span>
                <a
                  href={primaryPhoneHref}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-gold-light"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {schoolInfo.phone.primary}
                </a>
                <span aria-hidden="true" className="hidden h-4 w-px bg-white/15 sm:block" />
                <a
                  href={schoolInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-gold-light"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp {schoolInfo.phone.secondary}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <a href={secondaryPhoneHref} className="sr-only">
                  Call {schoolInfo.phone.secondary}
                </a>
              </div>
            </Reveal>
          )}

          {children}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SectionIntro — a compact heading block for mid-page sections         */
/* ------------------------------------------------------------------ */

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'left',
  id,
  withRule,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  id?: string;
  withRule?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        align={align}
        id={id}
        withRule={withRule ?? align === 'left'}
      />
    </Reveal>
  );
}
