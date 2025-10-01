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
    // Get the appropriate translation
    let translation = null;
    if (locale && content.translations?.length > 0) {
      translation =
        content.translations.find((t: any) => t.locale === locale) ||
        content.translations.find((t: any) => t.locale === 'en') ||
        content.translations[0];
    }

    return new ContentEntity({
      id: content.id,
      type: content.type,
      category: content.category,
      status: content.status,
      featured: content.featured,
      publishedAt: content.publishedAt,
      authorId: content.authorId,
      seoMetadata: content.seoMetadata,
      media: content.media,
      tags: content.tags,
      workflow: content.workflow,
      analytics: content.analytics,
      relatedContentIds: content.relatedContentIds,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      // Use translation data if available
      title: translation?.title || content.title || '',
      content: translation?.content || content.content || '',
      excerpt: translation?.excerpt || content.excerpt || '',
      slug: translation?.slug || content.slug || '',
    });
  }

  private getIncludeClause(locale?: string) {
    return {
      translations: locale
        ? {
            where: { locale },
          }
        : true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      versions: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    };
  }

  async findById(id: string, locale?: string): Promise<ContentEntity | null> {
    const content = await prisma.content.findUnique({
      where: { id },
      include: this.getIncludeClause(locale),
    });

    return content ? this.mapToEntity(content, locale) : null;
  }

  async findBySlug(
    slug: string,
    locale?: string
  ): Promise<ContentEntity | null> {
    const content = await prisma.content.findFirst({
      where: {
        OR: [
          { slug },
          {
            translations: {
              some: { slug },
            },
          },
        ],
        status: 'PUBLISHED',
      },
      include: this.getIncludeClause(locale),
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
      if (filters.featured !== undefined) {
        where.featured = filters.featured;
      }
      if (filters.dateFrom || filters.dateTo) {
        where.publishedAt = {
          ...(filters.dateFrom && { gte: filters.dateFrom }),
          ...(filters.dateTo && { lte: filters.dateTo }),
        };
      }
      if (filters.tags?.length) {
        where.tags = {
          hasSome: filters.tags,
        };
      }
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      if (filters.sortBy === 'views') {
        orderBy.analytics = {
          path: ['totalViews'],
          sort: filters.sortOrder || 'desc',
        };
      } else {
        orderBy[filters.sortBy] = filters.sortOrder || 'desc';
      }
    } else {
      orderBy.publishedAt = 'desc';
    }

    const contents = await prisma.content.findMany({
      where,
      include: this.getIncludeClause(locale),
      orderBy,
      take: filters?.limit,
      skip: filters?.offset,
    });

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
    const contents = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          {
            translations: {
              some: {
                locale: locale || 'en',
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { content: { contains: query, mode: 'insensitive' } },
                  { excerpt: { contains: query, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      },
      include: this.getIncludeClause(locale),
      take: 20,
      orderBy: {
        analytics: {
          path: ['totalViews'],
          sort: 'desc',
        },
      },
    });

    return contents.map(content => this.mapToEntity(content, locale));
  }

  async create(
    data: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentEntity> {
    const content = await prisma.content.create({
      data: {
        type: data.type,
        category: data.category,
        status: data.status,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug: data.slug,
        featured: data.featured,
        publishedAt: data.publishedAt,
        authorId: data.authorId,
        seoMetadata: data.seoMetadata as any,
        media: data.media,
        tags: data.tags,
        workflow: data.workflow as any,
        analytics: data.analytics as any,
        relatedContentIds: data.relatedContentIds,
      },
      include: this.getIncludeClause(),
    });

    return this.mapToEntity(content);
  }

  async update(
    id: string,
    data: Partial<ContentEntity>
  ): Promise<ContentEntity> {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData.createdAt;
    updateData.updatedAt = new Date();

    // Create version before updating
    const currentContent = await prisma.content.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
        excerpt: true,
        status: true,
        authorId: true,
      },
    });

    if (currentContent) {
      await prisma.contentVersion.create({
        data: {
          contentId: id,
          title: currentContent.title,
          content: currentContent.content,
          excerpt: currentContent.excerpt,
          status: currentContent.status,
          createdById: currentContent.authorId,
          changeLog: 'Content updated',
        },
      });
    }

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
      include: this.getIncludeClause(),
    });

    return this.mapToEntity(content);
  }

  async updateTranslation(
    id: string,
    locale: string,
    translation: any
  ): Promise<ContentEntity> {
    await prisma.contentTranslation.upsert({
      where: {
        contentId_locale: {
          contentId: id,
          locale,
        },
      },
      update: {
        title: translation.title,
        content: translation.content,
        excerpt: translation.excerpt,
        slug: translation.slug,
        updatedAt: new Date(),
      },
      create: {
        contentId: id,
        locale,
        title: translation.title,
        content: translation.content,
        excerpt: translation.excerpt,
        slug: translation.slug,
      },
    });

    const content = await prisma.content.findUnique({
      where: { id },
      include: this.getIncludeClause(locale),
    });

    return this.mapToEntity(content!, locale);
  }

  async publish(id: string): Promise<ContentEntity> {
    const content = await prisma.content.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
      include: this.getIncludeClause(),
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
      include: this.getIncludeClause(),
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
        relatedContentIds: true,
      },
    });

    if (!content) return [];

    // First try to get explicitly related content
    let relatedContents = [];
    if (content.relatedContentIds?.length > 0) {
      relatedContents = await prisma.content.findMany({
        where: {
          id: { in: content.relatedContentIds },
          status: 'PUBLISHED',
        },
        include: this.getIncludeClause(locale),
        take: limit,
      });
    }

    // If we need more content, find by category and tags
    if (relatedContents.length < limit) {
      const additionalContent = await prisma.content.findMany({
        where: {
          id: { not: id },
          status: 'PUBLISHED',
          OR: [
            { category: content.category },
            { tags: { hasSome: content.tags || [] } },
          ],
        },
        include: this.getIncludeClause(locale),
        take: limit - relatedContents.length,
        orderBy: { publishedAt: 'desc' },
      });

      relatedContents = [...relatedContents, ...additionalContent];
    }

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
      },
      include: {
        translations: locale
          ? {
              where: { locale },
            }
          : true,
      },
      select: {
        id: true,
        slug: true,
        type: true,
        updatedAt: true,
        translations: true,
      },
    });

    return contents.map(content => {
      const translation =
        locale && content.translations.length > 0
          ? content.translations.find(t => t.locale === locale) ||
            content.translations[0]
          : null;

      return {
        id: content.id,
        slug: translation?.slug || content.slug,
        type: content.type,
        lastModified: content.updatedAt,
        locale: locale || 'en',
      };
    });
  }
}

export const contentRepository = new ContentRepository();
