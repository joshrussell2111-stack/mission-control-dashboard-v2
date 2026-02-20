import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  assetPrefix: '.',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
