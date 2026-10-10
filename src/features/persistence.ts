/**
 * Local persistence for generated content.
 *
 * The demo keeps the last few papers and quizzes in `localStorage` so a refresh
 * does not wipe the teacher's work. Everything stored is sample, non-sensitive
 * content produced in the browser; nothing is sent anywhere. All access is
 * wrapped so private-mode browsers, disabled storage or corrupt JSON degrade to
 * "no saved history" instead of crashing the app.
 */
import type { GeneratedPaper } from './paperGenerator/paperGeneratorTypes';
import type { GeneratedQuiz } from './quizGenerator/quizGeneratorTypes';

const PAPER_KEY = 'spectral.ai.paperHistory.v1';
const QUIZ_KEY = 'spectral.ai.quizHistory.v1';
const MAX_RECORDS = 20;

function readArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]).slice(0, MAX_RECORDS) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: readonly T[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value.slice(0, MAX_RECORDS)));
  } catch {
    /* Storage unavailable or full; the session still works without persistence. */
  }
}

export function loadPaperHistory(): GeneratedPaper[] {
  return readArray<GeneratedPaper>(PAPER_KEY);
}

export function savePaperHistory(history: readonly GeneratedPaper[]): void {
  writeArray(PAPER_KEY, history);
}

export function loadQuizHistory(): GeneratedQuiz[] {
  return readArray<GeneratedQuiz>(QUIZ_KEY);
}

export function saveQuizHistory(history: readonly GeneratedQuiz[]): void {
  writeArray(QUIZ_KEY, history);
}
