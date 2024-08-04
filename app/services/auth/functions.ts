import { redirect } from '@remix-run/node';

import { AUTH_SESSION_KEY, authSessionStorage } from './constants';
import { getSession } from './queries';

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
