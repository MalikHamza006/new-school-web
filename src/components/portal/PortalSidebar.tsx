import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FileText, Globe, ListChecks, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SchoolLogo } from '../brand/SchoolLogo';
import { DemoBadge } from './DemoBadge';
import { getDashboard, getSection } from '../../data/portalDashboards';
import { hasPermission } from '../../data/portalAccess';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { demoSignOut } from '../../store/authSlice';

/**
 * The portal sidebar: brand, section navigation, and the signed-in demo user.
 *
 * Rendered in two places — the fixed desktop column and the mobile drawer — so
 * it is written once here and reused, exactly like the site's own mobile menu.
 *
 * RBAC: the navigation list is filtered by `hasPermission`, so a section only
 * appears for a role that holds its permission. The route guard enforces the
 * same rule on direct navigation, so hiding a link is convenience, not security.
 */
export function PortalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const role = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!role) return null;

  const dashboard = getDashboard(role);
  const sections = dashboard.sections.filter((section) => hasPermission(role, section.permission));
  const overviewSection = getSection(role, 'overview');

  const handleSignOut = () => {
    dispatch(demoSignOut());
    onNavigate?.();
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col bg-navy text-white">
      {/* Brand + portal identity */}
      <div className="px-5 pt-5">
        <Link
          to="/"
          onClick={onNavigate}
          className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Spectral Model School & College home"
        >
          <SchoolLogo tone="overlay" />
        </Link>

        <div className="mt-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-light">
            {dashboard.audience}
          </p>
          <p className="font-display text-lg font-semibold text-white">
            {dashboard.portalName}
          </p>
        </div>
        <DemoBadge className="mt-2.5" />
      </div>

      {/* Section navigation */}
      <nav
        aria-label={`${dashboard.portalName} navigation`}
        className="mt-5 flex-1 overflow-y-auto px-3 pb-3"
      >
        <ul className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isOverview = section.id === overviewSection?.id;
            const to = isOverview ? `/portal/${role}` : `/portal/${role}/${section.id}`;

            return (
              <li key={section.id}>
                <NavLink
                  to={to}
                  end={isOverview}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-gold-light' : 'text-white/50 group-hover:text-white/80'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{section.label}</span>
                      {isActive && (
                        <span
                          className="ml-auto h-4 w-1 rounded-full bg-gold-light"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Teaching tools. Shown to the teacher portal only; these are the
            demo AI generators, which live on the public site rather than inside
            the portal shell. */}
        {role === 'teacher' && (
          <div className="mt-5">
            <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/40">
              Teaching tools
            </p>
            <ul className="mt-2 space-y-1">
              {[
                { label: 'Paper Generator', to: '/academics/ai-tools/paper-generator', icon: FileText },
                { label: 'Quiz Generator', to: '/academics/ai-tools/quiz-generator', icon: ListChecks },
              ].map((tool) => {
                const Icon = tool.icon;
                return (
                  <li key={tool.to}>
                    <Link
                      to={tool.to}
                      onClick={onNavigate}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-white/50 group-hover:text-white/80" aria-hidden="true" />
                      <span className="truncate">{tool.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Signed-in demo user + exits */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {dashboard.user.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-white">
              {dashboard.user.name}
            </span>
            <span className="block truncate text-xs text-white/50">{dashboard.user.meta}</span>
          </span>
        </div>

        <div className="mt-1 space-y-0.5">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Globe className="h-4 w-4 text-white/50" aria-hidden="true" />
            Back to website
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 text-white/50" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
