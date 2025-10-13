import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Utility function to convert undefined to null for Prisma compatibility
function convertUndefinedToNull<T extends Record<string, any>>(obj: T): any {
  const result: any = {};
  for (const key in obj) {
    if (obj[key] === undefined) {
      result[key] = null;
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

// Validation schemas
const ProductFilterSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  search: z.string().optional(),
  coffeeType: z.enum(['ROBUSTA', 'ARABICA', 'BLEND', 'SPECIALTY']).optional(),
  grade: z
    .enum(['GRADE_1', 'GRADE_2', 'GRADE_3', 'PREMIUM', 'SPECIALTY', 'CUSTOM'])
    .optional(),
  processing: z
    .enum(['NATURAL', 'WASHED', 'HONEY', 'WET_HULLED', 'SEMI_WASHED', 'MIXED'])
    .optional(),
  origin: z.string().optional(),
  region: z.string().optional(),
  minCuppingScore: z.string().optional(),
  maxCuppingScore: z.string().optional(),
  certifications: z.string().optional(), // Comma-separated certification IDs
  inStock: z.string().optional(),
  isFeatured: z.string().optional(),
  sortBy: z
    .enum(['name', 'cuppingScore', 'createdAt', 'updatedAt', 'origin'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  locale: z.string().optional().default('en'),
});

const CreateProductSchema = z.object({
  sku: z.string().min(1),
  coffeeType: z.enum(['ROBUSTA', 'ARABICA', 'BLEND', 'SPECIALTY']),
  grade: z.enum([
    'GRADE_1',
    'GRADE_2',
    'GRADE_3',
    'PREMIUM',
    'SPECIALTY',
    'CUSTOM',
  ]),
  processing: z.enum([
    'NATURAL',
    'WASHED',
    'HONEY',
    'WET_HULLED',
    'SEMI_WASHED',
    'MIXED',
  ]),
  origin: z.string().min(1),
  region: z.string().optional(),
  farm: z.string().optional(),
  altitude: z.string().optional(),
  harvestSeason: z.string().optional(),
  cuppingScore: z.number().min(0).max(100).optional(),
  moisture: z.string().optional(),
  screenSize: z.string().optional(),
  defectRate: z.string().optional(),
  leadTime: z.string().optional(),
  minimumOrder: z.string().optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  pricing: z.record(z.string(), z.any()).optional(),
  availability: z.record(z.string(), z.any()).optional(),
  originInfo: z.record(z.string(), z.any()).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  createdBy: z.string().min(1),
});

// GET /api/products - List products with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const {
      page,
      limit,
      search,
      coffeeType,
      grade,
      processing,
      origin,
      region,
      minCuppingScore,
      maxCuppingScore,
      certifications,
      inStock,
      isFeatured,
      sortBy,
      sortOrder,
      locale,
    } = ProductFilterSchema.parse(params);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        {
          translations: {
            some: {
              locale,
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tastingNotes: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
        { sku: { contains: search, mode: 'insensitive' } },
        { origin: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
        { farm: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (coffeeType) where.coffeeType = coffeeType;
    if (grade) where.grade = grade;
    if (processing) where.processing = processing;
    if (origin) where.origin = { contains: origin, mode: 'insensitive' };
    if (region) where.region = { contains: region, mode: 'insensitive' };
    if (inStock === 'true') where.inStock = true;
    if (isFeatured === 'true') where.isFeatured = true;

    // Cupping score range
    if (minCuppingScore || maxCuppingScore) {
      where.cuppingScore = {};
      if (minCuppingScore) where.cuppingScore.gte = parseFloat(minCuppingScore);
      if (maxCuppingScore) where.cuppingScore.lte = parseFloat(maxCuppingScore);
    }

    // Certifications filter
    if (certifications) {
      const certIds = certifications.split(',');
      where.certifications = {
        some: {
          certificationId: { in: certIds },
          isActive: true,
        },
      };
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === 'name') {
      orderBy.translations = {
        _count: 'desc',
      };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Execute query
    const [products, total] = await Promise.all([
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
          suppliers: {
            where: { isActive: true },
            include: {
              supplier: {
                select: {
                  id: true,
                  name: true,
                  country: true,
                  qualityRating: true,
                },
              },
            },
          },
          inventory: {
            select: {
              currentStock: true,
              availableStock: true,
              unit: true,
            },
          },
          pricingModels: {
            where: { isActive: true },
            include: {
              pricingModel: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  basePrice: true,
                  currency: true,
                  unit: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.coffeeProduct.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateProductSchema.parse(body);

    const product = await prisma.coffeeProduct.create({
      data: convertUndefinedToNull({
        ...validatedData,
        updatedBy: validatedData.createdBy,
      }),
      include: {
        translations: true,
        certifications: {
          include: {
            certification: true,
          },
        },
        // suppliers: {
        //   include: {
        //     supplier: true,
        //   },
        // },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
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
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
