/* ------------------------------------------------------------------ */
/* StatCard — numeric stat, used only with verified figures             */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  value: string;
  label: string;
  caption?: string;
  onDark?: boolean;
  className?: string;
}

export function StatCard({ value, label, caption, onDark = false, className = '' }: StatCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <p
        className={`font-display text-display-lg font-extrabold tabular-nums ${
          onDark ? 'text-gold' : 'text-navy'
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1.5 text-sm font-semibold ${onDark ? 'text-white' : 'text-navy'}`}
      >
        {label}
      </p>
      {caption && (
        <p className={`mt-1 text-xs ${onDark ? 'text-white/55' : 'text-ink-muted'}`}>
          {caption}
        </p>
      )}
    </div>
  );
}
