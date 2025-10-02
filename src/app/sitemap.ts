import { type MetadataRoute } from 'next';

import { locales, type Locale } from '@/i18n';
import { ContentManager } from '@/lib/contentlayer';
import type {
  MarketReport,
  OriginStory,
  ServicePage,
  BlogPost,
  LegalPage,
} from 'contentlayer/generated';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegreatbeans.com';

// Helper function to generate alternate refs for multilingual pages
function generateAlternateRefs(
  path: string
): Array<{ url: string; hreflang: string }> {
  const alternates = locales.map(locale => ({
    url: `${baseUrl}/${locale}${path}`,
    hreflang: locale,
  }));

  // Add x-default
  alternates.push({
    url: `${baseUrl}/en${path}`,
    hreflang: 'x-default' as any,
  });

  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // Add homepage for each locale with alternates
  locales.forEach(locale => {
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          generateAlternateRefs('').map(alt => [alt.hreflang, alt.url])
        ),
      },
    });
  });

  // Add static pages for each locale with alternates (AI-optimized priorities)
  const staticPages = [
    { path: 'products', priority: 0.95, changeFreq: 'daily' as const }, // High priority for product catalog
    { path: 'services', priority: 0.9, changeFreq: 'weekly' as const },
    {
      path: 'services/oem-manufacturing',
      priority: 0.85,
      changeFreq: 'weekly' as const,
    },
    {
      path: 'services/private-label',
      priority: 0.85,
      changeFreq: 'weekly' as const,
    },
    {
      path: 'services/sourcing',
      priority: 0.85,
      changeFreq: 'weekly' as const,
    },
    {
      path: 'services/logistics',
      priority: 0.8,
      changeFreq: 'weekly' as const,
    },
    {
      path: 'services/quality-control',
      priority: 0.8,
      changeFreq: 'weekly' as const,
    },
    {
      path: 'services/consulting',
      priority: 0.75,
      changeFreq: 'weekly' as const,
    },
    { path: 'quote', priority: 0.9, changeFreq: 'weekly' as const }, // High priority for lead generation
    { path: 'blog', priority: 0.8, changeFreq: 'daily' as const },
    { path: 'market-reports', priority: 0.8, changeFreq: 'weekly' as const },
    { path: 'origin-stories', priority: 0.7, changeFreq: 'monthly' as const },
    { path: 'about', priority: 0.6, changeFreq: 'monthly' as const },
    { path: 'contact', priority: 0.7, changeFreq: 'monthly' as const },
  ];

  // Add high-priority product pages for AI optimization
  const productPages = [
    {
      slug: 'vietnamese-robusta-grade-1',
      priority: 0.9,
      changeFreq: 'weekly' as const,
    },
    {
      slug: 'vietnamese-arabica-specialty',
      priority: 0.9,
      changeFreq: 'weekly' as const,
    },
    {
      slug: 'robusta-screen-18',
      priority: 0.85,
      changeFreq: 'weekly' as const,
    },
    {
      slug: 'arabica-honey-processed',
      priority: 0.85,
      changeFreq: 'weekly' as const,
    },
    {
      slug: 'robusta-washed-grade-1',
      priority: 0.85,
      changeFreq: 'weekly' as const,
    },
    {
      slug: 'arabica-natural-processed',
      priority: 0.85,
      changeFreq: 'weekly' as const,
    },
    { slug: 'robusta-screen-16', priority: 0.8, changeFreq: 'weekly' as const },
    {
      slug: 'arabica-washed-grade-1',
      priority: 0.8,
      changeFreq: 'weekly' as const,
    },
  ];

  staticPages.forEach(({ path, priority, changeFreq }) => {
    locales.forEach(locale => {
      sitemap.push({
        url: `${baseUrl}/${locale}/${path}`,
        lastModified: new Date(),
        changeFrequency: changeFreq,
        priority,
        alternates: {
          languages: Object.fromEntries(
            generateAlternateRefs(`/${path}`).map(alt => [
              alt.hreflang,
              alt.url,
            ])
          ),
        },
      });
    });
  });

  // Add product pages for each locale with alternates
  productPages.forEach(({ slug, priority, changeFreq }) => {
    locales.forEach(locale => {
      sitemap.push({
        url: `${baseUrl}/${locale}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: changeFreq,
        priority,
        alternates: {
          languages: Object.fromEntries(
            generateAlternateRefs(`/products/${slug}`).map(alt => [
              alt.hreflang,
              alt.url,
            ])
          ),
        },
      });
    });
  });

  // Helper function to add content with multilingual alternates
  function addContentToSitemap(
    contentType: string,
    getContentFn: (
      locale: Locale
    ) => (MarketReport | OriginStory | ServicePage | BlogPost | LegalPage)[],
    priority: number,
    changeFreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ) {
    // Group content by slug to create proper alternates
    const contentBySlug = new Map<
      string,
      Array<{
        locale: Locale;
        content:
          | MarketReport
          | OriginStory
          | ServicePage
          | BlogPost
          | LegalPage;
      }>
    >();

    locales.forEach(locale => {
      const content = getContentFn(locale);
      content.forEach(item => {
        if (!contentBySlug.has(item.slug)) {
          contentBySlug.set(item.slug, []);
        }
        contentBySlug.get(item.slug)!.push({ locale, content: item });
      });
    });

    // Add entries with proper alternates
    contentBySlug.forEach((localeVersions, slug) => {
      localeVersions.forEach(({ locale, content }) => {
        const alternateLanguages: Record<string, string> = {};

        // Add all available language versions
        localeVersions.forEach(({ locale: altLocale }) => {
          alternateLanguages[altLocale] =
            `${baseUrl}/${altLocale}/${contentType}/${slug}`;
        });

        // Add x-default (prefer English if available, otherwise first available)
        const defaultLocale =
          localeVersions.find(v => v.locale === 'en')?.locale ||
          localeVersions[0]?.locale ||
          'en';
        alternateLanguages['x-default'] =
          `${baseUrl}/${defaultLocale}/${contentType}/${slug}`;

        sitemap.push({
          url: `${baseUrl}/${locale}/${contentType}/${slug}`,
          lastModified: new Date(content.updatedAt || content.publishedAt),
          changeFrequency: changeFreq,
          priority,
          alternates: {
            languages: alternateLanguages,
          },
        });
      });
    });
  }

  // Add blog posts with multilingual alternates
  addContentToSitemap(
    'blog',
    locale => ContentManager.getBlogPosts(locale),
    0.7,
    'weekly'
  );

  // Add service pages with multilingual alternates
  addContentToSitemap(
    'services',
    locale => ContentManager.getServicePages(locale),
    0.8,
    'monthly'
  );

  // Add market reports with multilingual alternates
  addContentToSitemap(
    'market-reports',
    locale => ContentManager.getMarketReports(locale),
    0.6,
    'monthly'
  );

  // Add origin stories with multilingual alternates
  addContentToSitemap(
    'origin-stories',
    locale => ContentManager.getOriginStories(locale),
    0.6,
    'monthly'
  );

  // Add legal pages with multilingual alternates
  addContentToSitemap(
    'legal',
    locale => ContentManager.getLegalPages(locale),
    0.3,
    'yearly'
  );

  return sitemap;
}
