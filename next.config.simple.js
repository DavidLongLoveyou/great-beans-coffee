const { withContentlayer } = require('next-contentlayer2');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    esmExternals: true,
  },
};

module.exports = withNextIntl(withContentlayer(nextConfig));
