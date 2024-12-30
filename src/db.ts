// src/db/index.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// For development debugging
if (!process.env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL is not defined');
}

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:aA7LDTmpdy1i@ep-shy-sun-a52jz9y4.us-east-2.aws.neon.tech/neondb?sslmode=require';

neonConfig.fetchConnectionCache = true;

const sql = neon(DATABASE_URL);
export const db = drizzle(sql);