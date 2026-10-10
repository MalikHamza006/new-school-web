import { Reveal, IconTile } from '../ui';
import { leadership } from '../../data/content';
import { schoolInfo } from '../../data/school';
import { SchoolLogo } from '../brand/SchoolLogo';
import { Quote } from 'lucide-react';

/**
 * Principal / Director message block.
 *
 * Renders the leadership statement with the school's official insignia,
 * or an official portrait if supplied.
 */
export function LeadershipMessage({ className = '' }: { className?: string }) {
  const isPlaceholderMessage = leadership.message.some((line) => line.includes('['));
  const displayName = leadership.signatureName;

  return (
    <div className={`grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14 ${className}`}>
      {/* Insignia / Portrait */}
      <Reveal className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-navy to-navy-900 p-8 shadow-lift text-center flex flex-col items-center justify-center min-h-[19rem]">
            {leadership.portrait ? (
              <img
                src={leadership.portrait}
                alt={`Portrait of ${displayName ?? leadership.signatureRole}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-4">
                <div className="flex h-20 items-center justify-center">
                  <SchoolLogo tone="overlay" className="h-16 w-auto" />
                </div>
                <div className="mt-6 w-full">
                  <p className="font-display text-sm font-semibold text-white tracking-wide">
                    {schoolInfo.name}
                  </p>
                  <p className="mt-1 text-xs text-gold-light">
                    {schoolInfo.tagline}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-wider text-white/70">
                    Institutional Directorate
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Gold accent block */}
          <span
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 -z-10 h-24 w-24 rounded-2xl bg-gold/20"
          />
        </div>
      </Reveal>

      {/* Message */}
      <Reveal delay={0.1}>
        <div className="max-w-prose">
          <p className="eyebrow">Leadership</p>
          <h2 className="text-display-lg text-navy">{leadership.title}</h2>

          <IconTile tone="gold" size="sm" className="mt-6">
            <Quote className="h-4 w-4" aria-hidden="true" />
          </IconTile>

          <div className="mt-5 space-y-4">
            {leadership.message.map((paragraph, index) => (
              <p
                key={index}
                className={
                  isPlaceholderMessage
                    ? 'rounded-lg border border-dashed border-gold/50 bg-gold/8 p-4 text-[0.95rem] italic leading-relaxed text-gold-dark'
                    : 'text-base leading-relaxed text-ink-muted'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Signature */}
          <div className="mt-8">
            <p className="font-display text-lg font-semibold text-navy">
              {displayName ?? leadership.signatureRole}
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">
              {schoolInfo.name}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
