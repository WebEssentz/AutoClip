// src/db/schema.ts
import { pgTable, boolean, serial, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  imageUrl: varchar('imageUrl'),
  subscription: boolean('subscription').default(false),
  credits:integer('credits').default(30), //30 Credits = 3 Videos,
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Update VideoData table
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

export type User = typeof Users.$inferSelect;
export type videoData = typeof VideoData.$inferSelect;
export type videoExports = typeof VideoExports.$inferSelect;