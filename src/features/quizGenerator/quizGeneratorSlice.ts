import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { defaultQuizForm, validateQuizInput } from './quizGeneratorData';
import { generateQuiz } from './quizGeneratorService';
import type {
  GeneratedQuiz,
  GenerationStatus,
  QuizAttemptState,
  QuizFormInput,
} from './quizGeneratorTypes';

/** How many generated quizzes the demo keeps before dropping the oldest. */
export const QUIZ_HISTORY_LIMIT = 20;

/** A fresh, unanswered attempt. */
export const initialQuizAttempt: QuizAttemptState = {
  answers: {},
  flagged: {},
  submitted: false,
  startedAt: null,
  submittedAt: null,
};

export interface QuizGeneratorState {
  form: QuizFormInput;
  status: GenerationStatus;
  error: string | null;
  generationCount: number;
  current: GeneratedQuiz | null;
  history: GeneratedQuiz[];
  attempt: QuizAttemptState;
  /** Zero-based index of the question the student is looking at. */
  currentIndex: number;
}

const initialState: QuizGeneratorState = {
  form: defaultQuizForm,
  status: 'idle',
  error: null,
  generationCount: 0,
  current: null,
  history: [],
  attempt: initialQuizAttempt,
  currentIndex: 0,
};

export const generateQuizThunk = createAsyncThunk<
  GeneratedQuiz,
  void,
  { state: RootState; rejectValue: string }
>('quizGenerator/generate', async (_, { getState, rejectWithValue }) => {
  const { form, generationCount } = getState().quizGenerator;
  const validation = validateQuizInput(form);

  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0] ?? 'The form is incomplete.';
    return rejectWithValue(firstError);
  }

  return generateQuiz(form, generationCount);
});

const quizGeneratorSlice = createSlice({
  name: 'quizGenerator',
  initialState,
  reducers: {
    setQuizFormField: <K extends keyof QuizFormInput>(
      state: QuizGeneratorState,
      action: PayloadAction<{ field: K; value: QuizFormInput[K] }>
    ) => {
      state.form[action.payload.field] = action.payload.value;
      if (state.status === 'failed') {
        state.status = 'idle';
        state.error = null;
      }
    },
    resetQuizForm: (state) => {
      state.form = defaultQuizForm;
      state.error = null;
      if (state.status !== 'loading') state.status = 'idle';
    },
    clearCurrentQuiz: (state) => {
      state.current = null;
      state.status = 'idle';
      state.error = null;
      state.attempt = initialQuizAttempt;
      state.currentIndex = 0;
    },
    loadQuizFromHistory: (state, action: PayloadAction<string>) => {
      const record = state.history.find((item) => item.id === action.payload);
      if (!record) return;
      state.current = record;
      state.form = { ...record.input };
      state.status = 'succeeded';
      state.error = null;
      state.attempt = initialQuizAttempt;
      state.currentIndex = 0;
    },
    deleteQuizFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter((item) => item.id !== action.payload);
      if (state.current?.id === action.payload) {
        state.current = null;
        state.status = 'idle';
        state.attempt = initialQuizAttempt;
        state.currentIndex = 0;
      }
    },
    clearQuizHistory: (state) => {
      state.history = [];
    },
    hydrateQuizHistory: (state, action: PayloadAction<GeneratedQuiz[]>) => {
      state.history = action.payload.slice(0, QUIZ_HISTORY_LIMIT);
    },

    /* ----- attempt lifecycle ----- */
    startQuizAttempt: (state) => {
      state.attempt = { ...initialQuizAttempt, startedAt: new Date().toISOString() };
      state.currentIndex = 0;
    },
    resetQuizAttempt: (state) => {
      state.attempt = initialQuizAttempt;
      state.currentIndex = 0;
    },
    selectQuizAnswer: (state, action: PayloadAction<{ questionId: string; optionIndex: number }>) => {
      if (state.attempt.submitted) return;
      if (!state.attempt.startedAt) state.attempt.startedAt = new Date().toISOString();
      state.attempt.answers[action.payload.questionId] = action.payload.optionIndex;
    },
    toggleQuizFlag: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.attempt.flagged[id]) delete state.attempt.flagged[id];
      else state.attempt.flagged[id] = true;
    },
    goToQuizQuestion: (state, action: PayloadAction<number>) => {
      const max = Math.max(0, (state.current?.questions.length ?? 1) - 1);
      state.currentIndex = Math.min(Math.max(0, action.payload), max);
    },
    submitQuizAttempt: (state) => {
      if (state.attempt.submitted) return;
      state.attempt.submitted = true;
      state.attempt.submittedAt = new Date().toISOString();
      if (!state.attempt.startedAt) state.attempt.startedAt = state.attempt.submittedAt;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuizThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateQuizThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.generationCount += 1;
        state.history = [action.payload, ...state.history].slice(0, QUIZ_HISTORY_LIMIT);
        state.attempt = initialQuizAttempt;
        state.currentIndex = 0;
      })
      .addCase(generateQuizThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Generation failed.';
      });
  },
});

export const {
  setQuizFormField,
  resetQuizForm,
  clearCurrentQuiz,
  loadQuizFromHistory,
  deleteQuizFromHistory,
  clearQuizHistory,
  hydrateQuizHistory,
  startQuizAttempt,
  resetQuizAttempt,
  selectQuizAnswer,
  toggleQuizFlag,
  goToQuizQuestion,
  submitQuizAttempt,
} = quizGeneratorSlice.actions;

export default quizGeneratorSlice.reducer;
