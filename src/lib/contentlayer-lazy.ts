import type { Locale } from '@/i18n';
import type {
  MarketReport,
  OriginStory,
  ServicePage,
  BlogPost,
  LegalPage,
} from 'contentlayer/generated';

// Lazy content loader to avoid bundling all content
class LazyContentManager {
  private static contentCache = new Map<string, any>();

  private static async loadContent() {
    const cacheKey = 'all-content';
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    // Dynamic import to avoid bundling
    const contentModule = await import('contentlayer/generated');
    const content = {
      allMarketReports: contentModule.allMarketReports,
      allOriginStories: contentModule.allOriginStories,
      allServicePages: contentModule.allServicePages,
      allBlogPosts: contentModule.allBlogPosts,
      allLegalPages: contentModule.allLegalPages,
    };

    this.contentCache.set(cacheKey, content);
    return content;
  }

  static async getMarketReports(locale: Locale): Promise<MarketReport[]> {
    const { allMarketReports } = await this.loadContent();
    return allMarketReports.filter((report: MarketReport) => report.locale === locale);
  }

  static async getFeaturedMarketReports(locale: Locale, limit = 3): Promise<MarketReport[]> {
    const reports = await this.getMarketReports(locale);
    return reports
      .filter((report: MarketReport) => report.featured)
      .slice(0, limit);
  }

  static async getMarketReportBySlug(slug: string, locale: Locale): Promise<MarketReport | undefined> {
    const { allMarketReports } = await this.loadContent();
    return allMarketReports.find(
      (report: MarketReport) => report.slug === slug && report.locale === locale
    );
  }

  static async getOriginStories(locale: Locale): Promise<OriginStory[]> {
    const { allOriginStories } = await this.loadContent();
    return allOriginStories.filter((story: OriginStory) => story.locale === locale);
  }

  static async getFeaturedOriginStories(locale: Locale, limit = 3): Promise<OriginStory[]> {
    const stories = await this.getOriginStories(locale);
    return stories
      .filter((story: OriginStory) => story.featured)
      .slice(0, limit);
  }

  static async getOriginStoryBySlug(slug: string, locale: Locale): Promise<OriginStory | undefined> {
    const { allOriginStories } = await this.loadContent();
    return allOriginStories.find(
      (story: OriginStory) => story.slug === slug && story.locale === locale
    );
  }

  static async getServicePages(locale: Locale): Promise<ServicePage[]> {
    const { allServicePages } = await this.loadContent();
    return allServicePages.filter((page: ServicePage) => page.locale === locale);
  }

  static async getFeaturedServicePages(locale: Locale): Promise<ServicePage[]> {
    const pages = await this.getServicePages(locale);
    return pages.filter((page: ServicePage) => page.featured);
  }

  static async getServicePageBySlug(slug: string, locale: Locale): Promise<ServicePage | undefined> {
    const { allServicePages } = await this.loadContent();
    return allServicePages.find(
      (page: ServicePage) => page.slug === slug && page.locale === locale
    );
  }

  static async getBlogPosts(locale: Locale): Promise<BlogPost[]> {
    const { allBlogPosts } = await this.loadContent();
    return allBlogPosts.filter((post: BlogPost) => post.locale === locale);
  }

  static async getFeaturedBlogPosts(locale: Locale, limit = 3): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts(locale);
    return posts
      .filter((post: BlogPost) => post.featured)
      .slice(0, limit);
  }

  static async getBlogPostBySlug(slug: string, locale: Locale): Promise<BlogPost | undefined> {
    const { allBlogPosts } = await this.loadContent();
    return allBlogPosts.find(
      (post: BlogPost) => post.slug === slug && post.locale === locale
    );
  }

  static async getBlogCategories(locale: Locale): Promise<string[]> {
    const posts = await this.getBlogPosts(locale);
    const categories = new Set<string>();
    posts.forEach((post: BlogPost) => {
      if (post.category) {
        categories.add(post.category);
      }
    });
    return Array.from(categories);
  }

  static async getLegalPages(locale: Locale): Promise<LegalPage[]> {
    const { allLegalPages } = await this.loadContent();
    return allLegalPages.filter((page: LegalPage) => page.locale === locale);
  }

  static async getLegalPageBySlug(slug: string, locale: Locale): Promise<LegalPage | undefined> {
    const { allLegalPages } = await this.loadContent();
    return allLegalPages.find(
      (page: LegalPage) => page.slug === slug && page.locale === locale
    );
  }

  // Search functionality
  static async searchContent(locale: Locale, query: string): Promise<any[]> {
    const [blogPosts, marketReports, servicePages, originStories] = await Promise.all([
      this.getBlogPosts(locale),
      this.getMarketReports(locale),
      this.getServicePages(locale),
      this.getOriginStories(locale),
    ]);

    const searchTerm = query.toLowerCase();
    const results: any[] = [];

    // Search blog posts
    blogPosts.forEach(post => {
      if (
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)) ||
        (post.category && post.category.toLowerCase().includes(searchTerm)) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      ) {
        results.push({
          id: post._id,
          type: 'blog',
          title: post.title,
          description: post.description,
          excerpt: post.excerpt,
          url: `/${locale}/blog/${post.slug}`,
          publishedAt: post.publishedAt,
          category: post.category,
          tags: post.tags,
          coverImage: post.coverImage,
          readingTime: post.readingTime,
          featured: post.featured,
        });
      }
    });

    // Search market reports
    marketReports.forEach(report => {
      if (
        report.title.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm) ||
        (report.excerpt && report.excerpt.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          id: report._id,
          type: 'market-report',
          title: report.title,
          description: report.description,
          excerpt: report.excerpt,
          url: `/${locale}/market-reports/${report.slug}`,
          publishedAt: report.publishedAt,
          category: report.category,
          coverImage: report.coverImage,
          featured: report.featured,
        });
      }
    });

    // Search service pages
    servicePages.forEach(page => {
      if (
        page.title.toLowerCase().includes(searchTerm) ||
        page.description.toLowerCase().includes(searchTerm) ||
        (page.excerpt && page.excerpt.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          id: page._id,
          type: 'service',
          title: page.title,
          description: page.description,
          excerpt: page.excerpt,
          url: `/${locale}/services/${page.slug}`,
          featured: page.featured,
        });
      }
    });

    // Search origin stories
    originStories.forEach(story => {
      if (
        story.title.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm) ||
        (story.excerpt && story.excerpt.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          id: story._id,
          type: 'origin-story',
          title: story.title,
          description: story.description,
          excerpt: story.excerpt,
          url: `/${locale}/origin-stories/${story.slug}`,
          publishedAt: story.publishedAt,
          featured: story.featured,
        });
      }
    });

    return results;
  }

  // Clear cache when needed (useful for development)
  static clearCache(): void {
    this.contentCache.clear();
  }
}

export default LazyContentManager;