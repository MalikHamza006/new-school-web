import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/**
 * `/portal` — the bare entry point.
 *
 * There is no "portal lobby"; this route exists only so a bookmark to `/portal`
 * does the obvious thing. A signed-in visitor is sent to their own dashboard, a
 * signed-out one to the portal chooser.
 */
export function PortalRootPage() {
  const role = useAppSelector((state) => state.auth.role);
  return <Navigate to={role ? `/portal/${role}` : '/login'} replace />;
}
