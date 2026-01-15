import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    serverActions: {
      allowedOrigins: [
        'localhost:3001',
        'special-couscous-jgjrx7457x7cpgp4-3001.app.github.dev',
        '*.app.github.dev'
      ]
    }
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  }
};

export default nextConfig;
