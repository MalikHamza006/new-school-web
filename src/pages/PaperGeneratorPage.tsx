import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FolderOpen,
  Printer,
  RefreshCw,
  Trash,
  Trash2,
  WandSparkles,
} from 'lucide-react';
import {
  AnswerKey,
  Button,
  Card,
  Container,
  GenerationStatus,
  PageHero,
  PaperGeneratorForm,
  PaperPreview,
  Reveal,
  Section,
  SectionHeading,
} from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearCurrentPaper,
  clearPaperHistory,
  deletePaperFromHistory,
  generatePaperThunk,
  loadPaperFromHistory,
} from '../features/paperGenerator/paperGeneratorSlice';
import {
  selectCurrentPaper,
  selectPaperError,
  selectPaperHistory,
  selectPaperStatus,
} from '../features/paperGenerator/paperGeneratorSelectors';
import { formatTimestamp } from '../features/demoGeneration';
import { useSeo, buildBreadcrumbSchema, buildGraph } from '../hooks/useSeo';
import { schoolInfo } from '../data';
import type { GeneratedPaper } from '../features/paperGenerator/paperGeneratorTypes';

const PAGE_SCHEMA = buildGraph(
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Academics', path: '/academics' },
    { name: 'AI Tools', path: '/academics/ai-tools' },
    { name: 'Paper Generator', path: '/academics/ai-tools/paper-generator' },
  ])
);

function SavedPaperRow({
  paper,
  onOpen,
  onDelete,
}: {
  paper: GeneratedPaper;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-lift">
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-navy">{paper.title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {paper.questions.length} questions · {paper.marksPlan.allocated} marks ·{' '}
          {formatTimestamp(paper.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" size="sm" onClick={() => onOpen(paper.id)}>
          <FolderOpen className="h-4 w-4" aria-hidden="true" />
          Open
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(paper.id)}
          aria-label={`Delete ${paper.title}`}
        >
          <Trash className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}

export function PaperGeneratorPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPaperStatus);
  const error = useAppSelector(selectPaperError);
  const current = useAppSelector(selectCurrentPaper);
  const history = useAppSelector(selectPaperHistory);

  const [showAnswers, setShowAnswers] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useSeo({
    title: `AI Paper Generator | ${schoolInfo.name}`,
    description:
      'Generate a sample class assessment paper with the Spectral AI paper generator demo. Plan marks, build sections and print an answer key.',
    path: '/academics/ai-tools/paper-generator',
    noIndex: true,
    structuredData: PAGE_SCHEMA,
  });

  const handleOpen = (id: string) => {
    dispatch(loadPaperFromHistory(id));
    setShowAnswers(false);
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isLoading = status === 'loading';

  return (
    <>
      <div className="print:hidden">
        <PageHero
          eyebrow="For Teachers"
          title="AI Paper Generator"
          description="Set the class, subject, paper type and question mix. The generator plans the marks and lays out a print-ready sample paper."
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Academics', href: '/academics' },
            { label: 'AI Tools', href: '/academics/ai-tools' },
            { label: 'Paper Generator' },
          ]}
        />
      </div>

      <Section tone="canvas" aria-labelledby="paper-builder-heading">
        <Container>
          <div className="mb-8 print:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/academics/ai-tools">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All AI tools
              </Link>
            </Button>
          </div>

          <h2 id="paper-builder-heading" className="sr-only">
            Paper builder
          </h2>

          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Form */}
            <div className="lg:col-span-5 print:hidden">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <Card padding="lg">
                    <h3 className="font-display text-lg font-semibold text-navy">Paper details</h3>
                    <p className="mt-1 mb-6 text-sm text-ink-muted">
                      Fields marked with a star are required.
                    </p>
                    <PaperGeneratorForm />
                  </Card>
                </Reveal>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-7">
              <div ref={previewRef} className="scroll-mt-28">
                {isLoading ? (
                  <GenerationStatus status="loading" />
                ) : status === 'failed' ? (
                  <GenerationStatus
                    status="failed"
                    error={error}
                    onRetry={() => void dispatch(generatePaperThunk())}
                  />
                ) : current ? (
                  <div>
                    {/* Print / answer-key toolbar (never printed) */}
                    <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
                      <Button variant="primary" size="sm" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" aria-hidden="true" />
                        Print paper
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowAnswers((value) => !value)}
                        aria-pressed={showAnswers}
                      >
                        {showAnswers ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                        {showAnswers ? 'Hide answer key' : 'Show answer key'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => void dispatch(generatePaperThunk())}
                      >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Regenerate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(clearCurrentPaper())}
                      >
                        <Trash className="h-4 w-4" aria-hidden="true" />
                        Clear
                      </Button>
                    </div>

                    <PaperPreview paper={current} />
                    {showAnswers && <AnswerKey paper={current} />}
                  </div>
                ) : (
                  <GenerationStatus
                    status="idle"
                    idleHint="Fill in the paper details and select Generate paper. Your sample paper and a printable layout will appear here."
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Saved papers */}
      {history.length > 0 && (
        <Section tone="white" aria-labelledby="saved-papers-heading" className="print:hidden">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                id="saved-papers-heading"
                eyebrow="Saved"
                title="Recent Papers"
                description="Saved in this browser only. Open a paper to load it back into the preview."
              />
              <Button variant="ghost" size="sm" onClick={() => dispatch(clearPaperHistory())}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear history
              </Button>
            </div>

            <ul className="mt-8 grid gap-3">
              {history.map((paper) => (
                <SavedPaperRow
                  key={paper.id}
                  paper={paper}
                  onOpen={handleOpen}
                  onDelete={(id) => dispatch(deletePaperFromHistory(id))}
                />
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Encouraging message when history is empty */}
      {history.length === 0 && (
        <Section tone="white" className="print:hidden">
          <Container>
            <div className="flex items-center gap-3 rounded-2xl bg-navy-50/70 p-6 text-sm text-ink-muted">
              <WandSparkles className="h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
              Generated papers will be saved here for easy access in this browser. Nothing leaves your
              device.
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
