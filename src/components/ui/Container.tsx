import { forwardRef, type HTMLAttributes } from 'react';

export type ContainerSize = 'narrow' | 'default' | 'wide' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

const sizeMap: Record<ContainerSize, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-container',
  full: 'max-w-none',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'wide', className = '', children, ...props },
  ref
) {
  return (
    <div ref={ref} className={`container-page ${sizeMap[size]} ${className}`} {...props}>
      {children}
    </div>
  );
});
