/**
 * Deterministic "AI" paper generator (demo).
 *
 * There is no model here. Given a form and a numeric seed, this module selects
 * questions from the sample banks and assembles a paper whose marks add up
 * exactly. The same input and seed always produce the same paper, which is what
 * makes "Regenerate" testable: the slice changes the seed, not the algorithm.
 *
 * The exported `generatePaper` is the seam a real provider would replace: its
 * signature already describes an asynchronous, out-of-process generation, so the
 * caller does not care whether the questions came from a local bank or a server.
 */
import { hashString, withDemoDelay, DEMO_MODE_LABEL, makeId } from '../demoGeneration';
import { selectQuestions } from '../questionSelection';
import { planMarks, questionBanks } from './paperGeneratorData';
import type {
  BankChoiceQuestion,
  BankWrittenQuestion,
  ClassName,
  GeneratedPaper,
  MarksPlan,
  PaperFormInput,
  PaperHeader,
  PaperQuestion,
  SubjectBank,
  SubjectName,
} from './paperGeneratorTypes';

/** The school name printed on every paper, taken from the verified site content. */
const SCHOOL_NAME = 'Spectral Model School & College';

/** A blank rule for the teacher or office to complete by hand. */
const BLANK = '________________';

function classNumber(className: ClassName): number {
  return Number(className);
}

function toMcqQuestion(question: BankChoiceQuestion, number: number, marks: number): PaperQuestion {
  const answerIndex = question.answerIndex;
  return {
    id: `q-${question.id}`,
    bankId: question.id,
    type: 'mcq',
    number,
    text: question.text,
    marks,
    options: question.options.slice(),
    answerIndex,
    answer: `${question.options[answerIndex]} — ${question.explanation}`,
  };
}

function toWrittenQuestion(
  question: BankWrittenQuestion,
  type: 'short' | 'long',
  number: number,
  marks: number
): PaperQuestion {
  return {
    id: `q-${question.id}`,
    bankId: question.id,
    type,
    number,
    text: question.text,
    marks,
    answer: question.answer,
  };
}

/** Build the ordered list of instructions printed at the top of the paper. */
function buildInstructions(input: PaperFormInput): string[] {
  const instructions = [
    'Write your name and roll number clearly on the answer sheet.',
    'Read every question carefully before attempting it.',
  ];

  if (input.mcqCount > 0) {
    instructions.push('For each MCQ, circle the letter of the single best answer.');
  }
  if (input.shortCount > 0) {
    instructions.push('Answer short questions briefly and to the point.');
  }
  if (input.longCount > 0) {
    instructions.push('Answer long questions in detail, showing all working where required.');
  }

  instructions.push('Marks for each question are shown in the margin.');
  return instructions;
}

/** Everything the preview needs to print the paper header, computed once. */
function buildHeader(input: PaperFormInput, totalMarks: number): PaperHeader {
  const className = input.className as ClassName;
  const subject = input.subject as SubjectName;

  return {
    schoolName: SCHOOL_NAME,
    className,
    subject,
    paperType: input.paperType as PaperHeader['paperType'],
    totalMarks,
    durationMinutes: input.durationMinutes,
    difficulty: input.difficulty,
    topics: input.topics.trim(),
    datePlaceholder: BLANK,
    studentNamePlaceholder: BLANK,
    rollNumberPlaceholder: BLANK,
    teacherSignaturePlaceholder: BLANK,
  };
}

/**
 * Assemble a complete paper from a validated form and a seed.
 *
 * Throws only if the form was not validated first; callers run
 * `validatePaperInput` before dispatching, and the thunk re-checks.
 */
export function buildPaper(input: PaperFormInput, seed: number): GeneratedPaper {
  const className = input.className as ClassName;
  const subject = input.subject as SubjectName;
  const bank: SubjectBank = questionBanks[subject];
  const target = classNumber(className);

  const marksResult = planMarks(input);
  if (!marksResult.ok) {
    throw new Error(marksResult.message);
  }
  const marksPlan: MarksPlan = marksResult.plan;

  const mcqSelections = selectQuestions(bank.mcq, input.mcqCount, target, input.difficulty, seed);
  const shortSelections = selectQuestions(bank.short, input.shortCount, target, input.difficulty, seed + 1);
  const longSelections = selectQuestions(bank.long, input.longCount, target, input.difficulty, seed + 2);

  let number = 0;
  const mcq = mcqSelections.map((question) => {
    number += 1;
    return toMcqQuestion(question, number, marksPlan.mcqMarks);
  });
  const short = shortSelections.map((question) => {
    number += 1;
    return toWrittenQuestion(question, 'short', number, marksPlan.shortMarks);
  });
  const long = longSelections.map((question) => {
    number += 1;
    return toWrittenQuestion(question, 'long', number, marksPlan.longMarks);
  });

  const questions = [...mcq, ...short, ...long];
  const paperType = input.paperType as string;

  return {
    id: makeId('paper'),
    title: `Class ${className} ${subject} — ${paperType}`,
    className,
    subject,
    paperType: input.paperType as GeneratedPaper['paperType'],
    difficulty: input.difficulty,
    createdAt: new Date().toISOString(),
    input: { ...input },
    header: buildHeader(input, marksPlan.allocated),
    instructions: buildInstructions(input),
    marksPlan,
    mcq,
    short,
    long,
    questions,
  };
}

/** The seed for a request: stable for a given form, varied by `generationCount`. */
export function seedFor(input: PaperFormInput, generationCount: number): number {
  return hashString(JSON.stringify(input)) + generationCount * 2654435761;
}

/**
 * The public "generate" call. Async and delayed so the UI can show a loading
 * state, exactly as a real provider call would be. The demo label is attached by
 * the preview, not here.
 */
export function generatePaper(input: PaperFormInput, generationCount: number): Promise<GeneratedPaper> {
  const paper = buildPaper(input, seedFor(input, generationCount));
  return withDemoDelay(paper);
}

export { DEMO_MODE_LABEL };
