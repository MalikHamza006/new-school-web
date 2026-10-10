import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import {
  footerLinks,
  primaryPhoneHref,
  schoolInfo,
  secondaryPhoneHref,
} from '../../data/school';
import { siteLogo } from '../../data/images';
import { FacebookIcon, WhatsAppIcon } from '../brand/BrandIcons';
import { Button } from '../ui';

// Fixed year per project requirements.
const currentYear = 2026;

export function Footer() {
  return (
    <footer className="on-dark bg-navy text-white print:hidden">
      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-page flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-display-sm text-white">
              Considering admission for your child?
            </h2>
            <p className="mt-1.5 text-white/65">
              Our admissions team is available to answer your questions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="accent" asChild>
              <Link to="/admissions">
                Apply for Admission
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="whitestroke" asChild>
              <a href={schoolInfo.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container-page grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-4">
          {/* The school's own logo, reversed to white for the navy footer */}
          <img
            src={siteLogo.inverseSrc}
            srcSet={siteLogo.inverseSrcSet}
            width={siteLogo.width}
            height={siteLogo.height}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-16 sm:h-20 w-auto max-w-[clamp(150px,15vw,220px)] object-contain"
          />
          <span className="sr-only">{schoolInfo.name}</span>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/65">
            {schoolInfo.shortDescription}
          </p>

          <address className="mt-7 space-y-4 not-italic">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-white">Campus Address</h3>
                <a
                  href={schoolInfo.googleRating.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-sm leading-relaxed text-white/65 transition-colors hover:text-gold-light"
                >
                  {schoolInfo.address.full}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-white">Phone</h3>
                <a
                  href={primaryPhoneHref}
                  className="mt-0.5 block text-sm text-white/65 transition-colors hover:text-gold-light"
                >
                  {schoolInfo.phone.primary}
                </a>
                <a
                  href={secondaryPhoneHref}
                  className="block text-sm text-white/65 transition-colors hover:text-gold-light"
                >
                  {schoolInfo.phone.secondary}
                </a>
              </div>
            </div>

            {schoolInfo.email && (
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Email</h3>
                  <a
                    href={`mailto:${schoolInfo.email}`}
                    className="mt-0.5 block text-sm break-all text-white/65 transition-colors hover:text-gold-light"
                  >
                    {schoolInfo.email}
                  </a>
                </div>
              </div>
            )}
          </address>
        </div>

        {/* Link columns */}
        <nav aria-label="Quick links" className="lg:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">
            Explore
          </h2>
          <ul className="mt-5 space-y-3">
            {footerLinks.quickLinks.map((link) => (
              <li key={link.href}>
                <FooterLink to={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Admissions" className="lg:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">
            Admissions
          </h2>
          <ul className="mt-5 space-y-3">
            {footerLinks.admissions.map((link) => (
              <li key={link.href}>
                <FooterLink to={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More" className="lg:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">
            Campus
          </h2>
          <ul className="mt-5 space-y-3">
            {footerLinks.explore.map((link) => (
              <li key={link.href}>
                <FooterLink to={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">
            Connect
          </h2>
          <ul className="mt-5 space-y-3">
            {/* Only verified profiles are rendered as links. */}
            {schoolInfo.social.map((social) =>
              social.url ? (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-gold-light"
                  >
                    <FacebookIcon className="h-4 w-4" />
                    {social.label}
                    <ArrowUpRight className="h-3 w-3 opacity-60" aria-hidden="true" />
                  </a>
                </li>
              ) : (
                <li
                  key={social.label}
                  className="flex items-center gap-2 text-sm text-white/65"
                >
                  <FacebookIcon className="h-4 w-4 shrink-0" />
                  <span>
                    {social.handle}
                    <span className="sr-only"> on Facebook</span>
                  </span>
                </li>
              )
            )}
            <li>
              <a
                href={schoolInfo.googleRating.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-gold-light"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Find us on Google Maps
                <ArrowUpRight className="h-3 w-3 opacity-60" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/55">
            © {currentYear} {schoolInfo.legalName}. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            {schoolInfo.address.city}, {schoolInfo.address.province} {schoolInfo.address.postalCode}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-sm text-white/65 transition-colors duration-200 hover:text-gold-light"
    >
      {children}
    </Link>
  );
}
