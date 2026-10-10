import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Navbar, Footer, WelcomeSplash, SpectralAIAssistant } from './components';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';

/* Route-level code splitting: the homepage ships in the main bundle, while
   every interior page is fetched on demand. */
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const AcademicsPage = lazy(() =>
  import('./pages/AcademicsPage').then((m) => ({ default: m.AcademicsPage }))
);
const AiToolsPage = lazy(() =>
  import('./pages/AiToolsPage').then((m) => ({ default: m.AiToolsPage }))
);
const PaperGeneratorPage = lazy(() =>
  import('./pages/PaperGeneratorPage').then((m) => ({ default: m.PaperGeneratorPage }))
);
const QuizGeneratorPage = lazy(() =>
  import('./pages/QuizGeneratorPage').then((m) => ({ default: m.QuizGeneratorPage }))
);
const AdmissionsPage = lazy(() =>
  import('./pages/AdmissionsPage').then((m) => ({ default: m.AdmissionsPage }))
);
const CampusPage = lazy(() =>
  import('./pages/CampusPage').then((m) => ({ default: m.CampusPage }))
);
const AchievementsPage = lazy(() =>
  import('./pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage }))
);
const EventsPage = lazy(() =>
  import('./pages/EventsPage').then((m) => ({ default: m.EventsPage }))
);
const EventDetailPage = lazy(() =>
  import('./pages/EventDetailPage').then((m) => ({ default: m.EventDetailPage }))
);
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const PortalLoginPage = lazy(() =>
  import('./pages/PortalLoginPage').then((m) => ({ default: m.PortalLoginPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
/* Portal dashboard: a layout route plus its nested pages. */
const PortalShell = lazy(() =>
  import('./components/portal').then((m) => ({ default: m.PortalShell }))
);
const PortalRootPage = lazy(() =>
  import('./pages/portal/PortalRootPage').then((m) => ({ default: m.PortalRootPage }))
);
const PortalSectionPage = lazy(() =>
  import('./pages/portal/PortalSectionPage').then((m) => ({ default: m.PortalSectionPage }))
);

/** Neutral loading state shown while a route chunk is fetched. */
function RouteFallback() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
        <span
          className="h-9 w-9 animate-spin rounded-full border-2 border-navy/15 border-t-navy motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="text-sm text-ink-muted">Loading…</span>
      </div>
    </div>
  );
}

/**
 * Restores the document title to the site default when leaving a page that
 * set its own, so a stale title never lingers.
 */
function useDocumentLang() {
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);
}

export default function App() {
  useDocumentLang();
  const location = useLocation();

  /* The portal dashboards are an app shell of their own. On `/portal` the
     marketing chrome (welcome splash, navbar, footer, AI assistant) is not
     rendered, so the portal's own sidebar and topbar are the only navigation —
     the same separation a real product would draw between its site and its app. */
  const isPortal =
    location.pathname === '/portal' || location.pathname.startsWith('/portal/');

  return (
    <>
      {/* Animated welcome splash on load */}
      {!isPortal && <WelcomeSplash />}

      {/* Keyboard users can jump straight past the navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollToTop />
      {!isPortal && <Navbar />}

      <main
        id="main-content"
        tabIndex={-1}
        className={isPortal ? 'focus:outline-none' : 'min-h-[60svh] focus:outline-none'}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            {/* Teacher AI-tools demo. The hub lists both generators, each of
                which is a separate URL so it can be linked to and bookmarked. */}
            <Route path="/academics/ai-tools" element={<AiToolsPage />} />
            <Route path="/academics/ai-tools/paper-generator" element={<PaperGeneratorPage />} />
            <Route path="/academics/ai-tools/quiz-generator" element={<QuizGeneratorPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/campus" element={<CampusPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* One page per portal. Declared after `/login` so the exact path is
                matched first; this segment is what makes each portal a
                separate URL rather than a tab. */}
            <Route path="/login/:portalId" element={<PortalLoginPage />} />
            {/* Portal dashboards. `/portal` resolves to the signed-in role's
                dashboard; `/portal/:role` is the guarded app shell, with the
                overview at the index and every section under one more segment. */}
            <Route path="/portal" element={<PortalRootPage />} />
            <Route path="/portal/:role" element={<PortalShell />}>
              <Route index element={<PortalSectionPage />} />
              <Route path=":sectionId" element={<PortalSectionPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isPortal && <Footer />}
      {!isPortal && <SpectralAIAssistant />}
    </>
  );
}
