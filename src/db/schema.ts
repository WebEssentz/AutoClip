// src/db/schema.ts
import { pgTable, boolean, serial, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  imageUrl: varchar('imageUrl'),
  subscription: boolean('subscription').default(false),
  credits:integer('credits').default(30), //30 Credits = 3 Videos
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const VideoData = pgTable('videoData', {
  id: serial('id').primaryKey(),
  script: json('script').notNull(),
  audioFileUrl: varchar('audioFileUrl').notNull(),
  captions: json('captions').notNull(),
  imageList: varchar('imageList').array(),
  createdBy: varchar('createdBy').notNull(),
})


export type User = typeof Users.$inferSelect;
export type videoData = typeof VideoData.$inferSelect;