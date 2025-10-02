import {
  ContentEntity,
  type Content,
  type ContentType,
  type ContentStatus,
  type ContentCategory,
  type ContentTranslation,
  type ContentAuthor,
  type ContentWorkflow,
  type ContentAnalytics,
  type SEOMetadata,
  type ContentMedia,
  type ContentVersion,
} from '../entities/content.entity';

// Search and filter criteria
export interface ContentSearchCriteria {
  // Basic filters
  type?: ContentType | ContentType[];
  status?: ContentStatus | ContentStatus[];
  category?: ContentCategory | ContentCategory[];

  // Author and ownership
  authorId?: string;
  createdBy?: string;
  assignedTo?: string;

  // Publication filters
  isPublished?: boolean;
  isFeatured?: boolean;
  publishedAfter?: Date;
  publishedBefore?: Date;

  // SEO and visibility
  hasMetaDescription?: boolean;
  hasOpenGraphImage?: boolean;
  minSeoScore?: number;

  // Language and localization
  locale?: string | string[];
  hasTranslations?: boolean;
  translationStatus?: 'COMPLETE' | 'PARTIAL' | 'MISSING';

  // Engagement metrics
  minViews?: number;
  minShares?: number;
  minEngagementRate?: number;

  // Content characteristics
  minReadTime?: number;
  maxReadTime?: number;
  hasMedia?: boolean;
  mediaType?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

  // Tags and keywords
  tags?: string | string[];
  keywords?: string | string[];

  // Text search
  searchTerm?: string; // Search in title, excerpt, content

  // Date filters
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?:
    | 'title'
    | 'publishedAt'
    | 'views'
    | 'engagementRate'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ContentSearchResult {
  content: ContentEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ContentRepositoryAnalytics {
  totalContent: number;
  contentByType: Record<ContentType, number>;
  contentByStatus: Record<ContentStatus, number>;
  contentByCategory: Record<ContentCategory, number>;
  contentByLocale: Record<string, number>;
  publishingTrends: Array<{
    month: string;
    published: number;
    drafted: number;
  }>;
  topPerformingContent: Array<{
    contentId: string;
    title: string;
    views: number;
    engagementRate: number;
  }>;
  authorProductivity: Array<{
    authorId: string;
    contentCount: number;
    averageEngagement: number;
  }>;
  seoPerformance: {
    averageSeoScore: number;
    contentWithMetaDescription: number;
    contentWithOpenGraph: number;
    topKeywords: Array<{ keyword: string; count: number; avgRanking?: number }>;
  };
}

export interface ContentPerformanceMetrics {
  contentId: string;
  views: number;
  uniqueViews: number;
  shares: number;
  likes: number;
  comments: number;
  engagementRate: number;
  averageTimeOnPage: number;
  bounceRate: number;
  conversionRate?: number;
  seoRanking?: Record<string, number>; // keyword -> ranking
}

// Repository interface
export interface IContentRepository {
  // Basic CRUD operations
  findById(id: string): Promise<ContentEntity | null>;
  findBySlug(slug: string, locale?: string): Promise<ContentEntity | null>;
  findAll(): Promise<ContentEntity[]>;
  create(
    content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentEntity>;
  update(id: string, updates: Partial<Content>): Promise<ContentEntity>;
  delete(id: string): Promise<void>;

  // Advanced search and filtering
  search(criteria: ContentSearchCriteria): Promise<ContentSearchResult>;
  findByType(type: ContentType): Promise<ContentEntity[]>;
  findByStatus(status: ContentStatus): Promise<ContentEntity[]>;
  findByCategory(category: ContentCategory): Promise<ContentEntity[]>;
  findByAuthor(authorId: string): Promise<ContentEntity[]>;

  // Publication management
  publish(
    id: string,
    publishedBy: string,
    publishedAt?: Date
  ): Promise<ContentEntity>;
  unpublish(
    id: string,
    unpublishedBy: string,
    reason?: string
  ): Promise<ContentEntity>;
  schedule(
    id: string,
    publishAt: Date,
    scheduledBy: string
  ): Promise<ContentEntity>;
  findScheduled(): Promise<ContentEntity[]>;
  findPublished(): Promise<ContentEntity[]>;
  findDrafts(): Promise<ContentEntity[]>;

  // Featured content management
  setFeatured(
    id: string,
    featured: boolean,
    updatedBy: string
  ): Promise<ContentEntity>;
  findFeatured(type?: ContentType, limit?: number): Promise<ContentEntity[]>;
  getFeaturedByCategory(
    category: ContentCategory,
    limit?: number
  ): Promise<ContentEntity[]>;

  // SEO management
  updateSEOMetadata(
    id: string,
    seoData: SEOMetadata
  ): Promise<ContentEntity>;
  findBySEOKeyword(keyword: string): Promise<ContentEntity[]>;
  findWithMissingSEO(): Promise<ContentEntity[]>;
  calculateSEOScore(id: string): Promise<number>;
  updateSEOScore(id: string, score: number): Promise<ContentEntity>;

  // Translation and localization
  addTranslation(
    id: string,
    locale: string,
    translation: ContentTranslation
  ): Promise<ContentEntity>;
  updateTranslation(
    id: string,
    locale: string,
    updates: Partial<ContentTranslation>
  ): Promise<ContentEntity>;
  removeTranslation(id: string, locale: string): Promise<ContentEntity>;
  findByLocale(locale: string): Promise<ContentEntity[]>;
  findUntranslated(targetLocale: string): Promise<ContentEntity[]>;
  getTranslationStatus(
    id: string
  ): Promise<Record<string, 'COMPLETE' | 'PARTIAL' | 'MISSING'>>;

  // Media management
  addMedia(
    id: string,
    media: Omit<ContentMedia, 'id' | 'uploadedAt'>
  ): Promise<ContentEntity>;
  updateMedia(
    id: string,
    mediaId: string,
    updates: Partial<ContentMedia>
  ): Promise<ContentEntity>;
  removeMedia(id: string, mediaId: string): Promise<ContentEntity>;
  findByMediaType(mediaType: string): Promise<ContentEntity[]>;
  getMediaUsage(): Promise<Record<string, number>>;

  // Version management
  createVersion(
    id: string,
    versionData: Omit<ContentVersion, 'id' | 'createdAt'>
  ): Promise<ContentEntity>;
  getVersionHistory(id: string): Promise<ContentVersion[]>;
  restoreVersion(
    id: string,
    versionId: string,
    restoredBy: string
  ): Promise<ContentEntity>;
  compareVersions(
    id: string,
    version1Id: string,
    version2Id: string
  ): Promise<any>;

  // Workflow management
  updateWorkflow(
    id: string,
    workflow: Content['workflow']
  ): Promise<ContentEntity>;
  findByWorkflowStage(stage: string): Promise<ContentEntity[]>;
  assignReviewer(
    id: string,
    reviewerId: string,
    assignedBy: string
  ): Promise<ContentEntity>;
  submitForReview(id: string, submittedBy: string): Promise<ContentEntity>;
  approveContent(
    id: string,
    approvedBy: string,
    notes?: string
  ): Promise<ContentEntity>;
  rejectContent(
    id: string,
    rejectedBy: string,
    reason: string
  ): Promise<ContentEntity>;

  // Analytics and performance
  updateAnalytics(
    id: string,
    analytics: Content['analytics']
  ): Promise<ContentEntity>;
  getPerformanceMetrics(id: string): Promise<ContentPerformanceMetrics>;
  incrementViews(id: string, isUnique?: boolean): Promise<ContentEntity>;
  recordEngagement(
    id: string,
    type: 'LIKE' | 'SHARE' | 'COMMENT',
    userId?: string
  ): Promise<ContentEntity>;
  getTopPerforming(
    type?: ContentType,
    limit?: number,
    timeframe?: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
  ): Promise<ContentEntity[]>;

  // Tag and keyword management
  addTags(id: string, tags: string[]): Promise<ContentEntity>;
  removeTags(id: string, tags: string[]): Promise<ContentEntity>;
  findByTag(tag: string): Promise<ContentEntity[]>;
  getPopularTags(
    limit?: number
  ): Promise<Array<{ tag: string; count: number }>>;
  updateKeywords(id: string, keywords: string[]): Promise<ContentEntity>;

  // Related content
  findRelated(id: string, limit?: number): Promise<ContentEntity[]>;
  findSimilar(id: string, limit?: number): Promise<ContentEntity[]>;
  setRelatedContent(id: string, relatedIds: string[]): Promise<ContentEntity>;

  // Content series and collections
  createSeries(
    name: string,
    description: string,
    contentIds: string[]
  ): Promise<string>;
  addToSeries(seriesId: string, contentId: string): Promise<void>;
  removeFromSeries(seriesId: string, contentId: string): Promise<void>;
  findBySeries(seriesId: string): Promise<ContentEntity[]>;

  // Bulk operations
  updateMany(
    updates: Array<{ id: string; data: Partial<Content> }>
  ): Promise<ContentEntity[]>;
  deleteMany(ids: string[]): Promise<void>;
  bulkPublish(ids: string[], publishedBy: string): Promise<ContentEntity[]>;
  bulkUnpublish(ids: string[], unpublishedBy: string): Promise<ContentEntity[]>;
  bulkUpdateStatus(
    ids: string[],
    status: ContentStatus,
    updatedBy: string
  ): Promise<ContentEntity[]>;

  // Search and discovery
  fullTextSearch(query: string, locale?: string): Promise<ContentEntity[]>;
  findSuggestions(
    query: string,
    limit?: number
  ): Promise<Array<{ title: string; slug: string; type: ContentType }>>;
  findTrending(
    timeframe?: 'DAY' | 'WEEK' | 'MONTH',
    limit?: number
  ): Promise<ContentEntity[]>;

  // Content calendar
  getContentCalendar(
    startDate: Date,
    endDate: Date
  ): Promise<
    Array<{
      date: Date;
      content: Array<{
        id: string;
        title: string;
        type: ContentType;
        status: ContentStatus;
      }>;
    }>
  >;
  getPublishingSchedule(authorId?: string): Promise<
    Array<{
      contentId: string;
      title: string;
      scheduledAt: Date;
      status: ContentStatus;
    }>
  >;

  // Analytics and reporting
  getAnalytics(dateRange?: {
    start: Date;
    end: Date;
  }): Promise<ContentRepositoryAnalytics>;
  getAuthorPerformance(authorId: string): Promise<{
    totalContent: number;
    publishedContent: number;
    totalViews: number;
    averageEngagement: number;
    topContent: ContentEntity[];
  }>;
  getContentGaps(): Promise<
    Array<{ category: ContentCategory; suggestedTopics: string[] }>
  >;

  // Export and import
  exportToCSV(criteria?: ContentSearchCriteria): Promise<string>;
  exportContent(
    id: string,
    format: 'JSON' | 'MARKDOWN' | 'HTML'
  ): Promise<string>;
  importContent(
    data: any[],
    format: 'JSON' | 'CSV'
  ): Promise<{ success: number; errors: string[] }>;

  // Audit and history
  getHistory(
    id: string
  ): Promise<
    Array<{ timestamp: Date; changes: Partial<Content>; changedBy: string }>
  >;
  getEditHistory(
    id: string
  ): Promise<Array<{ timestamp: Date; editor: string; summary: string }>>;

  // Cache management
  clearCache(): Promise<void>;
  warmCache(): Promise<void>;
  invalidateContentCache(id: string): Promise<void>;
}
