import type { ReactNode } from 'react';
import { CircleAlert, Loader2, Sparkles, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DEMO_MODE_LABEL } from '../../features/demoGeneration';
import { Button } from '../ui';

/**
 * The honest label that sits on every generated artefact. It exists so nobody —
 * teacher, parent or student — mistakes the sample questions for approved,
 * syllabus-verified material.
 */
export function DemoNotice({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-gold/15 font-semibold text-gold-dark',
        compact ? 'px-2.5 py-1 text-[0.68rem]' : 'px-3 py-1 text-xs',
        className
      )}
    >
      <TriangleAlert className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden="true" />
      {DEMO_MODE_LABEL}
    </p>
  );
}

interface GenerationStatusProps {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  /** Shown in the idle state before anything has been generated. */
  idleHint?: ReactNode;
  /** Called by the "Try again" button in the failed state. */
  onRetry?: () => void;
  className?: string;
}

/**
 * One consistent place for the generator's loading, error and idle states, so
 * both generators behave — and read — the same way.
 */
export function GenerationStatus({ status, error, idleHint, onRetry, className }: GenerationStatusProps) {
  if (status === 'loading') {
    return (
      <div
        className={cn('flex flex-col items-center gap-3 rounded-2xl bg-navy-50/70 p-8 text-center', className)}
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-7 w-7 animate-spin text-navy motion-reduce:animate-none" aria-hidden="true" />
        <p className="text-sm font-medium text-navy">Generating sample content…</p>
        <p className="text-xs text-ink-muted">{DEMO_MODE_LABEL}</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div
        className={cn('flex flex-col items-center gap-3 rounded-2xl bg-red-50 p-8 text-center', className)}
        role="alert"
      >
        <CircleAlert className="h-7 w-7 text-red-600" aria-hidden="true" />
        <p className="text-sm font-semibold text-red-700">Could not generate content</p>
        {error && <p className="max-w-md text-sm text-red-600">{error}</p>}
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (idleHint) {
    return (
      <div
        className={cn('flex flex-col items-center gap-3 rounded-2xl bg-navy-50/70 p-8 text-center', className)}
      >
        <Sparkles className="h-7 w-7 text-gold-dark" aria-hidden="true" />
        <div className="max-w-md text-sm leading-relaxed text-ink-muted">{idleHint}</div>
      </div>
    );
  }

  return null;
}
