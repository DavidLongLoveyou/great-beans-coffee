import { Prisma, CoffeeGrade as PrismaCoffeeGrade } from '@prisma/client';

import {
  CoffeeProductEntity,
  type MultilingualContent,
  type CoffeeType,
  type CoffeeGrade,
  type ProcessingMethod,
  type Certification,
} from '../../../domain/entities/coffee-product.entity';
import { prisma } from '../prisma';

// Use actual Prisma types
type PrismaProductWithIncludes = Prisma.CoffeeProductGetPayload<{
  include: {
    translations: true;
    certifications: {
      include: {
        certification: true;
      };
    };
  };
}>;

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
  private mapToEntity(product: PrismaProductWithIncludes): CoffeeProductEntity {
    // Map Prisma enums to domain enums
    const mapCoffeeType = (type: string): CoffeeType => {
      switch (type) {
        case 'ROBUSTA':
          return 'ROBUSTA';
        case 'ARABICA':
          return 'ARABICA';
        case 'BLEND':
          return 'BLEND';
        case 'SPECIALTY':
          return 'INSTANT'; // Map SPECIALTY to INSTANT as fallback
        default:
          return 'ROBUSTA';
      }
    };

    const mapCoffeeGrade = (grade: string): CoffeeGrade => {
      switch (grade) {
        case 'GRADE_1':
          return 'GRADE_1';
        case 'GRADE_2':
          return 'GRADE_2';
        case 'GRADE_3':
          return 'GRADE_3';
        case 'PREMIUM':
          return 'SCREEN_18'; // Map PREMIUM to SCREEN_18
        case 'SPECIALTY':
          return 'SPECIALTY';
        case 'CUSTOM':
          return 'COMMERCIAL'; // Map CUSTOM to COMMERCIAL
        default:
          return 'GRADE_1';
      }
    };

    const mapProcessingMethod = (method: string): ProcessingMethod => {
      switch (method) {
        case 'NATURAL':
          return 'NATURAL';
        case 'WASHED':
          return 'WASHED';
        case 'HONEY':
          return 'HONEY';
        case 'WET_HULLED':
          return 'WET_HULLED';
        case 'SEMI_WASHED':
          return 'SEMI_WASHED';
        case 'MIXED':
          return 'SEMI_WASHED'; // Map MIXED to SEMI_WASHED as fallback
        default:
          return 'NATURAL';
      }
    };

    // Helper to safely parse JSON values
    const parseJsonValue = <T>(value: any, fallback: T): T => {
      if (value === null || value === undefined) return fallback;
      if (typeof value === 'object') return value as T;
      try {
        return JSON.parse(value as string) as T;
      } catch {
        return fallback;
      }
    };

    // Build multilingual content from translations
    const buildMultilingualContent = (
      fallback: string
    ): MultilingualContent => {
      const content: MultilingualContent = { en: fallback };

      if (product.translations) {
        product.translations.forEach(translation => {
          if (translation.name) {
            content[translation.locale as keyof MultilingualContent] =
              translation.name;
          }
        });
      }

      return content;
    };

    const buildMultilingualDescription = (
      fallback: string
    ): MultilingualContent => {
      const content: MultilingualContent = { en: fallback };

      if (product.translations) {
        product.translations.forEach(translation => {
          if (translation.description) {
            content[translation.locale as keyof MultilingualContent] =
              translation.description;
          }
        });
      }

      return content;
    };

    return new CoffeeProductEntity({
      id: product.id,
      sku: product.sku,
      name: buildMultilingualContent(product.sku),
      description: buildMultilingualDescription(''),
      shortDescription: undefined, // Not available in current schema
      type: mapCoffeeType(product.coffeeType),
      grade: mapCoffeeGrade(product.grade),
      processingMethod: mapProcessingMethod(product.processing),
      specifications: parseJsonValue(product.specifications, {
        moisture: 12,
        screenSize: '16+',
        defectRate: 5,
      }),
      pricing: parseJsonValue(product.pricing, {
        basePrice: 0,
        currency: 'USD' as const,
        unit: 'MT' as const,
        incoterms: 'FOB' as const,
        minimumOrder: 1,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }),
      availability: parseJsonValue(product.availability, {
        inStock: product.inStock,
        stockQuantity: 0,
        harvestSeason: product.harvestSeason || '2024/2025',
        availableFrom: new Date(),
        leadTime: 30,
        productionCapacity: 100,
      }),
      certifications:
        product.certifications?.map(
          pc => pc.certification.name as Certification
        ) || [],
      origin: parseJsonValue(product.originInfo, {
        region: product.region || 'Unknown',
        province: product.origin,
      }),
      traceabilityCode: undefined, // Not available in current schema
      images: parseJsonValue(product.images, []),
      documents: parseJsonValue(product.documents, undefined),
      seoTitle: undefined, // Not available in current schema
      seoDescription: undefined, // Not available in current schema
      keywords: undefined, // Not available in current schema
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      sortOrder: product.sortOrder,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      createdBy: product.createdBy,
      updatedBy: product.updatedBy,
    });
  }

  private getIncludeClause(locale?: string) {
    return {
      translations: locale
        ? {
            where: { locale },
          }
        : true,
      certifications: {
        include: {
          certification: true,
        },
      },
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

    // The mapToEntity method already handles translations properly
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

    // The mapToEntity method already handles translations properly
    return this.mapToEntity(product);
  }

  async findBySKU(sku: string): Promise<CoffeeProductEntity | null> {
    const product = await prisma.coffeeProduct.findUnique({
      where: { sku },
      include: {
        translations: true,
        certifications: {
          include: {
            certification: true,
          },
        },
      },
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
      if (filters.featured !== undefined) {
        where.isFeatured = filters.featured;
      }
    }

    const orderBy: Prisma.CoffeeProductOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      // Map sortBy fields to actual database fields
      const sortField =
        filters.sortBy === 'name'
          ? 'sku'
          : filters.sortBy === 'price'
            ? 'createdAt' // Fallback since pricing is JSON
            : filters.sortBy;

      if (
        [
          'sku',
          'createdAt',
          'updatedAt',
          'coffeeType',
          'grade',
          'processing',
          'origin',
          'region',
        ].includes(sortField)
      ) {
        (orderBy as Record<string, 'asc' | 'desc'>)[sortField] =
          filters.sortOrder || 'asc';
      } else {
        orderBy.createdAt = 'desc'; // Default fallback
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const queryOptions: Prisma.CoffeeProductFindManyArgs = {
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

    const products = (await prisma.coffeeProduct.findMany(
      queryOptions
    )) as PrismaProductWithIncludes[];

    return products.map(product => this.mapToEntity(product));
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

    return products.map(product => this.mapToEntity(product));
  }

  async create(
    data: Omit<CoffeeProductEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CoffeeProductEntity> {
    const originData = data.origin;
    const product = await prisma.coffeeProduct.create({
      data: {
        sku: data.sku,
        coffeeType: data.type === 'INSTANT' ? 'SPECIALTY' : data.type,
        grade: this.mapZodGradeToPrismaGrade(data.grade),
        processing: data.processingMethod,
        origin: originData?.region || 'Unknown',
        region: originData?.province || 'Unknown',
        specifications: data.specifications as Prisma.InputJsonValue,
        pricing: data.pricing as Prisma.InputJsonValue,
        availability: data.availability as Prisma.InputJsonValue,
        images: data.images as Prisma.InputJsonValue,
        documents: data.documents as Prisma.InputJsonValue,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
      include: {
        translations: true,
        certifications: {
          include: {
            certification: true,
          },
        },
      },
    });

    return this.mapToEntity(product);
  }

  async update(
    id: string,
    data: Partial<CoffeeProductEntity>
  ): Promise<CoffeeProductEntity> {
    const updateData: Prisma.CoffeeProductUpdateInput = {};

    if (data.sku) updateData.sku = data.sku;
    if (data.type)
      updateData.coffeeType = data.type === 'INSTANT' ? 'SPECIALTY' : data.type;
    if (data.grade) {
      updateData.grade = this.mapZodGradeToPrismaGrade(data.grade);
    }
    if (data.processingMethod) updateData.processing = data.processingMethod;
    if (data.origin?.region) updateData.origin = data.origin.region;
    if (data.origin?.province) updateData.region = data.origin.province;
    if (data.specifications)
      updateData.specifications = data.specifications as Prisma.InputJsonValue;
    if (data.pricing)
      updateData.pricing = data.pricing as Prisma.InputJsonValue;
    if (data.availability)
      updateData.availability = data.availability as Prisma.InputJsonValue;
    if (data.images) updateData.images = data.images as Prisma.InputJsonValue;
    if (data.documents)
      updateData.documents = data.documents as Prisma.InputJsonValue;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const product = await prisma.coffeeProduct.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        certifications: {
          include: {
            certification: true,
          },
        },
      },
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

    const currentAvailability =
      (product.availability as Record<string, unknown>) || {};
    const updatedAvailability = {
      ...currentAvailability,
      quantity,
      inStock: quantity > 0,
    };

    const updatedProduct = await prisma.coffeeProduct.update({
      where: { id },
      data: {
        availability: updatedAvailability as Prisma.InputJsonValue,
      },
      include: {
        translations: true,
        certifications: {
          include: {
            certification: true,
          },
        },
      },
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

  // Map Zod CoffeeGrade values to Prisma CoffeeGrade values
  private mapZodGradeToPrismaGrade(grade: CoffeeGrade): PrismaCoffeeGrade {
    switch (grade) {
      case 'GRADE_1':
        return PrismaCoffeeGrade.GRADE_1;
      case 'GRADE_2':
        return PrismaCoffeeGrade.GRADE_2;
      case 'GRADE_3':
        return PrismaCoffeeGrade.GRADE_3;
      case 'SCREEN_18':
        return PrismaCoffeeGrade.PREMIUM;
      case 'SCREEN_16':
        return PrismaCoffeeGrade.PREMIUM;
      case 'SCREEN_13':
        return PrismaCoffeeGrade.PREMIUM;
      case 'SPECIALTY':
        return PrismaCoffeeGrade.SPECIALTY;
      case 'COMMERCIAL':
        return PrismaCoffeeGrade.CUSTOM;
      default:
        return PrismaCoffeeGrade.GRADE_1;
    }
  }
}

export const coffeeProductRepository = new CoffeeProductRepository();
