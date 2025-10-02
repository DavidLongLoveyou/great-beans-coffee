// Content DTOs for application layer communication

export interface ContentDto {
  id: string;
  type: 'BLOG_POST' | 'MARKET_REPORT' | 'ORIGIN_STORY' | 'SERVICE_PAGE' | 'PRODUCT_PAGE' | 'LANDING_PAGE';
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';
  
  // Multilingual Content
  title: {
    en: string;
    de?: string;
    ja?: string;
    fr?: string;
    it?: string;
    es?: string;
    nl?: string;
    ko?: string;
  };
  
  description: {
    en: string;
    de?: string;
    ja?: string;
    fr?: string;
    it?: string;
    es?: string;
    nl?: string;
    ko?: string;
  };
  
  content: {
    en: string;
    de?: string;
    ja?: string;
    fr?: string;
    it?: string;
    es?: string;
    nl?: string;
    ko?: string;
  };
  
  excerpt?: {
    en: string;
    de?: string;
    ja?: string;
    fr?: string;
    it?: string;
    es?: string;
    nl?: string;
    ko?: string;
  };

  // Media
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  };
  
  gallery?: Array<{
    url: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;

  // SEO
  seoMetadata: {
    title: {
      en: string;
      de?: string;
      ja?: string;
      fr?: string;
      it?: string;
      es?: string;
      nl?: string;
      ko?: string;
    };
    description: {
      en: string;
      de?: string;
      ja?: string;
      fr?: string;
      it?: string;
      es?: string;
      nl?: string;
      ko?: string;
    };
    keywords: {
      en: string[];
      de?: string[];
      ja?: string[];
      fr?: string[];
      it?: string[];
      es?: string[];
      nl?: string[];
      ko?: string[];
    };
    canonicalUrl?: string;
    ogImage?: string;
    structuredData?: Record<string, any>;
  };

  // Categorization
  categories?: string[];
  tags?: string[];
  
  // Publishing
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  
  // Content-specific fields
  metadata?: {
    // For blog posts
    author?: {
      name: string;
      bio?: string;
      avatar?: string;
      social?: Record<string, string>;
    };
    readingTime?: number;
    
    // For market reports
    reportDate?: Date;
    reportType?: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'SPECIAL';
    dataSource?: string;
    
    // For origin stories
    origin?: {
      country: string;
      region: string;
      province?: string;
      farm?: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    
    // For service pages
    serviceType?: 'OEM' | 'PRIVATE_LABEL' | 'SOURCING' | 'LOGISTICS' | 'CONSULTING';
    features?: string[];
    benefits?: string[];
    
    // For product pages
    productId?: string;
    specifications?: Record<string, any>;
    certifications?: string[];
  };
}

export interface CreateContentDto {
  type: ContentDto['type'];
  slug: string;
  title: ContentDto['title'];
  description: ContentDto['description'];
  content: ContentDto['content'];
  excerpt?: ContentDto['excerpt'];
  featuredImage?: ContentDto['featuredImage'];
  gallery?: ContentDto['gallery'];
  seoMetadata: ContentDto['seoMetadata'];
  categories?: string[];
  tags?: string[];
  status?: ContentDto['status'];
  publishedAt?: Date;
  scheduledAt?: Date;
  metadata?: ContentDto['metadata'];
}

export interface UpdateContentDto extends Partial<CreateContentDto> {
  id: string;
  updatedBy: string;
}

export interface ContentSearchDto {
  query?: string;
  type?: ContentDto['type'][];
  status?: ContentDto['status'][];
  categories?: string[];
  tags?: string[];
  locale?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ContentListDto {
  content: ContentDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ContentStatsDto {
  totalContent: number;
  byType: Record<ContentDto['type'], number>;
  byStatus: Record<ContentDto['status'], number>;
  byLocale: Record<string, number>;
  recentlyUpdated: ContentDto[];
  popularContent: Array<{
    id: string;
    title: string;
    views: number;
    engagement: number;
  }>;
}

export interface ContentRevisionDto {
  id: string;
  contentId: string;
  version: number;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  createdBy: string;
  createdAt: Date;
  notes?: string;
}

export interface ContentTranslationDto {
  contentId: string;
  locale: string;
  title: string;
  description: string;
  content: string;
  excerpt?: string;
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVIEW';
  translatedBy?: string;
  reviewedBy?: string;
  completedAt?: Date;
}