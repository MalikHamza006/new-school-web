import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageCircle, MapPin } from 'lucide-react';
import { Button, Container, Reveal, ImageWithOverlay, WelcomeAudioExperience } from '../components';
import { ScrollHint } from '../components/ui/ImagePlaceholder';
import { schoolInfo, heroImages, homeHeroSequence } from '../data';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { heroSlideChanged } from '../store/uiSlice';

/** How long each hero photograph stays on screen. */
const SLIDE_MS = 6000;

/**
 * Cinematic home hero.
 *
 * Copy is centred over a full-bleed photograph, so there are no statistics,
 * student counts or result figures anywhere in this section — none have been
 * supplied by the school.
 *
 * The backdrop rotates through the school's own photographs, downloaded from
 * spectralcollege.com. Rotation pauses for reduced-motion users, who see a
 * single static frame instead.
 */
export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const dispatch = useAppDispatch();

  // Which photograph is showing lives in Redux rather than local state: the
  // hero writes it on every auto-advance, and the indicator controls below read
  // and set it. Two separate `useState` copies of "current slide" would be a
  // classic source of indicator/photo desync.
  const slide = useAppSelector((state) => state.ui.heroSlide);

  // Per-image decode status stays local — it is only ever read by this one
  // component, so there is nothing to share and no reason to put it in the store.
  const [decoded, setDecoded] = useState<Record<string, boolean>>({});

  // A slide is only shown once its bytes are actually decoded. Without this the
  // cross-fade reveals a half-loaded photo and the background visibly softens
  // on every change.
  const markDecoded = useCallback((id: string) => {
    setDecoded((previous) => (previous[id] ? previous : { ...previous, [id]: true }));
  }, []);

  // Fetch and decode every slide shortly after first paint, so switching later
  // is instant and never falls back to the placeholder.
  useEffect(() => {
    const timers = homeHeroSequence.slice(1).map((id, index) =>
      window.setTimeout(
        () => {
          const preloader = new Image();
          preloader.onload = () => markDecoded(id);
          preloader.onerror = () => markDecoded(id);
          preloader.src = heroImages[id].fallbackSrc;
        },
        500 + index * 400
      )
    );

    return () => timers.forEach(window.clearTimeout);
  }, [markDecoded]);

  // Auto-advance. Disabled for reduced motion so nothing moves on its own.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      dispatch(heroSlideChanged((slide + 1) % homeHeroSequence.length));
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion, dispatch, slide]);

  return (
    <section
      className="on-dark relative isolate flex min-h-[92svh] items-center overflow-hidden bg-navy pb-24 pt-28 sm:min-h-[88svh] lg:min-h-[92svh] lg:pb-32 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      {/*
        No blur-up layer here on purpose.

        A 16px thumbnail permanently mounted underneath — even at `blur-md` —
        is what made the hero look soft: the placeholder is part of the frame
        during every decode and across the whole cross-fade. Since the hero sits
        on `bg-navy`, a brief flat navy while the photo loads is a far better
        failure mode than a permanently fuzzy picture. The slide is also held at
        opacity 0 until its bytes are decoded, so the placeholder never shows
        through a half-transparent photo.
      */}

      {/* Official photographs. Only one opacity transition each, and each is
          held at full opacity once decoded so nothing is ever softened. */}
      {homeHeroSequence.map((id, index) => {
        const image = heroImages[id];
        const isActive = index === slide;

        return (
          <motion.img
            key={id}
            src={image.fallbackSrc}
            srcSet={image.srcSet}
            sizes="100vw"
            width={image.width}
            height={image.height}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => markDecoded(id)}
            initial={false}
            animate={
              isActive && decoded[id]
                ? { opacity: 1, scale: reduceMotion ? 1 : [1, 1.055] }
                : { opacity: 0, scale: 1 }
            }
            // Slow Ken Burns drift on the active frame, so it feels like footage
            // rather than a slideshow. Skipped for reduced motion.
            transition={{
              opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              scale: {
                duration: reduceMotion ? 0 : SLIDE_MS / 1000,
                ease: 'linear',
              },
            }}
            className="absolute inset-0 -z-30 h-full w-full origin-center object-cover will-change-transform"
          />
        );
      })}

      {/* Scrim tuned for CENTRED copy: a soft radial pool of navy sits directly
          behind the text block so the headline stays legible, while the outer
          thirds of the photograph stay clearly visible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(72%_58%_at_50%_46%,rgba(4,10,22,0.68)_0%,rgba(4,10,22,0.34)_58%,rgba(4,10,22,0.12)_100%)]"
      />

      {/* Background layers. The blue wash is kept light so the photograph
          carries the colour instead of a flat gradient. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(130%_130%_at_50%_0%,rgba(23,78,166,0.34)_0%,rgba(11,31,58,0.10)_55%,rgba(7,18,36,0.45)_100%)]"
      />
      {/* Gold arcs. The graph-paper grid that used to sit here is gone: at any
          opacity it reads as small boxes painted over the photograph, which
          flattens the photo into a template. */}
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-32 -z-10 h-[36rem] w-[36rem] rounded-full border border-gold/20"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 top-6 -z-10 h-[22rem] w-[22rem] rounded-full border border-gold/10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-28 -z-10 h-[30rem] w-[30rem] rounded-full bg-gold/[0.06]"
      />

      <Container className="w-full">
        {/* Centred single column — the qualitative highlights panel that used
            to sit on the right has been removed. */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/90 ring-1 ring-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              {schoolInfo.name}
            </p>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-display-xl text-white"
          >
            Shaping Bright Minds.
            <br />
            <span className="text-gold">Building Strong Futures.</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            An institution committed to quality education, character development and preparing
            students for a successful future.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center"
          >
            <Button variant="accent" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/admissions">
                Explore Admissions
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="whitestroke" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/about">Discover Spectral</Link>
            </Button>
          </motion.div>

          {/* Interactive Welcome Audio Experience with Play/Pause/Stop/Mute controls */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <WelcomeAudioExperience />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65"
          >
            <a
              href={schoolInfo.googleRating.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-light"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {schoolInfo.address.area}, {schoolInfo.address.city}
            </a>
            <a
              href={schoolInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-light"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp the school
            </a>
          </motion.div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-7 hidden justify-center lg:flex">
        <ScrollHint />
      </div>

      {/* Slide indicators — also give manual control over the rotation */}
      {!reduceMotion && (
        <div className="absolute inset-x-0 bottom-24 flex justify-center sm:bottom-20 lg:bottom-24">
          <div className="flex items-center gap-2.5" role="group" aria-label="Hero photographs">
            {homeHeroSequence.map((id, index) => (
              <button
                key={id}
                type="button"
                onClick={() => dispatch(heroSlideChanged(index))}
                aria-label={`Show photograph ${index + 1} of ${homeHeroSequence.length}`}
                aria-current={index === slide ? 'true' : undefined}
                className="group py-2"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-500 ease-premium ${
                    index === slide
                      ? 'w-10 bg-gold'
                      : 'w-5 bg-white/35 group-hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * "Education That Goes Beyond the Classroom" — image + copy two-column band.
 */
export function IntroductionSection() {
  return (
    <section className="section bg-canvas" aria-labelledby="intro-heading">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <Reveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl bg-white shadow-lift">
              <ImageWithOverlay
                src={heroImages.campusB.content.fallbackSrc}
                srcSet={heroImages.campusB.content.srcSet}
                width={heroImages.campusB.content.width}
                height={heroImages.campusB.content.height}
                label="Official photograph of Spectral Model School & College"
                alt="Official photograph of Spectral Model School & College"
                className="aspect-[4/3] w-full"
              />
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="max-w-prose">
              <p className="eyebrow">Our Approach</p>
              <h2 id="intro-heading" className="text-display-lg text-navy">
                Education That Goes Beyond the Classroom
              </h2>
              <p className="mt-5 text-base leading-relaxed">
                Spectral Model School &amp; College is focused on education and student
                development together. Academic work matters, but so do the habits, character and
                confidence that let a student use what they learn.
              </p>
              <p className="mt-4 text-base leading-relaxed">
                Teaching is structured and expectations are clear. Students are supported by
                teachers who know them individually, and families are kept informed throughout the
                year rather than only at the end of it.
              </p>

              <div className="mt-9">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">
                    Learn More About Spectral
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
