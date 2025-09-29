import { z } from 'zod';

// Content Type Enum
export const ContentTypeSchema = z.enum([
  'PAGE',
  'BLOG_POST',
  'MARKET_REPORT',
  'ORIGIN_STORY',
  'SERVICE_PAGE',
  'PRODUCT_DESCRIPTION',
  'FAQ',
  'TESTIMONIAL',
  'CASE_STUDY',
  'NEWS_ARTICLE',
  'PRESS_RELEASE',
  'LANDING_PAGE',
  'EMAIL_TEMPLATE',
  'SOCIAL_MEDIA_POST'
]);

// Content Status Enum
export const ContentStatusSchema = z.enum([
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'ARCHIVED',
  'REJECTED'
]);

// Content Category Enum
export const ContentCategorySchema = z.enum([
  'COFFEE_EDUCATION',
  'MARKET_INSIGHTS',
  'SUSTAINABILITY',
  'QUALITY_ASSURANCE',
  'ORIGIN_STORIES',
  'PROCESSING_METHODS',
  'CERTIFICATIONS',
  'TRADE_INFORMATION',
  'COMPANY_NEWS',
  'INDUSTRY_TRENDS',
  'TECHNICAL_GUIDES',
  'CUSTOMER_SUCCESS',
  'PRODUCT_UPDATES',
  'REGULATORY_UPDATES'
]);

// SEO Metadata Schema
export const SEOMetadataSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional(),
  ogTitle: z.string().max(60).optional(),
  ogDescription: z.string().max(160).optional(),
  ogImage: z.string().url().optional(),
  twitterTitle: z.string().max(60).optional(),
  twitterDescription: z.string().max(160).optional(),
  twitterImage: z.string().url().optional(),
  structuredData: z.record(z.string(), z.any()).optional(), // JSON-LD schema
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false)
});

// Content Media Schema
export const ContentMediaSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'INFOGRAPHIC']),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  alt: z.string(),
  caption: z.string().optional(),
  credits: z.string().optional(),
  fileSize: z.number().positive().optional(),
  dimensions: z.object({
    width: z.number().positive(),
    height: z.number().positive()
  }).optional(),
  duration: z.number().positive().optional(), // For video/audio in seconds
  mimeType: z.string().optional(),
  cloudinaryPublicId: z.string().optional()
});

// Content Translation Schema
export const ContentTranslationSchema = z.object({
  locale: z.string().min(2), // e.g., 'en', 'vi', 'ko'
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  seoMetadata: SEOMetadataSchema,
  isDefault: z.boolean().default(false),
  translatedBy: z.string().uuid().optional(),
  translatedAt: z.date().optional(),
  reviewedBy: z.string().uuid().optional(),
  reviewedAt: z.date().optional(),
  qualityScore: z.number().min(0).max(100).optional()
});

// Content Author Schema
export const ContentAuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  expertise: z.array(z.string()).optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional()
  }).optional()
});

// Content Workflow Schema
export const ContentWorkflowSchema = z.object({
  assignedTo: z.string().uuid().optional(),
  reviewers: z.array(z.string().uuid()).optional(),
  approvers: z.array(z.string().uuid()).optional(),
  dueDate: z.date().optional(),
  publishDate: z.date().optional(),
  expiryDate: z.date().optional(),
  workflowStage: z.enum(['WRITING', 'EDITING', 'REVIEW', 'APPROVAL', 'TRANSLATION', 'PUBLISHING']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  estimatedReadTime: z.number().positive().optional() // in minutes
});

// Content Analytics Schema
export const ContentAnalyticsSchema = z.object({
  views: z.number().min(0).default(0),
  uniqueViews: z.number().min(0).default(0),
  shares: z.number().min(0).default(0),
  likes: z.number().min(0).default(0),
  comments: z.number().min(0).default(0),
  averageTimeOnPage: z.number().min(0).optional(), // in seconds
  bounceRate: z.number().min(0).max(100).optional(),
  conversionRate: z.number().min(0).max(100).optional(),
  leadGenerated: z.number().min(0).default(0),
  lastAnalyticsUpdate: z.date().optional()
});

// Content Version Schema
export const ContentVersionSchema = z.object({
  id: z.string().uuid(),
  versionNumber: z.string(),
  changes: z.string(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  isPublished: z.boolean().default(false)
});

// Content Entity Schema
export const ContentSchema = z.object({
  id: z.string().uuid(),
  contentId: z.string().min(1), // Human-readable ID
  
  // Basic Information
  type: ContentTypeSchema,
  category: ContentCategorySchema,
  status: ContentStatusSchema,
  
  // Content Data
  translations: z.array(ContentTranslationSchema).min(1),
  media: z.array(ContentMediaSchema).optional(),
  
  // Authoring
  author: ContentAuthorSchema,
  contributors: z.array(ContentAuthorSchema).optional(),
  
  // Workflow & Publishing
  workflow: ContentWorkflowSchema.optional(),
  
  // Organization
  tags: z.array(z.string()).optional(),
  relatedContent: z.array(z.string().uuid()).optional(),
  parentContent: z.string().uuid().optional(), // For hierarchical content
  
  // Analytics & Performance
  analytics: ContentAnalyticsSchema.optional(),
  
  // Versioning
  versions: z.array(ContentVersionSchema).optional(),
  currentVersion: z.string().optional(),
  
  // Technical
  template: z.string().optional(), // Template used for rendering
  customFields: z.record(z.string(), z.any()).optional(),
  
  // Targeting
  targetAudience: z.array(z.enum(['IMPORTERS', 'ROASTERS', 'DISTRIBUTORS', 'RETAILERS', 'GENERAL'])).optional(),
  targetMarkets: z.array(z.string()).optional(), // Country codes
  
  // Content Relationships
  coffeeProducts: z.array(z.string().uuid()).optional(), // Related coffee products
  businessServices: z.array(z.string().uuid()).optional(), // Related services
  
  // System Fields
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().optional(),
  lastModifiedBy: z.string().uuid(),
  createdBy: z.string().uuid()
});

// Type Exports
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type ContentCategory = z.infer<typeof ContentCategorySchema>;
export type SEOMetadata = z.infer<typeof SEOMetadataSchema>;
export type ContentMedia = z.infer<typeof ContentMediaSchema>;
export type ContentTranslation = z.infer<typeof ContentTranslationSchema>;
export type ContentAuthor = z.infer<typeof ContentAuthorSchema>;
export type ContentWorkflow = z.infer<typeof ContentWorkflowSchema>;
export type ContentAnalytics = z.infer<typeof ContentAnalyticsSchema>;
export type ContentVersion = z.infer<typeof ContentVersionSchema>;
export type Content = z.infer<typeof ContentSchema>;

// Content Entity Class
export class ContentEntity {
  constructor(private readonly data: Content) {
    ContentSchema.parse(data);
  }

  // Getters
  get id(): string { return this.data.id; }
  get contentId(): string { return this.data.contentId; }
  get type(): ContentType { return this.data.type; }
  get category(): ContentCategory { return this.data.category; }
  get status(): ContentStatus { return this.data.status; }
  get translations(): ContentTranslation[] { return this.data.translations; }
  get author(): ContentAuthor { return this.data.author; }

  // Business Logic Methods
  isPublished(): boolean {
    return this.data.status === 'PUBLISHED';
  }

  isDraft(): boolean {
    return this.data.status === 'DRAFT';
  }

  canBePublished(): boolean {
    return ['APPROVED'].includes(this.data.status);
  }

  isExpired(): boolean {
    if (!this.data.workflow?.expiryDate) return false;
    return new Date() > this.data.workflow.expiryDate;
  }

  needsReview(): boolean {
    return this.data.status === 'IN_REVIEW';
  }

  getTranslation(locale: string): ContentTranslation | null {
    return this.data.translations.find(t => t.locale === locale) || null;
  }

  getDefaultTranslation(): ContentTranslation {
    return this.data.translations.find(t => t.isDefault) || this.data.translations[0];
  }

  getAvailableLocales(): string[] {
    return this.data.translations.map(t => t.locale);
  }

  hasTranslation(locale: string): boolean {
    return this.data.translations.some(t => t.locale === locale);
  }

  getLocalizedTitle(locale: string): string {
    const translation = this.getTranslation(locale);
    return translation?.title || this.getDefaultTranslation().title;
  }

  getLocalizedContent(locale: string): string {
    const translation = this.getTranslation(locale);
    return translation?.content || this.getDefaultTranslation().content;
  }

  getLocalizedSlug(locale: string): string {
    const translation = this.getTranslation(locale);
    return translation?.slug || this.getDefaultTranslation().slug;
  }

  getSEOMetadata(locale: string): SEOMetadata {
    const translation = this.getTranslation(locale);
    return translation?.seoMetadata || this.getDefaultTranslation().seoMetadata;
  }

  getEstimatedReadTime(): number {
    if (this.data.workflow?.estimatedReadTime) {
      return this.data.workflow.estimatedReadTime;
    }
    
    // Calculate based on word count (average 200 words per minute)
    const defaultTranslation = this.getDefaultTranslation();
    const wordCount = defaultTranslation.content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }

  getFeaturedImage(): ContentMedia | null {
    return this.data.media?.find(m => m.type === 'IMAGE') || null;
  }

  getMediaByType(type: ContentMedia['type']): ContentMedia[] {
    return this.data.media?.filter(m => m.type === type) || [];
  }

  isTargetedTo(audience: string): boolean {
    return this.data.targetAudience?.includes(audience as any) || false;
  }

  isTargetedToMarket(countryCode: string): boolean {
    return this.data.targetMarkets?.includes(countryCode) || false;
  }

  getAnalytics(): ContentAnalytics | null {
    return this.data.analytics || null;
  }

  getEngagementRate(): number {
    const analytics = this.getAnalytics();
    if (!analytics || analytics.views === 0) return 0;
    
    const engagements = analytics.shares + analytics.likes + analytics.comments;
    return (engagements / analytics.views) * 100;
  }

  addTranslation(translation: ContentTranslation): ContentEntity {
    // Ensure only one default translation
    const updatedTranslations = this.data.translations.map(t => ({
      ...t,
      isDefault: translation.isDefault ? false : t.isDefault
    }));
    
    const updatedData: Content = {
      ...this.data,
      translations: [...updatedTranslations, translation],
      updatedAt: new Date()
    };
    
    return new ContentEntity(updatedData);
  }

  updateTranslation(locale: string, updates: Partial<ContentTranslation>): ContentEntity {
    const updatedTranslations = this.data.translations.map(t => 
      t.locale === locale ? { ...t, ...updates } : t
    );
    
    const updatedData: Content = {
      ...this.data,
      translations: updatedTranslations,
      updatedAt: new Date()
    };
    
    return new ContentEntity(updatedData);
  }

  updateStatus(status: ContentStatus, updatedBy: string): ContentEntity {
    const updatedData: Content = {
      ...this.data,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : this.data.publishedAt,
      updatedAt: new Date(),
      lastModifiedBy: updatedBy
    };
    
    return new ContentEntity(updatedData);
  }

  addMedia(media: ContentMedia): ContentEntity {
    const updatedData: Content = {
      ...this.data,
      media: [...(this.data.media || []), media],
      updatedAt: new Date()
    };
    
    return new ContentEntity(updatedData);
  }

  updateAnalytics(analytics: Partial<ContentAnalytics>): ContentEntity {
    const updatedData: Content = {
      ...this.data,
      analytics: {
        ...this.data.analytics,
        ...analytics,
        lastAnalyticsUpdate: new Date()
      } as ContentAnalytics,
      updatedAt: new Date()
    };
    
    return new ContentEntity(updatedData);
  }

  incrementViews(unique: boolean = false): ContentEntity {
    const currentAnalytics = this.data.analytics || {
      views: 0,
      uniqueViews: 0,
      shares: 0,
      likes: 0,
      comments: 0,
      leadGenerated: 0
    };
    
    const updatedAnalytics: ContentAnalytics = {
      ...currentAnalytics,
      views: currentAnalytics.views + 1,
      uniqueViews: unique ? currentAnalytics.uniqueViews + 1 : currentAnalytics.uniqueViews,
      lastAnalyticsUpdate: new Date()
    };
    
    return this.updateAnalytics(updatedAnalytics);
  }

  addVersion(changes: string, createdBy: string): ContentEntity {
    const newVersion: ContentVersion = {
      id: crypto.randomUUID(),
      versionNumber: this.generateNextVersionNumber(),
      changes,
      createdBy,
      createdAt: new Date(),
      isPublished: this.data.status === 'PUBLISHED'
    };
    
    const updatedData: Content = {
      ...this.data,
      versions: [...(this.data.versions || []), newVersion],
      currentVersion: newVersion.versionNumber,
      updatedAt: new Date()
    };
    
    return new ContentEntity(updatedData);
  }

  private generateNextVersionNumber(): string {
    if (!this.data.versions || this.data.versions.length === 0) {
      return '1.0.0';
    }
    
    const lastVersion = this.data.versions[this.data.versions.length - 1];
    const [major, minor, patch] = lastVersion.versionNumber.split('.').map(Number);
    
    // Increment patch version
    return `${major}.${minor}.${patch + 1}`;
  }

  // Validation Methods
  static validate(data: unknown): Content {
    return ContentSchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      ContentSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  // Factory Methods
  static create(data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): ContentEntity {
    const now = new Date();
    
    const contentData: Content = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    
    return new ContentEntity(contentData);
  }

  static generateContentId(title: string, type: ContentType): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const typePrefix = type.toLowerCase().replace('_', '-');
    const timestamp = Date.now().toString().slice(-6);
    
    return `${typePrefix}-${slug}-${timestamp}`;
  }

  toJSON(): Content {
    return { ...this.data };
  }
}