import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconTile } from '../ui';
import type {
  BadgeTone,
  DashboardBlock,
  FeesBlock,
  ListBlock,
  NoteBlock,
  NoticeBlock,
  ProgressBlock,
  ScheduleBlock,
  StatBlock,
  TableBlock,
  TableCell,
  TimelineBlock,
} from '../../data/portalDashboards';

/**
 * The dashboard block renderers.
 *
 * Each portal page is a stack of blocks that come from `data/portalDashboards`.
 * A block is data with a `type`; `BlockRenderer` maps the type to one of the
 * components below. This is why twenty-plus pages can look consistent and
 * on-brand without twenty-plus hand-built layouts — the look lives here, once.
 *
 * Everything is borderless and shadow-separated, matching the rest of the site:
 * rows are divided by a soft tint, never a 1px outline.
 */

/* ------------------------------------------------------------------ */
/* Tone badge                                                          */
/* ------------------------------------------------------------------ */

const toneClasses: Record<BadgeTone, string> = {
  gold: 'bg-gold/15 text-gold-dark',
  navy: 'bg-navy text-white',
  muted: 'bg-navy-50 text-ink-muted',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
};

function ToneBadge({ tone = 'muted', children }: { tone?: BadgeTone; children: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold',
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

function StatGrid({ block }: { block: StatBlock }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {block.items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="rounded-2xl bg-white p-5 shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-ink-muted">{item.label}</p>
              {Icon && (
                <IconTile tone="navy" size="sm">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </IconTile>
              )}
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight text-navy">
              {item.value}
            </p>
            {item.hint && <p className="mt-1 text-xs text-ink-muted">{item.hint}</p>}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

function renderCell(cell: TableCell) {
  if (typeof cell === 'string') return cell;
  if (cell.badge) return <ToneBadge tone={cell.badge}>{cell.text}</ToneBadge>;
  return cell.text;
}

function DataTable({ block }: { block: TableBlock }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lift">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          {block.caption && (
            <caption className="bg-white px-5 pt-4 text-left text-sm font-semibold text-navy">
              {block.caption}
            </caption>
          )}
          <thead className="bg-navy-50/60 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
            <tr>
              {block.columns.map((column) => (
                <th key={column} scope="col" className="whitespace-nowrap px-5 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100/70">
            {block.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="align-middle transition-colors hover:bg-navy-50/40"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      'px-5 py-3.5 text-ink',
                      cellIndex === 0 && 'font-medium text-navy'
                    )}
                  >
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Schedule (timetable / day plan)                                     */
/* ------------------------------------------------------------------ */

function ScheduleBoard({ block }: { block: ScheduleBlock }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {block.days.map((day) => (
        <div key={day.day} className="rounded-2xl bg-white p-5 shadow-lift">
          <h3 className="font-display text-base font-semibold text-navy">{day.day}</h3>
          <ul className="mt-3 space-y-2">
            {day.periods.map((period) => (
              <li
                key={`${day.day}-${period.time}`}
                className="flex gap-3 rounded-xl bg-navy-50/50 px-3 py-2.5"
              >
                <span className="w-12 shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-gold-dark">
                  {period.time}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-navy">{period.title}</span>
                  {period.detail && (
                    <span className="block text-xs text-ink-muted">{period.detail}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bars                                                       */
/* ------------------------------------------------------------------ */

function ProgressList({ block }: { block: ProgressBlock }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lift">
      {block.caption && (
        <p className="text-sm font-semibold text-navy">{block.caption}</p>
      )}
      <ul className="mt-4 space-y-4">
        {block.items.map((item) => (
          <li key={item.label}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-medium text-navy">{item.label}</span>
              <span className="tabular-nums text-ink-muted">{item.detail ?? `${item.value}%`}</span>
            </div>
            {/* Inline width is the data value itself (0–100), which a static
                class cannot express. Everything else about the bar is styled. */}
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-navy-100"
              role="progressbar"
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={item.label}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-navy to-blue"
                style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Item list                                                           */
/* ------------------------------------------------------------------ */

function ItemList({ block }: { block: ListBlock }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lift">
      {block.heading && <p className="text-sm font-semibold text-navy">{block.heading}</p>}
      <ul className="mt-2 divide-y divide-navy-100/70">
        {block.items.map((item) => (
          <li key={item.title} className="flex items-start justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy">{item.title}</p>
              {item.meta && <p className="mt-0.5 text-xs text-ink-muted">{item.meta}</p>}
              {item.description && (
                <p className="mt-0.5 text-xs text-ink-muted">{item.description}</p>
              )}
            </div>
            {item.badge && <ToneBadge tone={item.badgeTone ?? 'muted'}>{item.badge}</ToneBadge>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notices                                                             */
/* ------------------------------------------------------------------ */

function NoticeFeed({ block }: { block: NoticeBlock }) {
  return (
    <ul className="grid gap-4">
      {block.items.map((notice) => (
        <li key={notice.title} className="rounded-2xl bg-white p-5 shadow-lift">
          <div className="flex flex-wrap items-center gap-2">
            {notice.tag && <ToneBadge tone="gold">{notice.tag}</ToneBadge>}
            <span className="text-xs text-ink-muted">{notice.date}</span>
          </div>
          <h3 className="mt-2 font-display text-base font-semibold text-navy">{notice.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{notice.body}</p>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Fees                                                                */
/* ------------------------------------------------------------------ */

function FeePanel({ block }: { block: FeesBlock }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lift">
      <ul className="divide-y divide-navy-100/70">
        {block.lines.map((line) => (
          <li key={line.label} className="flex items-center justify-between gap-4 px-6 py-4">
            <p className="text-sm font-medium text-navy">{line.label}</p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tabular-nums text-navy">{line.amount}</span>
              <ToneBadge tone={line.status}>{line.statusLabel}</ToneBadge>
            </div>
          </li>
        ))}
      </ul>
      <div className="on-dark flex items-center justify-between gap-4 bg-navy px-6 py-4">
        <span className="text-sm font-medium text-white/70">{block.totalLabel}</span>
        <span className="font-display text-xl font-bold text-white">{block.total}</span>
      </div>
      {block.note && <p className="px-6 py-4 text-xs leading-relaxed text-ink-muted">{block.note}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Activity timeline                                                   */
/* ------------------------------------------------------------------ */

function ActivityTimeline({ block }: { block: TimelineBlock }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lift">
      <ol className="relative space-y-5 border-l border-navy-100 pl-6">
        {block.items.map((entry) => (
          <li key={`${entry.time}-${entry.title}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[1.9rem] top-1 size-3 rounded-full border-2 border-white bg-gold"
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <p className="text-sm font-medium text-navy">{entry.title}</p>
              <span className="text-xs tabular-nums text-ink-muted">{entry.time}</span>
            </div>
            {entry.description && (
              <p className="mt-0.5 text-xs text-ink-muted">{entry.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Note                                                                */
/* ------------------------------------------------------------------ */

function NotePanel({ block }: { block: NoteBlock }) {
  const gold = block.tone === 'gold';
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl p-4 text-sm',
        gold ? 'bg-gold/10' : 'bg-blue-50'
      )}
    >
      <Info
        className={cn('mt-0.5 size-4 shrink-0', gold ? 'text-gold-dark' : 'text-blue')}
        aria-hidden="true"
      />
      <p className="text-ink-muted">{block.text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Renderer                                                            */
/* ------------------------------------------------------------------ */

export function BlockRenderer({ block }: { block: DashboardBlock }) {
  switch (block.type) {
    case 'stats':
      return <StatGrid block={block} />;
    case 'table':
      return <DataTable block={block} />;
    case 'schedule':
      return <ScheduleBoard block={block} />;
    case 'progress':
      return <ProgressList block={block} />;
    case 'list':
      return <ItemList block={block} />;
    case 'notices':
      return <NoticeFeed block={block} />;
    case 'fees':
      return <FeePanel block={block} />;
    case 'timeline':
      return <ActivityTimeline block={block} />;
    case 'note':
      return <NotePanel block={block} />;
    default:
      return null;
  }
}

/** Renders a section's full stack of blocks with consistent rhythm. */
export function BlockList({ blocks }: { blocks: DashboardBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
