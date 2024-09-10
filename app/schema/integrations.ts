import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

import { userIntegrations } from './user-integrations';

export const integrations = sqliteTable('integration', {
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
  slug: text('slug').notNull(),

  // The type of integration that is being added. Data sources, when enabled,
  // will be shown to the users. Login sources will not be shown to users
  // on the integrations page
  type: text('type', { enum: ['login', 'data', ''] }).default(''),
});

export type Integration = typeof integrations.$inferSelect;

export const integrationRelations = relations(integrations, ({ many }) => ({
  userIntegrations: many(userIntegrations),
}));
