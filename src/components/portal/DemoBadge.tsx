import { cn } from '../../lib/utils';

/**
 * The "Demo" marker shown throughout the portals.
 *
 * It is not decoration: every portal here runs on sample data with no backend,
 * so a visitor must be able to tell at a glance that what they are looking at is
 * a preview and not a real school record. It appears in the sidebar, the topbar
 * and on every demo entry button.
 */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-gold-dark',
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
      Demo
    </span>
  );
}
