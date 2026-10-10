/**
 * Types for the AI Quiz Generator demo.
 *
 * A quiz is a short, self-marking set of multiple-choice questions drawn from
 * the same sample bank the paper generator uses. The attempt state is kept
 * separate from the generated quiz so "Retake" can reset answers without
 * regenerating the questions.
 */
import type { ClassName, Difficulty, GenerationStatus, SubjectName } from '../paperGenerator/paperGeneratorTypes';

/** Quiz difficulty adds "Mixed" to the paper generator's three levels. */
export type QuizDifficulty = Difficulty | 'Mixed';

/** The form the teacher fills in to request a quiz. */
export interface QuizFormInput {
  className: ClassName | '';
  subject: SubjectName | '';
  /** Free-text topics or chapters the quiz should cover. */
  topics: string;
  questionCount: number;
  difficulty: QuizDifficulty;
  /** In minutes; 0 means no time limit. */
  timeLimitMinutes: number;
}

/** One multiple-choice question as it appears in a generated quiz. */
export interface QuizQuestion {
  id: string;
  bankId: string;
  number: number;
  text: string;
  options: string[];
  /** Correct option, kept out of the UI until the quiz is submitted. */
  answerIndex: number;
  explanation: string;
  difficulty: Difficulty;
}

/** A complete generated quiz. */
export interface GeneratedQuiz {
  id: string;
  title: string;
  className: ClassName;
  subject: SubjectName;
  difficulty: QuizDifficulty;
  createdAt: string;
  input: QuizFormInput;
  instructions: string[];
  questions: QuizQuestion[];
}

/** Answer sheet for one attempt at the current quiz. */
export interface QuizAttemptState {
  /** Question id → selected option index. */
  answers: Record<string, number>;
  /** Question id → flagged for review. */
  flagged: Record<string, boolean>;
  submitted: boolean;
  startedAt: string | null;
  submittedAt: string | null;
}

/** Per-question marking, used by the results screen. */
export interface QuizQuestionResult {
  questionId: string;
  selected: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

/** Marked result of a submitted attempt. */
export interface QuizResult {
  correct: number;
  total: number;
  percentage: number;
  perQuestion: QuizQuestionResult[];
}

/** Re-exported so consumers of the quiz feature need only one import. */
export type { GenerationStatus };
