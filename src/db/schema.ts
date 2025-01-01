// src/db/schema.ts
import { pgTable, boolean, serial, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  imageUrl: varchar('imageUrl'),
  subscription: boolean('subscription').default(false),
  credits: integer('credits').default(30),
  lastCreditReset: timestamp('last_credit_reset'),
  stripeCustomerId: varchar('stripe_customer_id'),
  subscriptionId: varchar('subscription_id'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Remove lastCreditReset from VideoData since it belongs in Users
export const VideoData = pgTable('videoData', {
  id: serial('id').primaryKey(),
  script: json('script').notNull(),
  audioFileUrl: varchar('audioFileUrl').notNull(),
  captions: json('captions').notNull(),
  imageList: varchar('imageList').array(),
  createdBy: varchar('createdBy').notNull(),
  exportCount: integer('export_count').default(0),
  lastExportedAt: timestamp('last_exported_at'),
});

export const VideoExports = pgTable('videoExports', {
  id: serial('id').primaryKey(),
  videoId: integer('video_id').references(() => VideoData.id),
  userId: varchar('user_id').notNull(),
  status: varchar('status').notNull(), // 'pending' | 'processing' | 'ready' | 'downloaded' | 'expired'
  storageUrl: varchar('storage_url'),
  downloadUrl: varchar('download_url'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  downloadedAt: timestamp('downloaded_at'),
  creditsUsed: integer('credits_used').notNull(),
});

export type Users = typeof Users.$inferSelect;
export type videoData = typeof VideoData.$inferSelect;
export type videoExports = typeof VideoExports.$inferSelect;