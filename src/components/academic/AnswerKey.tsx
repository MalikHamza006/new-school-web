import { KeyRound } from 'lucide-react';
import type { GeneratedPaper, PaperQuestion } from '../../features/paperGenerator/paperGeneratorTypes';

function AnswerRow({ question }: { question: PaperQuestion }) {
  return (
    <li className="flex gap-3 text-sm">
      <span className="w-7 shrink-0 text-right font-semibold text-navy tabular-nums">
        {question.number}.
      </span>
      <div className="min-w-0">
        <p className="font-medium text-ink">{question.text}</p>
        <p className="mt-1 leading-relaxed text-ink-muted">
          <span className="font-semibold text-navy">Answer: </span>
          {question.answer}
        </p>
      </div>
    </li>
  );
}

/**
 * The answer key. Rendered only when the teacher turns it on, which is why it
 * is a separate component rather than a section that is merely hidden: nothing
 * that is not on the page can be printed, so answers cannot leak into a printed
 * paper by accident.
 */
export function AnswerKey({ paper }: { paper: GeneratedPaper }) {
  const sections: Array<{ id: string; title: string; items: PaperQuestion[] }> = [
    { id: 'key-a', title: 'Section A — Multiple Choice Questions', items: paper.mcq },
    { id: 'key-b', title: 'Section B — Short Answer Questions', items: paper.short },
    { id: 'key-c', title: 'Section C — Long Answer Questions', items: paper.long },
  ].filter((section) => section.items.length > 0);

  return (
    <article className="print-area mt-8 rounded-2xl bg-navy-50/70 p-6 sm:p-8 print:mt-6 print:rounded-none print:bg-white print:p-0">
      <header className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold-light">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-navy">Answer Key</h3>
          <p className="text-xs text-ink-muted">
            For the teacher. Not shown on the paper itself unless you enable it.
          </p>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="mt-6" aria-labelledby={section.id}>
          <h4
            id={section.id}
            className="border-b border-navy-200 pb-1 font-display text-sm font-semibold uppercase tracking-wide text-navy"
          >
            {section.title}
          </h4>
          <ol className="mt-3 space-y-4">
            {section.items.map((question) => (
              <AnswerRow key={question.id} question={question} />
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
}
