import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer, { persistRole } from './authSlice';
import paperGeneratorReducer, { hydratePaperHistory } from '../features/paperGenerator/paperGeneratorSlice';
import quizGeneratorReducer, { hydrateQuizHistory } from '../features/quizGenerator/quizGeneratorSlice';
import { loadPaperHistory, loadQuizHistory, savePaperHistory, saveQuizHistory } from '../features/persistence';

/**
 * The store: cross-cutting UI state, the portal demo's role, and the local
 * AI-tools generators (papers and quizzes).
 *
 * Kept intentionally small — see each slice for what does and does not belong
 * here. Adding a slice should be a considered decision, not a default.
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    paperGenerator: paperGeneratorReducer,
    quizGenerator: quizGeneratorReducer,
  },
});

/* Restore saved generated content before the first render. */
store.dispatch(hydratePaperHistory(loadPaperHistory()));
store.dispatch(hydrateQuizHistory(loadQuizHistory()));

/* Persist the demo role so a refresh keeps the visitor in the same portal.
   Written here rather than inside the reducer, which must stay pure, and only
   on an actual change so unrelated actions never touch storage. */
let lastRole = store.getState().auth.role;
let lastPaperHistory = store.getState().paperGenerator.history;
let lastQuizHistory = store.getState().quizGenerator.history;
store.subscribe(() => {
  const state = store.getState();

  const { role } = state.auth;
  if (role !== lastRole) {
    lastRole = role;
    persistRole(role);
  }

  /* Reference comparison: the slices replace the array only on a real change. */
  if (state.paperGenerator.history !== lastPaperHistory) {
    lastPaperHistory = state.paperGenerator.history;
    savePaperHistory(lastPaperHistory);
  }
  if (state.quizGenerator.history !== lastQuizHistory) {
    lastQuizHistory = state.quizGenerator.history;
    saveQuizHistory(lastQuizHistory);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
