import { describe, it } from 'vitest';

import { assert } from './helpers';

describe('utils/helpers', () => {
  describe('assert', () => {
    it('returns the value if it is not null or undefined', ({ expect }) => {
      expect(assert('hello')).toBe('hello');
    });

    it('does not throw an error for an empty string', ({ expect }) => {
      expect(assert('')).toBe('');
    });

    it('does not throw an error for the number 0', ({ expect }) => {
      expect(assert(0)).toBe(0);
    });

    it('does not throw an error for an empty array', ({ expect }) => {
      expect(assert([])).toStrictEqual([]);
    });

    it('throws an error if the value is null', ({ expect }) => {
      expect(() => assert(null)).toThrowError();
    });

    it('throws an error if the value is undefined', ({ expect }) => {
      expect(() => assert(undefined)).toThrowError();
    });
  });
});
