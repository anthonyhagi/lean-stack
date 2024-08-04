import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator } from 'remix-auth';
import { env } from '../app';
import { googleStrategy } from './strategy/google';
import { ProviderUser } from './types';

export const AUTH_SESSION_KEY = 'sessionId';

// The default session expiration time for all auth sessions.
// For human readability, the session will last for 30 days.
export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;

export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'en__session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: env.SESSION_SECRET.split(','),
    secure: env.NODE_ENV === 'production',
  },
});

// we have to do this because every time you commit the session you overwrite it
// so we store the expiration time in the cookie and reset it every time we commit
const originalCommitSession = authSessionStorage.commitSession;

Object.defineProperty(authSessionStorage, 'commitSession', {
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

// This cookie session storage is used to handle google and other social
// auth methods. It should be regarded as 'throwaway' as the auth
// session above is what we really care about.
export const connectionSessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'en_connection',
    sameSite: 'lax', // CSRF protection is advised if changing to 'none'
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    secrets: env.SESSION_SECRET.split(','),
    secure: env.NODE_ENV === 'production',
  },
});

export const authenticator = new Authenticator<ProviderUser>(
  connectionSessionStorage
);

// Add all strategies that should be used here. Ideally we only want
// to limit this to social/provider strategies such as Google and
// GitHub, etc.
authenticator.use(googleStrategy);
