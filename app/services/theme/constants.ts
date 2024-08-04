import { createCookieSessionStorage } from '@remix-run/node';
import { createThemeSessionResolver } from 'remix-themes';
import { env } from '../app';

// The default session expiration time for all auth sessions.
// For human readability, the session will last for 30 days.
export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;

const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'en_theme',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: env.SESSION_SECRET.split(','),
    secure: env.NODE_ENV === 'production',
  },
});

// we have to do this because every time you commit the session you overwrite it
// so we store the expiration time in the cookie and reset it every time we commit
const originalCommitSession = themeSessionStorage.commitSession;

Object.defineProperty(themeSessionStorage, 'commitSession', {
  value: async function commitSession(
    ...args: Parameters<typeof originalCommitSession>
  ) {
    const [session, options] = args;

    if (options?.expires) {
      session.set('expires', options.expires);
    }

    if (options?.maxAge) {
      session.set('expires', new Date(Date.now() + options.maxAge * 1000));
    }

    const expires = session.has('expires')
      ? new Date(session.get('expires'))
      : undefined;

    const setCookieHeader = await originalCommitSession(session, {
      ...options,
      expires,
    });

    return setCookieHeader;
  },
});

export const themeSessionResolver =
  createThemeSessionResolver(themeSessionStorage);
