import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * UI state that more than one component needs to agree on.
 *
 * Scope is deliberately narrow. Only genuinely cross-cutting UI state belongs
 * here — anything a single component can own locally should stay local state.
 * Routing (`useSearchParams`) already handles shareable state like the gallery
 * filter, and server data belongs to a query cache, not Redux.
 *
 * What lives here:
 *  - which hero slide is showing (read by the hero, written by its indicators)
 *  - whether the mobile navigation drawer is open (written by the navbar,
 *    observed by the scroll-lock and skip-link behaviour)
 */

export interface UiState {
  /** Index into `homeHeroSequence` of the currently visible hero photograph. */
  heroSlide: number;
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  heroSlide: 0,
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    heroSlideChanged(state, action: PayloadAction<number>) {
      state.heroSlide = action.payload;
    },
    heroSlideAdvanced(state) {
      state.heroSlide += 1;
    },
    mobileNavToggled(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    mobileNavClosed(state) {
      state.mobileNavOpen = false;
    },
  },
});

export const { heroSlideChanged, heroSlideAdvanced, mobileNavToggled, mobileNavClosed } =
  uiSlice.actions;

export default uiSlice.reducer;
