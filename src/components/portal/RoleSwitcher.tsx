import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Repeat } from 'lucide-react';
import { cn } from '../../lib/utils';
import { portals, type PortalId } from '../../data/portals';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { demoSignIn } from '../../store/authSlice';

/**
 * Demo role switcher.
 *
 * Lets whoever is viewing the demo jump between the four portals without
 * signing out and back in — the point of the demo is to show what each role
 * sees. It is a plain, hand-rolled menu rather than a Radix one because it is
 * the only dropdown in the app and Radix's dropdown-menu package is not a
 * dependency; it still wires up `aria-haspopup`/`aria-expanded`, Escape, and
 * outside-click close.
 *
 * This is not an access-control bypass — it is the demo's whole premise that
 * you may look at any role. Real authorisation must live on the server.
 */
export function RoleSwitcher({ className }: { className?: string }) {
  const role = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const current = portals.find((portal) => portal.id === role) ?? portals[0];

  const choose = (id: PortalId) => {
    dispatch(demoSignIn(id));
    setOpen(false);
    navigate(`/portal/${id}`);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-navy shadow-lift transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
      >
        <Repeat className="h-4 w-4 text-gold-dark" aria-hidden="true" />
        <span className="hidden sm:inline text-ink-muted">Viewing as</span>
        <span>{current.category}</span>
        <ChevronDown
          className={cn('h-4 w-4 text-ink-muted transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Switch demo role"
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right animate-scale-in overflow-hidden rounded-2xl bg-white p-1.5 shadow-lift-lg"
        >
          <p className="px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Switch demo role
          </p>
          {portals.map((portal) => {
            const Icon = portal.icon;
            const active = portal.id === role;
            return (
              <button
                key={portal.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(portal.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                  active ? 'bg-navy-50' : 'hover:bg-navy-50/70'
                )}
              >
                <Icon
                  className={cn('h-4 w-4 shrink-0', active ? 'text-gold-dark' : 'text-ink-muted')}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-navy">{portal.name}</span>
                  <span className="block truncate text-xs text-ink-muted">{portal.category}</span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
