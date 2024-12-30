import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:aA7LDTmpdy1i@ep-shy-sun-a52jz9y4.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
});
