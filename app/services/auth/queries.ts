import { eq, and, gt } from 'drizzle-orm';
import { sessions, users } from '~/schema';

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
