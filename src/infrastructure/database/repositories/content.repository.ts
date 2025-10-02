import { Prisma } from '@prisma/client';

import { ContentEntity } from '../../../domain/entities/content.entity';
import { prisma } from '../prisma';

export interface IContentRepository {
  findById(id: string, locale?: string): Promise<ContentEntity | null>;
  findBySlug(slug: string, locale?: string): Promise<ContentEntity | null>;
  findAll(filters?: ContentFilters, locale?: string): Promise<ContentEntity[]>;
  findByType(type: string, locale?: string): Promise<ContentEntity[]>;
  findByCategory(category: string, locale?: string): Promise<ContentEntity[]>;
  findPublished(locale?: string): Promise<ContentEntity[]>;
  findFeatured(limit?: number, locale?: string): Promise<ContentEntity[]>;
  search(query: string, locale?: string): Promise<ContentEntity[]>;
  create(
    data: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentEntity>;
  update(id: string, data: Partial<ContentEntity>): Promise<ContentEntity>;
  updateTranslation(
    id: string,
    locale: string,
    translation: any
  ): Promise<ContentEntity>;
  publish(id: string): Promise<ContentEntity>;
  unpublish(id: string): Promise<ContentEntity>;
  delete(id: string): Promise<void>;
  getRelatedContent(
    id: string,
    limit?: number,
    locale?: string
  ): Promise<ContentEntity[]>;
  getPopularContent(limit?: number, locale?: string): Promise<ContentEntity[]>;
  getSitemapData(locale?: string): Promise<any[]>;
}

export interface ContentFilters {
  type?: string[];
  category?: string[];
  status?: string[];
  authorId?: string;
  featured?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'title' | 'publishedAt' | 'createdAt' | 'updatedAt' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export class ContentRepository implements IContentRepository {
  private mapToEntity(content: any, locale?: string): ContentEntity {
    return new ContentEntity({
      id: content.id,
      contentId: content.id,
      type: content.type,
      status: content.status,
      category: content.category || 'COMPANY_NEWS',
      translations: [
          {
            locale: content.locale,
            title: content.title,
            content: content.content,
            excerpt: content.excerpt || '',
            slug: content.slug,
            isDefault: content.locale === 'en',
            translatedBy: '',
            translatedAt: undefined,
            reviewedBy: '',
            reviewedAt: undefined,
            qualityScore: undefined,
            seoMetadata: {
               title: content.metaTitle || content.title,
               description: content.metaDescription || content.excerpt || '',
               keywords: Array.isArray(content.metaKeywords) ? content.metaKeywords : [],
               noIndex: false,
               noFollow: false,
               canonicalUrl: '',
               ogImage: content.featuredImage || '',
               structuredData: {}
             }
          }
        ],
      media: Array.isArray(content.media) ? content.media : [],
      author: {
        id: content.authorId || '',
        name: '',
        email: '',
        bio: '',
        avatar: '',
        expertise: [],
        socialLinks: {}
      },
      contributors: [],
      tags: Array.isArray(content.tags) ? content.tags : [],
      relatedContent: [],
      parentContent: undefined,
      versions: [],
      currentVersion: '1',
      template: undefined,
      customFields: {},
      targetAudience: [],
      targetMarkets: [],
      coffeeProducts: [],
      businessServices: [],
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      publishedAt: content.publishedAt,
      lastModifiedBy: content.authorId || '',
      createdBy: content.authorId || '',
    });
  }



  async findById(id: string, locale?: string): Promise<ContentEntity | null> {
    const content = await prisma.content.findUnique({
      where: { id },
    });

    return content ? this.mapToEntity(content, locale) : null;
  }

  async findBySlug(
    slug: string,
    locale?: string
  ): Promise<ContentEntity | null> {
    const whereClause: any = { slug, status: 'PUBLISHED' };
    
    if (locale) {
      whereClause.locale = locale;
    }

    const content = await prisma.content.findFirst({
      where: whereClause,
    });

    return content ? this.mapToEntity(content, locale) : null;
  }

  async findAll(
    filters?: ContentFilters,
    locale?: string
  ): Promise<ContentEntity[]> {
    const where: Prisma.ContentWhereInput = {};

    if (filters) {
      if (filters.type?.length) {
        where.type = { in: filters.type as any[] };
      }
      if (filters.category?.length) {
        where.category = { in: filters.category as any[] };
      }
      if (filters.status?.length) {
        where.status = { in: filters.status as any[] };
      }
      if (filters.authorId) {
        where.authorId = filters.authorId;
      }
      if (filters.dateFrom || filters.dateTo) {
        where.publishedAt = {
          ...(filters.dateFrom && { gte: filters.dateFrom }),
          ...(filters.dateTo && { lte: filters.dateTo }),
        };
      }
      if (filters.tags?.length) {
        // Tags is Json type, need to use array_contains or similar
        // For now, skip tags filtering as it requires complex Json queries
        // TODO: Implement proper Json array filtering
      }
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      if (filters.sortBy === 'views') {
        // Views sorting not available in current schema, fallback to publishedAt
        orderBy.publishedAt = filters.sortOrder || 'desc';
      } else {
        orderBy[filters.sortBy] = filters.sortOrder || 'desc';
      }
    } else {
      orderBy.publishedAt = 'desc';
    }

    const queryOptions: any = {
      where,
      orderBy,
    };

    if (filters?.limit) {
      queryOptions.take = filters.limit;
    }

    if (filters?.offset) {
      queryOptions.skip = filters.offset;
    }

    const contents = await prisma.content.findMany(queryOptions);

    return contents.map(content => this.mapToEntity(content, locale));
  }

  async findByType(type: string, locale?: string): Promise<ContentEntity[]> {
    return this.findAll(
      {
        type: [type],
        status: ['PUBLISHED'],
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      },
      locale
    );
  }

  async findByCategory(
    category: string,
    locale?: string
  ): Promise<ContentEntity[]> {
    return this.findAll(
      {
        category: [category],
        status: ['PUBLISHED'],
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      },
      locale
    );
  }

  async findPublished(locale?: string): Promise<ContentEntity[]> {
    return this.findAll(
      {
        status: ['PUBLISHED'],
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      },
      locale
    );
  }

  async findFeatured(
    limit: number = 6,
    locale?: string
  ): Promise<ContentEntity[]> {
    return this.findAll(
      {
        featured: true,
        status: ['PUBLISHED'],
        limit,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      },
      locale
    );
  }

  async search(query: string, locale?: string): Promise<ContentEntity[]> {
    const whereClause: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { excerpt: { contains: query } },
      ],
    };

    if (locale) {
      whereClause.locale = locale;
    }

    const contents = await prisma.content.findMany({
      where: whereClause,
      take: 20,
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return contents.map(content => this.mapToEntity(content, locale));
  }

  async create(
    data: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentEntity> {
    // ContentEntity has a different structure - we need to extract the actual data
    const entityData = data.toJSON();
    const defaultTranslation = entityData.translations?.find(t => t.isDefault) || entityData.translations?.[0];
    
    if (!defaultTranslation) {
      throw new Error('Content must have at least one translation');
    }
    
    const content = await prisma.content.create({
      data: {
        type: entityData.type,
        status: entityData.status,
        locale: defaultTranslation.locale,
        title: defaultTranslation.title,
        slug: defaultTranslation.slug,
        excerpt: defaultTranslation.excerpt || null,
        content: defaultTranslation.content,
        category: entityData.category || null,
        publishedAt: entityData.publishedAt || null,
        authorId: entityData.createdBy,
        // Store complex data as JSON
        media: entityData.media || Prisma.JsonNull,
        tags: entityData.tags || Prisma.JsonNull,
        metaTitle: defaultTranslation.seoMetadata?.title || null,
        metaDescription: defaultTranslation.seoMetadata?.description || null,
        metaKeywords: defaultTranslation.seoMetadata?.keywords || Prisma.JsonNull,
      },
    });

    return this.mapToEntity(content);
  }

  async update(
    id: string,
    data: Partial<ContentEntity>
  ): Promise<ContentEntity> {
    // Extract data from ContentEntity if needed
    const entityData = data instanceof ContentEntity ? data.toJSON() : data as any;
    
    const updateData: any = {};
    
    // Only update fields that exist in Prisma schema
    if (entityData.type) updateData.type = entityData.type;
    if (entityData.status) updateData.status = entityData.status;
    if (entityData.category) updateData.category = entityData.category;
    if (entityData.publishedAt !== undefined) updateData.publishedAt = entityData.publishedAt;
    
    // Handle translations
    if (entityData.translations) {
      const defaultTranslation = entityData.translations.find((t: any) => t.isDefault) || entityData.translations[0];
      if (defaultTranslation) {
        updateData.title = defaultTranslation.title;
        updateData.slug = defaultTranslation.slug;
        updateData.excerpt = defaultTranslation.excerpt || null;
        updateData.content = defaultTranslation.content;
        updateData.locale = defaultTranslation.locale;
        updateData.metaTitle = defaultTranslation.seoMetadata?.title || null;
        updateData.metaDescription = defaultTranslation.seoMetadata?.description || null;
        updateData.metaKeywords = defaultTranslation.seoMetadata?.keywords || Prisma.JsonNull;
      }
    }
    
    // Handle JSON fields
    if (entityData.media !== undefined) updateData.media = entityData.media || Prisma.JsonNull;
    if (entityData.tags !== undefined) updateData.tags = entityData.tags || Prisma.JsonNull;

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(content);
  }

  async updateTranslation(
    id: string,
    locale: string,
    translation: any
  ): Promise<ContentEntity> {
    // Since we don't have separate translation table, update the main content
    const updateData: any = {
      locale,
      title: translation.title,
      content: translation.content,
      excerpt: translation.excerpt || null,
      slug: translation.slug,
    };

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(content);
  }

  async publish(id: string): Promise<ContentEntity> {
    const content = await prisma.content.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(content);
  }

  async unpublish(id: string): Promise<ContentEntity> {
    const content = await prisma.content.update({
      where: { id },
      data: {
        status: 'DRAFT',
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(content);
  }

  async delete(id: string): Promise<void> {
    await prisma.content.delete({
      where: { id },
    });
  }

  async getRelatedContent(
    id: string,
    limit: number = 5,
    locale?: string
  ): Promise<ContentEntity[]> {
    const content = await prisma.content.findUnique({
      where: { id },
      select: {
        category: true,
        tags: true,
      },
    });

    if (!content) return [];

    // Find related content by category
    const relatedContents = await prisma.content.findMany({
      where: {
        id: { not: id },
        status: 'PUBLISHED',
        category: content.category,
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });

    return relatedContents.map(content => this.mapToEntity(content, locale));
  }

  async getPopularContent(
    limit: number = 10,
    locale?: string
  ): Promise<ContentEntity[]> {
    return this.findAll(
      {
        status: ['PUBLISHED'],
        limit,
        sortBy: 'views',
        sortOrder: 'desc',
      },
      locale
    );
  }

  async getSitemapData(locale?: string): Promise<any[]> {
    const contents = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        ...(locale && { locale }),
      },
      select: {
        id: true,
        slug: true,
        type: true,
        updatedAt: true,
        locale: true,
      },
    });

    return contents.map(content => ({
      id: content.id,
      slug: content.slug,
      type: content.type,
      lastModified: content.updatedAt,
      locale: content.locale,
    }));
  }
}

export const contentRepository = new ContentRepository();
