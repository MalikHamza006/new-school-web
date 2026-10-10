import { Container, NotFoundContent, HeroSequenceBackdrop } from '../components';
import { schoolInfo } from '../data';
import { pageHeroSequence } from '../data/images';
import { useSeo } from '../hooks/useSeo';

export function NotFoundPage() {
  useSeo({
    title: `Page Not Found | ${schoolInfo.name}`,
    description: 'The page you are looking for could not be found.',
    path: '/404',
    noIndex: true,
  });

  return (
    <section
      className="on-dark relative isolate flex min-h-[80svh] items-center overflow-hidden bg-navy pb-20 pt-32"
      aria-labelledby="notfound-heading"
    >
      {/* Rotates like every other hero, so a mistyped URL still lands on a
          photograph of the school rather than a flat navy panel. */}
      <HeroSequenceBackdrop sequence={pageHeroSequence.contact} scrim="strong" priority />

      <Container className="relative">
        <NotFoundContent tone="dark" />
      </Container>
    </section>
  );
}
