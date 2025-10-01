/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://thegreatbeans.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  // Exclude certain paths from sitemap
  exclude: [
    '/admin/*',
    '/api/*',
    '/404',
    '/500',
    '/_error',
    '/_document',
    '/_app',
    '/sitemap.xml',
    '/robots.txt',
  ],

  // Additional paths to include
  additionalPaths: async config => {
    const paths = [];
    const locales = ['en', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko', 'vi'];

    // Add homepage for each locale
    locales.forEach(locale => {
      paths.push({
        loc: `/${locale}`,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
        alternateRefs: locales
          .map(altLocale => ({
            href: `${config.siteUrl}/${altLocale}`,
            hreflang: altLocale,
          }))
          .concat([
            {
              href: `${config.siteUrl}/en`,
              hreflang: 'x-default',
            },
          ]),
      });
    });

    // Add static pages for each locale
    const staticPages = [
      'services',
      'blog',
      'market-reports',
      'origin-stories',
      'about',
      'contact',
      'quote',
    ];

    staticPages.forEach(page => {
      locales.forEach(locale => {
        paths.push({
          loc: `/${locale}/${page}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date().toISOString(),
          alternateRefs: locales
            .map(altLocale => ({
              href: `${config.siteUrl}/${altLocale}/${page}`,
              hreflang: altLocale,
            }))
            .concat([
              {
                href: `${config.siteUrl}/en/${page}`,
                hreflang: 'x-default',
              },
            ]),
        });
      });
    });

    return paths;
  },

  // Transform function to add hreflang
  transform: async (config, path) => {
    // Skip if path doesn't start with a locale
    const localeMatch = path.match(/^\/([a-z]{2})(\/.*)?$/);
    if (!localeMatch) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      };
    }

    const [, currentLocale, subPath = ''] = localeMatch;
    const locales = ['en', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko', 'vi'];

    // Generate alternate refs for all locales
    const alternateRefs = locales
      .map(locale => ({
        href: `${config.siteUrl}/${locale}${subPath}`,
        hreflang: locale,
      }))
      .concat([
        {
          href: `${config.siteUrl}/en${subPath}`,
          hreflang: 'x-default',
        },
      ]);

    // Determine priority and change frequency based on path
    let priority = 0.5;
    let changefreq = 'monthly';

    if (path === `/${currentLocale}` || path === `/${currentLocale}/`) {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/services/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.includes('/blog/') || path.includes('/market-reports/')) {
      priority = 0.7;
      changefreq = 'weekly';
    } else if (path.includes('/origin-stories/')) {
      priority = 0.6;
      changefreq = 'monthly';
    } else if (path.includes('/legal/')) {
      priority = 0.3;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs,
    };
  },

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/404', '/500'],
      },
    ],
    additionalSitemaps: [
      'https://thegreatbeans.com/sitemap.xml',
      'https://thegreatbeans.com/rss.xml',
    ],
  },

  // Output directory
  outDir: './public',

  // Generate separate sitemaps for different content types
  generateIndexSitemap: true,
  sitemapSize: 5000,

  // Custom transformation for specific routes
  additionalSitemaps: [
    'https://thegreatbeans.com/blog/rss.xml',
    'https://thegreatbeans.com/market-reports/rss.xml',
    'https://thegreatbeans.com/origin-stories/rss.xml',
  ],
};
