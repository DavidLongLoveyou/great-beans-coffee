import { Prisma } from '@prisma/client';

import { CoffeeProductEntity } from '../../../domain/entities/coffee-product.entity';
import { prisma } from '../prisma';

export interface ICoffeeProductRepository {
  findById(id: string, locale?: string): Promise<CoffeeProductEntity | null>;
  findBySlug(
    slug: string,
    locale?: string
  ): Promise<CoffeeProductEntity | null>;
  findBySKU(sku: string): Promise<CoffeeProductEntity | null>;
  findAll(
    filters?: CoffeeProductFilters,
    locale?: string
  ): Promise<CoffeeProductEntity[]>;
  findFeatured(limit?: number, locale?: string): Promise<CoffeeProductEntity[]>;
  search(query: string, locale?: string): Promise<CoffeeProductEntity[]>;
  create(
    data: Omit<CoffeeProductEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CoffeeProductEntity>;
  update(
    id: string,
    data: Partial<CoffeeProductEntity>
  ): Promise<CoffeeProductEntity>;
  delete(id: string): Promise<void>;
  updateStock(id: string, quantity: number): Promise<CoffeeProductEntity>;
  getAvailableProducts(locale?: string): Promise<CoffeeProductEntity[]>;
  getProductsByOrigin(
    region: string,
    locale?: string
  ): Promise<CoffeeProductEntity[]>;
  getProductsByGrade(
    grade: string,
    locale?: string
  ): Promise<CoffeeProductEntity[]>;
  getProductsByType(
    type: string,
    locale?: string
  ): Promise<CoffeeProductEntity[]>;
}

export interface CoffeeProductFilters {
  type?: string[];
  grade?: string[];
  processingMethod?: string[];
  certifications?: string[];
  region?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export class CoffeeProductRepository implements ICoffeeProductRepository {
  private mapToEntity(product: any): CoffeeProductEntity {
    return new CoffeeProductEntity({
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      type: product.type,
      grade: product.grade,
      processingMethod: product.processingMethod,
      specifications: product.specifications,
      pricing: product.pricing,
      availability: product.availability,
      originInfo: product.originInfo,
      certifications: product.certifications,
      images: product.images,
      documents: product.documents,
      seoMetadata: product.seoMetadata,
      featured: product.featured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  private getIncludeClause(locale?: string) {
    return {
      translations: locale
        ? {
            where: { locale },
          }
        : true,
    };
  }

  async findById(
    id: string,
    locale?: string
  ): Promise<CoffeeProductEntity | null> {
    const product = await prisma.coffeeProduct.findUnique({
      where: { id },
      include: this.getIncludeClause(locale),
    });

    if (!product) return null;

    // Merge translation data if available
    if (locale && product.translations.length > 0) {
      const translation = product.translations[0];
      return this.mapToEntity({
        ...product,
        name: translation.name || product.name,
        description: translation.description || product.description,
      });
    }

    return this.mapToEntity(product);
  }

  async findBySlug(
    slug: string,
    locale?: string
  ): Promise<CoffeeProductEntity | null> {
    const product = await prisma.coffeeProduct.findFirst({
      where: {
        OR: [
          { slug },
          {
            translations: {
              some: { slug },
            },
          },
        ],
      },
      include: this.getIncludeClause(locale),
    });

    if (!product) return null;

    if (locale && product.translations.length > 0) {
      const translation = product.translations[0];
      return this.mapToEntity({
        ...product,
        name: translation.name || product.name,
        description: translation.description || product.description,
      });
    }

    return this.mapToEntity(product);
  }

  async findBySKU(sku: string): Promise<CoffeeProductEntity | null> {
    const product = await prisma.coffeeProduct.findUnique({
      where: { sku },
      include: { translations: true },
    });

    return product ? this.mapToEntity(product) : null;
  }

  async findAll(
    filters?: CoffeeProductFilters,
    locale?: string
  ): Promise<CoffeeProductEntity[]> {
    const where: Prisma.CoffeeProductWhereInput = {
      isActive: true,
    };

    if (filters) {
      if (filters.type?.length) {
        where.type = { in: filters.type as any[] };
      }
      if (filters.grade?.length) {
        where.grade = { in: filters.grade as any[] };
      }
      if (filters.processingMethod?.length) {
        where.processingMethod = { in: filters.processingMethod as any[] };
      }
      if (filters.certifications?.length) {
        where.certifications = {
          hasSome: filters.certifications,
        };
      }
      if (filters.region?.length) {
        where.originInfo = {
          path: ['region'],
          in: filters.region,
        };
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.pricing = {
          path: ['basePrice'],
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        };
      }
      if (filters.inStock !== undefined) {
        where.availability = {
          path: ['inStock'],
          equals: filters.inStock,
        };
      }
      if (filters.featured !== undefined) {
        where.featured = filters.featured;
      }
    }

    const orderBy: Prisma.CoffeeProductOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const products = await prisma.coffeeProduct.findMany({
      where,
      include: this.getIncludeClause(locale),
      orderBy,
      take: filters?.limit,
      skip: filters?.offset,
    });

    return products.map(product => {
      if (locale && product.translations.length > 0) {
        const translation = product.translations[0];
        return this.mapToEntity({
          ...product,
          name: translation.name || product.name,
          description: translation.description || product.description,
        });
      }
      return this.mapToEntity(product);
    });
  }

  async findFeatured(
    limit: number = 6,
    locale?: string
  ): Promise<CoffeeProductEntity[]> {
    return this.findAll(
      {
        featured: true,
        limit,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      },
      locale
    );
  }

  async search(query: string, locale?: string): Promise<CoffeeProductEntity[]> {
    const products = await prisma.coffeeProduct.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          {
            translations: {
              some: {
                OR: [
                  { name: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      },
      include: this.getIncludeClause(locale),
      take: 20,
    });

    return products.map(product => {
      if (locale && product.translations.length > 0) {
        const translation = product.translations[0];
        return this.mapToEntity({
          ...product,
          name: translation.name || product.name,
          description: translation.description || product.description,
        });
      }
      return this.mapToEntity(product);
    });
  }

  async create(
    data: Omit<CoffeeProductEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CoffeeProductEntity> {
    const product = await prisma.coffeeProduct.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        type: data.type,
        grade: data.grade,
        processingMethod: data.processingMethod,
        specifications: data.specifications as any,
        pricing: data.pricing as any,
        availability: data.availability as any,
        originInfo: data.originInfo as any,
        certifications: data.certifications,
        images: data.images,
        documents: data.documents,
        seoMetadata: data.seoMetadata as any,
        featured: data.featured,
        isActive: data.isActive,
      },
      include: { translations: true },
    });

    return this.mapToEntity(product);
  }

  async update(
    id: string,
    data: Partial<CoffeeProductEntity>
  ): Promise<CoffeeProductEntity> {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData.createdAt;
    updateData.updatedAt = new Date();

    const product = await prisma.coffeeProduct.update({
      where: { id },
      data: updateData,
      include: { translations: true },
    });

    return this.mapToEntity(product);
  }

  async delete(id: string): Promise<void> {
    await prisma.coffeeProduct.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateStock(
    id: string,
    quantity: number
  ): Promise<CoffeeProductEntity> {
    const product = await prisma.coffeeProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const availability = product.availability as any;
    availability.quantity = quantity;
    availability.inStock = quantity > 0;

    const updatedProduct = await prisma.coffeeProduct.update({
      where: { id },
      data: {
        availability,
        updatedAt: new Date(),
      },
      include: { translations: true },
    });

    return this.mapToEntity(updatedProduct);
  }

  async getAvailableProducts(locale?: string): Promise<CoffeeProductEntity[]> {
    return this.findAll(
      {
        inStock: true,
        sortBy: 'name',
        sortOrder: 'asc',
      },
      locale
    );
  }

  async getProductsByOrigin(
    region: string,
    locale?: string
  ): Promise<CoffeeProductEntity[]> {
    return this.findAll(
      {
        region: [region],
        sortBy: 'name',
        sortOrder: 'asc',
      },
      locale
    );
  }

  async getProductsByGrade(
    grade: string,
    locale?: string
  ): Promise<CoffeeProductEntity[]> {
    return this.findAll(
      {
        grade: [grade],
        sortBy: 'name',
        sortOrder: 'asc',
      },
      locale
    );
  }

  async getProductsByType(
    type: string,
    locale?: string
  ): Promise<CoffeeProductEntity[]> {
    return this.findAll(
      {
        type: [type],
        sortBy: 'name',
        sortOrder: 'asc',
      },
      locale
    );
  }
}

export const coffeeProductRepository = new CoffeeProductRepository();
