import { eq } from 'drizzle-orm';
import { userPasswords, users } from '~/schema';

import { db } from '../db';

type GetUserParams = { email: string } | { id: string };

function getWhereClause(params: GetUserParams) {
  if ('id' in params) {
    return eq(users.id, params.id);
  }

  if ('email' in params) {
    return eq(users.email, params.email);
  }
}

export async function getUser(params: GetUserParams) {
  const rows = await db
    .select()
    .from(users)
    .where(getWhereClause(params))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

export async function getUserWithPassword(params: GetUserParams) {
  const rows = await db
    .select({ user: users, password: userPasswords })
    .from(users)
    .where(getWhereClause(params))
    .leftJoin(userPasswords, eq(users.id, userPasswords.userId))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  const data = rows[0];

  return { ...data.user, password: data.password };
}

export type UserWithPassword = NonNullable<
  Awaited<ReturnType<typeof getUserWithPassword>>
>;
