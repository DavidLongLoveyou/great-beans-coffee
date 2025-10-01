import { Locale } from '@/shared/config/i18n';

export interface SEOMetrics {
  pageTitle: string;
  metaDescription: string;
  h1Count: number;
  h2Count: number;
  imageCount: number;
  imagesWithAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  readingTime: number;
  hasStructuredData: boolean;
  hasHreflang: boolean;
  hasCanonical: boolean;
  pageSizeKB: number;
  loadTimeMs: number;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'meta' | 'content' | 'technical' | 'accessibility' | 'performance';
  message: string;
  element?: string;
  recommendation: string;
}

export class SEOAnalyzer {
  private document: Document;
  private locale: Locale;

  constructor(document: Document, locale: Locale) {
    this.document = document;
    this.locale = locale;
  }

  public analyze(): { metrics: SEOMetrics; issues: SEOIssue[] } {
    const metrics = this.collectMetrics();
    const issues = this.identifyIssues(metrics);

    return { metrics, issues };
  }

  private collectMetrics(): SEOMetrics {
    const title = this.document.querySelector('title')?.textContent || '';
    const metaDescription =
      this.document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || '';

    const h1Elements = this.document.querySelectorAll('h1');
    const h2Elements = this.document.querySelectorAll('h2');
    const images = this.document.querySelectorAll('img');
    const imagesWithAlt = this.document.querySelectorAll('img[alt]');

    const allLinks = this.document.querySelectorAll('a[href]');
    const internalLinks = Array.from(allLinks).filter(link => {
      const href = link.getAttribute('href') || '';
      return href.startsWith('/') || href.includes(window.location.hostname);
    });
    const externalLinks = Array.from(allLinks).filter(link => {
      const href = link.getAttribute('href') || '';
      return (
        href.startsWith('http') && !href.includes(window.location.hostname)
      );
    });

    const textContent = this.document.body?.textContent || '';
    const wordCount = textContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    const hasStructuredData = !!this.document.querySelector(
      'script[type="application/ld+json"]'
    );
    const hasHreflang = !!this.document.querySelector('link[hreflang]');
    const hasCanonical = !!this.document.querySelector('link[rel="canonical"]');

    return {
      pageTitle: title,
      metaDescription,
      h1Count: h1Elements.length,
      h2Count: h2Elements.length,
      imageCount: images.length,
      imagesWithAlt: imagesWithAlt.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      wordCount,
      readingTime,
      hasStructuredData,
      hasHreflang,
      hasCanonical,
      pageSizeKB: 0, // Would need to be calculated server-side
      loadTimeMs: 0, // Would need to be measured with Performance API
    };
  }

  private identifyIssues(metrics: SEOMetrics): SEOIssue[] {
    const issues: SEOIssue[] = [];

    // Title issues
    if (!metrics.pageTitle) {
      issues.push({
        type: 'error',
        category: 'meta',
        message: 'Missing page title',
        element: '<title>',
        recommendation: 'Add a descriptive title tag (50-60 characters)',
      });
    } else if (metrics.pageTitle.length < 30) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: 'Title too short',
        element: '<title>',
        recommendation: 'Expand title to 50-60 characters for better SEO',
      });
    } else if (metrics.pageTitle.length > 60) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: 'Title too long',
        element: '<title>',
        recommendation:
          'Shorten title to under 60 characters to prevent truncation',
      });
    }

    // Meta description issues
    if (!metrics.metaDescription) {
      issues.push({
        type: 'error',
        category: 'meta',
        message: 'Missing meta description',
        element: '<meta name="description">',
        recommendation:
          'Add a compelling meta description (150-160 characters)',
      });
    } else if (metrics.metaDescription.length < 120) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: 'Meta description too short',
        element: '<meta name="description">',
        recommendation: 'Expand meta description to 150-160 characters',
      });
    } else if (metrics.metaDescription.length > 160) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: 'Meta description too long',
        element: '<meta name="description">',
        recommendation: 'Shorten meta description to under 160 characters',
      });
    }

    // Heading structure issues
    if (metrics.h1Count === 0) {
      issues.push({
        type: 'error',
        category: 'content',
        message: 'Missing H1 heading',
        element: '<h1>',
        recommendation:
          'Add exactly one H1 heading that describes the page content',
      });
    } else if (metrics.h1Count > 1) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Multiple H1 headings',
        element: '<h1>',
        recommendation: 'Use only one H1 heading per page for better SEO',
      });
    }

    if (metrics.h2Count === 0) {
      issues.push({
        type: 'info',
        category: 'content',
        message: 'No H2 headings found',
        element: '<h2>',
        recommendation:
          'Consider adding H2 headings to improve content structure',
      });
    }

    // Image accessibility issues
    if (metrics.imageCount > 0) {
      const imagesWithoutAlt = metrics.imageCount - metrics.imagesWithAlt;
      if (imagesWithoutAlt > 0) {
        issues.push({
          type: 'warning',
          category: 'accessibility',
          message: `${imagesWithoutAlt} images missing alt text`,
          element: '<img>',
          recommendation:
            'Add descriptive alt text to all images for accessibility and SEO',
        });
      }
    }

    // Content length issues
    if (metrics.wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Content too short',
        element: 'body',
        recommendation:
          'Add more content (aim for 300+ words) for better SEO value',
      });
    }

    // Technical SEO issues
    if (!metrics.hasStructuredData) {
      issues.push({
        type: 'info',
        category: 'technical',
        message: 'No structured data found',
        element: '<script type="application/ld+json">',
        recommendation:
          'Add structured data markup to help search engines understand your content',
      });
    }

    if (!metrics.hasHreflang) {
      issues.push({
        type: 'warning',
        category: 'technical',
        message: 'Missing hreflang tags',
        element: '<link hreflang>',
        recommendation: 'Add hreflang tags for international SEO',
      });
    }

    if (!metrics.hasCanonical) {
      issues.push({
        type: 'warning',
        category: 'technical',
        message: 'Missing canonical URL',
        element: '<link rel="canonical">',
        recommendation: 'Add canonical URL to prevent duplicate content issues',
      });
    }

    return issues;
  }
}

export function generateSEOReport(
  metrics: SEOMetrics,
  issues: SEOIssue[]
): string {
  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;
  const infoCount = issues.filter(issue => issue.type === 'info').length;

  let score = 100;
  score -= errorCount * 20;
  score -= warningCount * 10;
  score -= infoCount * 5;
  score = Math.max(0, score);

  const report = `
SEO Analysis Report
==================

Overall Score: ${score}/100

Summary:
- ${errorCount} errors
- ${warningCount} warnings  
- ${infoCount} recommendations

Page Metrics:
- Title: "${metrics.pageTitle}" (${metrics.pageTitle.length} chars)
- Meta Description: "${metrics.metaDescription}" (${metrics.metaDescription.length} chars)
- Word Count: ${metrics.wordCount}
- Reading Time: ${metrics.readingTime} minutes
- Images: ${metrics.imageCount} (${metrics.imagesWithAlt} with alt text)
- Internal Links: ${metrics.internalLinks}
- External Links: ${metrics.externalLinks}

Technical Features:
- Structured Data: ${metrics.hasStructuredData ? '✓' : '✗'}
- Hreflang Tags: ${metrics.hasHreflang ? '✓' : '✗'}
- Canonical URL: ${metrics.hasCanonical ? '✓' : '✗'}

Issues Found:
${issues
  .map(
    issue => `
${issue.type.toUpperCase()}: ${issue.message}
Element: ${issue.element}
Recommendation: ${issue.recommendation}
`
  )
  .join('\n')}
`;

  return report;
}

// Google Analytics 4 tracking utilities
export function trackSEOEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'SEO',
      ...parameters,
    });
  }
}

export function trackPageView(
  locale: Locale,
  pageType: string,
  contentId?: string
) {
  trackSEOEvent('page_view', {
    locale,
    page_type: pageType,
    content_id: contentId,
  });
}

export function trackSearchQuery(
  query: string,
  results: number,
  locale: Locale
) {
  trackSEOEvent('search', {
    search_term: query,
    results_count: results,
    locale,
  });
}

export function trackContentEngagement(
  contentType: string,
  contentId: string,
  action: string
) {
  trackSEOEvent('content_engagement', {
    content_type: contentType,
    content_id: contentId,
    action,
  });
}

// Core Web Vitals monitoring
export function measureCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  new PerformanceObserver(entryList => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];

    trackSEOEvent('core_web_vitals', {
      metric: 'LCP',
      value: lastEntry.startTime,
      rating:
        lastEntry.startTime < 2500
          ? 'good'
          : lastEntry.startTime < 4000
            ? 'needs_improvement'
            : 'poor',
    });
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  new PerformanceObserver(entryList => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      trackSEOEvent('core_web_vitals', {
        metric: 'FID',
        value: entry.processingStart - entry.startTime,
        rating:
          entry.processingStart - entry.startTime < 100
            ? 'good'
            : entry.processingStart - entry.startTime < 300
              ? 'needs_improvement'
              : 'poor',
      });
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver(entryList => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });

    trackSEOEvent('core_web_vitals', {
      metric: 'CLS',
      value: clsValue,
      rating:
        clsValue < 0.1
          ? 'good'
          : clsValue < 0.25
            ? 'needs_improvement'
            : 'poor',
    });
  }).observe({ entryTypes: ['layout-shift'] });
}

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, string | number | boolean>
    ) => void;
  }
}
