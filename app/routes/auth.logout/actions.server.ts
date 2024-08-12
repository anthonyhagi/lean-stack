import { redirect } from '@remix-run/node';

import { AUTH_SESSION_KEY, authSessionStorage } from '~/services/auth';
import { deleteSession } from '~/services/auth';

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
