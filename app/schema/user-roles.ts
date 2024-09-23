import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { roles } from './roles';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const userRoles = sqliteTable(
  'user_role',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  })
);

export type UserRole = typeof userRoles.$inferSelect;

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));
