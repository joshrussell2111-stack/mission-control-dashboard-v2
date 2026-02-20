import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/mission-control-dashboard-v2',
  assetPrefix: '/mission-control-dashboard-v2',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
