import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      enabled: true
    },
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
    eslint: {
      ignoreDuringBuilds: true,  // Disables ESLint during builds
    },
  }
};

export default nextConfig;
