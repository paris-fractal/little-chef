import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipes', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    recipeData: text('recipe_data').notNull(),
    userId: text('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    userIdIdx: index('recipes_user_id_idx').on(table.userId),
}));