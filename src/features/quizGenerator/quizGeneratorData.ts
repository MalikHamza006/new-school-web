/**
 * Options, limits and validation for the Quiz Generator demo.
 *
 * The quiz reuses the multiple-choice questions from the paper generator's
 * sample banks, so there is one source of truth for the questions themselves.
 */
import { CLASS_OPTIONS, SUBJECT_OPTIONS, questionBanks } from '../paperGenerator/paperGeneratorData';
import type { BankChoiceQuestion, SubjectName } from '../paperGenerator/paperGeneratorTypes';
import type { QuizDifficulty, QuizFormInput } from './quizGeneratorTypes';

export { CLASS_OPTIONS, SUBJECT_OPTIONS };

export const QUIZ_DIFFICULTY_OPTIONS: readonly QuizDifficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];

/**
 * The bank holds ten MCQs per subject, so a quiz is capped at eight to keep it
 * a *quiz* (a short check of understanding) rather than an exam.
 */
export const MAX_QUIZ_QUESTIONS = 8;
export const MIN_QUIZ_QUESTIONS = 3;

/** A sensible starting point: a quick eight-question mixed quiz. */
export const defaultQuizForm: QuizFormInput = {
  className: '9',
  subject: 'Physics',
  topics: 'Chapter 3: Kinematics; Chapter 4: Dynamics',
  questionCount: 6,
  difficulty: 'Mixed',
  timeLimitMinutes: 0,
};

/** The MCQ bank for a subject, or an empty list if the subject has none. */
export function quizBankFor(subject: SubjectName): BankChoiceQuestion[] {
  return questionBanks[subject]?.mcq ?? [];
}

export type QuizFormField = keyof QuizFormInput;

export interface QuizFormValidation {
  errors: Partial<Record<QuizFormField, string>>;
  isValid: boolean;
}

const TIME_LIMIT_MAX = 120;

/** Validate the quiz form. Pure, so it can run in the component and the thunk. */
export function validateQuizInput(input: QuizFormInput): QuizFormValidation {
  const errors: Partial<Record<QuizFormField, string>> = {};

  if (!input.className) errors.className = 'Choose a class.';
  if (!input.subject) errors.subject = 'Choose a subject.';
  if (!input.topics.trim()) errors.topics = 'List at least one topic or chapter.';

  if (
    !Number.isFinite(input.questionCount) ||
    input.questionCount < MIN_QUIZ_QUESTIONS ||
    input.questionCount > MAX_QUIZ_QUESTIONS
  ) {
    errors.questionCount = `Choose between ${MIN_QUIZ_QUESTIONS} and ${MAX_QUIZ_QUESTIONS} questions.`;
  }

  if (!Number.isFinite(input.timeLimitMinutes) || input.timeLimitMinutes < 0 || input.timeLimitMinutes > TIME_LIMIT_MAX) {
    errors.timeLimitMinutes = `Use 0 for no limit, or up to ${TIME_LIMIT_MAX} minutes.`;
  }

  const subject = input.subject as SubjectName | '';
  if (subject && input.questionCount > quizBankFor(subject).length) {
    errors.questionCount = `${subject} only has ${quizBankFor(subject).length} sample questions.`;
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
