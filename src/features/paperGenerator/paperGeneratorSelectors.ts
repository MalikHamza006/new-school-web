import type { RootState } from '../../store';
import { validatePaperInput, type PaperFormValidation } from './paperGeneratorData';

/** The form currently in the paper generator. */
export const selectPaperForm = (state: RootState) => state.paperGenerator.form;

/** Current generation status ('idle' | 'loading' | 'succeeded' | 'failed'). */
export const selectPaperStatus = (state: RootState) => state.paperGenerator.status;

/** Error message from the last failed or rejected generation, if any. */
export const selectPaperError = (state: RootState) => state.paperGenerator.error;

/** The paper currently open in the preview, if any. */
export const selectCurrentPaper = (state: RootState) => state.paperGenerator.current;

/** Saved papers, most recent first. */
export const selectPaperHistory = (state: RootState) => state.paperGenerator.history;

export const selectPaperIsLoading = (state: RootState) => state.paperGenerator.status === 'loading';

/** The live validation result for the form, recomputed from state. */
export const selectPaperValidation = (state: RootState): PaperFormValidation =>
  validatePaperInput(state.paperGenerator.form);

/** Look up a saved paper by id, e.g. from a route param. */
export const selectPaperById = (state: RootState, id: string) =>
  state.paperGenerator.history.find((item) => item.id === id) ?? null;
