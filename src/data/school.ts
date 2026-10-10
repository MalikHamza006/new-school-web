/**
 * Core identity, contact and navigation data for Spectral Model School & College.
 *
 * CONTENT POLICY
 * --------------
 * Only the values below marked `verified: true` were supplied by the school and
 * may be presented publicly as fact. Everything else is an explicit,
 * easily-editable placeholder. Never invent or infer school facts
 * (principal name, fees, board results, established year, rankings, etc.).
 */

export interface Address {
  street: string;
  area: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  /** Single-line address for display and structured data. */
  full: string;
}

export interface PhoneNumbers {
  /** Landline shown as the primary contact number. */
  primary: string;
  /** Mobile / WhatsApp number. */
  secondary: string;
}

export interface SocialLink {
  /** Network name, e.g. "Facebook". */
  label: string;
  /**
   * Public profile URL. `null` until the school provides the exact link —
   * we do not guess profile URLs from page names.
   */
  url: string | null;
  /** The name of the page as supplied, used while the URL is unknown. */
  handle: string;
}

export const schoolInfo = {
  name: 'Spectral Model School & College',
  /** Used in tight spaces such as the mobile navbar. */
  shortName: 'Spectral',
  /** Used in the footer / legal line. */
  legalName: 'Spectral Model School & College',

  address: {
    street: 'Qazi Park Rd',
    area: 'Qazi Park, Shahdara',
    city: 'Lahore',
    province: 'Punjab',
    country: 'Pakistan',
    postalCode: '54950',
    full: 'Qazi Park Rd, Qazi Park, Shahdara, Lahore, Punjab, Pakistan 54950',
  } satisfies Address,

  phone: {
    primary: '042-37932284',
    secondary: '0322-7595534',
  } satisfies PhoneNumbers,

  /**
   * No official email address was supplied. `null` keeps the UI from
   * displaying a fabricated address; add the real one here when available.
   */
  email: null as string | null,

  /** Existing website supplied by the school. */
  website: 'https://spectralcollege.com/',

  social: [
    {
      label: 'Facebook',
      url: null,
      handle: 'Spectral College, Lahore',
    },
  ] satisfies SocialLink[],

  /** Supplied in project brief. Safe to display. */
  googleRating: {
    score: 4.6,
    reviewCount: 36,
    /**
     * Google Maps place URL. The exact place ID was not supplied, so we link to
     * a maps search for the address rather than inventing a place link.
     */
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Spectral Model School and College, Qazi Park Rd, Shahdara, Lahore'),
    embedUrl:
      'https://www.google.com/maps?q=' +
      encodeURIComponent('Spectral Model School and College, Qazi Park Rd, Shahdara, Lahore') +
      '&output=embed',
  },

  /**
   * WhatsApp deep link built from the supplied mobile number.
   * The number is normalised to international format for wa.me.
   */
  whatsappUrl: `https://wa.me/92${'03227595534'.replace(/^0/, '')}`,

  /** Unconfirmed — do not display until the school confirms. */
  establishedYear: null as number | null,
  principalName: null as string | null,

  /** Supplied in project brief. */
  tagline: 'Shaping Bright Minds. Building Strong Futures.',
  description:
    'An institution committed to quality education, character development and preparing students for a successful future.',

  /**
   * Short description used in the footer and meta descriptions.
   * Supplied/derived from the brief, safe to publish.
   */
  shortDescription:
    'A school and college in Shahdara, Lahore focused on quality education, character development and student growth.',
} as const;

/** Absolute tel: href for the primary landline. */
export const primaryPhoneHref = `tel:${schoolInfo.phone.primary.replace(/[^0-9+]/g, '')}`;

/** Absolute tel: href for the secondary mobile. */
export const secondaryPhoneHref = `tel:${schoolInfo.phone.secondary.replace(/[^0-9+]/g, '')}`;

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary navigation. `Campus` and `Achievements` are top-level routes.
 * Kept intentionally short so the desktop bar never overcrowds.
 */
export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Campus', href: '/campus' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

/** Nav items shown in the mobile drawer (same set, kept in one place). */
export const mobileNavigation: NavItem[] = navigation;

export const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Events', href: '/events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ] satisfies NavItem[],

  admissions: [
    { label: 'Apply for Admission', href: '/admissions' },
    { label: 'Admission Inquiry', href: '/admissions#inquiry' },
    { label: 'Contact Admissions', href: '/contact' },
  ] satisfies NavItem[],

  explore: [
    { label: 'Campus', href: '/campus' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Academics', href: '/academics' },
    { label: 'AI Tools for Teachers', href: '/academics/ai-tools' },
  ] satisfies NavItem[],
};

export const seo = {
  title: 'Spectral Model School & College | Shahdara Lahore',
  titleTemplate: '%s | Spectral Model School & College',
  description:
    'Spectral Model School & College in Shahdara, Lahore, providing quality education and supporting students in their academic and personal development.',
  /** Absolute site origin used for canonical URLs. */
  siteUrl: 'https://spectralcollege.com',
  locale: 'en_PK',
} as const;
