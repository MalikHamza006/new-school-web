import { useEffect, useState } from 'react';
import {
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Flag,
  Info,
  ListChecks,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui';
import { Label, RadioGroup, RadioGroupItem } from '../shadcn/primitives';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  goToQuizQuestion,
  resetQuizAttempt,
  selectQuizAnswer,
  startQuizAttempt,
  submitQuizAttempt,
  toggleQuizFlag,
} from '../../features/quizGenerator/quizGeneratorSlice';
import {
  selectQuizAnsweredCount,
  selectQuizAttempt,
  selectQuizCurrentIndex,
  selectQuizResult,
} from '../../features/quizGenerator/quizGeneratorSelectors';
import type { GeneratedQuiz, QuizQuestion } from '../../features/quizGenerator/quizGeneratorTypes';

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Not started                                                         */
/* ------------------------------------------------------------------ */

function QuizStart({ quiz, onStart }: { quiz: GeneratedQuiz; onStart: () => void }) {
  return (
    <div className="rounded-2xl bg-navy-50/70 p-6 text-center sm:p-8">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold-light">
        <ListChecks className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-navy">{quiz.title}</h3>
      <p className="mt-1 text-sm text-ink-muted">
        {quiz.questions.length} questions
        {quiz.input.timeLimitMinutes > 0 ? ` · ${quiz.input.timeLimitMinutes} minute limit` : ' · no time limit'}
      </p>

      <ol className="mx-auto mt-5 max-w-md list-inside list-decimal space-y-1 text-left text-sm text-ink-muted">
        {quiz.instructions.map((instruction) => (
          <li key={instruction}>{instruction}</li>
        ))}
      </ol>

      <Button variant="primary" className="mt-6" onClick={onStart}>
        Start quiz
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        Answers are revealed only after you submit.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* In progress                                                         */
/* ------------------------------------------------------------------ */

function QuestionCard({ question }: { question: QuizQuestion }) {
  const dispatch = useAppDispatch();
  const attempt = useAppSelector(selectQuizAttempt);
  const selected = attempt.answers[question.id];
  const isFlagged = Boolean(attempt.flagged[question.id]);
  const answered = Object.prototype.hasOwnProperty.call(attempt.answers, question.id);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-lift sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-base font-semibold text-navy sm:text-lg">
          <span className="mr-2 text-ink-muted">Q{question.number}.</span>
          {question.text}
        </p>
        <button
          type="button"
          onClick={() => dispatch(toggleQuizFlag(question.id))}
          aria-pressed={isFlagged}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
            isFlagged ? 'bg-gold/20 text-gold-dark' : 'bg-navy-50 text-ink-muted hover:bg-navy-100'
          )}
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          {isFlagged ? 'Flagged' : 'Flag'}
        </button>
      </div>

      <RadioGroup
        className="mt-5 gap-2"
        aria-label={`Options for question ${question.number}`}
        value={answered ? String(selected) : ''}
        onValueChange={(value) =>
          dispatch(selectQuizAnswer({ questionId: question.id, optionIndex: Number(value) }))
        }
      >
        {question.options.map((option, index) => {
          const optionId = `${question.id}-option-${index}`;
          const isChosen = selected === index;
          return (
            <Label
              key={optionId}
              htmlFor={optionId}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl p-3.5 text-sm font-normal transition-colors',
                isChosen ? 'bg-navy/5' : 'hover:bg-navy-50/70'
              )}
            >
              <RadioGroupItem id={optionId} value={String(index)} className="mt-0.5" />
              <span className="text-ink">
                <span className="mr-1.5 font-semibold text-navy">({optionLetter(index)})</span>
                {option}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}

function QuizInProgress({ quiz }: { quiz: GeneratedQuiz }) {
  const dispatch = useAppDispatch();
  const attempt = useAppSelector(selectQuizAttempt);
  const currentIndex = useAppSelector(selectQuizCurrentIndex);
  const answeredCount = useAppSelector(selectQuizAnsweredCount);
  const timeLimit = quiz.input.timeLimitMinutes;
  const startedAt = attempt.startedAt;

  /* Elapsed seconds are ticked by an interval; the remaining time is then
     derived during render. Deriving (rather than storing `remaining` and
     setting it from the effect) avoids a synchronous setState in the effect
     and keeps the timer a pure function of the clock. */
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (timeLimit <= 0 || !startedAt) return;
    const startMs = new Date(startedAt).getTime();
    const id = window.setInterval(() => {
      setElapsed(Math.round((Date.now() - startMs) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timeLimit, startedAt]);

  const remaining = timeLimit > 0 ? Math.max(0, timeLimit * 60 - elapsed) : null;

  /* Auto-submit the moment the clock runs out. */
  useEffect(() => {
    if (remaining === 0) dispatch(submitQuizAttempt());
  }, [remaining, dispatch]);

  const question = quiz.questions[currentIndex] ?? quiz.questions[0];
  if (!question) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === quiz.questions.length - 1;
  const answered = (id: string) => Object.prototype.hasOwnProperty.call(attempt.answers, id);

  return (
    <div className="space-y-5">
      {/* Progress + timer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-muted">
          Question <span className="font-semibold text-navy">{currentIndex + 1}</span> of{' '}
          {quiz.questions.length} · <span className="font-semibold text-navy">{answeredCount}</span> answered
        </p>
        {remaining !== null && (
          <p
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold',
              remaining <= 30 ? 'bg-red-50 text-red-600' : 'bg-navy-50 text-navy'
            )}
            role="timer"
            aria-live="off"
          >
            <Timer className="h-4 w-4" aria-hidden="true" />
            {formatTime(remaining)}
          </p>
        )}
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Question navigator">
        {quiz.questions.map((item, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = answered(item.id);
          const isFlagged = Boolean(attempt.flagged[item.id]);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => dispatch(goToQuizQuestion(index))}
              aria-label={`Go to question ${index + 1}${isAnswered ? ', answered' : ', unanswered'}`}
              aria-current={isCurrent}
              className={cn(
                'relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
                isCurrent
                  ? 'bg-navy text-white'
                  : isAnswered
                    ? 'bg-navy-100 text-navy'
                    : 'bg-navy-50 text-ink-muted hover:bg-navy-100'
              )}
            >
              {index + 1}
              {isFlagged && (
                <span
                  className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <QuestionCard question={question} />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(goToQuizQuestion(currentIndex - 1))}
            disabled={isFirst}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(goToQuizQuestion(currentIndex + 1))}
            disabled={isLast}
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <Button variant="accent" onClick={() => dispatch(submitQuizAttempt())}>
          <Check className="h-4 w-4" aria-hidden="true" />
          Submit quiz
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Results                                                             */
/* ------------------------------------------------------------------ */

function QuizResults({ quiz }: { quiz: GeneratedQuiz }) {
  const dispatch = useAppDispatch();
  const attempt = useAppSelector(selectQuizAttempt);
  const result = useAppSelector(selectQuizResult);
  if (!result) return null;

  const passed = result.percentage >= 50;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-navy p-6 text-center text-white sm:p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-gold-light">
          <Award className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-gold-light">
          {passed ? 'Well done' : 'Keep practising'}
        </p>
        <p className="mt-1 font-display text-display-md text-white">
          {result.correct} / {result.total} correct
        </p>
        <p className="mt-1 text-white/70">{result.percentage}%</p>
      </div>

      <ol className="space-y-4">
        {quiz.questions.map((question, index) => {
          const marking = result.perQuestion[index];
          const selected = marking.selected;
          const isCorrect = marking.isCorrect;
          return (
            <li key={question.id} className="rounded-2xl bg-white p-5 shadow-lift">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white',
                    isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                >
                  {isCorrect ? (
                    <CircleCheck className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CircleX className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.975rem] font-medium text-ink">
                    <span className="mr-1.5 text-ink-muted">Q{question.number}.</span>
                    {question.text}
                  </p>

                  <div className="mt-3 space-y-1.5 text-sm">
                    <p className={cn(isCorrect ? 'text-emerald-700' : 'text-red-700')}>
                      Your answer:{' '}
                      {selected === null
                        ? 'Not answered'
                        : `(${optionLetter(selected)}) ${question.options[selected]}`}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-700">
                        Correct answer: ({optionLetter(question.answerIndex)}){' '}
                        {question.options[question.answerIndex]}
                      </p>
                    )}
                    <p className="leading-relaxed text-ink-muted">{question.explanation}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-3 print:hidden">
        <Button variant="primary" onClick={() => dispatch(resetQuizAttempt())}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retake quiz
        </Button>
      </div>

      {attempt.submittedAt && (
        <p className="text-xs text-ink-muted">
          Submitted {new Date(attempt.submittedAt).toLocaleString('en-GB')}.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Controller                                                          */
/* ------------------------------------------------------------------ */

export function QuizAttempt({ quiz }: { quiz: GeneratedQuiz }) {
  const dispatch = useAppDispatch();
  const attempt = useAppSelector(selectQuizAttempt);

  if (attempt.submitted) return <QuizResults quiz={quiz} />;
  if (attempt.startedAt) return <QuizInProgress quiz={quiz} />;

  return <QuizStart quiz={quiz} onStart={() => dispatch(startQuizAttempt())} />;
}
