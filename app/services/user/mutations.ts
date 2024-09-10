import { users } from '~/schema';
import { db } from '../db';
import { getDefaultUserRole } from '../roles';
import { userRoles } from '~/schema/userRoles';

type CreateUserParams = typeof users.$inferInsert;

/**
 * Handle creating a new user profile with all of the required
 * parameters.
 *
 * @param params the new users' attributes.
 *
 * @throws `Error` when the user wasn't created.
 *
 * @returns the new user once created.
 */
export async function createUser(params: CreateUserParams) {
  const role = await getDefaultUserRole();

  return await db.transaction(async (tx) => {
    const rows = await tx.insert(users).values(params).returning();

    if (rows.length === 0) {
      throw new Error('Failed to create a user');
    }

    // Ensure that the user is added to the default user group such
    // that they're considered a general user. If we want the user
    // to have more access within the application, we need to
    // manually add them to other groups (e.g. beta access).
    await tx.insert(userRoles).values({
      userId: rows[0].id,
      roleId: role.id,
    });

    return rows[0];
  });
}
