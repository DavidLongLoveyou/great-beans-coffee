import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const SearchProductsSchema = z.object({
  q: z.string().optional(),
  coffeeType: z
    .array(z.enum(['ROBUSTA', 'ARABICA', 'BLEND', 'SPECIALTY']))
    .optional(),
  grade: z
    .array(
      z.enum([
        'GRADE_1',
        'GRADE_2',
        'GRADE_3',
        'PREMIUM',
        'SPECIALTY',
        'CUSTOM',
      ])
    )
    .optional(),
  processing: z
    .array(
      z.enum([
        'NATURAL',
        'WASHED',
        'HONEY',
        'WET_HULLED',
        'SEMI_WASHED',
        'MIXED',
      ])
    )
    .optional(),
  origin: z.array(z.string()).optional(),
  region: z.array(z.string()).optional(),
  cuppingScoreMin: z.number().min(0).max(100).optional(),
  cuppingScoreMax: z.number().min(0).max(100).optional(),
  certifications: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  sortBy: z
    .enum(['name', 'cuppingScore', 'createdAt', 'updatedAt', 'price'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  locale: z.string().default('en'),
});

// POST /api/products/search - Advanced product search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      q,
      coffeeType,
      grade,
      processing,
      origin,
      region,
      cuppingScoreMin,
      cuppingScoreMax,
      certifications,
      inStock,
      isFeatured,
      priceMin,
      priceMax,
      sortBy,
      sortOrder,
      page,
      limit,
      locale,
    } = SearchProductsSchema.parse(body);

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    // Text search
    if (q) {
      where.OR = [
        {
          sku: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          origin: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          region: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          farm: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          translations: {
            some: {
              locale,
              OR: [
                {
                  name: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  flavorProfile: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        },
      ];
    }

    // Filter by coffee type
    if (coffeeType && coffeeType.length > 0) {
      where.coffeeType = {
        in: coffeeType,
      };
    }

    // Filter by grade
    if (grade && grade.length > 0) {
      where.grade = {
        in: grade,
      };
    }

    // Filter by processing method
    if (processing && processing.length > 0) {
      where.processing = {
        in: processing,
      };
    }

    // Filter by origin
    if (origin && origin.length > 0) {
      where.origin = {
        in: origin,
      };
    }

    // Filter by region
    if (region && region.length > 0) {
      where.region = {
        in: region,
      };
    }

    // Filter by cupping score range
    if (cuppingScoreMin !== undefined || cuppingScoreMax !== undefined) {
      where.cuppingScore = {};
      if (cuppingScoreMin !== undefined) {
        where.cuppingScore.gte = cuppingScoreMin;
      }
      if (cuppingScoreMax !== undefined) {
        where.cuppingScore.lte = cuppingScoreMax;
      }
    }

    // Filter by certifications
    if (certifications && certifications.length > 0) {
      where.certifications = {
        some: {
          certification: {
            id: {
              in: certifications,
            },
          },
          isActive: true,
        },
      };
    }

    // Filter by stock status
    if (inStock !== undefined) {
      where.inStock = inStock;
    }

    // Filter by featured status
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'name':
        orderBy = {
          translations: {
            _count: sortOrder,
          },
        };
        break;
      case 'cuppingScore':
        orderBy = { cuppingScore: sortOrder };
        break;
      case 'price':
        // Sort by minimum price from pricing models
        orderBy = {
          pricingModels: {
            _count: sortOrder,
          },
        };
        break;
      default:
        orderBy = { [sortBy]: sortOrder };
    }

    // Execute search query
    const [products, totalCount] = await Promise.all([
      prisma.coffeeProduct.findMany({
        where,
        include: {
          translations: {
            where: { locale },
          },
          certifications: {
            where: { isActive: true },
            include: {
              certification: {
                include: {
                  translations: {
                    where: { locale },
                  },
                },
              },
            },
          },
          // suppliers: {
          //   where: { isActive: true },
          //   take: 1,
          //   include: {
          //     supplier: {
          //       select: {
          //         id: true,
          //         name: true,
          //         country: true,
          //       },
          //     },
          //   },
          // },
          pricingModels: {
            where: { isActive: true },
            take: 1,
            include: {
              pricingModel: true,
            },
          },
          // inventory: {
          //   take: 1,
          //   orderBy: { lastUpdated: 'desc' },
          // },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.coffeeProduct.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Get aggregated filter data for faceted search
    const [
      coffeeTypes,
      grades,
      processingMethods,
      origins,
      regions,
      availableCertifications,
    ] = await Promise.all([
      prisma.coffeeProduct.groupBy({
        by: ['coffeeType'],
        where: { isActive: true },
        _count: true,
      }),
      prisma.coffeeProduct.groupBy({
        by: ['grade'],
        where: { isActive: true },
        _count: true,
      }),
      prisma.coffeeProduct.groupBy({
        by: ['processing'],
        where: { isActive: true },
        _count: true,
      }),
      prisma.coffeeProduct.groupBy({
        by: ['origin'],
        where: { isActive: true },
        _count: true,
      }),
      prisma.coffeeProduct.groupBy({
        by: ['region'],
        where: { isActive: true, region: { not: null } },
        _count: true,
      }),
      prisma.certification.findMany({
        where: {
          isActive: true,
          products: {
            some: {
              product: {
                isActive: true,
              },
            },
          },
        },
        include: {
          translations: {
            where: { locale },
          },
          _count: {
            select: {
              products: {
                where: {
                  product: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          coffeeTypes: coffeeTypes.map(item => ({
            value: item.coffeeType,
            count: item._count,
          })),
          grades: grades.map(item => ({
            value: item.grade,
            count: item._count,
          })),
          processingMethods: processingMethods.map(item => ({
            value: item.processing,
            count: item._count,
          })),
          origins: origins.map(item => ({
            value: item.origin,
            count: item._count,
          })),
          regions: regions.map(item => ({
            value: item.region,
            count: item._count,
          })),
          certifications: availableCertifications.map(cert => ({
            id: cert.id,
            name: cert.translations[0]?.name || cert.name,
            count: cert._count.products,
          })),
        },
      },
    });
  } catch (error) {
    // Error logging removed for production

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
