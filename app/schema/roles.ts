import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { users } from './users';

export const roles = sqliteTable('role', {
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
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

export type Role = typeof roles.$inferSelect;

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
