import { sessions } from '~/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';

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
