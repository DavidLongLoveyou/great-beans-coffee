import { type Metadata } from 'next';
import { type Locale } from '@/i18n';
import { 
  AdvancedSEOMetadata, 
  advancedSEOManager,
  AdvancedSEOConfig 
} from '@/shared/utils/advanced-seo-manager';
import { 
  schemaGenerators,
  type CoffeeProductData,
  type B2BServiceData,
  type ArticleData,
  type MarketReportData,
  type OriginStoryData,
} from '@/shared/utils/schema-generators';

/**
 * Enhanced SEO Service for The Great Beans
 * Provides comprehensive SEO capabilities for the application layer including:
 * - Dynamic metadata generation
 * - Schema.org structured data management
 * - International SEO optimization
 * - Performance and Core Web Vitals optimization
 * - AI and voice search optimization
 */

export interface SEOPageData {
  // Page identification
  pageType: 'home' | 'product' | 'service' | 'article' | 'collection' | 'about' | 'contact' | 'report' | 'origin-story';
  slug?: string;
  locale: Locale;
  
  // Content data
  title: string;
  description: string;
  keywords: string[];
  content?: string;
  
  // Media
  images?: Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  }>;
  
  // Dates
  publishedDate?: string;
  modifiedDate?: string;
  
  // Author and attribution
  author?: string;
  
  // Category and tags
  category?: string;
  tags?: string[];
  
  // Business data
  price?: {
    amount: string;
    currency: string;
    unit?: string;
  };
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Seasonal';
  
  // Navigation
  breadcrumbs?: Array<{ name: string; url: string }>;
  
  // Related content
  relatedItems?: Array<{ name: string; url: string; description?: string }>;
  
  // FAQ for AI optimization
  faqs?: Array<{ question: string; answer: string }>;
  
  // Custom properties
  customData?: Record<string, any>;
}

export interface SEOOptimizationOptions {
  // Performance optimization
  enableImageOptimization?: boolean;
  enableCriticalResourcePreload?: boolean;
  enableCoreWebVitalsTracking?: boolean;
  
  // Content optimization
  enableSchemaMarkup?: boolean;
  enableFAQOptimization?: boolean;
  enableBreadcrumbMarkup?: boolean;
  
  // International SEO
  enableHreflangTags?: boolean;
  alternateLocales?: Locale[];
  
  // Analytics and tracking
  enableAnalytics?: boolean;
  enableEnhancedEcommerce?: boolean;
  
  // Custom optimization
  customSchemas?: Record<string, any>[];
  preloadResources?: Array<{
    href: string;
    as: 'image' | 'font' | 'script' | 'style';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
}

export interface SEOAuditResult {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    category: 'metadata' | 'schema' | 'performance' | 'accessibility' | 'international';
    message: string;
    recommendation?: string;
  }>;
  recommendations: string[];
  performance: {
    metaTagsCount: number;
    schemaCount: number;
    imageOptimization: boolean;
    internationalSEO: boolean;
  };
}

export class EnhancedSEOService {
  private seoManager = advancedSEOManager;
  private schemaGen = schemaGenerators;
  private baseUrl: string;

  constructor(baseUrl: string = 'https://thegreatbeans.com') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate comprehensive SEO metadata for any page type
   */
  async generatePageSEO(
    pageData: SEOPageData,
    options: SEOOptimizationOptions = {}
  ): Promise<{
    metadata: Metadata;
    structuredData: Record<string, any>[];
    preloadResources: Array<{ href: string; as: string; type?: string; crossOrigin?: string }>;
  }> {
    // Build advanced SEO metadata
    const seoMetadata: AdvancedSEOMetadata = {
      title: pageData.title,
      description: pageData.description,
      keywords: pageData.keywords,
      contentType: this.mapPageTypeToContentType(pageData.pageType),
      locale: pageData.locale,
      alternateLocales: options.alternateLocales,
      author: pageData.author,
      publishedTime: pageData.publishedDate,
      modifiedTime: pageData.modifiedDate,
      section: pageData.category,
      tags: pageData.tags,
      price: pageData.price,
      availability: pageData.availability,
      images: pageData.images,
      canonical: this.generateCanonicalUrl(pageData),
      priority: this.calculatePagePriority(pageData.pageType),
      changeFrequency: this.getChangeFrequency(pageData.pageType),
    };

    // Generate Next.js metadata
    const metadata = this.seoManager.generateMetadata(seoMetadata);

    // Generate structured data
    const structuredData: Record<string, any>[] = [];

    if (options.enableSchemaMarkup !== false) {
      // Always include organization and website schemas
      structuredData.push(this.seoManager.generateOrganizationSchema());
      structuredData.push(this.seoManager.generateWebsiteSchema(pageData.locale));

      // Add page-specific schemas
      await this.addPageSpecificSchemas(pageData, structuredData);

      // Add breadcrumb schema
      if (options.enableBreadcrumbMarkup !== false && pageData.breadcrumbs) {
        structuredData.push(this.seoManager.generateBreadcrumbSchema(pageData.breadcrumbs));
      }

      // Add FAQ schema for AI optimization
      if (options.enableFAQOptimization !== false && pageData.faqs) {
        structuredData.push(this.seoManager.generateFAQSchema(pageData.faqs));
      }

      // Add custom schemas
      if (options.customSchemas) {
        structuredData.push(...options.customSchemas);
      }
    }

    // Generate preload resources
    const preloadResources = this.generatePreloadResources(pageData, options);

    return {
      metadata,
      structuredData,
      preloadResources,
    };
  }

  /**
   * Generate SEO for product pages
   */
  async generateProductSEO(
    productData: CoffeeProductData,
    locale: Locale,
    options: SEOOptimizationOptions = {}
  ): Promise<{
    metadata: Metadata;
    structuredData: Record<string, any>[];
    preloadResources: Array<{ href: string; as: string; type?: string; crossOrigin?: string }>;
  }> {
    const pageData: SEOPageData = {
      pageType: 'product',
      slug: productData.id,
      locale,
      title: `${productData.name} - Premium ${productData.variety} Coffee from ${productData.origin}`,
      description: `${productData.description} Premium ${productData.variety} coffee from ${productData.origin}. ${productData.processingMethod} processed. Flavor notes: ${productData.flavorProfile.join(', ')}.`,
      keywords: [
        productData.name,
        productData.variety,
        productData.origin,
        productData.processingMethod,
        ...productData.flavorProfile,
        ...productData.certifications,
        'coffee export',
        'Vietnamese coffee',
        'B2B coffee',
        'wholesale coffee',
      ],
      images: productData.images,
      price: productData.price,
      availability: productData.availability,
      breadcrumbs: [
        { name: 'Home', url: `/${locale}` },
        { name: 'Products', url: `/${locale}/products` },
        { name: productData.name, url: `/${locale}/products/${productData.id}` },
      ],
    };

    const result = await this.generatePageSEO(pageData, options);

    // Add product-specific schema
    if (options.enableSchemaMarkup !== false) {
      result.structuredData.push(
        this.schemaGen.generateCoffeeProductSchema(productData, locale)
      );
    }

    return result;
  }

  /**
   * Generate SEO for service pages
   */
  async generateServiceSEO(
    serviceData: B2BServiceData,
    locale: Locale,
    options: SEOOptimizationOptions = {}
  ): Promise<{
    metadata: Metadata;
    structuredData: Record<string, any>[];
    preloadResources: Array<{ href: string; as: string; type?: string; crossOrigin?: string }>;
  }> {
    const pageData: SEOPageData = {
      pageType: 'service',
      slug: serviceData.id,
      locale,
      title: `${serviceData.name} - Professional Coffee ${serviceData.serviceType} Services`,
      description: `${serviceData.description} Professional ${serviceData.serviceType} services for ${serviceData.targetMarkets.join(', ')}. Serving ${serviceData.areaServed.join(', ')}.`,
      keywords: [
        serviceData.name,
        serviceData.serviceType,
        ...serviceData.targetMarkets,
        ...serviceData.features,
        ...serviceData.certifications,
        'coffee services',
        'B2B coffee solutions',
        'coffee export services',
        'coffee consulting',
      ],
      breadcrumbs: [
        { name: 'Home', url: `/${locale}` },
        { name: 'Services', url: `/${locale}/services` },
        { name: serviceData.name, url: `/${locale}/services/${serviceData.id}` },
      ],
    };

    const result = await this.generatePageSEO(pageData, options);

    // Add service-specific schema
    if (options.enableSchemaMarkup !== false) {
      result.structuredData.push(
        this.schemaGen.generateB2BServiceSchema(serviceData, locale)
      );
    }

    return result;
  }

  /**
   * Generate SEO for article/blog pages
   */
  async generateArticleSEO(
    articleData: ArticleData,
    options: SEOOptimizationOptions = {}
  ): Promise<{
    metadata: Metadata;
    structuredData: Record<string, any>[];
    preloadResources: Array<{ href: string; as: string; type?: string; crossOrigin?: string }>;
  }> {
    const pageData: SEOPageData = {
      pageType: 'article',
      slug: articleData.id,
      locale: articleData.locale,
      title: articleData.title,
      description: articleData.description,
      keywords: [
        ...articleData.tags,
        articleData.category,
        'coffee industry',
        'coffee export',
        'Vietnamese coffee',
        'coffee market',
        'B2B coffee',
      ],
      content: articleData.content,
      images: articleData.images,
      publishedDate: articleData.publishedDate,
      modifiedDate: articleData.modifiedDate,
      author: articleData.author,
      category: articleData.category,
      tags: articleData.tags,
      breadcrumbs: [
        { name: 'Home', url: `/${articleData.locale}` },
        { name: 'Blog', url: `/${articleData.locale}/blog` },
        { name: articleData.category, url: `/${articleData.locale}/blog/category/${articleData.category.toLowerCase()}` },
        { name: articleData.title, url: `/${articleData.locale}/blog/${articleData.id}` },
      ],
    };

    const result = await this.generatePageSEO(pageData, options);

    // Add article-specific schema
    if (options.enableSchemaMarkup !== false) {
      result.structuredData.push(
        this.schemaGen.generateArticleSchema(articleData, articleData.locale)
      );
    }

    return result;
  }

  /**
   * Perform comprehensive SEO audit
   */
  async auditPageSEO(
    pageData: SEOPageData,
    currentMetadata?: Metadata,
    currentSchemas?: Record<string, any>[]
  ): Promise<SEOAuditResult> {
    const issues: SEOAuditResult['issues'] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Audit metadata
    if (!pageData.title || pageData.title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'metadata',
        message: 'Title is too short (recommended: 30-60 characters)',
        recommendation: 'Expand title to include more descriptive keywords',
      });
      score -= 10;
    }

    if (pageData.title && pageData.title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'metadata',
        message: 'Title is too long (recommended: 30-60 characters)',
        recommendation: 'Shorten title to improve search result display',
      });
      score -= 5;
    }

    if (!pageData.description || pageData.description.length < 120) {
      issues.push({
        type: 'warning',
        category: 'metadata',
        message: 'Description is too short (recommended: 120-160 characters)',
        recommendation: 'Expand description to provide more context',
      });
      score -= 10;
    }

    if (pageData.description && pageData.description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'metadata',
        message: 'Description is too long (recommended: 120-160 characters)',
        recommendation: 'Shorten description to prevent truncation in search results',
      });
      score -= 5;
    }

    if (!pageData.keywords || pageData.keywords.length < 3) {
      issues.push({
        type: 'warning',
        category: 'metadata',
        message: 'Insufficient keywords (recommended: 3-10 relevant keywords)',
        recommendation: 'Add more relevant keywords for better content classification',
      });
      score -= 10;
    }

    // Audit images
    if (!pageData.images || pageData.images.length === 0) {
      issues.push({
        type: 'info',
        category: 'metadata',
        message: 'No images found for social sharing',
        recommendation: 'Add at least one high-quality image for better social media sharing',
      });
      score -= 5;
    }

    // Audit structured data
    if (!currentSchemas || currentSchemas.length < 2) {
      issues.push({
        type: 'warning',
        category: 'schema',
        message: 'Insufficient structured data markup',
        recommendation: 'Add more Schema.org markup for better search engine understanding',
      });
      score -= 15;
    }

    // Audit international SEO
    if (pageData.locale && !pageData.breadcrumbs) {
      issues.push({
        type: 'info',
        category: 'international',
        message: 'Missing breadcrumb navigation',
        recommendation: 'Add breadcrumb navigation for better user experience and SEO',
      });
      score -= 5;
    }

    // Generate recommendations
    if (score < 80) {
      recommendations.push('Focus on improving metadata quality and completeness');
    }
    if (!currentSchemas || currentSchemas.length < 3) {
      recommendations.push('Implement comprehensive Schema.org markup for better search visibility');
    }
    if (!pageData.faqs && pageData.pageType === 'product') {
      recommendations.push('Add FAQ section to optimize for voice search and AI assistants');
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
      performance: {
        metaTagsCount: this.countMetaTags(currentMetadata),
        schemaCount: currentSchemas?.length || 0,
        imageOptimization: pageData.images?.every(img => img.alt) || false,
        internationalSEO: !!pageData.breadcrumbs,
      },
    };
  }

  /**
   * Generate sitemap entry for a page
   */
  generateSitemapEntry(
    pageData: SEOPageData,
    lastModified?: string
  ): {
    url: string;
    lastModified: string;
    changeFrequency: string;
    priority: number;
    images?: Array<{ url: string; caption?: string; title?: string }>;
  } {
    return {
      url: this.generateCanonicalUrl(pageData),
      lastModified: lastModified || pageData.modifiedDate || pageData.publishedDate || new Date().toISOString(),
      changeFrequency: this.getChangeFrequency(pageData.pageType),
      priority: this.calculatePagePriority(pageData.pageType),
      images: pageData.images?.map(img => ({
        url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
        caption: img.caption || img.alt,
        title: img.alt,
      })),
    };
  }

  /**
   * Helper methods
   */
  private mapPageTypeToContentType(pageType: string): AdvancedSEOMetadata['contentType'] {
    const mapping = {
      home: 'website',
      product: 'product',
      service: 'service',
      article: 'article',
      collection: 'collection',
      about: 'organization',
      contact: 'organization',
      report: 'article',
      'origin-story': 'article',
    };
    
    return mapping[pageType as keyof typeof mapping] || 'website';
  }

  private generateCanonicalUrl(pageData: SEOPageData): string {
    const basePath = `${this.baseUrl}/${pageData.locale}`;
    
    if (pageData.pageType === 'home') {
      return basePath;
    }
    
    const typeMapping = {
      product: 'products',
      service: 'services',
      article: 'blog',
      report: 'market-reports',
      'origin-story': 'origins',
      collection: pageData.slug || 'collection',
    };
    
    const pathSegment = typeMapping[pageData.pageType as keyof typeof typeMapping] || pageData.pageType;
    
    return pageData.slug 
      ? `${basePath}/${pathSegment}/${pageData.slug}`
      : `${basePath}/${pathSegment}`;
  }

  private calculatePagePriority(pageType: string): number {
    const priorities = {
      home: 1.0,
      product: 0.8,
      service: 0.8,
      collection: 0.7,
      article: 0.6,
      report: 0.7,
      'origin-story': 0.6,
      about: 0.5,
      contact: 0.5,
    };
    
    return priorities[pageType as keyof typeof priorities] || 0.5;
  }

  private getChangeFrequency(pageType: string): string {
    const frequencies = {
      home: 'weekly',
      product: 'monthly',
      service: 'monthly',
      collection: 'weekly',
      article: 'never',
      report: 'monthly',
      'origin-story': 'yearly',
      about: 'yearly',
      contact: 'yearly',
    };
    
    return frequencies[pageType as keyof typeof frequencies] || 'monthly';
  }

  private async addPageSpecificSchemas(
    pageData: SEOPageData,
    schemas: Record<string, any>[]
  ): Promise<void> {
    // This method can be extended to add more specific schemas based on page content
    // For now, it's a placeholder for future enhancements
  }

  private generatePreloadResources(
    pageData: SEOPageData,
    options: SEOOptimizationOptions
  ): Array<{ href: string; as: string; type?: string; crossOrigin?: string }> {
    const resources: Array<{ href: string; as: string; type?: string; crossOrigin?: string }> = [];

    // Add custom preload resources
    if (options.preloadResources) {
      resources.push(...options.preloadResources);
    }

    // Add critical image preloading
    if (options.enableImageOptimization !== false && pageData.images?.[0]) {
      const primaryImage = pageData.images[0];
      if (primaryImage.url) {
        resources.push({
          href: primaryImage.url.startsWith('http') ? primaryImage.url : `${this.baseUrl}${primaryImage.url}`,
          as: 'image',
        });
      }
    }

    // Add font preloading
    if (options.enableCriticalResourcePreload !== false) {
      resources.push(
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          as: 'style',
        },
        {
          href: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        }
      );
    }

    return resources;
  }

  private countMetaTags(metadata?: Metadata): number {
    if (!metadata) return 0;
    
    let count = 0;
    if (metadata.title) count++;
    if (metadata.description) count++;
    if (metadata.keywords) count++;
    if (metadata.openGraph) count += Object.keys(metadata.openGraph).length;
    if (metadata.twitter) count += Object.keys(metadata.twitter).length;
    
    return count;
  }
}

// Export singleton instance
export const enhancedSEOService = new EnhancedSEOService();