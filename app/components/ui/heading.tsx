import { HTMLAttributes } from 'react';

import { cn } from '~/utils/css';

// Feel free to add 'h5' and 'h6' if you need them for your app. If you
// do, make sure to add the style definitions below.
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

const headingStyles: Record<HeadingLevel, string> = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
};

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
}

export function Heading(props: HeadingProps) {
  const { className, children, as: Element = 'h1', ...rest } = props;

  if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(Element)) {
    throw new Error(
      'Please specify a valid html heading element (e.g. h1, h2, h3, etc.)'
    );
  }

  return (
    <Element className={cn(headingStyles[Element])} {...rest}>
      {children}
    </Element>
  );
}
