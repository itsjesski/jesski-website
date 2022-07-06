require('dotenv').config();

/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const baseUrl = '';

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  trailingSlash: true,
  basePath: baseUrl,
  env: {
    baseUrl,
  },
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
});

module.exports = {
  webpack: (config) => {
    // this will override the experiments
    // eslint-disable-next-line no-param-reassign
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
  env: {
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  },
};
