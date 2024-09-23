import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

import { users } from './users';

export const userPasswordChangeRequests = sqliteTable(
  'user_password_change_request',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdateFn(() => new Date().toISOString()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),

    // The date/time we want to expire an email change request.
    expiresAt: text('expires_at').notNull(),

    // The unique code we want to verify in the email to keep things
    // stateless.
    code: text('code').notNull(),
  }
);

export type UserPasswordChangeRequest =
  typeof userPasswordChangeRequests.$inferSelect;
