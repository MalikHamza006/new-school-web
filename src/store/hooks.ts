import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

/**
 * Typed Redux hooks.
 *
 * Always use these instead of the untyped `useDispatch`/`useSelector` from
 * react-redux: the bare versions default to `unknown` for state, which quietly
 * loses type safety across every call site.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
