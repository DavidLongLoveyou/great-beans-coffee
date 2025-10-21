# SEO Tools & Utilities Documentation

## Overview

The Great Beans Coffee Export Platform implements a comprehensive Technical SEO framework designed specifically for B2B coffee export businesses. This documentation covers all SEO tools, utilities, and optimization strategies implemented to maximize search visibility and performance.

## Table of Contents

1. [SEO Architecture Overview](#seo-architecture-overview)
2. [Core SEO Services](#core-seo-services)
3. [Schema.org Structured Data](#schemaorg-structured-data)
4. [Performance Optimization](#performance-optimization)
5. [Image Optimization](#image-optimization)
6. [Sitemap Generation](#sitemap-generation)
7. [Robots.txt Configuration](#robotstxt-configuration)
8. [International SEO](#international-seo)
9. [Core Web Vitals](#core-web-vitals)
10. [SEO Components](#seo-components)
11. [SEO Testing & Monitoring](#seo-testing--monitoring)
12. [Best Practices](#best-practices)
13. [Troubleshooting](#troubleshooting)

## SEO Architecture Overview

### Core Components

The SEO system is built on a layered architecture:

- **Application Layer**: `enhanced-seo.service.ts` - Main SEO orchestration
- **Shared Utilities**: Core SEO utilities and configurations
- **Infrastructure**: External service integrations (Cloudinary, Analytics)
- **Presentation**: SEO components and layouts

### Key Features

- ✅ **Dynamic Metadata Generation** - Page-specific meta tags
- ✅ **Schema.org Markup** - Industry-specific structured data
- ✅ **Performance Optimization** - Core Web Vitals optimization
- ✅ **Image Optimization** - Cloudinary integration with WebP/AVIF
- ✅ **International SEO** - Multi-language support with hreflang
- ✅ **Automated Sitemaps** - Dynamic sitemap generation
- ✅ **SEO Monitoring** - Real-time SEO analysis and reporting

## Core SEO Services

### Enhanced SEO Service

**Location**: `src/application/services/enhanced-seo.service.ts`

The main SEO orchestration service providing:

#### Key Methods

```typescript
// Generate complete page SEO
generatePageSEO(pageData: SEOPageData, options?: SEOOptimizationOptions)

// Generate product-specific SEO
generateProductSEO(productData: CoffeeProductData, locale: Locale)

// Generate service page SEO
generateServiceSEO(serviceData: B2BServiceData, locale: Locale)

// Generate article SEO
generateArticleSEO(articleData: ArticleData, locale: Locale)

// Analyze SEO performance
analyzeSEOPerformance(pageData: SEOPageData, currentMetadata?: Metadata)
```

#### SEO Page Data Interface

```typescript
interface SEOPageData {
  pageType:
    | 'home'
    | 'product'
    | 'service'
    | 'article'
    | 'collection'
    | 'about'
    | 'contact'
    | 'report'
    | 'origin-story';
  slug?: string;
  locale: Locale;
  title: string;
  description: string;
  keywords: string[];
  images?: Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  }>;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
  tags?: string[];
  price?: {
    amount: string;
    currency: string;
    unit?: string;
  };
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}
```

### SEO Utilities

**Location**: `src/shared/utils/seo-utils.ts`

Core utility functions for metadata generation:

#### Configuration

```typescript
export const seoConfig = {
  siteName: 'The Great Beans',
  siteUrl: 'https://thegreatbeans.com',
  defaultTitle: 'The Great Beans - Premium Coffee Export Solutions',
  defaultDescription:
    'Leading B2B coffee export platform connecting global buyers with premium coffee producers.',
  defaultKeywords: [
    'coffee export',
    'B2B coffee',
    'premium coffee',
    'coffee sourcing',
  ],
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@thegreatbeans',
  facebookAppId: 'your-facebook-app-id',
};
```

#### Metadata Generation

```typescript
generateMetadata({
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'service'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  locale?: Locale
  alternateLocales?: readonly Locale[]
  noIndex?: boolean
  canonical?: string
}): Metadata
```

## Schema.org Structured Data

### Schema Generators

**Location**: `src/shared/utils/schema-generators.ts`

Industry-specific schema markup for coffee export business:

#### Coffee Product Schema

```typescript
interface CoffeeProductData {
  id: string;
  name: string;
  description: string;
  variety: string;
  origin: string;
  processingMethod: string;
  roastLevel?: string;
  flavorProfile: string[];
  certifications: string[];
  price?: {
    amount: string;
    currency: string;
    unit: string;
  };
  availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Seasonal';
  minimumOrderQuantity?: string;
  harvestSeason?: string;
  altitude?: string;
  specifications?: {
    moisture?: string;
    screenSize?: string;
    density?: string;
    defects?: string;
  };
}
```

#### B2B Service Schema

```typescript
interface B2BServiceData {
  id: string;
  name: string;
  description: string;
  serviceType:
    | 'export'
    | 'manufacturing'
    | 'consulting'
    | 'logistics'
    | 'quality-control';
  targetMarkets: string[];
  features: string[];
  certifications: string[];
  areaServed: string[];
  deliveryTime?: string;
}
```

#### Available Schema Types

1. **Organization Schema** - Company information and contact details
2. **Product Schema** - Coffee products with B2B specifications
3. **Service Schema** - Export and consulting services
4. **Article Schema** - Blog posts and educational content
5. **FAQ Schema** - AI and voice search optimization
6. **Breadcrumb Schema** - Navigation structure
7. **Collection Schema** - Product and content listings
8. **Market Report Schema** - Industry insights and reports
9. **Origin Story Schema** - Coffee farm and producer stories

### Advanced SEO Manager

**Location**: `src/shared/utils/advanced-seo-manager.ts`

Enhanced SEO capabilities including:

#### Features

- **Enhanced Meta Tags** - Comprehensive metadata optimization
- **Structured Data Management** - Schema.org markup validation
- **International SEO** - Multi-language support
- **Core Web Vitals** - Performance optimization
- **AI Optimization** - Voice search and AI assistant optimization

#### Key Methods

```typescript
// Generate organization schema
generateOrganizationSchema(): SchemaOrgData

// Generate website schema
generateWebsiteSchema(locale: Locale): SchemaOrgData

// Generate breadcrumb schema
generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): SchemaOrgData

// Generate FAQ schema for AI optimization
generateFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaOrgData

// Validate structured data
validateStructuredData(schema: SchemaOrgData): boolean
```

## Performance Optimization

### Core Web Vitals Optimizer

**Location**: `src/shared/utils/core-web-vitals.ts`

Comprehensive performance monitoring and optimization:

#### Key Metrics Tracked

1. **Largest Contentful Paint (LCP)** - Loading performance
2. **First Input Delay (FID)** - Interactivity
3. **Cumulative Layout Shift (CLS)** - Visual stability
4. **Interaction to Next Paint (INP)** - Responsiveness

#### Features

```typescript
class CoreWebVitalsOptimizer {
  // Initialize performance monitoring
  initializeWebVitals(): void;

  // Optimize images for Core Web Vitals
  optimizeImagesForWebVitals(
    images: Array<{
      publicId: string;
      priority: 'high' | 'low';
      sizes?: string;
    }>
  ): void;

  // Preload critical resources
  preloadCriticalResources(
    resources: Array<{
      href: string;
      as: string;
      type?: string;
    }>
  ): void;

  // Get performance score
  getPerformanceScore(): {
    overall: number;
    lcp: number;
    fid: number;
    cls: number;
    inp: number;
  };
}
```

#### Performance Thresholds

- **LCP**: < 2.5s (Good), < 4.0s (Needs Improvement), ≥ 4.0s (Poor)
- **FID**: < 100ms (Good), < 300ms (Needs Improvement), ≥ 300ms (Poor)
- **CLS**: < 0.1 (Good), < 0.25 (Needs Improvement), ≥ 0.25 (Poor)
- **INP**: < 200ms (Good), < 500ms (Needs Improvement), ≥ 500ms (Poor)

### Performance Initializer

**Location**: `src/shared/components/performance/PerformanceInitializer.tsx`

Client-side performance optimization:

#### Features

- **Resource Hints** - DNS prefetch and preconnect
- **Critical Resource Preloading** - Fonts, images, scripts
- **Viewport Optimization** - Mobile-first configuration
- **Scroll Behavior** - Smooth scrolling optimization
- **Intersection Observer** - Lazy loading optimization

## Image Optimization

### Cloudinary Service

**Location**: `src/infrastructure/external-services/cloudinary.service.ts`

Advanced image optimization with Cloudinary:

#### Features

```typescript
class CloudinaryService {
  // Generate optimized image URL
  getOptimizedImageUrl(
    publicId: string,
    options: OptimizedImageOptions
  ): string;

  // Generate hero image URL with LCP optimization
  getHeroImageUrl(publicId: string): string;

  // Generate blur placeholder
  getBlurPlaceholder(publicId: string): string;

  // Generate responsive image URLs
  getResponsiveImageUrls(
    publicId: string,
    breakpoints: number[],
    options: OptimizedImageOptions
  ): Array<{ url: string; width: number }>;
}
```

#### Default Optimizations

- **Quality**: Auto (intelligent compression)
- **Format**: Auto (WebP/AVIF when supported)
- **DPR**: Auto (device pixel ratio optimization)
- **Progressive**: Enabled for better perceived performance
- **Fetch Format**: Auto (best format selection)

### Enhanced Optimized Image Component

**Location**: `src/shared/components/performance/EnhancedOptimizedImage.tsx`

React component with advanced optimization:

#### Features

- **Cloudinary Integration** - Automatic optimization
- **Core Web Vitals Tracking** - Performance monitoring
- **Intelligent Lazy Loading** - Intersection observer
- **Blur Placeholder** - Better perceived performance
- **Error Handling** - Fallback states
- **LCP Optimization** - Above-the-fold image optimization
- **Responsive Sizing** - Multiple breakpoints

#### Usage

```tsx
<EnhancedOptimizedImage
  publicId="coffee-beans-hero"
  alt="Premium coffee beans"
  size="hero"
  optimizeForLCP={true}
  trackPerformance={true}
  showBlurPlaceholder={true}
  responsiveBreakpoints={[640, 768, 1024, 1280]}
/>
```

## Sitemap Generation

### Sitemap Generator

**Location**: `src/shared/utils/sitemap-generator.ts`

Comprehensive sitemap generation for all content types:

#### Features

```typescript
class SitemapGenerator {
  // Generate complete sitemap
  async generateSitemap(options?: SitemapOptions): Promise<SitemapEntry[]>;

  // Generate XML sitemap
  generateXMLSitemap(entries: SitemapEntry[]): string;

  // Generate robots.txt
  generateRobotsTxt(): string;

  // Get static pages
  private getStaticPages(): SitemapEntry[];

  // Get blog post entries
  async getBlogPostEntries(): Promise<SitemapEntry[]>;

  // Get service pages
  getServicePages(): SitemapEntry[];

  // Get product pages
  async getProductPages(): Promise<SitemapEntry[]>;
}
```

#### Sitemap Types

1. **Main Sitemap** (`/sitemap.xml`) - Core pages and static content
2. **Blog Sitemap** (`/sitemap-blog.xml`) - Blog posts and articles
3. **Services Sitemap** (`/sitemap-services.xml`) - Service pages
4. **Sitemap Index** (`/sitemap-index.xml`) - References all sitemaps

#### Sitemap Entry Interface

```typescript
interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  alternateLanguages?: Array<{
    href: string;
    hreflang: string;
  }>;
}
```

### Sitemap Submission Service

**Location**: `src/shared/utils/sitemap-submission.ts`

Automated sitemap submission to search engines:

#### Features

```typescript
class SitemapSubmissionService {
  // Submit to Google Search Console
  async submitToGoogle(sitemapUrl: string): Promise<SitemapSubmissionResult>;

  // Submit to Bing Webmaster Tools
  async submitToBing(sitemapUrl: string): Promise<SitemapSubmissionResult>;

  // Submit all sitemaps
  async submitAllSitemaps(): Promise<SitemapSubmissionResult[]>;

  // Check sitemap health
  async checkSitemapHealth(sitemapUrl: string): Promise<SitemapHealthCheck>;

  // Generate submission report
  generateSubmissionReport(results: SitemapSubmissionResult[]): string;
}
```

## Robots.txt Configuration

### Configuration

**Location**: `public/robots.txt` and `next-sitemap.config.js`

#### Current Configuration

```
User-agent: *
Allow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /test/

# Sitemaps
Sitemap: https://thegreatbeans.com/sitemap.xml
Sitemap: https://thegreatbeans.com/sitemap-blog.xml
Sitemap: https://thegreatbeans.com/sitemap-index.xml
```

#### Dynamic Robots.txt Generation

```typescript
// In sitemap-generator.ts
generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml
Sitemap: ${this.baseUrl}/sitemap-blog.xml
Sitemap: ${this.baseUrl}/sitemap-services.xml`
}
```

## International SEO

### Multi-Language Support

The platform supports 9 languages with proper hreflang implementation:

#### Supported Locales

- **English** (en) - Primary
- **German** (de)
- **Japanese** (ja)
- **French** (fr)
- **Italian** (it)
- **Spanish** (es)
- **Dutch** (nl)
- **Korean** (ko)
- **Vietnamese** (vi)

#### Hreflang Implementation

```typescript
// Automatic hreflang generation
alternateLanguages: locales.map(locale => ({
  href: `${siteUrl}/${locale}${path}`,
  hreflang: locale,
}));
```

#### URL Structure

- **Primary**: `/en/products/arabica`
- **German**: `/de/products/arabica`
- **Japanese**: `/ja/products/arabica`

## Core Web Vitals

### Monitoring and Optimization

#### Real User Monitoring (RUM)

```typescript
// Initialize Core Web Vitals tracking
coreWebVitalsOptimizer.initializeWebVitals();

// Track specific metrics
coreWebVitalsOptimizer.trackLCP(element);
coreWebVitalsOptimizer.trackFID(event);
coreWebVitalsOptimizer.trackCLS(entries);
```

#### Optimization Strategies

1. **LCP Optimization**
   - Hero image preloading
   - Critical CSS inlining
   - Font optimization
   - Server-side rendering

2. **FID Optimization**
   - JavaScript code splitting
   - Third-party script optimization
   - Event handler optimization
   - Web Workers for heavy tasks

3. **CLS Optimization**
   - Image dimension specification
   - Font loading optimization
   - Dynamic content handling
   - Layout shift prevention

## SEO Components

### Enhanced SEO Head

**Location**: `src/shared/components/seo/EnhancedSEOHead.tsx`

Comprehensive SEO head component:

#### Features

- **Advanced Meta Tags** - Complete metadata
- **Schema.org Markup** - All content types
- **Resource Preloading** - Critical resources
- **Analytics Integration** - Performance tracking

#### Usage

```tsx
<EnhancedSEOHead
  metadata={metadata}
  productData={productData}
  breadcrumbs={breadcrumbs}
  faqs={faqs}
  preloadResources={[
    { href: '/critical.css', as: 'style' },
    { href: '/hero-image.webp', as: 'image' },
  ]}
  enableAnalytics={true}
  enableCoreWebVitalsTracking={true}
/>
```

### SEO Meta Component

**Location**: `src/components/seo/SeoMeta.tsx`

Simplified SEO component for basic pages:

#### Features

- **Basic Meta Tags** - Title, description, keywords
- **Open Graph** - Social media optimization
- **Twitter Cards** - Twitter-specific metadata
- **Schema.org** - Organization and product schemas

## SEO Testing & Monitoring

### SEO Testing Utilities

**Location**: `src/shared/utils/seo-testing.ts`

Automated SEO testing framework:

#### Test Categories

1. **Metadata Completeness** - Required meta tags
2. **Schema Markup Validation** - Structured data testing
3. **Performance Metrics** - Core Web Vitals
4. **Sitemap Inclusion** - URL discoverability
5. **International SEO** - Hreflang validation
6. **Robots.txt Compliance** - Crawling directives

#### Usage

```typescript
const seoTester = new SEOTestingService();

// Test specific page
const results = await seoTester.testPage('/products/arabica', 'en');

// Test all pages
const allResults = await seoTester.testAllPages();
```

### SEO Audit Utilities

**Location**: `src/shared/utils/seo-audit.ts`

Comprehensive SEO auditing:

#### Audit Categories

1. **Technical SEO** - Meta tags, structured data, performance
2. **Content Quality** - Keyword optimization, readability
3. **User Experience** - Mobile-friendliness, accessibility
4. **International SEO** - Multi-language implementation

## Best Practices

### Content Optimization

1. **Title Tags**
   - Keep under 60 characters
   - Include primary keyword
   - Make unique and descriptive
   - Include brand name

2. **Meta Descriptions**
   - Keep under 160 characters
   - Include call-to-action
   - Summarize page content
   - Include relevant keywords

3. **Header Structure**
   - Use H1 for main title
   - Logical hierarchy (H1 → H2 → H3)
   - Include keywords naturally
   - One H1 per page

### Technical SEO

1. **URL Structure**
   - Use descriptive URLs
   - Include keywords
   - Use hyphens for word separation
   - Keep URLs short and clean

2. **Image Optimization**
   - Use descriptive alt text
   - Optimize file sizes
   - Use modern formats (WebP/AVIF)
   - Implement lazy loading

3. **Schema Markup**
   - Use relevant schema types
   - Include all required properties
   - Validate markup regularly
   - Update with content changes

### Performance Optimization

1. **Core Web Vitals**
   - Monitor LCP, FID, CLS, INP
   - Optimize critical rendering path
   - Minimize layout shifts
   - Reduce JavaScript execution time

2. **Resource Loading**
   - Preload critical resources
   - Use resource hints
   - Optimize font loading
   - Minimize render-blocking resources

## Troubleshooting

### Common Issues

#### 1. Schema Markup Errors

**Problem**: Invalid structured data
**Solution**:

- Use Google's Rich Results Test
- Validate with Schema.org validator
- Check required properties
- Update schema generators

#### 2. Core Web Vitals Issues

**Problem**: Poor performance scores
**Solution**:

- Optimize images with Cloudinary
- Preload critical resources
- Minimize JavaScript execution
- Use performance monitoring

#### 3. Sitemap Not Updating

**Problem**: Sitemap shows old content
**Solution**:

- Check sitemap generation logic
- Verify content management system
- Clear CDN cache
- Resubmit to search engines

#### 4. International SEO Issues

**Problem**: Incorrect hreflang implementation
**Solution**:

- Verify locale configuration
- Check URL structure
- Validate hreflang tags
- Test with Google Search Console

### Debugging Tools

1. **Google Search Console** - Performance monitoring
2. **Google Rich Results Test** - Schema validation
3. **PageSpeed Insights** - Core Web Vitals analysis
4. **Lighthouse** - Comprehensive auditing
5. **Schema.org Validator** - Structured data testing

### Performance Monitoring

```typescript
// Monitor SEO performance
const seoAnalyzer = new SEOAnalyzer();
const analysis = await seoAnalyzer.analyzePage(url);

console.log('SEO Score:', analysis.score);
console.log('Issues:', analysis.issues);
console.log('Recommendations:', analysis.recommendations);
```

## API Reference

### SEO Service Endpoints

- `POST /api/seo/analyze` - Analyze page SEO
- `GET /api/sitemap/submit` - Check sitemap health
- `POST /api/sitemap/submit` - Submit sitemaps to search engines
- `GET /api/seo/audit` - Get SEO audit report

### Configuration Files

- `next-sitemap.config.js` - Sitemap configuration
- `src/shared/config/seo.ts` - SEO settings
- `src/shared/utils/seo-utils.ts` - Core utilities
- `public/robots.txt` - Robots directives

---

This documentation provides a comprehensive guide to all SEO tools and utilities implemented in The Great Beans Coffee Export Platform. For specific implementation details, refer to the individual component files and their inline documentation.
