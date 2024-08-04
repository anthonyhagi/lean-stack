import { relations, sql } from 'drizzle-orm';
import {
  text,
  sqliteTable,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

import { roles } from './roles';
import { sessions } from './sessions';
import { userIntegrations } from './user-integrations';

export const users = sqliteTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdateFn(() => new Date().toISOString()),
    deletedAt: text('deleted_at'),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').unique().notNull(),
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id),
    active: integer('active', { mode: 'boolean' }).default(false),
  },
  (table) => ({ emailIdx: uniqueIndex('email_idx').on(table.email) })
);

export type User = typeof users.$inferSelect;

export const userRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  role: one(roles),
  userIntegrations: many(userIntegrations),
}));
