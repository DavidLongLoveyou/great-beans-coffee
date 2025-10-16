#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Webpack warnings and optimizing configuration...');

// 1. Clear Next.js cache to resolve compiled config issues
const nextCacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCacheDir)) {
  console.log('📁 Clearing .next cache directory...');
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
  console.log('✅ Cache cleared successfully');
} else {
  console.log('ℹ️  No .next cache directory found');
}

// 2. Clear node_modules/.cache if it exists
const nodeModulesCacheDir = path.join(process.cwd(), 'node_modules', '.cache');
if (fs.existsSync(nodeModulesCacheDir)) {
  console.log('📁 Clearing node_modules/.cache directory...');
  fs.rmSync(nodeModulesCacheDir, { recursive: true, force: true });
  console.log('✅ Node modules cache cleared successfully');
}

// 3. Create optimized next.config.js to resolve compilation issues
const optimizedConfig = `const { withContentlayer } = require('next-contentlayer2');
const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization for Core Web Vitals
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
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

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    esmExternals: true,
    optimizeCss: true,
  },

  // Webpack optimizations with improved caching
  webpack: (config, { dev, isServer }) => {
    // SVG handling
    config.module.rules.push({
      test: /\\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Handle JSON imports
    config.module.rules.push({
      test: /\\.json$/,
      type: 'json',
    });

    // Enable experimental features
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Improved caching configuration to prevent warnings
    if (!isServer && !dev) {
      config.cache = {
        type: 'filesystem',
        version: '2.0.0',
        cacheDirectory: path.resolve('.next/cache/webpack'),
        buildDependencies: {
          config: [__filename],
        },
        managedPaths: [path.resolve('node_modules')],
        profile: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      };
    }

    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
          cacheGroups: {
            vendor: {
              test: /[\\\\/]node_modules[\\\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              priority: 5,
            },
            react: {
              test: /[\\\\/]node_modules[\\\\/](react|react-dom)[\\\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
          },
        },
        concatenateModules: true,
      };
    }

    // Development optimizations
    if (dev) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }

    return config;
  },

  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = bundleAnalyzer(withNextIntl(withContentlayer(nextConfig)));
`;

// 4. Write the optimized config
console.log('📝 Creating optimized next.config.js...');
fs.writeFileSync(path.join(process.cwd(), 'next.config.optimized.js'), optimizedConfig);
console.log('✅ Optimized config created');

// 5. Create a backup of the current TypeScript config
const currentConfigPath = path.join(process.cwd(), 'next.config.ts');
const backupConfigPath = path.join(process.cwd(), 'next.config.ts.backup');

if (fs.existsSync(currentConfigPath)) {
  console.log('💾 Creating backup of current next.config.ts...');
  fs.copyFileSync(currentConfigPath, backupConfigPath);
  console.log('✅ Backup created as next.config.ts.backup');
}

console.log('\\n🎯 Webpack optimization completed!');
console.log('\\n📋 Next steps:');
console.log('1. Restart the development server');
console.log('2. Monitor for reduced warnings');
console.log('3. If issues persist, consider using next.config.optimized.js');
console.log('\\n✨ Configuration optimized for better performance and fewer warnings');