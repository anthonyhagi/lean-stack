import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

import { users } from './users';
import { integrations } from './integrations';

export const userIntegrations = sqliteTable('user_integration', {
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
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  integrationId: text('integration_id')
    .notNull()
    .references(() => integrations.id),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull().default(''),
  providerId: text('provider_id').notNull(),
});

export type UserIntegration = typeof userIntegrations.$inferSelect;

export const userIntegrationRelations = relations(
  userIntegrations,
  ({ one }) => ({
    integration: one(integrations),
    user: one(users),
  })
);
