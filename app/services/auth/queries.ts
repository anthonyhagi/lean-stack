import { eq, and, gt } from 'drizzle-orm';
import { integrations, sessions, userIntegrations, users } from '~/schema';

import { db } from '../db';

type GetSessionParams = { id: string };

/**
 * Handle getting the session by id with the attached user.
 *
 * @param params the id of the session to retrieve it.
 *
 * @returns the formatted session with associated user
 * or null.
 */
export async function getSession(params: GetSessionParams) {
  const rows = await db
    .select()
    .from(sessions)
    .leftJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.id, params.id),
        gt(sessions.expiresAt, new Date().toISOString())
      )
    );

  if (!rows || rows.length === 0) {
    return null;
  }

  const data = rows[0]!;

  return { ...data.session, user: data.user };
}

export type SessionWithUser = NonNullable<
  Awaited<ReturnType<typeof getSession>>
>;

type ExistingConnectionParams = {
  providerId: string;
};

/**
 * Handle getting the social auth connection for a user based on
 * their providerId.
 *
 * @param params the providers' id that we will search for.
 *
 * @returns `null` if the connection doesn't exist, otherwise
 * we return the connection.
 */
export async function getExistingConnection(params: ExistingConnectionParams) {
  const { providerId } = params;

  const rows = await db
    .select()
    .from(userIntegrations)
    .where(eq(userIntegrations.providerId, providerId))
    .leftJoin(
      integrations,
      eq(userIntegrations.integrationId, integrations.id)
    );

  if (rows.length === 0) {
    return null;
  }

  const data = rows[0];

  if (!data.integration || !data.user_integration) {
    return null;
  }

  return {
    ...data.integration,
    userIntegration: {
      ...data.user_integration,
    },
  };
}
