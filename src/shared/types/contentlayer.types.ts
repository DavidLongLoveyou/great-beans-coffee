// Contentlayer Types - Re-export all generated types for application use
export type {
  MarketReport,
  OriginStory,
  ServicePage,
  BlogPost,
  LegalPage,
  DocumentTypes,
} from 'contentlayer/generated';

// Content collections exports
export {
  allMarketReports,
  allOriginStories,
  allServicePages,
  allBlogPosts,
  allLegalPages,
  allDocuments,
} from 'contentlayer/generated';

// Content utility types
export interface ContentMetadata {
  slug: string;
  title: string;
  description: string;
  locale: string;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  category: string;
  tags?: string[];
  excerpt?: string;
  readingTime?: number;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

// Content filtering types
export interface ContentFilters {
  locale?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Content search types
export interface ContentSearchResult {
  item: ContentMetadata;
  score: number;
  matches: {
    field: string;
    value: string;
    indices: [number, number][];
  }[];
}

// Content pagination types
export interface ContentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Content query types
export interface ContentQuery {
  filters?: ContentFilters;
  search?: string;
  sort?: {
    field: keyof ContentMetadata;
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

// Content response types
export interface ContentResponse<T = ContentMetadata> {
  data: T[];
  pagination: ContentPagination;
  filters: ContentFilters;
}