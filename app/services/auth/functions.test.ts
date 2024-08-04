import { describe, it } from 'vitest';

import { hashUserPassword } from './functions';

describe('services/auth', () => {
  describe('hashUserPassword()', () => {
    it("returns a hash of the users' password", async ({ expect }) => {
      const { hash } = await hashUserPassword('some-password');

      expect(hash).not.toBe('some-password');
    });
  });
});
