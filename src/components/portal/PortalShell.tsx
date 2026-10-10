import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { PortalSidebar } from './PortalSidebar';
import { PortalTopbar } from './PortalTopbar';
import { isPortalId } from '../../data/portals';
import { demoNotice } from '../../data/portalDashboards';
import { useAppSelector } from '../../store/hooks';

/**
 * The portal application shell.
 *
 * Holds the sidebar, topbar and content area, and — importantly — the route
 * guard. All three checks live in one place so no individual page has to
 * remember them:
 *
 *   1. an unknown role segment is sent to the portal chooser;
 *   2. a visitor with no demo session is sent to that role's sign-in page;
 *   3. a visitor signed in as one role who opens another role's URL is bounced
 *      to their own dashboard — the RBAC rule that keeps the four portals apart.
 *
 * The navigation is the marketing site's chrome-free zone: the Navbar and
 * Footer are not rendered on `/portal` (see `App.tsx`), so this is a full-height
 * app layout rather than a page inside the website.
 */
export function PortalShell() {
  const { role: roleParam } = useParams<{ role: string }>();
  const authRole = useAppSelector((state) => state.auth.role);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(location.pathname);

  // Close the mobile drawer when the route changes. Adjusting state during
  // render is React's recommended way to reset state in response to a changed
  // value — it avoids the extra cascading render a setState-in-effect would
  // cause. Navigating from inside the drawer also closes it directly through
  // `onNavigate`; this covers back/forward and programmatic navigation.
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setMenuOpen(false);
  }

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // --- Route guard (all hooks are above this line) ---
  if (!isPortalId(roleParam)) return <Navigate to="/login" replace />;
  if (!authRole) return <Navigate to={`/login/${roleParam}`} replace />;
  if (authRole !== roleParam) return <Navigate to={`/portal/${authRole}`} replace />;

  return (
    <div className="min-h-svh bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <PortalSidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close portal menu"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-[18rem] max-w-[85vw] shadow-lift-lg"
            >
              <PortalSidebar onNavigate={() => setMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Content column */}
      <div className="lg:pl-72">
        <PortalTopbar onOpenMenu={() => setMenuOpen(true)} />

        {/* Persistent demo disclosure — never let a sample figure look official. */}
        <PortalDemoBanner />

        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function PortalDemoBanner() {
  return (
    <div className="border-b border-gold/20 bg-gold/[0.08] px-4 py-2.5 sm:px-6 lg:px-8">
      <p className="flex items-start gap-2 text-xs leading-relaxed text-navy/80">
        <Info className="mt-px size-3.5 shrink-0 text-gold-dark" aria-hidden="true" />
        {demoNotice}
      </p>
    </div>
  );
}

/**
 * A titled wrapper for a single section's content, used by the section page.
 * Kept here so the page component stays thin.
 */
export function PortalSectionHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>
      </div>
      {children}
    </div>
  );
}
