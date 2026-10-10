import { Menu } from 'lucide-react';
import { DemoBadge } from './DemoBadge';
import { RoleSwitcher } from './RoleSwitcher';
import { getDashboard } from '../../data/portalDashboards';
import { useAppSelector } from '../../store/hooks';

/**
 * The sticky portal topbar: menu toggle on small screens, the portal name, and
 * the demo controls (badge, role switcher, signed-in avatar).
 */
export function PortalTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const role = useAppSelector((state) => state.auth.role);
  if (!role) return null;

  const dashboard = getDashboard(role);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-white/90 px-4 shadow-nav backdrop-blur-md sm:px-6 lg:h-20 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-navy transition-colors hover:bg-navy/5 lg:hidden"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">Open portal menu</span>
      </button>

      <p className="truncate font-display text-sm font-semibold text-navy sm:text-base">
        {dashboard.portalName}
      </p>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <DemoBadge className="hidden sm:inline-flex" />
        <RoleSwitcher />
        <span
          className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white lg:inline-flex"
          aria-hidden="true"
        >
          {dashboard.user.initials}
        </span>
      </div>
    </header>
  );
}
