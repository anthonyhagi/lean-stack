import { HTMLAttributes } from 'react';
import { cn } from '~/utils/css';

type TextVariant = 'default' | 'lead' | 'large' | 'small' | 'muted';

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
}

const textStyles: Record<TextVariant, string> = {
  default: 'leading-7 [&:not(:first-child)]:mt-6',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
};

export function Text(props: TextProps) {
  const { className, children, variant = 'default', ...rest } = props;

  if (variant === 'small') {
    return (
      <small className={cn(textStyles[variant], className)} {...rest}>
        {children}
      </small>
    );
  }

  return (
    <p className={cn(textStyles[variant], className)} {...rest}>
      {children}
    </p>
  );
}
