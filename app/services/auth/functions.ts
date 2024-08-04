import { redirect } from '@remix-run/node';
import * as argon2 from 'argon2';

import { Session } from '~/schema';
import { assert } from '~/utils/helpers';

import { getUserRole } from '../roles';
import { getUserWithPassword } from '../user';
import {
  AUTH_SESSION_KEY,
  authSessionStorage,
  SESSION_EXPIRATION_TIME,
} from './constants';
import { getSession } from './queries';

export function getAuthSessionExpirationTime(): Date {
  return new Date(Date.now() + SESSION_EXPIRATION_TIME);
}

/**
 * Handle hasing the user password to keep it secure in the DB.
 *
 * This function handles encrypting the password and returning
 * the hash. Ideally we should never have to update this
 * function unless we need to change the algorithm.
 *
 * @param password the users' plaintext password.
 *
 * @returns the hashed password.
 */
export async function hashUserPassword(password: string) {
  const hash = await argon2.hash(password);

  return { hash };
}

/**
 * Handle verifying if the supplied password for the user matches
 * with the current password.
 *
 * NOTE: if the user does not have a password set (e.g. if a 3rd
 * party auth is used), this function will always return `false`.
 *
 * @param user the user we wish to check the password against.
 * @param password the password used to login.
 *
 * @returns `true` if the password was matched successfully;
 * `false` otherwise.
 */
export async function verifyUserPassword(email: string, password: string) {
  const user = await getUserWithPassword({ email });

  if (!user || !user.password) {
    return null;
  }

  const isValid = await argon2.verify(user.password.hash, password);

  if (!isValid) {
    return null;
  }

  return user;
}

/**
 * Handle getting the logged in users' id.
 *
 * This function will get the logged in users' id from the session
 * that they have provided.
 *
 * @param request the request object from the loader and/or action.
 *
 * @returns `null` if the session is invalid; the user id otherwise.
 */
export async function getLoggedInUser(request: Request) {
  const cookie = request.headers.get('Cookie');
  const authSession = await authSessionStorage.getSession(cookie);

  const sessionId = authSession.get(AUTH_SESSION_KEY) as string | undefined;

  if (!sessionId) {
    return null;
  }

  const session = await getSession({ id: sessionId });

  if (!session || !session.user) {
    throw redirect('/auth/login', {
      headers: {
        'Set-Cookie': await authSessionStorage.destroySession(authSession),
      },
    });
  }

  return session.user.id;
}

/**
 * Require a user to not be logged in (e.g. anonymous user).
 *
 * This function should be used at the start of a loader and/or
 * action to ensure the pages are only loaded for NON logged in
 * users only.
 *
 * @param request the request object from the loader and/or action.
 *
 * @throws redirect to the homepage if the user is authenticated
 * or the session is valid.
 */
export async function requireNotLoggedIn(request: Request) {
  const userId = await getLoggedInUser(request);

  if (userId) {
    throw redirect('/');
  }
}

/**
 * Require a user to be logged in (e.g. to have a valid session).
 *
 * This function should be used at the start of a loader and/or
 * action to ensure the pages are only loaded for logged in
 * users only.
 *
 * @param request the request object from the loader and/or
 * action.
 *
 * @throws a redirect to the login page if the user is not
 * authenticated or the session is invalid.
 */
export async function requireLoggedIn(request: Request) {
  const userId = await getLoggedInUser(request);

  if (!userId) {
    throw redirect('/auth/login');
  }
}

/**
 * Require a user to be logged in (e.g. to have a valid session)
 * AND to be an admin user.
 *
 * This function should be used at the start of a loader and/or
 * action to ensure the pages are only loaded for logged in
 * users AND admin users only.
 *
 * @param request the request object from the loader and/or
 * action.
 *
 * @throws a redirect to the login page if the user is not
 * authenticated or the session is invalid.
 * @throws a redirect to the homepage if the user is
 * authenticated but is not an admin user.
 */
export async function requireAdminUser(request: Request) {
  const userId = await getLoggedInUser(request);

  if (!userId) {
    throw redirect('/auth/login');
  }

  const role = assert(await getUserRole({ userId }));

  if (role.slug !== 'admin') {
    throw redirect('/');
  }
}

type NewSessionParams = {
  request: Request;
  session: Session;
  rememberMe?: boolean;
};

/**
 * Handle creating a new session for the user and redirect them to the
 * homepage. This is the last step that needs to take place for a user
 * to be considered "logged in".
 *
 * @param params the request, db session and whether to remember the
 * session for the user.
 *
 * @returns a redirect to the homepage with the new auth session
 * cookie for the user to start using the app.
 */
export async function createNewSessionForUser(params: NewSessionParams) {
  const { request, session, rememberMe } = params;

  const cookie = request.headers.get('Cookie');
  const authSession = await authSessionStorage.getSession(cookie);

  authSession.set(AUTH_SESSION_KEY, session.id);

  return redirect('/', {
    headers: {
      'Set-Cookie': await authSessionStorage.commitSession(authSession, {
        expires: rememberMe ? new Date(assert(session.expiresAt)) : undefined,
      }),
    },
  });
}
