import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type Locale } from '@/i18n';

interface ContentItem {
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  publishedAt: string;
  updatedAt?: string;
  locale: Locale;
  featured?: boolean;
  category?: string;
  tags?: string[];
  coverImage?: string;
  author?: string;
  readingTime?: number;
  content: string;
  _id: string;
}

class FileContentLoader {
  private static contentCache = new Map<string, any>();
  private static contentDir = path.join(process.cwd(), 'content');

  private static getCacheKey(type: string, locale: Locale): string {
    return `${type}-${locale}`;
  }

  private static async loadContentFromFiles(
    contentType: string,
    locale: Locale
  ): Promise<ContentItem[]> {
    const cacheKey = this.getCacheKey(contentType, locale);

    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    try {
      const contentTypeDir = path.join(this.contentDir, contentType);

      if (!fs.existsSync(contentTypeDir)) {
        console.warn(`Content directory not found: ${contentTypeDir}`);
        return [];
      }

      const files = fs
        .readdirSync(contentTypeDir)
        .filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

      const content: ContentItem[] = [];

      for (const file of files) {
        try {
          const filePath = path.join(contentTypeDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content: mdxContent } = matter(fileContent);

          // Skip if locale doesn't match
          if (data.locale !== locale) {
            continue;
          }

          // Extract slug from filename
          const slug = file.replace(/\.(mdx?|md)$/, '');

          const item: ContentItem = {
            _id: `${contentType}-${slug}-${locale}`,
            slug,
            title: data.title || slug,
            description: data.description || '',
            excerpt: data.excerpt,
            publishedAt:
              data.publishedAt || data.date || new Date().toISOString(),
            updatedAt: data.updatedAt,
            locale: data.locale || locale,
            featured: data.featured || false,
            category: data.category,
            tags: data.tags || [],
            coverImage: data.coverImage,
            author: data.author,
            readingTime:
              data.readingTime || this.calculateReadingTime(mdxContent),
            content: mdxContent,
          };

          content.push(item);
        } catch (error) {
          console.error(`Error loading file ${file}:`, error);
        }
      }

      // Sort by publishedAt (newest first)
      content.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      this.contentCache.set(cacheKey, content);
      return content;
    } catch (error) {
      console.error(
        `Error loading ${contentType} content for ${locale}:`,
        error
      );
      return [];
    }
  }

  private static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Blog Posts
  static async getBlogPosts(locale: Locale): Promise<ContentItem[]> {
    return this.loadContentFromFiles('blog', locale);
  }

  static async getFeaturedBlogPosts(
    locale: Locale,
    limit = 3
  ): Promise<ContentItem[]> {
    const posts = await this.getBlogPosts(locale);
    return posts.filter(post => post.featured).slice(0, limit);
  }

  static async getBlogPostBySlug(
    slug: string,
    locale: Locale
  ): Promise<ContentItem | undefined> {
    const posts = await this.getBlogPosts(locale);
    return posts.find(post => post.slug === slug);
  }

  static async getBlogCategories(locale: Locale): Promise<string[]> {
    const posts = await this.getBlogPosts(locale);
    const categories = new Set<string>();
    posts.forEach(post => {
      if (post.category) {
        categories.add(post.category);
      }
    });
    return Array.from(categories);
  }

  // Market Reports
  static async getMarketReports(locale: Locale): Promise<ContentItem[]> {
    return this.loadContentFromFiles('market-reports', locale);
  }

  static async getFeaturedMarketReports(
    locale: Locale,
    limit = 3
  ): Promise<ContentItem[]> {
    const reports = await this.getMarketReports(locale);
    return reports.filter(report => report.featured).slice(0, limit);
  }

  static async getMarketReportBySlug(
    slug: string,
    locale: Locale
  ): Promise<ContentItem | undefined> {
    const reports = await this.getMarketReports(locale);
    return reports.find(report => report.slug === slug);
  }

  // Service Pages
  static async getServicePages(locale: Locale): Promise<ContentItem[]> {
    return this.loadContentFromFiles('services', locale);
  }

  static async getFeaturedServicePages(locale: Locale): Promise<ContentItem[]> {
    const pages = await this.getServicePages(locale);
    return pages.filter(page => page.featured);
  }

  static async getServicePageBySlug(
    slug: string,
    locale: Locale
  ): Promise<ContentItem | undefined> {
    const pages = await this.getServicePages(locale);
    return pages.find(page => page.slug === slug);
  }

  // Origin Stories
  static async getOriginStories(locale: Locale): Promise<ContentItem[]> {
    return this.loadContentFromFiles('origin-stories', locale);
  }

  static async getFeaturedOriginStories(
    locale: Locale,
    limit = 3
  ): Promise<ContentItem[]> {
    const stories = await this.getOriginStories(locale);
    return stories.filter(story => story.featured).slice(0, limit);
  }

  static async getOriginStoryBySlug(
    slug: string,
    locale: Locale
  ): Promise<ContentItem | undefined> {
    const stories = await this.getOriginStories(locale);
    return stories.find(story => story.slug === slug);
  }

  // Legal Pages
  static async getLegalPages(locale: Locale): Promise<ContentItem[]> {
    return this.loadContentFromFiles('legal', locale);
  }

  static async getLegalPageBySlug(
    slug: string,
    locale: Locale
  ): Promise<ContentItem | undefined> {
    const pages = await this.getLegalPages(locale);
    return pages.find(page => page.slug === slug);
  }

  // Search functionality
  static async searchContent(locale: Locale, query: string): Promise<any[]> {
    const [blogPosts, marketReports, servicePages, originStories] =
      await Promise.all([
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
        (post.tags &&
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
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

export default FileContentLoader;
export type { ContentItem };
