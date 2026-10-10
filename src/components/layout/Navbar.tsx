import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight, LogIn } from 'lucide-react';
import { navigation, primaryPhoneHref, schoolInfo } from '../../data/school';
import { Button } from '../ui';
import { SchoolLogo } from '../brand/SchoolLogo';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../shadcn/primitives';

/**
 * Sticky site header.
 *
 * Behaviour:
 *  - Transparent over the page hero, then solid white with a shadow on scroll.
 *  - On interior pages (which have their own navy hero) it is solid from the start.
 *  - The mobile drawer is a shadcn/Radix `Dialog`. Radix owns focus trapping,
 *    the scroll lock, Escape-to-close, `aria-modal` and focus restoration on
 *    close — all of which this file previously reimplemented by hand across
 *    ~50 lines, with the usual result that edge cases were missed.
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  /** Interior pages always render a solid bar because their hero is navy. */
  const hasHero = location.pathname === '/';

  useEffect(() => {
    if (!hasHero) {
      setIsScrolled(true);
      return;
    }
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasHero]);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const solid = isScrolled || !hasHero;

  const linkBase =
    'relative py-2 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100';

  const linkTone = solid
    ? 'text-ink-muted hover:text-navy'
    : 'text-white/85 hover:text-white';

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 print:hidden',
        solid
          ? 'border-b border-border bg-white/95 shadow-nav backdrop-blur-md supports-[backdrop-filter]:bg-white/85'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      {/* The bar widens slightly past the page container on very large screens.
          A child cannot exceed its parent's `max-w`, so the override has to
          live on the container itself. At 2xl the extra width is what pays for
          the phone number appearing in the bar. */}
      <div className="container-page 2xl:max-w-[86rem]">
        {/* ONE LINE, always. The row is a single non-wrapping flex line: logo,
            nine links, phone and the two CTAs. Nothing here may wrap or
            compress, so the horizontal budget is spent deliberately —
            link padding is tight, the phone number appears only once there is
            genuinely room for it, and the action group is pushed to the far
            right with `ml-auto` so the admissions CTA always sits hard against
            the right edge instead of floating beside the last nav link. */}
        <div className="flex h-16 flex-nowrap items-center gap-3 xl:h-20">
          {/* Brand */}
          <Link
            to="/"
            className="shrink-0 rounded-lg"
            aria-label={`${schoolInfo.name} home page`}
          >
            <SchoolLogo tone={solid ? 'solid' : 'overlay'} />
          </Link>

          {/* Desktop navigation.
              Opens at xl rather than lg: nine links plus the logo, a phone
              number and the admissions CTA do not fit in 1024px without
              crowding, so narrower desktops get the drawer instead.

              `flex-1` + `justify-evenly` is what produces the equal spacing: the
              nav absorbs all the slack between the logo and the action group,
              then hands that slack out evenly around each link. Because the
              width is consumed rather than left over, the group stays optically
              centred between the logo and the phone number instead of drifting
              left with a ragged gap on the right. */}
          <nav aria-label="Primary" className="hidden min-w-0 flex-1 xl:block">
            <ul className="flex items-center justify-evenly gap-1">
              {navigation.map((item) => (
                <li key={item.href} className="shrink-0">
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      [
                        linkBase,
                        linkTone,
                        'px-2',
                        isActive
                          ? solid
                            ? 'text-blue after:scale-x-100'
                            : 'text-white after:scale-x-100 after:bg-gold'
                          : '',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop actions — `ml-auto` pins the admissions CTA to the far
              right of the bar rather than leaving a ragged gap after the last
              nav link. */}
          <div className="ml-auto hidden shrink-0 items-center gap-2.5 xl:flex 2xl:gap-3">
            {/* The number is the first thing to yield: at xl the icon carries
                the affordance and the digits appear from 2xl, where the bar has
                room. It stays a single tappable link either way. */}
            <a
              href={primaryPhoneHref}
              className={`inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors ${
                solid ? 'text-ink-muted hover:text-navy' : 'text-white/85 hover:text-white'
              }`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden 2xl:inline">{schoolInfo.phone.primary}</span>
              <span className="sr-only 2xl:hidden">Call {schoolInfo.phone.primary}</span>
            </a>
            <Button variant={solid ? 'primary' : 'accent'} size="sm" asChild>
              <Link to="/admissions">
                Apply for Admission
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>

            {/* Login sits beside the admissions CTA rather than in the primary
                nav list. A signed-in user reaching the navbar wants to get to
                their portal in one click, and a parent or student is far more
                likely to arrive via this button than via a nine-item menu. */}
            <Button
              variant={solid ? 'outline' : 'whitestroke'}
              size="sm"
              asChild
            >
              <Link to="/login">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Login
              </Link>
            </Button>
          </div>

          {/* Mobile toggle.
              A plain button rather than `DialogTrigger`: the toggle renders
              before the `<Dialog>` in the tree, and Radix's trigger must be a
              descendant of its own Root. The dialog below is fully controlled
              by `isOpen`, so nothing is lost except Radix's automatic
              `aria-expanded`/`aria-controls`, which are set explicitly here.
              `ml-auto` pins it to the far right edge below `xl`, where the
              desktop nav and action group are hidden: without it the button
              sat immediately beside the logo with only the 12px row gap. */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            className={`ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors xl:hidden ${
              solid
                ? 'text-navy hover:bg-navy/5'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer. Radix handles the overlay, focus trap, scroll lock,
          Escape and focus restore. The panel slides down from the top to match
          the bar it belongs to, rather than up from the bottom.

          Transparent "mirror" glass — mobile only. The drawer opens over the
          top of every page, and every one of those tops is the dark navy hero,
          so the sheet is a near-transparent frosted pane: a barely-there light
          tint plus a deep backdrop blur, with the hero clearly visible through
          it. Because the surface behind is dark, the drawer's own content flips
          to light — the white logo, white links — so everything stays legible
          over the mirror rather than disappearing into it. Links take a blue
          hover. None of this touches the desktop bar. */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          id="mobile-drawer"
          showClose={false}
          overlayClassName="bg-navy/50"
          className="inset-x-0 top-0 max-h-[92svh] w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-b border-white/10 bg-white/10 p-0 shadow-nav backdrop-blur-2xl supports-[backdrop-filter]:bg-white/5 data-[state=closed]:animate-drawer-up data-[state=open]:animate-drawer-down xl:hidden"
        >
          <DialogTitle className="sr-only">Main menu</DialogTitle>
          <DialogDescription className="sr-only">
            Navigate to a page on the {schoolInfo.name} website.
          </DialogDescription>

          {/* Sheet header: the close control lives here rather than being
              overlaid, so it is reachable and announces itself correctly. */}
          <div className="flex h-16 items-center justify-between gap-4 border-b border-white/10 px-5 sm:px-8">
            <SchoolLogo tone="overlay" />
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
              >
                <X className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">Close main menu</span>
              </button>
            </DialogClose>
          </div>

          <nav aria-label="Mobile" className="container-page py-5">
            <ul className="flex flex-col">
              {navigation.map((item) => (
                <li key={item.href} className="border-b border-white/10 last:border-0">
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      [
                        'group flex items-center justify-between py-3.5 text-base font-medium transition-colors',
                        isActive ? 'text-gold-light' : 'text-white/90 hover:text-blue-300',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={isActive ? 'flex items-center gap-2.5' : ''}>
                          {isActive && (
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-gold-light"
                              aria-hidden="true"
                            />
                          )}
                          {item.label}
                        </span>
                        <ArrowRight
                          className="h-4 w-4 text-white/40 transition-colors group-hover:text-blue-300"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="accent" size="lg" fullWidth asChild>
                <Link to="/admissions" onClick={() => setIsOpen(false)}>
                  Apply for Admission
                </Link>
              </Button>
              <Button variant="whitestroke" size="lg" fullWidth asChild>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Contact the School
                </Link>
              </Button>

              <Button variant="whitestroke" size="lg" fullWidth asChild>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Login to a Portal
                </Link>
              </Button>
              <a
                href={primaryPhoneHref}
                onClick={() => setIsOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {schoolInfo.phone.primary}
              </a>
            </div>
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  );
}
