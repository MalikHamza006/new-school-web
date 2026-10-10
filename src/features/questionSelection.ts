/**
 * Shared question-selection logic for both generators.
 *
 * The paper generator and the quiz generator both need the same thing: choose N
 * questions from a bank, preferring ones written for the target class and the
 * requested difficulty, and failing that, the nearest classes. Keeping it here
 * means the two generators cannot drift apart.
 */
import { seededShuffle } from './demoGeneration';
import type { Difficulty } from './paperGenerator/paperGeneratorTypes';

/** The bit of a bank question the selection logic cares about. */
export interface SelectableQuestion {
  difficulty: Difficulty;
  classes: readonly [number, number];
}

/** How far a question's class range sits from a target class (0 when in range). */
export function rangeDistance(classes: readonly [number, number], target: number): number {
  const [lo, hi] = classes;
  if (target < lo) return lo - target;
  if (target > hi) return target - hi;
  return 0;
}

/**
 * Pick `count` questions from `pool`, preferring in-range classes and, within
 * each distance band, the requested difficulty. Passing `null` for `difficulty`
 * disables the difficulty preference (used for "Mixed" quizzes).
 *
 * Deterministic for a given `seed`.
 */
export function selectQuestions<T extends SelectableQuestion>(
  pool: readonly T[],
  count: number,
  target: number,
  difficulty: Difficulty | null,
  seed: number
): T[] {
  if (count <= 0) return [];

  const buckets = new Map<number, T[]>();
  for (const question of pool) {
    const distance = rangeDistance(question.classes, target);
    const bucket = buckets.get(distance);
    if (bucket) bucket.push(question);
    else buckets.set(distance, [question]);
  }

  const ordered: T[] = [];
  const distances = Array.from(buckets.keys()).sort((a, b) => a - b);
  for (const distance of distances) {
    const bucket = buckets.get(distance) ?? [];
    const matching = difficulty ? bucket.filter((q) => q.difficulty === difficulty) : [];
    const others = difficulty ? bucket.filter((q) => q.difficulty !== difficulty) : bucket;
    ordered.push(...seededShuffle(matching, seed + distance * 101));
    ordered.push(...seededShuffle(others, seed + distance * 101 + 7));
  }

  return ordered.slice(0, count);
}
