import { redirect } from 'react-router';

import {
  AUTH_SESSION_KEY,
  authSessionStorage,
  deleteSession,
} from '~/services/auth';

/**
 * Handle logging a user out by ensuring that their session is destroyed
 * both on the server and on the client (the cookie).
 *
 * @param request the request object from the loader.
 *
 * @throws a redirect to the homepage to ensure that the cookie is
 * destroyed properly.
 */
export async function logout(request: Request) {
  const cookie = request.headers.get('Cookie');
  const authSession = await authSessionStorage.getSession(cookie);

  const sessionId = authSession.get(AUTH_SESSION_KEY);

  if (sessionId) {
    await deleteSession({ id: sessionId });
  }

  throw redirect('/', {
    headers: {
      'Set-Cookie': await authSessionStorage.destroySession(authSession),
    },
  });
}
