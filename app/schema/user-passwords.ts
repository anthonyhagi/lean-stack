import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { users } from './users';

export const userPasswords = sqliteTable('user_password', {
  userId: text('user_id')
    .unique()
    .notNull()
    .references(() => users.id),
  hash: text('hash').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdateFn(() => new Date().toISOString()),
});

export type UserPassword = typeof userPasswords.$inferSelect;
