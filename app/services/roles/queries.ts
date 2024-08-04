import { roles, users } from '~/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';

type GetUserRoleParams = {
  userId: string;
};

export async function getUserRole(params: GetUserRoleParams) {
  const { userId } = params;

  const rows = await db
    .select({ role: roles })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId));

  if (!rows || rows.length === 0) {
    return null;
  }

  const data = rows[0];

  return data.role;
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
