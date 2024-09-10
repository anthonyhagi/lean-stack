import { integrations, sessions, userIntegrations } from '~/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { getAuthSessionExpirationTime } from './functions';
import { ProviderName } from './types';
import _ from 'lodash';

type CreateSessionParams = { userId: string };

/**
 * Create a session for the user in the database. This needs
 * to be created for each login to track it server-side.
 *
 * @param params the userId we are creating the session for.
 *
 * @returns the created session in the DB.
 */
export async function createSession(params: CreateSessionParams) {
  const rows = await db
    .insert(sessions)
    .values({
      userId: params.userId,
      expiresAt: getAuthSessionExpirationTime().toISOString(),
    })
    .returning();

  return rows[0];
}

type DeleteSessionParams = {
  id: string;
};

/**
 * Delete a session to handle logging the user out.
 *
 * @param params the unique `id` of the session to delete.
 *
 * @returns the deleted session and all of it's attributes.
 */
export async function deleteSession(params: DeleteSessionParams) {
  const rows = await db
    .delete(sessions)
    .where(eq(sessions.id, params.id))
    .returning();

  return rows;
}

type FindOrCreateIntegrationParams = {
  type?: 'login' | 'data';
};

/**
 * Handle finding the integration we want to load or create it if
 * it doesn't exist.
 *
 * All user logins will be stored against the specified providers
 * that we have defined in the database.
 *
 * @param provider the provider name we want to get.
 *
 * @returns the provider and all of it's attributes.
 */
export async function findOrCreateIntegration(
  provider: ProviderName,
  params: FindOrCreateIntegrationParams
) {
  const { type } = params;

  const slug = _.kebabCase(provider);
  const name = _.startCase(_.camelCase(provider));

  // We should only be creating new integrations when we've supported
  // the provider. Ideally we should always be finding the provider
  // in the database, but in the case that we haven't, it needs
  // to be created to ensure things don't error out.
  const foundRows = await db
    .select()
    .from(integrations)
    .where(eq(integrations.slug, slug));

  if (foundRows.length > 0) {
    return foundRows[0];
  }

  const rows = await db
    .insert(integrations)
    .values({ name, slug, type })
    .returning();

  return rows[0];
}

type CreateConnectionParams = {
  type?: 'login' | 'data';
  providerName: ProviderName;
  providerId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
};

/**
 * Create a connection between a user and the specified integration that
 * they are logging in with.
 *
 * @param params the provider, remote `userId`, internal `userId` and
 * any specific details that should be stored against the connection.
 *
 * @returns the connection that is linked between the integration
 * and the user.
 */
export async function createConnection(params: CreateConnectionParams) {
  const { providerId, providerName, userId, accessToken, refreshToken, type } =
    params;

  const integration = await findOrCreateIntegration(providerName, {
    type,
  });

  const newUserIntegration = await db
    .insert(userIntegrations)
    .values({
      integrationId: integration.id,
      accessToken,
      refreshToken,
      userId,
      providerId,
    })
    .returning();

  return newUserIntegration[0];
}
