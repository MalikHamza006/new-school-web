import { Clock, FileText, Target } from 'lucide-react';
import { DemoNotice } from './GenerationStatus';
import type { GeneratedPaper, PaperQuestion } from '../../features/paperGenerator/paperGeneratorTypes';

function optionLetter(index: number): string {
  return String.fromCharCode(97 + index);
}

function marksLabel(marks: number): string {
  return `${marks} ${marks === 1 ? 'mark' : 'marks'}`;
}

function QuestionBlock({ question, showOptions }: { question: PaperQuestion; showOptions?: boolean }) {
  return (
    <li className="flex gap-3">
      <span className="w-7 shrink-0 text-right font-semibold text-navy tabular-nums">
        {question.number}.
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[0.975rem] leading-relaxed text-ink">{question.text}</p>
          <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-ink-muted">
            [{marksLabel(question.marks)}]
          </span>
        </div>

        {showOptions && question.options && (
          <ol className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {question.options.map((option, index) => (
              <li key={option} className="flex gap-2 text-sm text-ink-muted">
                <span className="font-semibold text-navy">({optionLetter(index)})</span>
                <span>{option}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </li>
  );
}

/**
 * The printable paper. Everything visual here is print-safe: black text on
 * white, no shadow, no colour that would fail on a school photocopier. The
 * demo label is kept even in print, so a printed copy cannot be mistaken for
 * approved material.
 */
export function PaperPreview({ paper }: { paper: GeneratedPaper }) {
  const { header } = paper;

  return (
    <article className="print-area mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 text-ink shadow-lift sm:p-10 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
      {/* Header */}
      <header className="text-center">
        <DemoNotice compact className="print:hidden" />
        <h2 className="mt-3 font-display text-xl font-bold text-navy sm:text-2xl print:text-black">
          {header.schoolName}
        </h2>
        <p className="mt-1 font-display text-base font-semibold text-ink sm:text-lg">
          {header.paperType} — Class {header.className} {header.subject}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-sm text-ink">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-navy print:text-black" aria-hidden="true" />
            Total marks: <strong>{header.totalMarks}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-navy print:text-black" aria-hidden="true" />
            Time: <strong>{header.durationMinutes} min</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Target className="h-4 w-4 text-navy print:text-black" aria-hidden="true" />
            Difficulty: <strong>{header.difficulty}</strong>
          </span>
        </div>

        {header.topics && (
          <p className="mt-3 text-sm text-ink-muted">
            <span className="font-semibold text-navy">Topics:</span> {header.topics}
          </p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-y-2 text-left text-sm sm:grid-cols-2">
          <p>
            <span className="font-medium">Student Name:</span> {header.studentNamePlaceholder}
          </p>
          <p>
            <span className="font-medium">Roll No:</span> {header.rollNumberPlaceholder}
          </p>
          <p>
            <span className="font-medium">Date:</span> {header.datePlaceholder}
          </p>
        </div>

        <hr className="mt-5 border-t border-dashed border-navy-200" />
      </header>

      {/* Instructions */}
      <section className="mt-5" aria-labelledby="paper-instructions">
        <h3 id="paper-instructions" className="font-display text-sm font-semibold uppercase tracking-wide text-navy">
          Instructions
        </h3>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-ink-muted">
          {paper.instructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ol>
      </section>

      {/* Section A — MCQs */}
      {paper.mcq.length > 0 && (
        <section className="mt-8" aria-labelledby="section-a">
          <h3
            id="section-a"
            className="border-b border-navy-200 pb-1 font-display text-base font-semibold text-navy"
          >
            Section A — Multiple Choice Questions
          </h3>
          <ol className="mt-4 space-y-4">
            {paper.mcq.map((question) => (
              <QuestionBlock key={question.id} question={question} showOptions />
            ))}
          </ol>
        </section>
      )}

      {/* Section B — Short questions */}
      {paper.short.length > 0 && (
        <section className="mt-8" aria-labelledby="section-b">
          <h3
            id="section-b"
            className="border-b border-navy-200 pb-1 font-display text-base font-semibold text-navy"
          >
            Section B — Short Answer Questions
          </h3>
          <ol className="mt-4 space-y-4">
            {paper.short.map((question) => (
              <QuestionBlock key={question.id} question={question} />
            ))}
          </ol>
        </section>
      )}

      {/* Section C — Long questions */}
      {paper.long.length > 0 && (
        <section className="mt-8" aria-labelledby="section-c">
          <h3
            id="section-c"
            className="border-b border-navy-200 pb-1 font-display text-base font-semibold text-navy"
          >
            Section C — Long Answer Questions
          </h3>
          <ol className="mt-4 space-y-4">
            {paper.long.map((question) => (
              <QuestionBlock key={question.id} question={question} />
            ))}
          </ol>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-navy-200 pt-4 text-sm text-ink-muted">
        <span>Prepared by: {header.teacherSignaturePlaceholder}</span>
        <span>Checked by: {header.teacherSignaturePlaceholder}</span>
        <span className="text-xs">Page 1</span>
      </footer>
    </article>
  );
}
