/**
 * Shared helpers for the demo AI generators.
 *
 * HONESTY CONTRACT
 * ----------------
 * Nothing in `features/paperGenerator` or `features/quizGenerator` talks to an
 * AI provider, an API or a backend. The generators are *local and deterministic*:
 * they pick questions from hand-written sample banks using a seeded shuffle, so
 * the same input always produces the same paper. That is deliberate — a demo
 * that looked like a live model would be a lie, and a demo that changed on every
 * render would be untestable.
 *
 * The only thing that is "random" is the seed, which advances once per
 * generation so that "Regenerate" returns a different selection from the same
 * bank rather than the identical paper.
 *
 * The public interface (`generatePaper` / `generateQuiz` on each feature's
 * service) is shaped like a future AI call so that swapping the local bank for a
 * real, server-side provider is a change behind that interface and nothing else.
 */

/** Shown on every generated artefact. The demo questions are samples, not syllabus. */
export const DEMO_MODE_LABEL = 'Demo Mode — Sample Questions';

/**
 * A short, artificial delay for the generation thunks so the UI can show a
 * loading state. Roughly the time a real model call would take to feel
 * "working" without making the demo tedious.
 */
export const DEMO_DELAY_MS = 550;

/** Resolve a value after the demo delay, to simulate an asynchronous provider. */
export function withDemoDelay<T>(value: T, ms: number = DEMO_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

/**
 * Deterministic 32-bit string hash (FNV-1a). Used to turn a human-readable
 * description of the request into a numeric seed.
 */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Seeded pseudo-random generator (mulberry32). Same seed → same sequence, on
 * every machine and every run, which is what makes the "generation" repeatable.
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a new array shuffled deterministically by `seed` (Fisher–Yates). */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const random = createSeededRandom(seed);
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** A short, sortable, human-readable id, e.g. `paper-1712345678901-4f3a`. */
export function makeId(prefix: string): string {
  const stamp = Date.now().toString(36);
  const rand = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, '0');
  return `${prefix}-${stamp}-${rand}`;
}

/** Format a timestamp for display, e.g. "12 Jun 2026, 3:40 PM". */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
