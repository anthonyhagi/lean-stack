import { describe, it } from 'vitest';

import { getPasswordResetEmail } from './email';

describe('emails/auth/password-reset', () => {
  describe('html email', () => {
    it('renders the email', async ({ expect }) => {
      const { html } = await getPasswordResetEmail({
        firstName: 'Anthony',
        href: '',
      });

      expect(html).toBeDefined();
    });
  });

  describe('text email', () => {
    it('renders the email', async ({ expect }) => {
      const { text } = await getPasswordResetEmail({
        firstName: 'Anthony',
        href: '',
      });

      expect(text).toBeDefined();
    });
  });
});
