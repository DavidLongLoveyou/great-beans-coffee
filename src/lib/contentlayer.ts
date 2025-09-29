import { allMarketReports, allOriginStories, allServicePages, allBlogPosts, allLegalPages } from 'contentlayer/generated';
import type { MarketReport, OriginStory, ServicePage, BlogPost, LegalPage } from 'contentlayer/generated';
import type { Locale } from '@/i18n';

// Type definitions for content collections
export type ContentType = 'market-reports' | 'origin-stories' | 'services' | 'blog' | 'legal';

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  locale: Locale;
  url: string;
  publishedAt?: string;
  lastUpdated?: string;
  featured?: boolean;
  category?: string;
  tags?: string[];
  excerpt?: string;
  readingTime?: number;
  coverImage?: string;
}

// Content filtering and sorting utilities
export class ContentManager {
  /**
   * Get all market reports for a specific locale
   */
  static getMarketReports(locale: Locale): MarketReport[] {
    return allMarketReports
      .filter((report) => report.locale === locale)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  /**
   * Get featured market reports for a specific locale
   */
  static getFeaturedMarketReports(locale: Locale, limit = 3): MarketReport[] {
    return this.getMarketReports(locale)
      .filter((report) => report.featured)
      .slice(0, limit);
  }

  /**
   * Get market reports by category
   */
  static getMarketReportsByCategory(locale: Locale, category: string): MarketReport[] {
    return this.getMarketReports(locale)
      .filter((report) => report.category === category);
  }

  /**
   * Get all origin stories for a specific locale
   */
  static getOriginStories(locale: Locale): OriginStory[] {
    return allOriginStories
      .filter((story) => story.locale === locale)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  /**
   * Get featured origin stories for a specific locale
   */
  static getFeaturedOriginStories(locale: Locale, limit = 3): OriginStory[] {
    return this.getOriginStories(locale)
      .filter((story) => story.featured)
      .slice(0, limit);
  }

  /**
   * Get origin stories by coffee variety
   */
  static getOriginStoriesByVariety(locale: Locale, variety: string): OriginStory[] {
    return this.getOriginStories(locale)
      .filter((story) => story.coffeeVariety === variety);
  }

  /**
   * Get origin stories by region
   */
  static getOriginStoriesByRegion(locale: Locale, region: string): OriginStory[] {
    return this.getOriginStories(locale)
      .filter((story) => story.region === region);
  }

  /**
   * Get all service pages for a specific locale
   */
  static getServicePages(locale: Locale): ServicePage[] {
    return allServicePages
      .filter((service) => service.locale === locale)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  /**
   * Get featured service pages for a specific locale
   */
  static getFeaturedServicePages(locale: Locale): ServicePage[] {
    return this.getServicePages(locale)
      .filter((service) => service.featured);
  }

  /**
   * Get service page by type
   */
  static getServicePageByType(locale: Locale, serviceType: string): ServicePage | undefined {
    return allServicePages
      .find((service) => service.locale === locale && service.serviceType === serviceType);
  }

  /**
   * Get all blog posts for a specific locale
   */
  static getBlogPosts(locale: Locale): BlogPost[] {
    return allBlogPosts
      .filter((post) => post.locale === locale)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  /**
   * Get featured blog posts for a specific locale
   */
  static getFeaturedBlogPosts(locale: Locale, limit = 3): BlogPost[] {
    return this.getBlogPosts(locale)
      .filter((post) => post.featured)
      .slice(0, limit);
  }

  /**
   * Get blog posts by category
   */
  static getBlogPostsByCategory(locale: Locale, category: string): BlogPost[] {
    return this.getBlogPosts(locale)
      .filter((post) => post.category === category);
  }

  /**
   * Get recent blog posts
   */
  static getRecentBlogPosts(locale: Locale, limit = 5): BlogPost[] {
    return this.getBlogPosts(locale).slice(0, limit);
  }

  /**
   * Get all legal pages for a specific locale
   */
  static getLegalPages(locale: Locale): LegalPage[] {
    return allLegalPages
      .filter((page) => page.locale === locale)
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }

  /**
   * Get legal page by type
   */
  static getLegalPageByType(locale: Locale, pageType: string): LegalPage | undefined {
    return allLegalPages
      .find((page) => page.locale === locale && page.pageType === pageType);
  }

  /**
   * Search content across all types
   */
  static searchContent(locale: Locale, query: string): ContentItem[] {
    const searchTerm = query.toLowerCase();
    const results: ContentItem[] = [];

    // Search market reports
    const marketReports = this.getMarketReports(locale)
      .filter((report) => 
        report.title.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm) ||
        report.excerpt.toLowerCase().includes(searchTerm) ||
        report.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .map((report): ContentItem => ({
        slug: report.slug!,
        title: report.title,
        description: report.description,
        locale: report.locale as Locale,
        url: report.url,
        publishedAt: report.publishedAt,
        featured: report.featured,
        category: report.category,
        tags: report.tags,
        excerpt: report.excerpt,
        readingTime: report.readingTime,
        coverImage: report.coverImage,
      }));

    // Search origin stories
    const originStories = this.getOriginStories(locale)
      .filter((story) => 
        story.title.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm) ||
        story.excerpt.toLowerCase().includes(searchTerm) ||
        story.region.toLowerCase().includes(searchTerm) ||
        story.province.toLowerCase().includes(searchTerm)
      )
      .map((story): ContentItem => ({
        slug: story.slug!,
        title: story.title,
        description: story.description,
        locale: story.locale as Locale,
        url: story.url,
        publishedAt: story.publishedAt,
        featured: story.featured,
        excerpt: story.excerpt,
        readingTime: story.readingTime,
        coverImage: story.coverImage,
      }));

    // Search blog posts
    const blogPosts = this.getBlogPosts(locale)
      .filter((post) => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .map((post): ContentItem => ({
        slug: post.slug!,
        title: post.title,
        description: post.description,
        locale: post.locale as Locale,
        url: post.url,
        publishedAt: post.publishedAt,
        featured: post.featured,
        category: post.category,
        tags: post.tags,
        excerpt: post.excerpt,
        readingTime: post.readingTime,
        coverImage: post.coverImage,
      }));

    // Search service pages
    const servicePages = this.getServicePages(locale)
      .filter((service) => 
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.excerpt.toLowerCase().includes(searchTerm) ||
        service.benefits?.some(benefit => benefit.toLowerCase().includes(searchTerm)) ||
        service.features?.some(feature => feature.toLowerCase().includes(searchTerm))
      )
      .map((service): ContentItem => ({
        slug: service.slug!,
        title: service.title,
        description: service.description,
        locale: service.locale as Locale,
        url: service.url,
        featured: service.featured,
        excerpt: service.excerpt,
        readingTime: service.readingTime,
        coverImage: service.coverImage,
      }));

    return [...marketReports, ...originStories, ...blogPosts, ...servicePages];
  }

  /**
   * Get related content based on tags and category
   */
  static getRelatedContent(
    locale: Locale, 
    currentSlug: string, 
    tags: string[] = [], 
    category?: string,
    limit = 3
  ): ContentItem[] {
    const allContent = this.searchContent(locale, ''); // Get all content
    
    return allContent
      .filter((item) => item.slug !== currentSlug) // Exclude current item
      .map((item) => {
        let score = 0;
        
        // Score based on matching tags
        if (item.tags) {
          const matchingTags = item.tags.filter(tag => tags.includes(tag));
          score += matchingTags.length * 2;
        }
        
        // Score based on matching category
        if (category && item.category === category) {
          score += 3;
        }
        
        return { ...item, score };
      })
      .filter((item) => item.score > 0) // Only include items with some relevance
      .sort((a, b) => b.score - a.score) // Sort by relevance score
      .slice(0, limit);
  }

  /**
   * Get content for sitemap generation
   */
  static getAllContentForSitemap(): Array<{
    url: string;
    lastModified: Date;
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    priority: number;
  }> {
    const sitemapEntries: Array<{
      url: string;
      lastModified: Date;
      changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      priority: number;
    }> = [];

    // Market reports
    allMarketReports.forEach((report) => {
      sitemapEntries.push({
        url: report.url,
        lastModified: report.updatedAt ? new Date(report.updatedAt) : new Date(report.publishedAt),
        changeFrequency: 'weekly',
        priority: report.featured ? 0.8 : 0.6,
      });
    });

    // Origin stories
    allOriginStories.forEach((story) => {
      sitemapEntries.push({
        url: story.url,
        lastModified: new Date(story.publishedAt),
        changeFrequency: 'monthly',
        priority: story.featured ? 0.7 : 0.5,
      });
    });

    // Service pages
    allServicePages.forEach((service) => {
      sitemapEntries.push({
        url: service.url,
        lastModified: new Date(), // Services are updated regularly
        changeFrequency: 'monthly',
        priority: service.featured ? 0.9 : 0.7,
      });
    });

    // Blog posts
    allBlogPosts.forEach((post) => {
      sitemapEntries.push({
        url: post.url,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: post.featured ? 0.6 : 0.4,
      });
    });

    // Legal pages
    allLegalPages.forEach((page) => {
      sitemapEntries.push({
        url: page.url,
        lastModified: new Date(page.lastUpdated),
        changeFrequency: 'yearly',
        priority: 0.3,
      });
    });

    return sitemapEntries;
  }

  /**
   * Calculate reading time for content
   */
  static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Get content statistics
   */
  static getContentStats(locale: Locale) {
    return {
      marketReports: this.getMarketReports(locale).length,
      originStories: this.getOriginStories(locale).length,
      servicePages: this.getServicePages(locale).length,
      blogPosts: this.getBlogPosts(locale).length,
      legalPages: this.getLegalPages(locale).length,
      total: this.getMarketReports(locale).length + 
             this.getOriginStories(locale).length + 
             this.getServicePages(locale).length + 
             this.getBlogPosts(locale).length + 
             this.getLegalPages(locale).length,
    };
  }
}

// Export individual content getters for convenience
export const getMarketReports = ContentManager.getMarketReports;
export const getFeaturedMarketReports = ContentManager.getFeaturedMarketReports;
export const getOriginStories = ContentManager.getOriginStories;
export const getFeaturedOriginStories = ContentManager.getFeaturedOriginStories;
export const getServicePages = ContentManager.getServicePages;
export const getFeaturedServicePages = ContentManager.getFeaturedServicePages;
export const getBlogPosts = ContentManager.getBlogPosts;
export const getFeaturedBlogPosts = ContentManager.getFeaturedBlogPosts;
export const getLegalPages = ContentManager.getLegalPages;
export const searchContent = ContentManager.searchContent;
export const getRelatedContent = ContentManager.getRelatedContent;