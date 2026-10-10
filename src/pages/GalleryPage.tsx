import {
  Container,
  PageHero,
  Section,
  Reveal,
  GalleryGrid,
  CTASection,
} from '../components';
import { galleryImages, galleryCategories, schoolInfo } from '../data';
import { useSeo, buildOrganizationSchema, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';

const PAGE_SCHEMA = buildGraph(
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
  ])
);

export function GalleryPage() {
  useSeo({
    title: `Photo Gallery | ${schoolInfo.name}`,
    description: `Browse official photographs of the campus at ${schoolInfo.name}, Shahdara, Lahore.`,
    path: '/gallery',
    structuredData: PAGE_SCHEMA,
  });

  return (
    <>
      <PageHero
        heroKey="gallery"
        eyebrow="Gallery"
        title="Life at Spectral, in Pictures"
        description="A visual tour of the school campus at Qazi Park, Shahdara, Lahore."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Gallery' },
        ]}
      />

      <Section tone="canvas" aria-labelledby="gallery-heading">
        <Container>
          <h2 id="gallery-heading" className="sr-only">
            Photo gallery
          </h2>

          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm leading-relaxed text-ink-muted">
              Official photographs of Spectral Model School &amp; College in Shahdara, Lahore.
              Filter by category below and select any photograph to view it in full resolution.
            </p>
          </Reveal>

          <GalleryGrid
            images={galleryImages}
            categories={galleryCategories}
            emptyMessage="No images have been published in this category yet."
          />
        </Container>
      </Section>

      <CTASection
        eyebrow="See It in Person"
        title="Pictures Only Tell Part of the Story"
        description="The best way to understand the school is to visit. Contact the office to arrange a campus tour."
        primary={{ label: 'Arrange a Visit', to: '/contact' }}
        secondary={{ label: 'Apply for Admission', to: '/admissions' }}
      />
    </>
  );
}
