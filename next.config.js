const withNextIntl = require('next-intl/plugin')(
  // This is the default location for the i18n config
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other Next.js config options can go here
  experimental: {
    // Enable experimental features if needed
  },
};

module.exports = withNextIntl(nextConfig);