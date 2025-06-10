import { redirect } from 'react-router';
import {
  authenticator,
  createConnection,
  createNewSessionForUser,
  createSession,
  getExistingConnection,
} from '~/services/auth';
import { createUser, getUser } from '~/services/user';
import type { Route } from './+types/route';

export async function loader({ request }: Route.LoaderArgs) {
  // Check that the request we received was authenticated properly
  // using `remix-auth`. This ensures that we successfully
  // received the callback from Google rather than
  // another source.
  const authResult = await authenticator
    .authenticate('google', request, {
      throwOnError: true,
    })
    .then(
      (data) => ({ success: true, data }) as const,
      (error) => ({ success: false, error }) as const
    );

  // Something went wrong, don't do anything more and redirect
  // the user back to the login page.
  if (!authResult.success) {
    console.error(authResult.error);

    // TODO: add a notification/toast message for the user to
    // be notified about what went wrong.

    throw redirect('/auth/login');
  }

  const { data: profile } = authResult;

  const existingConnection = await getExistingConnection({
    providerId: profile.id,
  });

  // The user already has a connection in our app so let's
  // get them signed in. Ideally we shouldn't have to
  // do anything else after logging them in.
  if (existingConnection) {
    const userId = existingConnection.userIntegration.userId;

    const session = await createSession({ userId });

    return createNewSessionForUser({ request, session, rememberMe: true });
  }

  const user = await getUser({ email: profile.email });

  // If the user happens to already exist, then we want to link
  // the account to their email address. Once that's done,
  // sign them in.
  if (user) {
    await createConnection({
      type: 'login',
      providerName: 'google',
      userId: user.id,
      refreshToken: profile.integration.refreshToken,
      accessToken: profile.integration.accessToken,
      providerId: profile.id,
    });

    const session = await createSession({ userId: user.id });

    return createNewSessionForUser({ request, session, rememberMe: true });
  }

  // The user doesn't have an account in our system, so let's
  // create their account, save the connection and log them in.
  const newUser = await createUser({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
  });

  await createConnection({
    providerName: 'google',
    userId: newUser.id,
    refreshToken: profile.integration.refreshToken,
    accessToken: profile.integration.accessToken,
    providerId: profile.id,
  });

  const session = await createSession({ userId: newUser.id });

  return createNewSessionForUser({ request, session, rememberMe: true });
}
