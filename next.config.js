require('dotenv').config();

/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const baseUrl = '';

// Single consolidated configuration
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  basePath: baseUrl,
  reactStrictMode: true,

  // Performance optimizations
  swcMinify: true, // Faster minification
  compress: true, // Better compression

  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };

    // eslint-disable-next-line no-param-reassign
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };

    // Add production optimization
    if (process.env.NODE_ENV === 'production') {
      // Add production-only webpack optimizations if needed
    }

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
      },
      {
        protocol: 'https',
        hostname: 'jesski.com',
      },
    ],
    // Optimize common image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Enable modern image formats
    formats: ['image/webp'],
  },

  // Static file headers for better caching
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  env: {
    baseUrl,
    SITE_URL: process.env.SITE_URL,
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  },
};

// Apply the bundle analyzer wrapper
module.exports = withBundleAnalyzer(nextConfig);
