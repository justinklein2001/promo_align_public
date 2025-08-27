import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';

export const songNodes = pgTable('song_nodes', {
  id: text('id').primaryKey(),
  node: jsonb('node').notNull(),
});

export const promoNodes = pgTable('promo_nodes', {
  id: text('id').primaryKey(),
  node: jsonb('node').notNull(),
});

export const edges = pgTable('edges', {
  id: text('id').primaryKey(),
  source: text('source').notNull(),
  target: text('target').notNull(),
  type: text('type'),
});
