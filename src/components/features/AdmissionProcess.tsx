import { Reveal } from '../ui';
import { admissionProcess } from '../../data/programs';

/**
 * Four-step admission process timeline.
 * Rendered as an ordered list so the sequence is conveyed semantically.
 */
export function AdmissionProcess({ className = '' }: { className?: string }) {
  return (
    <ol className={`relative grid gap-8 sm:gap-0 ${className}`}>
      {/* Connecting rail — desktop only */}
      <span
        aria-hidden="true"
        className="absolute left-[1.6875rem] top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-blue/40 via-blue/20 to-transparent sm:block lg:left-0 lg:top-[1.6875rem] lg:h-px lg:w-full lg:bg-gradient-to-r"
      />

      {admissionProcess.map((step, index) => (
        <Reveal as="li" key={step.step} delay={index * 0.1} className="relative flex gap-5 sm:gap-6">
          {/* On mobile the rail is vertical; the number sits on the line. */}
          <span
            aria-hidden="true"
            className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy font-display text-lg font-bold text-white shadow-lift lg:h-14 lg:w-14"
          >
            {step.step}
          </span>

          <div className="min-w-0 flex-1 pb-8 last:pb-0 sm:pb-10 lg:pb-0 lg:pt-3.5">
            <h3 className="font-display text-display-sm text-navy">{step.title}</h3>
            <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
              {step.description}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
