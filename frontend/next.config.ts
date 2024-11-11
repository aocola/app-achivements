import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  env: {
    SERVER_HOST: process.env.SERVER_HOST,
  },
};

export default nextConfig;
