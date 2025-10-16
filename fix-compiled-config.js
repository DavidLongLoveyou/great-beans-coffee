#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing next.config.compiled.js issue...');

// Create a compiled version of the config to satisfy Webpack
const compiledConfigContent = `// Auto-generated compiled config to resolve Webpack warnings
const { withContentlayer } = require('next-contentlayer2');
const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/great-beans-coffee/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    esmExternals: true,
    optimizeCss: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    config.module.rules.push({
      test: /\\.json$/,
      type: 'json',
    });
    
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
    ];
  },
};

module.exports = bundleAnalyzer(withNextIntl(withContentlayer(nextConfig)));
`;

// Write the compiled config
const compiledConfigPath = path.join(process.cwd(), 'next.config.compiled.js');
fs.writeFileSync(compiledConfigPath, compiledConfigContent);
console.log('✅ Created next.config.compiled.js');

// Also create a simple version without TypeScript
const simpleConfigContent = `const { withContentlayer } = require('next-contentlayer2');
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
`;

fs.writeFileSync(path.join(process.cwd(), 'next.config.simple.js'), simpleConfigContent);
console.log('✅ Created next.config.simple.js as fallback');

console.log('\\n🎯 Configuration files created successfully!');
console.log('\\n📋 Files created:');
console.log('- next.config.compiled.js (resolves Webpack warnings)');
console.log('- next.config.simple.js (simplified fallback)');
console.log('\\n✨ Webpack should now find the compiled config file');