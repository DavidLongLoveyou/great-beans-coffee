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
      name: { en: product.sku }, // Fallback name
      description: { en: product.sku }, // Fallback description
      type: product.coffeeType,
      grade: product.grade,
      processingMethod: product.processing,
      specifications: product.specifications || {},
      pricing: product.pricing || { basePrice: 0, currency: 'USD', unit: 'KG' },
      availability: product.availability || { inStock: true, quantity: 0 },
      certifications: product.certifications || [],
      origin: product.originInfo || { region: product.origin || 'Unknown', province: product.region || 'Unknown' },
      images: product.images || [],
      documents: product.documents || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      sortOrder: product.sortOrder || 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      createdBy: product.createdBy || '',
      updatedBy: product.updatedBy || '',
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
    if (locale && product.translations && product.translations.length > 0) {
      const translation = product.translations[0];
      if (translation) {
        return this.mapToEntity({
          ...product,
          name: translation.name || product.sku,
          description: translation.description || product.sku,
        });
      }
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
          { sku: slug }, // Use sku as slug alternative
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

    if (locale && product.translations && product.translations.length > 0) {
      const translation = product.translations[0];
      if (translation) {
        return this.mapToEntity({
          ...product,
          name: translation.name || product.sku,
          description: translation.description || product.sku,
        });
      }
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
        where.coffeeType = { in: filters.type as any[] };
      }
      if (filters.grade?.length) {
        where.grade = { in: filters.grade as any[] };
      }
      if (filters.processingMethod?.length) {
        where.processing = { in: filters.processingMethod as any[] };
      }
      if (filters.region?.length) {
        where.region = { in: filters.region };
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        // Note: Pricing is JSON field, complex filtering may need custom logic
        // For now, we'll skip this filter or implement basic JSON path filtering
      }
      if (filters.inStock !== undefined) {
        where.inStock = filters.inStock;
      }
      if (filters.featured !== undefined) {
        where.isFeatured = filters.featured;
      }
    }

    const orderBy: Prisma.CoffeeProductOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      // Map sortBy fields to actual database fields
      const sortField = filters.sortBy === 'name' ? 'sku' : 
                       filters.sortBy === 'price' ? 'createdAt' : // Fallback since pricing is JSON
                       filters.sortBy;
      
      if (['sku', 'createdAt', 'updatedAt', 'coffeeType', 'grade', 'processing', 'origin', 'region'].includes(sortField)) {
        (orderBy as any)[sortField] = filters.sortOrder || 'asc';
      } else {
        orderBy.createdAt = 'desc'; // Default fallback
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const queryOptions: any = {
      where,
      include: this.getIncludeClause(locale),
      orderBy,
    };
    
    if (filters?.limit !== undefined) {
      queryOptions.take = filters.limit;
    }
    
    if (filters?.offset !== undefined) {
      queryOptions.skip = filters.offset;
    }

    const products = await prisma.coffeeProduct.findMany(queryOptions);

    return products.map(product => {
      const productWithTranslations = product as any;
      if (locale && productWithTranslations.translations && productWithTranslations.translations.length > 0) {
        const translation = productWithTranslations.translations[0];
        if (translation) {
          return this.mapToEntity({
            ...product,
            name: translation.name || product.sku,
            description: translation.description || product.sku,
          });
        }
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
          { sku: { contains: query } },
          { origin: { contains: query } },
          { region: { contains: query } },
          {
            translations: {
              some: {
                OR: [
                  { name: { contains: query } },
                  { description: { contains: query } },
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
      if (locale && product.translations && product.translations.length > 0) {
        const translation = product.translations[0];
        if (translation) {
          return this.mapToEntity({
            ...product,
            name: translation.name || product.sku,
            description: translation.description || product.sku,
          });
        }
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
        coffeeType: data.type === 'INSTANT' ? 'SPECIALTY' : data.type as any,
        grade: data.grade === 'COMMERCIAL' ? 'GRADE_3' : 
               data.grade?.startsWith('SCREEN_') ? 'PREMIUM' : 
               data.grade as any,
        processing: data.processingMethod,
        origin: data.origin.region || 'Unknown',
        region: data.origin.province || 'Unknown',
        specifications: data.specifications as any,
        pricing: data.pricing as any,
        availability: data.availability as any,
        originInfo: data.origin as any,
        images: data.images as any,
        documents: data.documents as any,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
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
