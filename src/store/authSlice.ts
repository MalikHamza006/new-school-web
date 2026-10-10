import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { isPortalId, type PortalId } from '../data/portals';

/**
 * Demo authentication state.
 *
 * SCOPE AND SAFETY
 * ----------------
 * This stores exactly one thing: which portal the visitor is currently
 * "viewing as" in the demo (`student` | `parent` | `teacher` | `admin`, or
 * null). There is no password, token, session or user record, because there is
 * no authentication — the demo signs you in with a single click and keeps the
 * choice in `localStorage` so a page refresh does not throw you back out.
 *
 * It is a presentation aid, not a security boundary: the browser owns the role,
 * so nothing here may be trusted for real access. Every portal in
 * `data/portals.ts` is still `confirmed: false`.
 */
export interface AuthState {
  /** The role currently signed in to the demo, or null when signed out. */
  role: PortalId | null;
}

const STORAGE_KEY = 'spectral.portal.demo.role.v1';

/**
 * Read the persisted role. Guarded for environments without `window` (the SSR
 * smoke test runs this module in Node) and for storage that is unavailable
 * (private mode, or quota errors) — either way the demo still works in-memory.
 */
export function readPersistedRole(): PortalId | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isPortalId(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Write (or clear) the persisted role, ignoring any storage failure. */
export function persistRole(role: PortalId | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (role) window.localStorage.setItem(STORAGE_KEY, role);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Storage unavailable — the in-memory demo state is unaffected. */
  }
}

const initialState: AuthState = {
  role: readPersistedRole(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Sign in to the demo as a role. One click; no credentials. */
    demoSignIn(state, action: PayloadAction<PortalId>) {
      state.role = action.payload;
    },
    /** Sign out of the demo and clear the persisted role. */
    demoSignOut(state) {
      state.role = null;
    },
  },
});

export const { demoSignIn, demoSignOut } = authSlice.actions;

export default authSlice.reducer;
