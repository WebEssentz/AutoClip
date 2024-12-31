import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    }
  }
};

export default nextConfig;
