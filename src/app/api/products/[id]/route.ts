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

const UpdateProductSchema = z.object({
  sku: z.string().min(1).optional(),
  coffeeType: z.enum(['ROBUSTA', 'ARABICA', 'BLEND', 'SPECIALTY']).optional(),
  grade: z
    .enum(['GRADE_1', 'GRADE_2', 'GRADE_3', 'PREMIUM', 'SPECIALTY', 'CUSTOM'])
    .optional(),
  processing: z
    .enum(['NATURAL', 'WASHED', 'HONEY', 'WET_HULLED', 'SEMI_WASHED', 'MIXED'])
    .optional(),
  origin: z.string().min(1).optional(),
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
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  inStock: z.boolean().optional(),
  _updatedBy: z.string().min(1),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/products/[id] - Get single product with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const includeInventory = searchParams.get('includeInventory') === 'true';
    const includeQuality = searchParams.get('includeQuality') === 'true';

    const product = await prisma.coffeeProduct.findUnique({
      where: {
        id: resolvedParams.id,
        isActive: true,
      },
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
              include: {
                contacts: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
        specificationItems: {
          orderBy: { sortOrder: 'asc' },
        },
        pricingModels: {
          where: { isActive: true },
          include: {
            pricingModel: true,
          },
        },
        ...(includeInventory && {
          inventory: {
            orderBy: { lastUpdated: 'desc' },
          },
        }),
        ...(includeQuality && {
          qualityReports: {
            where: { status: 'APPROVED' },
            orderBy: { reportDate: 'desc' },
            take: 5,
            include: {
              supplier: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        }),
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const validatedData = UpdateProductSchema.parse(body);

    // Check if product exists
    const existingProduct = await prisma.coffeeProduct.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.coffeeProduct.update({
      where: { id: resolvedParams.id },
      data: convertUndefinedToNull({
        ...validatedData,
        updatedAt: new Date(),
      }),
      include: {
        translations: true,
        certifications: {
          include: {
            certification: true,
          },
        },
        suppliers: {
          include: {
            supplier: true,
          },
        },
        specificationItems: true,
        pricingModels: {
          include: {
            pricingModel: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
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
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Soft delete product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { updatedBy } = z
      .object({
        updatedBy: z.string().min(1),
      })
      .parse(body);

    // Check if product exists
    const existingProduct = await prisma.coffeeProduct.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    const deletedProduct = await prisma.coffeeProduct.update({
      where: { id: resolvedParams.id },
      data: {
        isActive: false,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        id: deletedProduct.id,
        isActive: deletedProduct.isActive,
      },
    });
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
        error: 'Failed to delete product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
