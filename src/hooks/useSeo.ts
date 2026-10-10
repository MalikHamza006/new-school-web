import { useEffect } from 'react';
import { schoolInfo, seo } from '../data/school';

interface SeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/about". Used to build the canonical URL. */
  path?: string;
  /** Suppress indexing for utility pages such as 404. */
  noIndex?: boolean;
  /** JSON-LD structured data for this page. */
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

/**
 * Applies per-page document metadata: title, description, canonical URL,
 * Open Graph, Twitter card and optional JSON-LD structured data.
 *
 * React Router does not render a <head>, so this keeps the SPA's SEO correct
 * as the user navigates. Every tag is upserted (never duplicated).
 */
export function useSeo({ title, description, path = '/', noIndex = false, structuredData }: SeoOptions) {
  useEffect(() => {
    const fullTitle = path === '/' ? seo.title : title;
    const canonical = `${seo.siteUrl}${path === '/' ? '' : path}`;
    const url = canonical;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    );

    upsertLink('canonical', canonical);

    // Open Graph
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', schoolInfo.name);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', seo.locale);

    // Twitter
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    // JSON-LD
    const existing = document.getElementById('page-structured-data');
    if (existing) existing.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-structured-data';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById('page-structured-data')?.remove();
    };
  }, [title, description, path, noIndex, structuredData]);
}

/**
 * Site-wide EducationalOrganization / LocalBusiness schema.
 * Contains ONLY verified facts: name, address, phone numbers and the
 * supplied Google rating. No founding date, credentials or claims are added.
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${seo.siteUrl}/#organization`,
    name: schoolInfo.name,
    alternateName: 'Spectral College',
    url: seo.siteUrl,
    description: seo.description,
    telephone: [schoolInfo.phone.primary, schoolInfo.phone.secondary],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${schoolInfo.address.street}, ${schoolInfo.address.area}`,
      addressLocality: schoolInfo.address.city,
      addressRegion: schoolInfo.address.province,
      postalCode: schoolInfo.address.postalCode,
      addressCountry: 'PK',
    },
    areaServed: {
      '@type': 'City',
      name: schoolInfo.address.city,
    },
    /* No `aggregateRating` here on purpose.
       Google requires that anything marked up in structured data is also
       visible to the user on the page. The "Community Reviews" section was
       removed at the school's request, so the score and review count are no
       longer shown anywhere — and emitting the markup for invisible content
       is a guidelines violation that can cost the whole site's rich results,
       not just this one property. The figures are still in `school.ts`
       (`googleRating.score` / `.reviewCount`) and the Google Maps link is
       still live in the footer, contact block and hero, so putting the section
       back is a one-line change in `buildOrganizationSchema`. */
    sameAs: schoolInfo.social
      .map((social) => social.url)
      .filter((url): url is NonNullable<typeof url> => Boolean(url)),
  };
}

/** BreadcrumbList schema for an interior page. */
export function buildBreadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seo.siteUrl}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/** Wraps one or more schema objects into a single @graph payload. */
export function buildGraph(...nodes: Array<Record<string, unknown>>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
