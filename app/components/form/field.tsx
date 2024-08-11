import type { HTMLAttributes } from 'react';
import { cn } from '~/utils/css';

export const Field = ({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex flex-col gap-3', className)} {...rest}>
      {children}
    </div>
  );
};

export const FieldError = ({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('text-sm text-destructive', className)} {...rest}>
      {children}
    </div>
  );
};
