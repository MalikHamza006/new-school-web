import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Printer, RefreshCw, Trash, Trash2, WandSparkles } from 'lucide-react';
import {
  Button,
  Card,
  Container,
  GenerationStatus,
  PageHero,
  QuizAttempt,
  QuizGeneratorForm,
  Reveal,
  Section,
  SectionHeading,
} from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearCurrentQuiz,
  clearQuizHistory,
  deleteQuizFromHistory,
  generateQuizThunk,
  loadQuizFromHistory,
} from '../features/quizGenerator/quizGeneratorSlice';
import {
  selectCurrentQuiz,
  selectQuizError,
  selectQuizHistory,
  selectQuizStatus,
} from '../features/quizGenerator/quizGeneratorSelectors';
import { formatTimestamp } from '../features/demoGeneration';
import { useSeo, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';
import { schoolInfo } from '../data';
import type { GeneratedQuiz } from '../features/quizGenerator/quizGeneratorTypes';

const PAGE_SCHEMA = buildGraph(
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Academics', path: '/academics' },
    { name: 'AI Tools', path: '/academics/ai-tools' },
    { name: 'Quiz Generator', path: '/academics/ai-tools/quiz-generator' },
  ])
);

function SavedQuizRow({
  quiz,
  onOpen,
  onDelete,
}: {
  quiz: GeneratedQuiz;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-lift">
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-navy">{quiz.title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {quiz.questions.length} questions · {formatTimestamp(quiz.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" size="sm" onClick={() => onOpen(quiz.id)}>
          <FolderOpen className="h-4 w-4" aria-hidden="true" />
          Open
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(quiz.id)}
          aria-label={`Delete ${quiz.title}`}
        >
          <Trash className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}

export function QuizGeneratorPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectQuizStatus);
  const error = useAppSelector(selectQuizError);
  const current = useAppSelector(selectCurrentQuiz);
  const history = useAppSelector(selectQuizHistory);

  const previewRef = useRef<HTMLDivElement>(null);

  useSeo({
    title: `AI Quiz Generator | ${schoolInfo.name}`,
    description:
      'Generate a short, self-marking multiple-choice quiz with the Spectral AI quiz generator demo. Set a time limit and let students check their understanding.',
    path: '/academics/ai-tools/quiz-generator',
    noIndex: true,
    structuredData: PAGE_SCHEMA,
  });

  const handleOpen = (id: string) => {
    dispatch(loadQuizFromHistory(id));
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isLoading = status === 'loading';

  return (
    <>
      <div className="print:hidden">
        <PageHero
          eyebrow="For Teachers"
          title="AI Quiz Generator"
          description="Create a short multiple-choice quiz that marks itself. Students attempt it on screen and see their score and explanations on submit."
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Academics', href: '/academics' },
            { label: 'AI Tools', href: '/academics/ai-tools' },
            { label: 'Quiz Generator' },
          ]}
        />
      </div>

      <Section tone="canvas" aria-labelledby="quiz-builder-heading">
        <Container>
          <div className="mb-8 print:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/academics/ai-tools">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All AI tools
              </Link>
            </Button>
          </div>

          <h2 id="quiz-builder-heading" className="sr-only">
            Quiz builder
          </h2>

          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Form */}
            <div className="lg:col-span-5 print:hidden">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <Card padding="lg">
                    <h3 className="font-display text-lg font-semibold text-navy">Quiz details</h3>
                    <p className="mt-1 mb-6 text-sm text-ink-muted">
                      Fields marked with a star are required.
                    </p>
                    <QuizGeneratorForm />
                  </Card>
                </Reveal>
              </div>
            </div>

            {/* Quiz */}
            <div className="lg:col-span-7">
              <div ref={previewRef} className="scroll-mt-28">
                {isLoading ? (
                  <GenerationStatus status="loading" />
                ) : status === 'failed' ? (
                  <GenerationStatus
                    status="failed"
                    error={error}
                    onRetry={() => void dispatch(generateQuizThunk())}
                  />
                ) : current ? (
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => void dispatch(generateQuizThunk())}
                      >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Regenerate
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" aria-hidden="true" />
                        Print
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => dispatch(clearCurrentQuiz())}>
                        <Trash className="h-4 w-4" aria-hidden="true" />
                        Clear
                      </Button>
                    </div>

                    <QuizAttempt key={current.id} quiz={current} />
                  </div>
                ) : (
                  <GenerationStatus
                    status="idle"
                    idleHint="Choose the class, subject and number of questions, then select Generate quiz. Your quiz will appear here, ready to attempt."
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Saved quizzes */}
      {history.length > 0 && (
        <Section tone="white" aria-labelledby="saved-quizzes-heading" className="print:hidden">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                id="saved-quizzes-heading"
                eyebrow="Saved"
                title="Recent Quizzes"
                description="Saved in this browser only. Open a quiz to attempt it again."
              />
              <Button variant="ghost" size="sm" onClick={() => dispatch(clearQuizHistory())}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear history
              </Button>
            </div>

            <ul className="mt-8 grid gap-3">
              {history.map((quiz) => (
                <SavedQuizRow
                  key={quiz.id}
                  quiz={quiz}
                  onOpen={handleOpen}
                  onDelete={(id) => dispatch(deleteQuizFromHistory(id))}
                />
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {history.length === 0 && (
        <Section tone="white" className="print:hidden">
          <Container>
            <div className="flex items-center gap-3 rounded-2xl bg-navy-50/70 p-6 text-sm text-ink-muted">
              <WandSparkles className="h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
              Generated quizzes will be saved here for easy access in this browser. Nothing leaves your
              device.
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
