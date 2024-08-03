import { describe, it } from 'vitest';

import { cn } from './css';

describe('utils/css', () => {
  it('correctly merges css', ({ expect }) => {
    expect(cn('one', 'two')).toBe('one two');
  });
});
