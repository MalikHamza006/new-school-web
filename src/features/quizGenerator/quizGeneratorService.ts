/**
 * Deterministic "AI" quiz generator (demo).
 *
 * Same contract as the paper generator: no model, no network. A seeded
 * selection from the sample bank produces a repeatable quiz, and the exported
 * `generateQuiz` is the seam a real provider would replace.
 */
import { hashString, withDemoDelay, makeId } from '../demoGeneration';
import { selectQuestions } from '../questionSelection';
import { quizBankFor } from './quizGeneratorData';
import type { ClassName, SubjectName } from '../paperGenerator/paperGeneratorTypes';
import type { GeneratedQuiz, QuizFormInput, QuizQuestion } from './quizGeneratorTypes';

function classNumber(className: ClassName): number {
  return Number(className);
}

function buildInstructions(input: QuizFormInput): string[] {
  const instructions = [
    'Attempt every question; each carries equal marks.',
    'Choose the single best option for each question.',
  ];
  if (input.timeLimitMinutes > 0) {
    instructions.push(`You have ${input.timeLimitMinutes} minutes. The timer starts when you begin.`);
  } else {
    instructions.push('There is no time limit for this quiz.');
  }
  instructions.push('Your answers are marked when you submit.');
  return instructions;
}

/** Assemble a complete quiz from a validated form and a seed. */
export function buildQuiz(input: QuizFormInput, seed: number): GeneratedQuiz {
  const className = input.className as ClassName;
  const subject = input.subject as SubjectName;
  const bank = quizBankFor(subject);
  const target = classNumber(className);
  const difficulty = input.difficulty === 'Mixed' ? null : input.difficulty;

  const selected = selectQuestions(bank, input.questionCount, target, difficulty, seed);

  const questions: QuizQuestion[] = selected.map((question, index) => ({
    id: `qz-${question.id}`,
    bankId: question.id,
    number: index + 1,
    text: question.text,
    options: question.options.slice(),
    answerIndex: question.answerIndex,
    explanation: question.explanation,
    difficulty: question.difficulty,
  }));

  return {
    id: makeId('quiz'),
    title: `Class ${className} ${subject} — ${input.difficulty} Quiz`,
    className,
    subject,
    difficulty: input.difficulty,
    createdAt: new Date().toISOString(),
    input: { ...input },
    instructions: buildInstructions(input),
    questions,
  };
}

/** The seed for a request: stable for a given form, varied by `generationCount`. */
export function quizSeedFor(input: QuizFormInput, generationCount: number): number {
  return hashString(`quiz:${JSON.stringify(input)}`) + generationCount * 40503;
}

/** The public async "generate" call, shaped like a future provider request. */
export function generateQuiz(input: QuizFormInput, generationCount: number): Promise<GeneratedQuiz> {
  const quiz = buildQuiz(input, quizSeedFor(input, generationCount));
  return withDemoDelay(quiz);
}
