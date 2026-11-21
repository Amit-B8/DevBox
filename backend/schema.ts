import { sql } from 'drizzle-orm';
import { pgTable, pgEnum, uuid, varchar, text, timestamp, index, check } from 'drizzle-orm/pg-core';
import { usageActions, feedbackCategories } from '../src/lib/backend-contract';

export const usageAction = pgEnum('usage_action', usageActions);
export const feedbackCategory = pgEnum('feedback_category', feedbackCategories);
export const toolUsage = pgTable('tool_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  toolId: varchar('tool_id', { length: 100 }).notNull(),
  action: usageAction('action').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [index('usage_created_tool_idx').on(table.createdAt, table.toolId)]);

export const userFeedback = pgTable('user_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  toolId: varchar('tool_id', { length: 100 }),
  category: feedbackCategory('category').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [
  index('feedback_created_idx').on(table.createdAt),
  check('feedback_message_length', sql`char_length(trim(${table.message})) between 10 and 2000`),
]);
