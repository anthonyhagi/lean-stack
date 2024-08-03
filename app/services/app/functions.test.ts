import { beforeAll, describe, it, vi } from 'vitest';

import { getAbsoluteUrl } from './functions';
import { env } from './validation';

// To correctly mock the environment variables, we first need to import
// the `env` constant AND THEN actually mock what we want to mock.
// In this case, it needs to just be `APP_URL` since that's
// what we're testing.
vi.mock('./validation', () => ({ env: { APP_URL: '' } }));

describe('services/app/functions', () => {
  describe('getAbsoluteUrl()', () => {
    describe('localhost:5173', () => {
      const APP_URL = 'localhost:5173';

      beforeAll(() => {
        env.APP_URL = `https://${APP_URL}`;
      });

      it('correctly gets the absolute url for the index route', ({
        expect,
      }) => {
        expect(getAbsoluteUrl('/')).toBe(`https://${APP_URL}/`);
      });

      it('correctly gets the absolute url for a specific path', ({
        expect,
      }) => {
        expect(getAbsoluteUrl('/some-path/goes/here')).toBe(
          `https://${APP_URL}/some-path/goes/here`
        );
      });
    });

    describe('http://localhost:5173', () => {
      const APP_URL = 'http://localhost:5173';

      beforeAll(() => {
        env.APP_URL = `${APP_URL}`;
      });

      it('correctly gets the absolute url for the index route', ({
        expect,
      }) => {
        expect(getAbsoluteUrl('/')).toBe(`${APP_URL}/`);
      });

      it('correctly gets the absolute url for a specific path', ({
        expect,
      }) => {
        expect(getAbsoluteUrl('/some-path/goes/here')).toBe(
          `${APP_URL}/some-path/goes/here`
        );
      });
    });
  });
});
