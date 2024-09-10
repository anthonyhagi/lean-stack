import { roles, users } from '~/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { userRoles } from '~/schema/userRoles';
import { assert } from '~/utils/helpers';

type GetUserRoleParams = {
  userId: string;
};

export async function getUserRoles(params: GetUserRoleParams) {
  const { userId } = params;

  const rows = await db
    .select({ role: roles })
    .from(users)
    .leftJoin(userRoles, eq(userRoles.userId, users.id))
    .leftJoin(roles, eq(roles.id, userRoles.roleId))
    .where(eq(users.id, userId));

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows.map((row) => {
    return assert(row.role);
  });
}

export async function getDefaultUserRole() {
  const rows = await db.select().from(roles).where(eq(roles.slug, 'user'));

  if (!rows || rows.length === 0) {
    throw new Error(
      '[FATAL]: Unable to find the default user role. Has something changed in the DB?'
    );
  }

  const role = rows[0];

  return role;
}
