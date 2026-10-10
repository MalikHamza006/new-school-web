/**
 * Render smoke test.
 *
 * Mounts every route inside the real layout and reports whether it renders.
 * Run with: npm run smoke
 *
 * The portal dashboards are guarded: `/portal/:role` redirects a visitor who is
 * not signed in to that role. A pure redirect renders nothing, so each portal
 * case seeds the demo session with the matching role before it renders — the
 * same state the dashboard expects in the browser.
 */
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { demoSignIn, demoSignOut } from '../src/store/authSlice';
import { Navbar, Footer } from '../src/components';
import { PortalShell } from '../src/components/portal';
import { HomePage } from '../src/pages/HomePage';
import { AboutPage } from '../src/pages/AboutPage';
import { AcademicsPage } from '../src/pages/AcademicsPage';
import { AiToolsPage } from '../src/pages/AiToolsPage';
import { PaperGeneratorPage } from '../src/pages/PaperGeneratorPage';
import { QuizGeneratorPage } from '../src/pages/QuizGeneratorPage';
import { AdmissionsPage } from '../src/pages/AdmissionsPage';
import { CampusPage } from '../src/pages/CampusPage';
import { AchievementsPage } from '../src/pages/AchievementsPage';
import { EventsPage } from '../src/pages/EventsPage';
import { EventDetailPage } from '../src/pages/EventDetailPage';
import { GalleryPage } from '../src/pages/GalleryPage';
import { ContactPage } from '../src/pages/ContactPage';
import { LoginPage } from '../src/pages/LoginPage';
import { PortalLoginPage } from '../src/pages/PortalLoginPage';
import { PortalRootPage } from '../src/pages/portal/PortalRootPage';
import { PortalSectionPage } from '../src/pages/portal/PortalSectionPage';
import { NotFoundPage } from '../src/pages/NotFoundPage';
import { events } from '../src/data/events';
import { portals, type PortalId } from '../src/data/portals';

interface Case {
  path: string;
  label: string;
  /** Demo role to seed before rendering, for the guarded portal routes. */
  role?: PortalId;
}

export function buildCases(): Case[] {
  return [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/academics', label: 'Academics' },
    { path: '/academics/ai-tools', label: 'AI tools hub' },
    { path: '/academics/ai-tools/paper-generator', label: 'Paper generator' },
    { path: '/academics/ai-tools/quiz-generator', label: 'Quiz generator' },
    { path: '/admissions', label: 'Admissions' },
    { path: '/campus', label: 'Campus' },
    { path: '/achievements', label: 'Achievements' },
    { path: '/events', label: 'Events' },
    { path: `/events/${events[0]?.id ?? 'placeholder-1'}`, label: 'Event detail' },
    { path: '/events/does-not-exist', label: 'Event detail (bad id)' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Login (chooser)' },
    // Every portal gets its own page, so every portal is smoke-tested. Driven
    // from the data so a new portal cannot be added without a route here.
    ...portals.map((portal) => ({ path: portal.path, label: portal.name })),
    { path: '/login/no-such-portal', label: 'Portal (bad id)' },
    // Portal dashboards — overview plus a deeper section per role, each seeded
    // with its own role so the guard lets it render.
    { path: '/portal/student', label: 'Student overview', role: 'student' },
    { path: '/portal/student/timetable', label: 'Student timetable', role: 'student' },
    { path: '/portal/student/results', label: 'Student results', role: 'student' },
    { path: '/portal/parent', label: 'Parent overview', role: 'parent' },
    { path: '/portal/parent/fees', label: 'Parent fees', role: 'parent' },
    { path: '/portal/teacher', label: 'Teacher overview', role: 'teacher' },
    { path: '/portal/teacher/grades', label: 'Teacher grades', role: 'teacher' },
    { path: '/portal/admin', label: 'Admin overview', role: 'admin' },
    { path: '/portal/admin/reports', label: 'Admin reports', role: 'admin' },
    {
      path: '/portal/student/no-such-section',
      label: 'Student bad section',
      role: 'student',
    },
    { path: '/this-route-does-not-exist', label: '404' },
  ];
}

export function renderCase(path: string, role?: PortalId) {
  // Mirror the real app's auth state for this route: sign in as the role the
  // case expects, or sign out so an unrelated case cannot inherit it.
  if (role) store.dispatch(demoSignIn(role));
  else store.dispatch(demoSignOut());

  // The Provider must be present here exactly as it is in `main.tsx`, otherwise
  // any component reading from the store throws during server rendering. This
  // mirrors the real app shell deliberately: a smoke test that mounts a
  // different tree than production will miss real breakage.
  return renderToString(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/academics" element={<AcademicsPage />} />
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
            <Route path="/login/:portalId" element={<PortalLoginPage />} />
            <Route path="/portal" element={<PortalRootPage />} />
            <Route path="/portal/:role" element={<PortalShell />}>
              <Route index element={<PortalSectionPage />} />
              <Route path=":sectionId" element={<PortalSectionPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </MemoryRouter>
    </Provider>
  );
}
