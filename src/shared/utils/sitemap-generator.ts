import { allBlogPosts } from 'contentlayer/generated';
import { site } from '@/shared/config/site';

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternateLanguages?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export interface SitemapOptions {
  baseUrl?: string;
  includeImages?: boolean;
  includeAlternateLanguages?: boolean;
  excludePaths?: string[];
  customEntries?: SitemapEntry[];
}

/**
 * Sitemap Generator for The Great Beans Coffee Export Platform
 * Generates comprehensive sitemaps for all dynamic content including:
 * - Blog posts (multilingual)
 * - Service pages
 * - Market reports
 * - Origin stories
 * - Static pages
 */
export class SitemapGenerator {
  private baseUrl: string;
  private supportedLocales: string[];
  private defaultLocale: string;

  constructor(options: SitemapOptions = {}) {
    this.baseUrl = options.baseUrl || site.url;
    this.supportedLocales = ['en', 'de', 'ja', 'vi']; // Based on content structure
    this.defaultLocale = 'en';
  }

  /**
   * Generate complete sitemap entries for all content
   */
  async generateSitemap(options: SitemapOptions = {}): Promise<SitemapEntry[]> {
    const entries: SitemapEntry[] = [];

    // Add static pages
    entries.push(...this.getStaticPages());

    // Add blog posts
    entries.push(...await this.getBlogPostEntries());

    // Add service pages
    entries.push(...this.getServicePages());

    // Add market report pages
    entries.push(...this.getMarketReportPages());

    // Add origin story pages
    entries.push(...this.getOriginStoryPages());

    // Add legal pages
    entries.push(...this.getLegalPages());

    // Add custom entries
    if (options.customEntries) {
      entries.push(...options.customEntries);
    }

    // Filter out excluded paths
    const filteredEntries = options.excludePaths
      ? entries.filter(entry => !options.excludePaths!.some(path => entry.url.includes(path)))
      : entries;

    // Sort by priority and URL
    return filteredEntries.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0.5) - (a.priority || 0.5);
      }
      return a.url.localeCompare(b.url);
    });
  }

  /**
   * Get static page entries
   */
  private getStaticPages(): SitemapEntry[] {
    const staticPages = [
      { path: '', priority: 1.0, changeFreq: 'weekly' as const },
      { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
      { path: '/services', priority: 0.9, changeFreq: 'weekly' as const },
      { path: '/products', priority: 0.9, changeFreq: 'weekly' as const },
      { path: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
      { path: '/blog', priority: 0.8, changeFreq: 'daily' as const },
      { path: '/market-reports', priority: 0.7, changeFreq: 'weekly' as const },
      { path: '/origin-stories', priority: 0.6, changeFreq: 'monthly' as const },
    ];

    const entries: SitemapEntry[] = [];

    staticPages.forEach(page => {
      this.supportedLocales.forEach(locale => {
        const url = locale === this.defaultLocale 
          ? `${this.baseUrl}${page.path}`
          : `${this.baseUrl}/${locale}${page.path}`;

        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: page.changeFreq,
          priority: page.priority,
          alternateLanguages: this.getAlternateLanguages(page.path),
        });
      });
    });

    return entries;
  }

  /**
   * Get blog post entries from Contentlayer
   */
  private async getBlogPostEntries(): Promise<SitemapEntry[]> {
    const entries: SitemapEntry[] = [];

    // Group blog posts by slug to handle multilingual content
    const postsBySlug = new Map<string, typeof allBlogPosts>();
    
    allBlogPosts.forEach(post => {
      const slug = post.slug;
      if (!postsBySlug.has(slug)) {
        postsBySlug.set(slug, []);
      }
      postsBySlug.get(slug)!.push(post);
    });

    postsBySlug.forEach((posts, slug) => {
      // Find the most recent modification date
      const lastModified = new Date(Math.max(...posts.map(p => new Date(p.publishedAt).getTime())));
      
      posts.forEach(post => {
        const url = post.locale === this.defaultLocale
          ? `${this.baseUrl}/blog/${slug}`
          : `${this.baseUrl}/${post.locale}/blog/${slug}`;

        entries.push({
          url,
          lastModified,
          changeFrequency: 'weekly',
          priority: this.getBlogPostPriority(post),
          alternateLanguages: this.getBlogPostAlternateLanguages(slug, posts),
        });
      });
    });

    return entries;
  }

  /**
   * Get service page entries
   */
  private getServicePages(): SitemapEntry[] {
    const services = [
      'coffee-sourcing',
      'quality-control',
      'logistics-shipping',
      'market-analysis',
      'oem-private-label',
      'consulting',
    ];

    const entries: SitemapEntry[] = [];

    services.forEach(service => {
      this.supportedLocales.forEach(locale => {
        const url = locale === this.defaultLocale
          ? `${this.baseUrl}/services/${service}`
          : `${this.baseUrl}/${locale}/services/${service}`;

        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
          alternateLanguages: this.getAlternateLanguages(`/services/${service}`),
        });
      });
    });

    return entries;
  }

  /**
   * Get market report page entries
   */
  private getMarketReportPages(): SitemapEntry[] {
    const reports = [
      'vietnam-coffee-market-2024',
      'global-coffee-trends-2024',
      'specialty-coffee-growth',
      'sustainable-coffee-demand',
      'coffee-price-analysis',
    ];

    const entries: SitemapEntry[] = [];

    reports.forEach(report => {
      this.supportedLocales.forEach(locale => {
        const url = locale === this.defaultLocale
          ? `${this.baseUrl}/market-reports/${report}`
          : `${this.baseUrl}/${locale}/market-reports/${report}`;

        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternateLanguages: this.getAlternateLanguages(`/market-reports/${report}`),
        });
      });
    });

    return entries;
  }

  /**
   * Get origin story page entries
   */
  private getOriginStoryPages(): SitemapEntry[] {
    const origins = [
      'vietnam-coffee-heritage',
      'sustainable-farming-practices',
      'farmer-partnerships',
      'processing-innovations',
    ];

    const entries: SitemapEntry[] = [];

    origins.forEach(origin => {
      this.supportedLocales.forEach(locale => {
        const url = locale === this.defaultLocale
          ? `${this.baseUrl}/origin-stories/${origin}`
          : `${this.baseUrl}/${locale}/origin-stories/${origin}`;

        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: 'yearly',
          priority: 0.6,
          alternateLanguages: this.getAlternateLanguages(`/origin-stories/${origin}`),
        });
      });
    });

    return entries;
  }

  /**
   * Get legal page entries
   */
  private getLegalPages(): SitemapEntry[] {
    const legalPages = [
      'privacy-policy',
      'terms-of-service',
      'cookie-policy',
      'export-compliance',
    ];

    const entries: SitemapEntry[] = [];

    legalPages.forEach(page => {
      this.supportedLocales.forEach(locale => {
        const url = locale === this.defaultLocale
          ? `${this.baseUrl}/legal/${page}`
          : `${this.baseUrl}/${locale}/legal/${page}`;

        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: 'yearly',
          priority: 0.3,
          alternateLanguages: this.getAlternateLanguages(`/legal/${page}`),
        });
      });
    });

    return entries;
  }

  /**
   * Get alternate language URLs for a path
   */
  private getAlternateLanguages(path: string): Array<{ hreflang: string; href: string }> {
    return this.supportedLocales.map(locale => ({
      hreflang: locale,
      href: locale === this.defaultLocale 
        ? `${this.baseUrl}${path}`
        : `${this.baseUrl}/${locale}${path}`,
    }));
  }

  /**
   * Get alternate language URLs for blog posts
   */
  private getBlogPostAlternateLanguages(
    slug: string, 
    posts: typeof allBlogPosts
  ): Array<{ hreflang: string; href: string }> {
    const alternates: Array<{ hreflang: string; href: string }> = [];
    
    posts.forEach(post => {
      alternates.push({
        hreflang: post.locale,
        href: post.locale === this.defaultLocale
          ? `${this.baseUrl}/blog/${slug}`
          : `${this.baseUrl}/${post.locale}/blog/${slug}`,
      });
    });

    return alternates;
  }

  /**
   * Calculate blog post priority based on various factors
   */
  private getBlogPostPriority(post: any): number {
    let priority = 0.6; // Base priority for blog posts

    // Increase priority for recent posts
    const daysSincePublished = (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 30) priority += 0.2;
    else if (daysSincePublished < 90) priority += 0.1;

    // Increase priority for featured posts
    if (post.featured) priority += 0.1;

    // Increase priority for posts with high engagement categories
    const highPriorityCategories = ['market-analysis', 'industry-insights', 'sustainability'];
    if (highPriorityCategories.includes(post.category)) priority += 0.1;

    return Math.min(priority, 1.0);
  }

  /**
   * Generate XML sitemap string
   */
  generateXMLSitemap(entries: SitemapEntry[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    const urlsetClose = '</urlset>';

    const urls = entries.map(entry => {
      let urlXml = '  <url>\n';
      urlXml += `    <loc>${this.escapeXml(entry.url)}</loc>\n`;
      
      if (entry.lastModified) {
        urlXml += `    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>\n`;
      }
      
      if (entry.changeFrequency) {
        urlXml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
      }
      
      if (entry.priority !== undefined) {
        urlXml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      }

      // Add alternate language links
      if (entry.alternateLanguages && entry.alternateLanguages.length > 1) {
        entry.alternateLanguages.forEach(alt => {
          urlXml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escapeXml(alt.href)}" />\n`;
        });
      }

      urlXml += '  </url>';
      return urlXml;
    }).join('\n');

    return `${xmlHeader}\n${urlsetOpen}\n${urls}\n${urlsetClose}`;
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml
Sitemap: ${this.baseUrl}/sitemap-blog.xml
Sitemap: ${this.baseUrl}/sitemap-services.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important directories
Allow: /blog/
Allow: /services/
Allow: /products/
Allow: /market-reports/
Allow: /origin-stories/`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

/**
 * Create sitemap generator instance
 */
export const sitemapGenerator = new SitemapGenerator({
  baseUrl: site.url,
  includeImages: true,
  includeAlternateLanguages: true,
});

/**
 * Generate sitemap for specific content type
 */
export async function generateContentSitemap(
  contentType: 'blog' | 'services' | 'market-reports' | 'origin-stories' | 'all'
): Promise<SitemapEntry[]> {
  const generator = new SitemapGenerator();
  
  switch (contentType) {
    case 'blog':
      return generator.getBlogPostEntries();
    case 'services':
      return generator.getServicePages();
    case 'market-reports':
      return generator.getMarketReportPages();
    case 'origin-stories':
      return generator.getOriginStoryPages();
    case 'all':
    default:
      return generator.generateSitemap();
  }
}

/**
 * Utility to validate sitemap entries
 */
export function validateSitemapEntries(entries: SitemapEntry[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  entries.forEach((entry, index) => {
    // Validate URL format
    try {
      new URL(entry.url);
    } catch {
      errors.push(`Entry ${index}: Invalid URL format - ${entry.url}`);
    }

    // Validate priority range
    if (entry.priority !== undefined && (entry.priority < 0 || entry.priority > 1)) {
      errors.push(`Entry ${index}: Priority must be between 0 and 1 - ${entry.priority}`);
    }

    // Validate change frequency
    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    if (entry.changeFrequency && !validFrequencies.includes(entry.changeFrequency)) {
      errors.push(`Entry ${index}: Invalid change frequency - ${entry.changeFrequency}`);
    }

    // Check for duplicate URLs
    const duplicates = entries.filter(e => e.url === entry.url);
    if (duplicates.length > 1) {
      warnings.push(`Duplicate URL found: ${entry.url}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}