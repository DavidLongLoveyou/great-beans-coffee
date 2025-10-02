// SEO DTOs for application layer communication

export interface SeoMetadataDto {
  id: string;
  entityType: 'PAGE' | 'PRODUCT' | 'BLOG_POST' | 'MARKET_REPORT' | 'ORIGIN_STORY' | 'SERVICE';
  entityId: string;
  locale: string;
  
  // Basic SEO
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'business.business';
  ogUrl?: string;
  ogSiteName?: string;
  
  // Twitter Card
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  
  // Structured Data
  structuredData?: Array<{
    type: string;
    data: Record<string, any>;
  }>;
  
  // Technical SEO
  robots?: {
    index: boolean;
    follow: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
  };
  
  // Hreflang
  alternateUrls?: Array<{
    locale: string;
    url: string;
  }>;
  
  // Performance
  priority?: number; // 0.0 to 1.0 for sitemap
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  
  // Metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateSeoMetadataDto {
  entityType: SeoMetadataDto['entityType'];
  entityId: string;
  locale: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: SeoMetadataDto['ogType'];
  twitterCard?: SeoMetadataDto['twitterCard'];
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: SeoMetadataDto['structuredData'];
  robots?: SeoMetadataDto['robots'];
  alternateUrls?: SeoMetadataDto['alternateUrls'];
  priority?: number;
  changeFrequency?: SeoMetadataDto['changeFrequency'];
  createdBy: string;
}

export interface UpdateSeoMetadataDto extends Partial<CreateSeoMetadataDto> {
  id: string;
  updatedBy: string;
}

export interface SeoAnalysisDto {
  id: string;
  entityType: SeoMetadataDto['entityType'];
  entityId: string;
  locale: string;
  url: string;
  
  // Content Analysis
  contentAnalysis: {
    titleLength: number;
    descriptionLength: number;
    keywordDensity: Record<string, number>;
    headingStructure: Array<{
      level: number;
      text: string;
      hasKeyword: boolean;
    }>;
    wordCount: number;
    readabilityScore?: number;
    duplicateContent?: boolean;
  };
  
  // Technical Analysis
  technicalAnalysis: {
    hasCanonical: boolean;
    hasMetaDescription: boolean;
    hasOgTags: boolean;
    hasTwitterCard: boolean;
    hasStructuredData: boolean;
    hasHreflang: boolean;
    robotsDirectives: string[];
    pageLoadSpeed?: number;
    mobileOptimized?: boolean;
  };
  
  // SEO Score
  score: {
    overall: number; // 0-100
    content: number;
    technical: number;
    performance: number;
    accessibility: number;
  };
  
  // Recommendations
  recommendations: Array<{
    type: 'CRITICAL' | 'WARNING' | 'INFO';
    category: 'CONTENT' | 'TECHNICAL' | 'PERFORMANCE' | 'ACCESSIBILITY';
    message: string;
    suggestion: string;
    priority: number;
  }>;
  
  // Metadata
  analyzedAt: Date;
  analyzedBy?: string;
}

export interface SeoPerformanceDto {
  id: string;
  entityType: SeoMetadataDto['entityType'];
  entityId: string;
  locale: string;
  url: string;
  
  // Search Console Data
  searchConsole?: {
    impressions: number;
    clicks: number;
    ctr: number; // Click-through rate
    position: number; // Average position
    queries: Array<{
      query: string;
      impressions: number;
      clicks: number;
      ctr: number;
      position: number;
    }>;
  };
  
  // Analytics Data
  analytics?: {
    pageViews: number;
    uniquePageViews: number;
    averageTimeOnPage: number;
    bounceRate: number;
    exitRate: number;
    conversions: number;
    conversionRate: number;
  };
  
  // Rankings
  rankings?: Array<{
    keyword: string;
    position: number;
    searchEngine: 'GOOGLE' | 'BING' | 'YAHOO';
    country: string;
    device: 'DESKTOP' | 'MOBILE';
    checkedAt: Date;
  }>;
  
  // Backlinks
  backlinks?: {
    totalBacklinks: number;
    referringDomains: number;
    domainAuthority?: number;
    topBacklinks: Array<{
      url: string;
      domain: string;
      anchorText: string;
      authority: number;
      firstSeen: Date;
    }>;
  };
  
  // Period
  periodStart: Date;
  periodEnd: Date;
  updatedAt: Date;
}

export interface SeoKeywordDto {
  id: string;
  keyword: string;
  locale: string;
  
  // Keyword Metrics
  searchVolume?: number;
  difficulty?: number; // 0-100
  cpc?: number; // Cost per click
  competition?: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Targeting
  targetPages: Array<{
    entityType: SeoMetadataDto['entityType'];
    entityId: string;
    url: string;
    isPrimary: boolean;
  }>;
  
  // Performance
  currentRanking?: number;
  targetRanking?: number;
  bestRanking?: number;
  rankingHistory: Array<{
    position: number;
    date: Date;
  }>;
  
  // Related Keywords
  relatedKeywords?: string[];
  longTailKeywords?: string[];
  
  // Metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface SeoAuditDto {
  id: string;
  auditType: 'FULL_SITE' | 'PAGE_SPECIFIC' | 'TECHNICAL' | 'CONTENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  
  // Scope
  urls?: string[];
  entityTypes?: SeoMetadataDto['entityType'][];
  locales?: string[];
  
  // Results
  results?: {
    totalPages: number;
    pagesAnalyzed: number;
    averageScore: number;
    criticalIssues: number;
    warningIssues: number;
    infoIssues: number;
    
    // Issue Summary
    issues: Array<{
      type: 'CRITICAL' | 'WARNING' | 'INFO';
      category: 'CONTENT' | 'TECHNICAL' | 'PERFORMANCE' | 'ACCESSIBILITY';
      message: string;
      affectedPages: number;
      urls: string[];
    }>;
    
    // Recommendations
    recommendations: Array<{
      priority: number;
      category: string;
      title: string;
      description: string;
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
      effort: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
  };
  
  // Metadata
  startedAt: Date;
  completedAt?: Date;
  createdBy: string;
  configuration?: Record<string, any>;
}