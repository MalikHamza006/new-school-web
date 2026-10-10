/**
 * Types for the AI Paper Generator demo.
 *
 * Kept separate from the data, the service and the slice so the shape of a
 * request, a generated paper and a saved record are defined once and imported
 * everywhere. The service interface here is intentionally provider-agnostic: it
 * describes what a *paper generator* returns, not what any particular local
 * bank or future AI provider happens to produce.
 */

/** School classes the generator offers. Stored as strings to match <select> values. */
export type ClassName = '6' | '7' | '8' | '9' | '10' | '11' | '12';

/** Subjects with a sample question bank. */
export type SubjectName =
  | 'Computer Science'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'English'
  | 'Urdu';

/** The kind of assessment the paper represents. */
export type PaperType = 'Weekly Test' | 'Monthly Test' | 'Midterm' | 'Final Exam';

/** Difficulty, used to bias which sample questions are chosen. */
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/** Question sections a paper is built from. */
export type PaperQuestionType = 'mcq' | 'short' | 'long';

/** Inclusive range of classes a sample question is written for, e.g. [9, 10]. */
export type ClassRange = readonly [number, number];

/** The form the teacher fills in to request a paper. */
export interface PaperFormInput {
  className: ClassName | '';
  subject: SubjectName | '';
  paperType: PaperType | '';
  /** Free-text topics or chapters, e.g. "Chapter 3: Kinematics; Chapter 4: Dynamics". */
  topics: string;
  totalMarks: number;
  durationMinutes: number;
  difficulty: Difficulty;
  mcqCount: number;
  shortCount: number;
  longCount: number;
}

/** A question in the *bank*, before it becomes part of a generated paper. */
export interface BankChoiceQuestion {
  id: string;
  text: string;
  /** Exactly four options; the correct one is `answerIndex`. */
  options: readonly string[];
  answerIndex: number;
  difficulty: Difficulty;
  classes: ClassRange;
  explanation: string;
}

/** A short- or long-answer question in the bank. */
export interface BankWrittenQuestion {
  id: string;
  text: string;
  /** Model answer, shown in the answer key only. */
  answer: string;
  difficulty: Difficulty;
  classes: ClassRange;
}

/** The sample bank for one subject. */
export interface SubjectBank {
  mcq: BankChoiceQuestion[];
  short: BankWrittenQuestion[];
  long: BankWrittenQuestion[];
}

/**
 * A question as it appears on a generated paper. Carries its own marks so the
 * paper is self-describing, and keeps the bank id so an answer key can be matched.
 */
export interface PaperQuestion {
  id: string;
  bankId: string;
  type: PaperQuestionType;
  number: number;
  text: string;
  marks: number;
  /** Present for MCQs. */
  options?: string[];
  answerIndex?: number;
  /** Model answer for the answer key. */
  answer: string;
}

/** The marks awarded to each section. */
export interface MarksPlan {
  mcqMarks: number;
  shortMarks: number;
  longMarks: number;
  allocated: number;
}

/** Outcome of trying to fit the requested counts to the requested total marks. */
export type MarksPlanResult =
  | { ok: true; plan: MarksPlan }
  | { ok: false; message: string; min: number; max: number };

/** The header metadata printed on the paper. */
export interface PaperHeader {
  schoolName: string;
  className: ClassName;
  subject: SubjectName;
  paperType: PaperType;
  totalMarks: number;
  durationMinutes: number;
  difficulty: Difficulty;
  topics: string;
  /** Blank line for the teacher or office to fill in. */
  datePlaceholder: string;
  studentNamePlaceholder: string;
  rollNumberPlaceholder: string;
  teacherSignaturePlaceholder: string;
}

/** A complete generated paper. */
export interface GeneratedPaper {
  id: string;
  title: string;
  className: ClassName;
  subject: SubjectName;
  paperType: PaperType;
  difficulty: Difficulty;
  createdAt: string;
  /** The request that produced it, kept so it can be regenerated or re-edited. */
  input: PaperFormInput;
  header: PaperHeader;
  instructions: string[];
  marksPlan: MarksPlan;
  mcq: PaperQuestion[];
  short: PaperQuestion[];
  long: PaperQuestion[];
  /** Every question in order, for counting and preview rendering. */
  questions: PaperQuestion[];
}

/** Status of the demo generation request. */
export type GenerationStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
