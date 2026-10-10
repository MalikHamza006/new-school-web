import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { validatePaperInput } from './paperGeneratorData';
import { generatePaper } from './paperGeneratorService';
import type { GeneratedPaper, GenerationStatus, PaperFormInput } from './paperGeneratorTypes';

/** How many generated papers the demo keeps before dropping the oldest. */
export const PAPER_HISTORY_LIMIT = 20;

/** A sensible starting form: a short weekly test for the most common class. */
export const defaultPaperForm: PaperFormInput = {
  className: '9',
  subject: 'Physics',
  paperType: 'Weekly Test',
  topics: 'Chapter 3: Kinematics; Chapter 4: Dynamics',
  totalMarks: 25,
  durationMinutes: 40,
  difficulty: 'Medium',
  mcqCount: 5,
  shortCount: 3,
  longCount: 1,
};

export interface PaperGeneratorState {
  form: PaperFormInput;
  status: GenerationStatus;
  error: string | null;
  /** Advances on every successful generation so "Regenerate" varies the paper. */
  generationCount: number;
  current: GeneratedPaper | null;
  history: GeneratedPaper[];
}

const initialState: PaperGeneratorState = {
  form: defaultPaperForm,
  status: 'idle',
  error: null,
  generationCount: 0,
  current: null,
  history: [],
};

/**
 * Generate a paper from the current form.
 *
 * The thunk re-validates rather than trusting the component, because the form
 * can also be driven by "load from history" and by persistence on start-up. A
 * rejected generation leaves the previous paper on screen untouched.
 */
export const generatePaperThunk = createAsyncThunk<
  GeneratedPaper,
  void,
  { state: RootState; rejectValue: string }
>('paperGenerator/generate', async (_, { getState, rejectWithValue }) => {
  const { form, generationCount } = getState().paperGenerator;
  const validation = validatePaperInput(form);

  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0] ?? 'The form is incomplete.';
    return rejectWithValue(firstError);
  }

  return generatePaper(form, generationCount);
});

const paperGeneratorSlice = createSlice({
  name: 'paperGenerator',
  initialState,
  reducers: {
    setPaperFormField: <K extends keyof PaperFormInput>(
      state: PaperGeneratorState,
      action: PayloadAction<{ field: K; value: PaperFormInput[K] }>
    ) => {
      state.form[action.payload.field] = action.payload.value;
      if (state.status === 'failed') {
        state.status = 'idle';
        state.error = null;
      }
    },
    resetPaperForm: (state) => {
      state.form = defaultPaperForm;
      state.error = null;
      if (state.status !== 'loading') state.status = 'idle';
    },
    clearCurrentPaper: (state) => {
      state.current = null;
      state.status = 'idle';
      state.error = null;
    },
    loadPaperFromHistory: (state, action: PayloadAction<string>) => {
      const record = state.history.find((item) => item.id === action.payload);
      if (!record) return;
      state.current = record;
      state.form = { ...record.input };
      state.status = 'succeeded';
      state.error = null;
    },
    deletePaperFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter((item) => item.id !== action.payload);
      if (state.current?.id === action.payload) {
        state.current = null;
        state.status = 'idle';
      }
    },
    clearPaperHistory: (state) => {
      state.history = [];
    },
    /** Called once on start-up with records restored from storage. */
    hydratePaperHistory: (state, action: PayloadAction<GeneratedPaper[]>) => {
      state.history = action.payload.slice(0, PAPER_HISTORY_LIMIT);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePaperThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generatePaperThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.generationCount += 1;
        state.history = [action.payload, ...state.history].slice(0, PAPER_HISTORY_LIMIT);
      })
      .addCase(generatePaperThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Generation failed.';
      });
  },
});

export const {
  setPaperFormField,
  resetPaperForm,
  clearCurrentPaper,
  loadPaperFromHistory,
  deletePaperFromHistory,
  clearPaperHistory,
  hydratePaperHistory,
} = paperGeneratorSlice.actions;

export default paperGeneratorSlice.reducer;
