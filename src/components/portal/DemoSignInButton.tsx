import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, type ButtonProps } from '../ui';
import { getPortalById, type PortalId } from '../../data/portals';
import { useAppDispatch } from '../../store/hooks';
import { demoSignIn } from '../../store/authSlice';

interface DemoSignInButtonProps {
  role: PortalId;
  label?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  fullWidth?: boolean;
  className?: string;
}

/**
 * One-click demo entry into a portal.
 *
 * Signs the visitor in to the demo as this role and takes them straight to that
 * portal's dashboard. There are no credentials because there is no
 * authentication — this is the single, obvious way in that the demo promises,
 * and it says "demo" on the tin so it cannot be mistaken for a real login.
 */
export function DemoSignInButton({
  role,
  label,
  variant = 'accent',
  size = 'md',
  fullWidth = false,
  className,
}: DemoSignInButtonProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const portal = getPortalById(role);

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
      onClick={() => {
        dispatch(demoSignIn(role));
        navigate(`/portal/${role}`);
      }}
    >
      {label ?? `Enter ${portal?.name ?? 'portal'} demo`}
    </Button>
  );
}
