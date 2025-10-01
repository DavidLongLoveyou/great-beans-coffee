import { type Metadata } from 'next';
import { seoConfig } from './seo-utils';

// SEO audit result interfaces
export interface SEOAuditResult {
  score: number; // 0-100
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  metadata: SEOMetadataAudit;
  structuredData: StructuredDataAudit;
  performance: PerformanceAudit;
  accessibility: AccessibilityAudit;
  internationalSEO: InternationalSEOAudit;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'metadata' | 'structured-data' | 'performance' | 'accessibility' | 'international' | 'content';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  element?: string;
  recommendation: string;
}

export interface SEORecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
  implementation: string;
}

export interface SEOMetadataAudit {
  title: {
    present: boolean;
    length: number;
    optimal: boolean;
    issues: string[];
  };
  description: {
    present: boolean;
    length: number;
    optimal: boolean;
    issues: string[];
  };
  keywords: {
    present: boolean;
    count: number;
    issues: string[];
  };
  openGraph: {
    present: boolean;
    complete: boolean;
    issues: string[];
  };
  twitterCard: {
    present: boolean;
    complete: boolean;
    issues: string[];
  };
  canonical: {
    present: boolean;
    valid: boolean;
    issues: string[];
  };
  robots: {
    present: boolean;
    valid: boolean;
    issues: string[];
  };
}

export interface StructuredDataAudit {
  present: boolean;
  valid: boolean;
  schemas: string[];
  issues: string[];
  coverage: number; // 0-100
}

export interface PerformanceAudit {
  coreWebVitals: {
    lcp: { value: number; rating: string };
    fid: { value: number; rating: string };
    cls: { value: number; rating: string };
  };
  imageOptimization: {
    optimized: number;
    total: number;
    issues: string[];
  };
  resourceOptimization: {
    minified: boolean;
    compressed: boolean;
    cached: boolean;
    issues: string[];
  };
}

export interface AccessibilityAudit {
  altText: {
    present: number;
    missing: number;
    issues: string[];
  };
  headingStructure: {
    valid: boolean;
    issues: string[];
  };
  colorContrast: {
    valid: boolean;
    issues: string[];
  };
  keyboardNavigation: {
    valid: boolean;
    issues: string[];
  };
}

export interface InternationalSEOAudit {
  hreflang: {
    present: boolean;
    valid: boolean;
    coverage: string[];
    issues: string[];
  };
  languageDeclaration: {
    present: boolean;
    valid: boolean;
    issues: string[];
  };
  contentLocalization: {
    complete: boolean;
    issues: string[];
  };
}

// SEO audit configuration
export interface SEOAuditConfig {
  checkMetadata: boolean;
  checkStructuredData: boolean;
  checkPerformance: boolean;
  checkAccessibility: boolean;
  checkInternationalSEO: boolean;
  checkContent: boolean;
  targetLanguages: string[];
  performanceThresholds: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

const defaultAuditConfig: SEOAuditConfig = {
  checkMetadata: true,
  checkStructuredData: true,
  checkPerformance: true,
  checkAccessibility: true,
  checkInternationalSEO: true,
  checkContent: true,
  targetLanguages: ['en', 'vi', 'de', 'ja', 'fr'],
  performanceThresholds: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
  },
};

/**
 * SEO Audit Manager
 * 
 * Provides comprehensive SEO auditing capabilities including:
 * - Metadata analysis and optimization recommendations
 * - Structured data validation
 * - Performance and Core Web Vitals assessment
 * - Accessibility compliance checking
 * - International SEO validation
 * - Content optimization analysis
 */
export class SEOAuditManager {
  private config: SEOAuditConfig;

  constructor(config: Partial<SEOAuditConfig> = {}) {
    this.config = { ...defaultAuditConfig, ...config };
  }

  /**
   * Perform comprehensive SEO audit
   */
  async auditPage(
    url: string,
    metadata?: Metadata,
    content?: string,
    structuredData?: any[]
  ): Promise<SEOAuditResult> {
    const issues: SEOIssue[] = [];
    const recommendations: SEORecommendation[] = [];

    // Audit metadata
    const metadataAudit = this.config.checkMetadata 
      ? this.auditMetadata(metadata, issues, recommendations)
      : this.getEmptyMetadataAudit();

    // Audit structured data
    const structuredDataAudit = this.config.checkStructuredData
      ? this.auditStructuredData(structuredData, issues, recommendations)
      : this.getEmptyStructuredDataAudit();

    // Audit performance (client-side only)
    const performanceAudit = this.config.checkPerformance
      ? await this.auditPerformance(url, issues, recommendations)
      : this.getEmptyPerformanceAudit();

    // Audit accessibility
    const accessibilityAudit = this.config.checkAccessibility
      ? this.auditAccessibility(content, issues, recommendations)
      : this.getEmptyAccessibilityAudit();

    // Audit international SEO
    const internationalSEOAudit = this.config.checkInternationalSEO
      ? this.auditInternationalSEO(metadata, issues, recommendations)
      : this.getEmptyInternationalSEOAudit();

    // Calculate overall score
    const score = this.calculateSEOScore(
      metadataAudit,
      structuredDataAudit,
      performanceAudit,
      accessibilityAudit,
      internationalSEOAudit,
      issues
    );

    return {
      score,
      issues,
      recommendations,
      metadata: metadataAudit,
      structuredData: structuredDataAudit,
      performance: performanceAudit,
      accessibility: accessibilityAudit,
      internationalSEO: internationalSEOAudit,
    };
  }

  /**
   * Audit metadata
   */
  private auditMetadata(
    metadata: Metadata | undefined,
    issues: SEOIssue[],
    recommendations: SEORecommendation[]
  ): SEOMetadataAudit {
    const audit: SEOMetadataAudit = {
      title: { present: false, length: 0, optimal: false, issues: [] },
      description: { present: false, length: 0, optimal: false, issues: [] },
      keywords: { present: false, count: 0, issues: [] },
      openGraph: { present: false, complete: false, issues: [] },
      twitterCard: { present: false, complete: false, issues: [] },
      canonical: { present: false, valid: false, issues: [] },
      robots: { present: false, valid: false, issues: [] },
    };

    if (!metadata) {
      issues.push({
        type: 'error',
        category: 'metadata',
        title: 'Missing Metadata',
        description: 'No metadata found for this page',
        impact: 'high',
        recommendation: 'Add comprehensive metadata including title, description, and Open Graph tags',
      });
      return audit;
    }

    // Audit title
    if (metadata.title) {
      audit.title.present = true;
      const titleLength = typeof metadata.title === 'string' 
        ? metadata.title.length 
        : metadata.title.absolute?.length || 0;
      audit.title.length = titleLength;
      audit.title.optimal = titleLength >= 30 && titleLength <= 60;

      if (titleLength < 30) {
        audit.title.issues.push('Title is too short (< 30 characters)');
        issues.push({
          type: 'warning',
          category: 'metadata',
          title: 'Short Title',
          description: `Title is ${titleLength} characters, recommended 30-60 characters`,
          impact: 'medium',
          recommendation: 'Expand title to include more descriptive keywords while staying under 60 characters',
        });
      } else if (titleLength > 60) {
        audit.title.issues.push('Title is too long (> 60 characters)');
        issues.push({
          type: 'warning',
          category: 'metadata',
          title: 'Long Title',
          description: `Title is ${titleLength} characters, recommended 30-60 characters`,
          impact: 'medium',
          recommendation: 'Shorten title to under 60 characters to prevent truncation in search results',
        });
      }
    } else {
      audit.title.issues.push('Title is missing');
      issues.push({
        type: 'error',
        category: 'metadata',
        title: 'Missing Title',
        description: 'Page title is required for SEO',
        impact: 'high',
        recommendation: 'Add a descriptive, keyword-rich title between 30-60 characters',
      });
    }

    // Audit description
    if (metadata.description) {
      audit.description.present = true;
      audit.description.length = metadata.description.length;
      audit.description.optimal = audit.description.length >= 120 && audit.description.length <= 160;

      if (audit.description.length < 120) {
        audit.description.issues.push('Description is too short (< 120 characters)');
        issues.push({
          type: 'warning',
          category: 'metadata',
          title: 'Short Description',
          description: `Description is ${audit.description.length} characters, recommended 120-160 characters`,
          impact: 'medium',
          recommendation: 'Expand description to provide more context while staying under 160 characters',
        });
      } else if (audit.description.length > 160) {
        audit.description.issues.push('Description is too long (> 160 characters)');
        issues.push({
          type: 'warning',
          category: 'metadata',
          title: 'Long Description',
          description: `Description is ${audit.description.length} characters, recommended 120-160 characters`,
          impact: 'medium',
          recommendation: 'Shorten description to under 160 characters to prevent truncation',
        });
      }
    } else {
      audit.description.issues.push('Description is missing');
      issues.push({
        type: 'error',
        category: 'metadata',
        title: 'Missing Description',
        description: 'Meta description is required for SEO',
        impact: 'high',
        recommendation: 'Add a compelling meta description between 120-160 characters',
      });
    }

    // Audit keywords
    if (metadata.keywords) {
      audit.keywords.present = true;
      const keywordCount = typeof metadata.keywords === 'string'
        ? metadata.keywords.split(',').length
        : Array.isArray(metadata.keywords)
        ? metadata.keywords.length
        : 0;
      audit.keywords.count = keywordCount;

      if (keywordCount > 10) {
        audit.keywords.issues.push('Too many keywords (> 10)');
        issues.push({
          type: 'warning',
          category: 'metadata',
          title: 'Keyword Stuffing',
          description: `${keywordCount} keywords found, recommended 5-10 focused keywords`,
          impact: 'medium',
          recommendation: 'Focus on 5-10 highly relevant keywords instead of keyword stuffing',
        });
      }
    }

    // Audit Open Graph
    if (metadata.openGraph) {
      audit.openGraph.present = true;
      const og = metadata.openGraph;
      const hasRequiredFields = !!(og.title && og.description && og.url && og.images);
      audit.openGraph.complete = hasRequiredFields;

      if (!hasRequiredFields) {
        audit.openGraph.issues.push('Missing required Open Graph fields');
        issues.push({
          type: 'warning',
          category: 'metadata',
          title: 'Incomplete Open Graph',
          description: 'Missing required Open Graph fields (title, description, url, images)',
          impact: 'medium',
          recommendation: 'Add complete Open Graph metadata for better social media sharing',
        });
      }
    } else {
      audit.openGraph.issues.push('Open Graph metadata is missing');
      issues.push({
        type: 'warning',
        category: 'metadata',
        title: 'Missing Open Graph',
        description: 'Open Graph metadata improves social media sharing',
        impact: 'medium',
        recommendation: 'Add Open Graph metadata for better social media presence',
      });
    }

    // Audit Twitter Card
    if (metadata.twitter) {
      audit.twitterCard.present = true;
      const twitter = metadata.twitter;
      const hasRequiredFields = !!(twitter.card && twitter.title && twitter.description);
      audit.twitterCard.complete = hasRequiredFields;

      if (!hasRequiredFields) {
        audit.twitterCard.issues.push('Missing required Twitter Card fields');
        issues.push({
          type: 'info',
          category: 'metadata',
          title: 'Incomplete Twitter Card',
          description: 'Missing required Twitter Card fields',
          impact: 'low',
          recommendation: 'Add complete Twitter Card metadata for better Twitter sharing',
        });
      }
    }

    // Audit canonical URL
    if (metadata.alternates?.canonical) {
      audit.canonical.present = true;
      audit.canonical.valid = this.isValidURL(metadata.alternates.canonical);

      if (!audit.canonical.valid) {
        audit.canonical.issues.push('Invalid canonical URL format');
        issues.push({
          type: 'error',
          category: 'metadata',
          title: 'Invalid Canonical URL',
          description: 'Canonical URL is not properly formatted',
          impact: 'high',
          recommendation: 'Fix canonical URL format to prevent duplicate content issues',
        });
      }
    } else {
      audit.canonical.issues.push('Canonical URL is missing');
      issues.push({
        type: 'warning',
        category: 'metadata',
        title: 'Missing Canonical URL',
        description: 'Canonical URL helps prevent duplicate content issues',
        impact: 'medium',
        recommendation: 'Add canonical URL to prevent duplicate content penalties',
      });
    }

    // Audit robots meta
    if (metadata.robots) {
      audit.robots.present = true;
      audit.robots.valid = true; // Basic validation, could be enhanced
    }

    return audit;
  }

  /**
   * Audit structured data
   */
  private auditStructuredData(
    structuredData: any[] | undefined,
    issues: SEOIssue[],
    recommendations: SEORecommendation[]
  ): StructuredDataAudit {
    const audit: StructuredDataAudit = {
      present: false,
      valid: false,
      schemas: [],
      issues: [],
      coverage: 0,
    };

    if (!structuredData || structuredData.length === 0) {
      audit.issues.push('No structured data found');
      issues.push({
        type: 'warning',
        category: 'structured-data',
        title: 'Missing Structured Data',
        description: 'No Schema.org structured data found on this page',
        impact: 'medium',
        recommendation: 'Add relevant Schema.org markup to improve search engine understanding',
      });
      return audit;
    }

    audit.present = true;
    audit.schemas = structuredData.map(data => data['@type']).filter(Boolean);
    audit.valid = this.validateStructuredData(structuredData);
    audit.coverage = this.calculateStructuredDataCoverage(structuredData);

    if (!audit.valid) {
      audit.issues.push('Invalid structured data format');
      issues.push({
        type: 'error',
        category: 'structured-data',
        title: 'Invalid Structured Data',
        description: 'Structured data contains validation errors',
        impact: 'high',
        recommendation: 'Fix structured data validation errors using Google\'s Structured Data Testing Tool',
      });
    }

    if (audit.coverage < 70) {
      audit.issues.push('Low structured data coverage');
      recommendations.push({
        category: 'structured-data',
        title: 'Improve Structured Data Coverage',
        description: 'Add more comprehensive structured data markup',
        priority: 'medium',
        effort: 'medium',
        impact: 'medium',
        implementation: 'Add Organization, Product, Service, and Article schemas as appropriate',
      });
    }

    return audit;
  }

  /**
   * Audit performance (placeholder for client-side implementation)
   */
  private async auditPerformance(
    url: string,
    issues: SEOIssue[],
    recommendations: SEORecommendation[]
  ): Promise<PerformanceAudit> {
    // This would be implemented client-side with actual performance measurements
    return this.getEmptyPerformanceAudit();
  }

  /**
   * Audit accessibility
   */
  private auditAccessibility(
    content: string | undefined,
    issues: SEOIssue[],
    recommendations: SEORecommendation[]
  ): AccessibilityAudit {
    const audit: AccessibilityAudit = {
      altText: { present: 0, missing: 0, issues: [] },
      headingStructure: { valid: true, issues: [] },
      colorContrast: { valid: true, issues: [] },
      keyboardNavigation: { valid: true, issues: [] },
    };

    if (!content) {
      return audit;
    }

    // Check for images without alt text
    const imgMatches = content.match(/<img[^>]*>/gi) || [];
    const imagesWithAlt = content.match(/<img[^>]*alt\s*=\s*["'][^"']*["'][^>]*>/gi) || [];
    
    audit.altText.present = imagesWithAlt.length;
    audit.altText.missing = imgMatches.length - imagesWithAlt.length;

    if (audit.altText.missing > 0) {
      audit.altText.issues.push(`${audit.altText.missing} images missing alt text`);
      issues.push({
        type: 'error',
        category: 'accessibility',
        title: 'Missing Alt Text',
        description: `${audit.altText.missing} images are missing alt text`,
        impact: 'high',
        recommendation: 'Add descriptive alt text to all images for accessibility and SEO',
      });
    }

    // Check heading structure
    const headings = content.match(/<h[1-6][^>]*>/gi) || [];
    if (headings.length === 0) {
      audit.headingStructure.valid = false;
      audit.headingStructure.issues.push('No headings found');
      issues.push({
        type: 'warning',
        category: 'accessibility',
        title: 'Missing Headings',
        description: 'No heading tags found on this page',
        impact: 'medium',
        recommendation: 'Add proper heading structure (H1, H2, H3) for better accessibility and SEO',
      });
    }

    return audit;
  }

  /**
   * Audit international SEO
   */
  private auditInternationalSEO(
    metadata: Metadata | undefined,
    issues: SEOIssue[],
    recommendations: SEORecommendation[]
  ): InternationalSEOAudit {
    const audit: InternationalSEOAudit = {
      hreflang: { present: false, valid: false, coverage: [], issues: [] },
      languageDeclaration: { present: false, valid: false, issues: [] },
      contentLocalization: { complete: false, issues: [] },
    };

    // Check hreflang
    if (metadata?.alternates?.languages) {
      audit.hreflang.present = true;
      audit.hreflang.coverage = Object.keys(metadata.alternates.languages);
      audit.hreflang.valid = this.validateHreflang(metadata.alternates.languages);

      if (!audit.hreflang.valid) {
        audit.hreflang.issues.push('Invalid hreflang format');
        issues.push({
          type: 'error',
          category: 'international',
          title: 'Invalid Hreflang',
          description: 'Hreflang attributes contain invalid language codes',
          impact: 'high',
          recommendation: 'Fix hreflang language codes to follow ISO 639-1 standard',
        });
      }

      const missingLanguages = this.config.targetLanguages.filter(
        lang => !audit.hreflang.coverage.includes(lang)
      );

      if (missingLanguages.length > 0) {
        audit.hreflang.issues.push(`Missing hreflang for: ${missingLanguages.join(', ')}`);
        recommendations.push({
          category: 'international',
          title: 'Expand Hreflang Coverage',
          description: `Add hreflang for missing target languages: ${missingLanguages.join(', ')}`,
          priority: 'medium',
          effort: 'medium',
          impact: 'medium',
          implementation: 'Add hreflang tags for all target market languages',
        });
      }
    } else if (this.config.targetLanguages.length > 1) {
      audit.hreflang.issues.push('Hreflang is missing');
      issues.push({
        type: 'warning',
        category: 'international',
        title: 'Missing Hreflang',
        description: 'Hreflang tags are missing for international targeting',
        impact: 'medium',
        recommendation: 'Add hreflang tags for all target languages and regions',
      });
    }

    return audit;
  }

  /**
   * Calculate overall SEO score
   */
  private calculateSEOScore(
    metadata: SEOMetadataAudit,
    structuredData: StructuredDataAudit,
    performance: PerformanceAudit,
    accessibility: AccessibilityAudit,
    internationalSEO: InternationalSEOAudit,
    issues: SEOIssue[]
  ): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.impact) {
        case 'high':
          score -= issue.type === 'error' ? 15 : 10;
          break;
        case 'medium':
          score -= issue.type === 'error' ? 10 : 5;
          break;
        case 'low':
          score -= issue.type === 'error' ? 5 : 2;
          break;
      }
    });

    // Bonus points for good practices
    if (metadata.title.optimal) score += 5;
    if (metadata.description.optimal) score += 5;
    if (metadata.openGraph.complete) score += 3;
    if (structuredData.present && structuredData.valid) score += 10;
    if (structuredData.coverage > 80) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  // Helper methods
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private validateStructuredData(data: any[]): boolean {
    return data.every(item => 
      item['@context'] && 
      item['@type'] && 
      typeof item === 'object'
    );
  }

  private calculateStructuredDataCoverage(data: any[]): number {
    const expectedSchemas = ['Organization', 'WebSite', 'BreadcrumbList'];
    const presentSchemas = data.map(item => item['@type']);
    const coverage = expectedSchemas.filter(schema => 
      presentSchemas.includes(schema)
    ).length;
    
    return (coverage / expectedSchemas.length) * 100;
  }

  private validateHreflang(languages: Record<string, string>): boolean {
    const validLanguageCodes = /^[a-z]{2}(-[A-Z]{2})?$/;
    return Object.keys(languages).every(lang => 
      lang === 'x-default' || validLanguageCodes.test(lang)
    );
  }

  // Empty audit objects for disabled checks
  private getEmptyMetadataAudit(): SEOMetadataAudit {
    return {
      title: { present: false, length: 0, optimal: false, issues: [] },
      description: { present: false, length: 0, optimal: false, issues: [] },
      keywords: { present: false, count: 0, issues: [] },
      openGraph: { present: false, complete: false, issues: [] },
      twitterCard: { present: false, complete: false, issues: [] },
      canonical: { present: false, valid: false, issues: [] },
      robots: { present: false, valid: false, issues: [] },
    };
  }

  private getEmptyStructuredDataAudit(): StructuredDataAudit {
    return {
      present: false,
      valid: false,
      schemas: [],
      issues: [],
      coverage: 0,
    };
  }

  private getEmptyPerformanceAudit(): PerformanceAudit {
    return {
      coreWebVitals: {
        lcp: { value: 0, rating: 'unknown' },
        fid: { value: 0, rating: 'unknown' },
        cls: { value: 0, rating: 'unknown' },
      },
      imageOptimization: {
        optimized: 0,
        total: 0,
        issues: [],
      },
      resourceOptimization: {
        minified: false,
        compressed: false,
        cached: false,
        issues: [],
      },
    };
  }

  private getEmptyAccessibilityAudit(): AccessibilityAudit {
    return {
      altText: { present: 0, missing: 0, issues: [] },
      headingStructure: { valid: true, issues: [] },
      colorContrast: { valid: true, issues: [] },
      keyboardNavigation: { valid: true, issues: [] },
    };
  }

  private getEmptyInternationalSEOAudit(): InternationalSEOAudit {
    return {
      hreflang: { present: false, valid: false, coverage: [], issues: [] },
      languageDeclaration: { present: false, valid: false, issues: [] },
      contentLocalization: { complete: false, issues: [] },
    };
  }
}

// Export default instance
export const seoAuditManager = new SEOAuditManager();

// Utility functions
export function generateSEOReport(auditResult: SEOAuditResult): string {
  const { score, issues, recommendations } = auditResult;
  
  let report = `# SEO Audit Report\n\n`;
  report += `**Overall Score: ${score}/100**\n\n`;
  
  if (issues.length > 0) {
    report += `## Issues Found (${issues.length})\n\n`;
    issues.forEach((issue, index) => {
      report += `### ${index + 1}. ${issue.title} (${issue.impact} impact)\n`;
      report += `- **Type:** ${issue.type}\n`;
      report += `- **Category:** ${issue.category}\n`;
      report += `- **Description:** ${issue.description}\n`;
      report += `- **Recommendation:** ${issue.recommendation}\n\n`;
    });
  }
  
  if (recommendations.length > 0) {
    report += `## Recommendations (${recommendations.length})\n\n`;
    recommendations.forEach((rec, index) => {
      report += `### ${index + 1}. ${rec.title}\n`;
      report += `- **Priority:** ${rec.priority}\n`;
      report += `- **Effort:** ${rec.effort}\n`;
      report += `- **Impact:** ${rec.impact}\n`;
      report += `- **Description:** ${rec.description}\n`;
      report += `- **Implementation:** ${rec.implementation}\n\n`;
    });
  }
  
  return report;
}