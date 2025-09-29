import { type MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { ContentManager } from '@/lib/contentlayer';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegreatbeans.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // Add homepage for each locale
  locales.forEach((locale) => {
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  });

  // Add static pages for each locale
  const staticPages = [
    'services',
    'blog',
    'market-reports',
    'origin-stories',
    'about',
    'contact'
  ];

  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // Add blog posts for all locales
  locales.forEach((locale) => {
    const blogPosts = ContentManager.getBlogPosts(locale);
    blogPosts.forEach((post) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  // Add service pages for all locales
  locales.forEach((locale) => {
    const servicePages = ContentManager.getServicePages(locale);
    servicePages.forEach((service) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/services/${service.slug}`,
        lastModified: new Date(service.updatedAt || service.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  });

  // Add market reports for all locales
  locales.forEach((locale) => {
    const marketReports = ContentManager.getMarketReports(locale);
    marketReports.forEach((report) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/market-reports/${report.slug}`,
        lastModified: new Date(report.updatedAt || report.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  // Add origin stories for all locales
  locales.forEach((locale) => {
    const originStories = ContentManager.getOriginStories(locale);
    originStories.forEach((story) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/origin-stories/${story.slug}`,
        lastModified: new Date(story.updatedAt || story.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  // Add legal pages for all locales
  locales.forEach((locale) => {
    const legalPages = ContentManager.getLegalPages(locale);
    legalPages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/legal/${page.slug}`,
        lastModified: new Date(page.updatedAt || page.publishedAt),
        changeFrequency: 'yearly',
        priority: 0.3,
      });
    });
  });

  return sitemap;
}