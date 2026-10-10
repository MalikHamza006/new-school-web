import { schoolInfo, primaryPhoneHref, secondaryPhoneHref } from '../../data/school';
import { Button } from '../ui';
import { MapPin, Phone, MessageCircle, Navigation, Mail } from 'lucide-react';

/**
 * Address, phone, WhatsApp and an embedded map pointing at the supplied
 * school address. No other location data is used.
 */
export function ContactDetails({ className = '' }: { className?: string }) {
  const { address, phone } = schoolInfo;

  return (
    <div className={className}>
      <div className="space-y-7">
        {/* Address */}
        <div className="flex gap-4">
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy"
            aria-hidden="true"
          >
            <MapPin className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-navy">Campus Address</h3>
            <address className="mt-1 not-italic leading-relaxed text-ink-muted">
              {address.street}
              <br />
              {address.area}, {address.city}
              <br />
              {address.province}, {address.country} {address.postalCode}
            </address>
            <a
              href={schoolInfo.googleRating.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue underline-offset-4 transition-colors hover:text-navy hover:underline"
            >
              <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
              Get directions
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        {/* Phones */}
        <div className="flex gap-4">
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy"
            aria-hidden="true"
          >
            <Phone className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-navy">Phone</h3>
            <ul className="mt-1 space-y-1">
              <li>
                <a
                  href={primaryPhoneHref}
                  className="text-ink-muted transition-colors hover:text-blue"
                >
                  {phone.primary}
                </a>
                <span className="ml-2 text-xs text-ink-muted/70">(landline)</span>
              </li>
              <li>
                <a
                  href={secondaryPhoneHref}
                  className="text-ink-muted transition-colors hover:text-blue"
                >
                  {phone.secondary}
                </a>
                <span className="ml-2 text-xs text-ink-muted/70">(mobile)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex gap-4">
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy"
            aria-hidden="true"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-navy">WhatsApp</h3>
            <a
              href={schoolInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-ink-muted transition-colors hover:text-blue"
            >
              {phone.secondary}
              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
            <p className="mt-0.5 text-xs text-ink-muted">
              Fastest way to reach the admissions team.
            </p>
          </div>
        </div>

        {/* Email — only rendered if a real address exists */}
        {schoolInfo.email && (
          <div className="flex gap-4">
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy"
              aria-hidden="true"
            >
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-navy">Email</h3>
              <a
                href={`mailto:${schoolInfo.email}`}
                className="mt-1 block break-all text-ink-muted transition-colors hover:text-blue"
              >
                {schoolInfo.email}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" asChild fullWidth className="sm:w-auto">
          <a href={primaryPhoneHref}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call the School
          </a>
        </Button>
        <Button variant="outline" asChild fullWidth className="sm:w-auto">
          <a href={schoolInfo.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp Us
          </a>
        </Button>
      </div>
    </div>
  );
}

/**
 * Lazy-loaded Google Maps embed. Uses `loading="lazy"` so it never blocks
 * rendering or hurts the initial page load.
 */
export function MapEmbed({
  className = '',
  height = 'h-[22rem] sm:h-[26rem]',
  title = `Map showing the location of ${schoolInfo.name}`,
}: {
  className?: string;
  height?: string;
  title?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl card-base ${className}`}>
      <iframe
        src={schoolInfo.googleRating.embedUrl}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className={`w-full border-0 ${height}`}
      />
    </div>
  );
}
