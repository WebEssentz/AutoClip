import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      enabled: true
    },
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    }
  }
};

export default nextConfig;
