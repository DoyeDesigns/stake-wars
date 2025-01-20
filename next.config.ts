import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    PROJECT_ID: process.env.PROJECT_ID,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    PRODUCT_IMAGES_URL: process.env.PRODUCT_IMAGES_URL
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
};

export default nextConfig;
