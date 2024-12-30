// src/lib/env.ts
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_GEMINI_API_KEY',
  'GOOGLE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'REPLICATE_API_TOKEN'
] as const;

export function validateEnv() {
  for (const env of requiredEnvVars) {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
}