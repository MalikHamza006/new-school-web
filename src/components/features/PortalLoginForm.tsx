import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Info, Lock, ArrowRight } from 'lucide-react';
import { Button, Card, IconTile } from '../ui';
import { portals, type Portal, type PortalField } from '../../data/portals';

interface PortalLoginFormProps {
  portal: Portal;
  className?: string;
}

/**
 * One sign-in form per portal, on a page of its own.
 *
 * The four portals are genuinely different — a student is identified by roll
 * number, a parent by a registered mobile, a teacher by staff ID, an
 * administrator by username plus session — so each gets its own page built from
 * its own field definition in `data/portals`. One shared form would misrepresent
 * how any of them would really work, and one page holding all four forced a
 * visitor to scroll past three forms that were not theirs.
 *
 * BORDERLESS BY DESIGN
 * *******************
 * Nothing here draws a 1px line: no card outline, no field borders, no divider
 * above the summary. A grid of outlined boxes reads as a wireframe, and on a
 * sign-in page the eye should land on the label and the button, not the
 * scaffolding. Separation comes from the shadow, a soft tint fill, and
 * whitespace; focus is signalled with a ring, which does not shift the layout.
 *
 * NOT A REAL LOGIN
 * ----------------
 * This component does not authenticate anyone. Submitting only flips a local
 * flag so the button can say "preview only". There is no request, no session,
 * no storage, and no credential is read back. `noValidate` plus
 * `preventDefault` mean the browser never validates or transmits either — the
 * `preventDefault` matters because without it the browser could put the password
 * into the query string. Real authentication has to be built server-side;
 * nothing in this file should be mistaken for a starting point that already
 * handles it.
 */
export function PortalLoginForm({ portal, className = '' }: PortalLoginFormProps) {
  // Per-form reveal state, so showing the password does not leave it on screen.
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const Icon = portal.icon;
  const { role } = portal;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Stop the default navigation. Without this the browser would validate,
    // and could append the password to the query string.
    event.preventDefault();
    setSubmitted(true);
  };

  // The other three portals, offered inline so someone on the wrong page can
  // correct themselves in one click instead of using the back button.
  const others = portals.filter((item) => item.id !== portal.id);

  return (
    <Card padding="none" className={`overflow-hidden ${className}`}>
      {/* Portal header. Navy so the audience is unmistakable before the eye
          reaches the fields. */}
      <div className="on-dark relative isolate overflow-hidden bg-navy px-6 py-7 sm:px-9 sm:py-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_85%_0%,#174EA6_0%,#0B1F3A_60%,#081428_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 -z-10 size-48 rounded-full border border-gold/15"
        />

        <div className="flex items-center gap-3.5">
          <IconTile tone="gold" size="md">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </IconTile>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {portal.category}
            </p>
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              {portal.name}
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
          {role.description}
        </p>
      </div>

      {/* Form. Bottom padding is dropped because the tinted footer below runs
          to the bottom edge of the card, so padding there would only leave a
          white sliver under the tint. */}
      <form onSubmit={handleSubmit} noValidate className="p-6 pb-5 sm:p-9 sm:pb-6">
        <div className="space-y-5">
          {role.fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              portalId={portal.id}
              isVisible={Boolean(visible[field.name])}
              onToggle={() =>
                setVisible((previous) => ({
                  ...previous,
                  [field.name]: !previous[field.name],
                }))
              }
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <label className="flex items-center gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              name={`${portal.id}-remember`}
              className="size-4 rounded border-0 bg-navy-50 accent-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
            />
            Keep me signed in
          </label>

          <button
            type="button"
            className="text-sm font-semibold text-blue underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* The lock goes through `leftIcon`, not inside `children`.
            `Button` wraps `children` in a single span, and a single span is the
            button's only flex item — so the `gap-2` on the flex container never
            reaches anything *inside* that span. An icon passed as a child
            therefore sat flush against the label with no space, and the label
            itself had no way to shrink, so on a narrow screen it spilled out of
            the button instead of truncating. `leftIcon` is a sibling of the
            label span, so the gap applies and the text can be contained. */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          leftIcon={submitted ? undefined : <Lock className="h-4 w-4" aria-hidden="true" />}
        >
          {submitted ? 'Preview only. Nothing was sent' : role.submitLabel}
        </Button>

      </form>

      {/* ONE tinted footer, not two.
          The summary panel and the wrong-portal strip were previously separate
          `bg-navy-50/60` blocks with a band of white between them, so the bottom
          third of the card looked like two stacked slabs rather than one
          continuation of the page. Merged here, and separated only by
          whitespace — still no 1px line anywhere. */}
      <div className="bg-navy-50/60 px-6 py-6 sm:px-9 sm:py-7">
        {/* What this portal is for, and what the school would issue. */}
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">
          What you can do here
        </p>
        <ul className="mt-3.5 space-y-2">
          {portal.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>

        <p className="mt-5 flex gap-2.5 text-xs leading-relaxed text-ink-muted">
          <Info className="mt-px size-4 shrink-0 text-blue" aria-hidden="true" />
          {role.credentialNote}
        </p>

        {/* Wrong portal? A real link to the other three pages, not a tab. */}
        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Wrong portal? Sign in here instead
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {others.map((other) => {
              const OtherIcon = other.icon;
              return (
                <li key={other.id}>
                  <Link
                    to={other.path}
                    className="group inline-flex items-center gap-2 rounded-full bg-white py-2 pl-3 pr-4 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
                  >
                    <OtherIcon className="h-4 w-4 text-gold-dark" aria-hidden="true" />
                    {other.name}
                    <ArrowRight
                      className="h-3.5 w-3.5 text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}

interface FieldProps {
  field: PortalField;
  portalId: string;
  isVisible: boolean;
  onToggle: () => void;
}

/** Renders one field definition from the portal data. */
function Field({ field, portalId, isVisible, onToggle }: FieldProps) {
  const FieldIcon = field.icon;
  const icon = FieldIcon ? <FieldIcon className="h-4 w-4" /> : undefined;
  const id = `${portalId}-${field.name}`;

  // Password fields get a reveal toggle. A password manager also offers one,
  // but a visible control is expected on a form like this.
  if (field.type === 'password') {
    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="field-label">
          {field.label}
          {field.required && (
            <>
              <span className="ml-0.5 text-gold-dark" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
        <div className="relative">
          <input
            id={id}
            name={field.name}
            type={isVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder={field.placeholder}
            className={`field-control-flat ${icon ? 'pl-11' : ''} pr-12`}
          />
          {icon && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-ink-muted transition-colors hover:text-navy"
          >
            {isVisible ? (
              <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
            ) : (
              <Eye className="h-4.5 w-4.5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {isVisible ? `Hide ${field.label}` : `Show ${field.label}`}
            </span>
          </button>
        </div>
        {field.hint && <p className="text-sm text-ink-muted">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="field-label">
          {field.label}
          {field.required && (
            <>
              <span className="ml-0.5 text-gold-dark" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
        <div className="relative">
          <select
            id={id}
            name={field.name}
            defaultValue=""
            className={`field-control-flat appearance-none ${icon ? 'pl-11' : ''} pr-10`}
          >
            <option value="" disabled>
              Select an option
            </option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {icon && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <Chevron
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted"
            aria-hidden="true"
          />
        </div>
        {field.hint && <p className="text-sm text-ink-muted">{field.hint}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="field-label">
        {field.label}
        {field.required && (
          <>
            <span className="ml-0.5 text-gold-dark" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          name={field.name}
          type={field.type}
          autoComplete={
            field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'on'
          }
          placeholder={field.placeholder}
          className={`field-control-flat ${icon ? 'pl-11' : ''}`}
        />
        {icon && (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      {field.hint && <p className="text-sm text-ink-muted">{field.hint}</p>}
    </div>
  );
}

/** Inline chevron for the select control, avoiding a second icon import. */
function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`size-4 ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
