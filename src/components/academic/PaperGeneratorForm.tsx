import { Loader2, PencilLine, RotateCcw, WandSparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Button, Input, Select, Textarea } from '../ui';
import {
  CLASS_OPTIONS,
  DIFFICULTY_OPTIONS,
  MAX_LONG,
  MAX_MCQ,
  MAX_SHORT,
  PAPER_TYPE_OPTIONS,
  SUBJECT_OPTIONS,
} from '../../features/paperGenerator/paperGeneratorData';
import {
  generatePaperThunk,
  resetPaperForm,
  setPaperFormField,
} from '../../features/paperGenerator/paperGeneratorSlice';
import {
  selectPaperForm,
  selectPaperStatus,
  selectPaperValidation,
} from '../../features/paperGenerator/paperGeneratorSelectors';
import type { PaperFormInput } from '../../features/paperGenerator/paperGeneratorTypes';

const classOptions = CLASS_OPTIONS.map((value) => ({ value, label: `Class ${value}` }));
const subjectOptions = SUBJECT_OPTIONS.map((value) => ({ value, label: value }));
const paperTypeOptions = PAPER_TYPE_OPTIONS.map((value) => ({ value, label: value }));
const difficultyOptions = DIFFICULTY_OPTIONS.map((value) => ({ value, label: value }));

/** Turn an input's raw string into a number, treating empty as zero. */
function toNumber(value: string): number {
  if (value.trim() === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function PaperGeneratorForm() {
  const dispatch = useAppDispatch();
  const form = useAppSelector(selectPaperForm);
  const status = useAppSelector(selectPaperStatus);
  const validation = useAppSelector(selectPaperValidation);

  const setField = <K extends keyof PaperFormInput>(field: K, value: PaperFormInput[K]) => {
    dispatch(setPaperFormField({ field, value }));
  };

  const isLoading = status === 'loading';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(generatePaperThunk());
  };

  const marks = validation.marks;

  return (
    <form onSubmit={handleSubmit} className="space-y-7" aria-label="Paper generator form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Class"
          required
          name="className"
          placeholder="Choose a class"
          options={classOptions}
          value={form.className}
          error={validation.errors.className}
          onChange={(event) => setField('className', event.target.value as PaperFormInput['className'])}
        />
        <Select
          label="Subject"
          required
          name="subject"
          placeholder="Choose a subject"
          options={subjectOptions}
          value={form.subject}
          error={validation.errors.subject}
          onChange={(event) => setField('subject', event.target.value as PaperFormInput['subject'])}
        />
        <Select
          label="Paper type"
          required
          name="paperType"
          placeholder="Choose a paper type"
          options={paperTypeOptions}
          value={form.paperType}
          error={validation.errors.paperType}
          onChange={(event) => setField('paperType', event.target.value as PaperFormInput['paperType'])}
        />
        <Select
          label="Difficulty"
          name="difficulty"
          options={difficultyOptions}
          value={form.difficulty}
          hint="Biases which sample questions are chosen."
          onChange={(event) => setField('difficulty', event.target.value as PaperFormInput['difficulty'])}
        />
      </div>

      <Textarea
        label="Topics or chapters"
        required
        name="topics"
        rows={3}
        placeholder="e.g. Chapter 3: Kinematics; Chapter 4: Dynamics"
        value={form.topics}
        error={validation.errors.topics}
        hint="Separate multiple topics with a semicolon or comma."
        onChange={(event) => setField('topics', event.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Total marks"
          required
          type="number"
          inputMode="numeric"
          min={10}
          max={200}
          name="totalMarks"
          value={form.totalMarks}
          error={validation.errors.totalMarks}
          onChange={(event) => setField('totalMarks', toNumber(event.target.value))}
        />
        <Input
          label="Duration (minutes)"
          required
          type="number"
          inputMode="numeric"
          min={15}
          max={240}
          name="durationMinutes"
          value={form.durationMinutes}
          error={validation.errors.durationMinutes}
          onChange={(event) => setField('durationMinutes', toNumber(event.target.value))}
        />
      </div>

      <fieldset className="rounded-2xl bg-navy-50/60 p-5">
        <legend className="px-1 text-sm font-semibold text-navy">Question mix</legend>
        <div className="mt-3 grid gap-5 sm:grid-cols-3">
          <Input
            label="MCQs"
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_MCQ}
            name="mcqCount"
            value={form.mcqCount}
            error={validation.errors.mcqCount}
            onChange={(event) => setField('mcqCount', toNumber(event.target.value))}
          />
          <Input
            label="Short questions"
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_SHORT}
            name="shortCount"
            value={form.shortCount}
            error={validation.errors.shortCount}
            onChange={(event) => setField('shortCount', toNumber(event.target.value))}
          />
          <Input
            label="Long questions"
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_LONG}
            name="longCount"
            value={form.longCount}
            error={validation.errors.longCount}
            onChange={(event) => setField('longCount', toNumber(event.target.value))}
          />
        </div>

        {marks?.ok && (
          <p className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
            <PencilLine className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
            <span>
              Marks add up exactly: {form.mcqCount} MCQ × {marks.plan.mcqMarks}, {form.shortCount} short ×{' '}
              {marks.plan.shortMarks}, {form.longCount} long × {marks.plan.longMarks} ={' '}
              <strong className="text-navy">{marks.plan.allocated} marks</strong>.
            </span>
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <WandSparkles className="h-4 w-4" aria-hidden="true" />
          )}
          {isLoading ? 'Generating…' : 'Generate paper'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => dispatch(resetPaperForm())}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset form
        </Button>
      </div>
    </form>
  );
}
