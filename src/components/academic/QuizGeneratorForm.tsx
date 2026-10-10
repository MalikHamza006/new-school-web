import { Loader2, RotateCcw, WandSparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Button, Input, Select, Textarea } from '../ui';
import {
  CLASS_OPTIONS,
  MAX_QUIZ_QUESTIONS,
  MIN_QUIZ_QUESTIONS,
  QUIZ_DIFFICULTY_OPTIONS,
  SUBJECT_OPTIONS,
} from '../../features/quizGenerator/quizGeneratorData';
import { generateQuizThunk, resetQuizForm, setQuizFormField } from '../../features/quizGenerator/quizGeneratorSlice';
import { selectQuizForm, selectQuizStatus } from '../../features/quizGenerator/quizGeneratorSelectors';
import { validateQuizInput } from '../../features/quizGenerator/quizGeneratorData';
import type { QuizFormInput } from '../../features/quizGenerator/quizGeneratorTypes';

const classOptions = CLASS_OPTIONS.map((value) => ({ value, label: `Class ${value}` }));
const subjectOptions = SUBJECT_OPTIONS.map((value) => ({ value, label: value }));
const difficultyOptions = QUIZ_DIFFICULTY_OPTIONS.map((value) => ({ value, label: value }));

function toNumber(value: string): number {
  if (value.trim() === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function QuizGeneratorForm() {
  const dispatch = useAppDispatch();
  const form = useAppSelector(selectQuizForm);
  const status = useAppSelector(selectQuizStatus);

  const validation = validateQuizInput(form);

  const setField = <K extends keyof QuizFormInput>(field: K, value: QuizFormInput[K]) => {
    dispatch(setQuizFormField({ field, value }));
  };

  const isLoading = status === 'loading';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(generateQuizThunk());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7" aria-label="Quiz generator form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Class"
          required
          name="className"
          placeholder="Choose a class"
          options={classOptions}
          value={form.className}
          error={validation.errors.className}
          onChange={(event) => setField('className', event.target.value as QuizFormInput['className'])}
        />
        <Select
          label="Subject"
          required
          name="subject"
          placeholder="Choose a subject"
          options={subjectOptions}
          value={form.subject}
          error={validation.errors.subject}
          onChange={(event) => setField('subject', event.target.value as QuizFormInput['subject'])}
        />
      </div>

      <Textarea
        label="Topics or chapters"
        required
        name="topics"
        rows={3}
        placeholder="e.g. Chapter 5: Matter"
        value={form.topics}
        error={validation.errors.topics}
        hint="Used to describe the quiz; the sample bank is not topic-tagged yet."
        onChange={(event) => setField('topics', event.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Input
          label="Number of questions"
          required
          type="number"
          inputMode="numeric"
          min={MIN_QUIZ_QUESTIONS}
          max={MAX_QUIZ_QUESTIONS}
          name="questionCount"
          value={form.questionCount}
          error={validation.errors.questionCount}
          onChange={(event) => setField('questionCount', toNumber(event.target.value))}
        />
        <Select
          label="Difficulty"
          name="difficulty"
          options={difficultyOptions}
          value={form.difficulty}
          onChange={(event) => setField('difficulty', event.target.value as QuizFormInput['difficulty'])}
        />
        <Input
          label="Time limit (minutes)"
          type="number"
          inputMode="numeric"
          min={0}
          max={120}
          name="timeLimitMinutes"
          value={form.timeLimitMinutes}
          error={validation.errors.timeLimitMinutes}
          hint="Use 0 for no time limit."
          onChange={(event) => setField('timeLimitMinutes', toNumber(event.target.value))}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <WandSparkles className="h-4 w-4" aria-hidden="true" />
          )}
          {isLoading ? 'Generating…' : 'Generate quiz'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => dispatch(resetQuizForm())} disabled={isLoading}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset form
        </Button>
      </div>
    </form>
  );
}
