import type { RootState } from '../../store';
import type { GeneratedQuiz, QuizResult } from './quizGeneratorTypes';

export const selectQuizForm = (state: RootState) => state.quizGenerator.form;
export const selectQuizStatus = (state: RootState) => state.quizGenerator.status;
export const selectQuizError = (state: RootState) => state.quizGenerator.error;
export const selectCurrentQuiz = (state: RootState) => state.quizGenerator.current;
export const selectQuizHistory = (state: RootState) => state.quizGenerator.history;
export const selectQuizAttempt = (state: RootState) => state.quizGenerator.attempt;
export const selectQuizCurrentIndex = (state: RootState) => state.quizGenerator.currentIndex;
export const selectQuizIsLoading = (state: RootState) => state.quizGenerator.status === 'loading';
export const selectQuizIsSubmitted = (state: RootState) => state.quizGenerator.attempt.submitted;

export const selectQuizById = (state: RootState, id: string) =>
  state.quizGenerator.history.find((item) => item.id === id) ?? null;

/**
 * Mark a quiz against an attempt. Pure and exported on its own so both the
 * results screen and any test can call it with a hand-built attempt.
 */
export function markQuiz(quiz: GeneratedQuiz, attempt: { answers: Record<string, number> }): QuizResult {
  const perQuestion = quiz.questions.map((question) => {
    const selected = Object.prototype.hasOwnProperty.call(attempt.answers, question.id)
      ? attempt.answers[question.id]
      : null;
    return {
      questionId: question.id,
      selected,
      correctIndex: question.answerIndex,
      isCorrect: selected === question.answerIndex,
    };
  });

  const correct = perQuestion.filter((item) => item.isCorrect).length;
  const total = quiz.questions.length;

  return {
    correct,
    total,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    perQuestion,
  };
}

/** The marked result for the current quiz, or null when nothing is submitted. */
export function selectQuizResult(state: RootState): QuizResult | null {
  const quiz = state.quizGenerator.current;
  const attempt = state.quizGenerator.attempt;
  if (!quiz || !attempt.submitted) return null;
  return markQuiz(quiz, attempt);
}

/** How many questions have been answered so far. */
export function selectQuizAnsweredCount(state: RootState): number {
  const quiz = state.quizGenerator.current;
  if (!quiz) return 0;
  const answers = state.quizGenerator.attempt.answers;
  return quiz.questions.reduce(
    (count, question) => (Object.prototype.hasOwnProperty.call(answers, question.id) ? count + 1 : count),
    0
  );
}
