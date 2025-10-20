import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Utility function to remove undefined fields for Prisma compatibility
function removeUndefinedFields<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

const BulkUpdateSchema = z.object({
  productIds: z.array(z.string()).min(1),
  updates: z.object({
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    inStock: z.boolean().optional(),
    coffeeType: z.enum(['ROBUSTA', 'ARABICA', 'BLEND', 'SPECIALTY']).optional(),
    grade: z
      .enum(['GRADE_1', 'GRADE_2', 'GRADE_3', 'PREMIUM', 'SPECIALTY', 'CUSTOM'])
      .optional(),
    processing: z
      .enum([
        'NATURAL',
        'WASHED',
        'HONEY',
        'WET_HULLED',
        'SEMI_WASHED',
        'MIXED',
      ])
      .optional(),
  }),
  updatedBy: z.string().min(1),
});

const BulkDeleteSchema = z.object({
  productIds: z.array(z.string()).min(1),
  updatedBy: z.string().min(1),
});

const PricingSchema = z.object({
  basePrice: z.number().positive().optional(),
  currency: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  bulkPricing: z
    .array(
      z.object({
        minQuantity: z.number().positive(),
        pricePerUnit: z.number().positive(),
      })
    )
    .optional(),
});

const BulkPricingUpdateSchema = z.object({
  productIds: z.array(z.string()).min(1),
  pricingUpdates: z.record(z.string(), PricingSchema),
  updatedBy: z.string().min(1),
});

const BulkInventorySyncSchema = z.object({
  productIds: z.array(z.string()),
  inventoryData: z.record(
    z.string(),
    z.object({
      quantity: z.number(),
      unit: z.string(),
      location: z.string().optional(),
      reservedQuantity: z.number().optional(),
    })
  ),
  updatedBy: z.string(),
});

const BulkCertificationUpdateSchema = z.object({
  productIds: z.array(z.string()),
  certificationIds: z.array(z.string()),
  action: z.enum(['add', 'remove']),
  updatedBy: z.string(),
});

// PUT /api/products/bulk - Bulk update products
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, updates, updatedBy } = BulkUpdateSchema.parse(body);

    // Verify all products exist
    const existingProducts = await prisma.coffeeProduct.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: { id: true },
    });

    const existingIds = existingProducts.map(p => p.id);
    const missingIds = productIds.filter(id => !existingIds.includes(id));

    if (missingIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some products not found',
          missingIds,
        },
        { status: 404 }
      );
    }

    // Filter out undefined values to satisfy exactOptionalPropertyTypes
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    // Perform bulk update
    const result = await prisma.coffeeProduct.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        ...filteredUpdates,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${result.count} products`,
      data: {
        updatedCount: result.count,
        productIds,
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
        error: 'Failed to bulk update products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/bulk - Bulk delete products (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, updatedBy } = BulkDeleteSchema.parse(body);

    // Verify all products exist
    const existingProducts = await prisma.coffeeProduct.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: { id: true },
    });

    const existingIds = existingProducts.map(p => p.id);
    const missingIds = productIds.filter(id => !existingIds.includes(id));

    if (missingIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some products not found',
          missingIds,
        },
        { status: 404 }
      );
    }

    // Perform bulk soft delete
    const result = await prisma.coffeeProduct.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        isActive: false,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} products`,
      data: {
        deletedCount: result.count,
        productIds,
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
        error: 'Failed to bulk delete products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/products/bulk - Bulk operations (pricing updates, inventory sync, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation } = body;

    switch (operation) {
      case 'updatePricing':
        return await handleBulkPricingUpdate(body);
      case 'syncInventory':
        return await handleBulkInventorySync(body);
      case 'updateCertifications':
        return await handleBulkCertificationUpdate(body);
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid operation',
            supportedOperations: [
              'updatePricing',
              'syncInventory',
              'updateCertifications',
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    // Error logging removed for production
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform bulk operation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleBulkPricingUpdate(
  body: z.infer<typeof BulkPricingUpdateSchema>
) {
  const { productIds, pricingUpdates, updatedBy } =
    BulkPricingUpdateSchema.parse(body);

  const results = await Promise.allSettled(
    productIds.map(async productId => {
      const pricing = pricingUpdates[productId];
      if (!pricing) return null;

      return await prisma.coffeeProduct.update({
        where: { id: productId },
        data: removeUndefinedFields({
          pricing,
          updatedBy,
          updatedAt: new Date(),
        }) as any,
      });
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return NextResponse.json({
    success: true,
    message: `Pricing update completed: ${successful} successful, ${failed} failed`,
    data: {
      successful,
      failed,
      total: productIds.length,
    },
  });
}

async function handleBulkInventorySync(
  body: z.infer<typeof BulkInventorySyncSchema>
) {
  const {
    productIds,
    inventoryData,
    updatedBy: _updatedBy,
  } = BulkInventorySyncSchema.parse(body);

  const results = await Promise.allSettled(
    productIds.map(async productId => {
      const inventory = inventoryData[productId];
      if (!inventory) return null;

      // Find existing inventory record
      const existingInventory = await prisma.productInventory.findFirst({
        where: { productId },
      });

      if (existingInventory) {
        // Update existing record
        return await prisma.productInventory.update({
          where: { id: existingInventory.id },
          data: removeUndefinedFields({
            ...inventory,
            lastUpdated: new Date(),
          }) as any,
        });
      } else {
        // Create new record
        return await prisma.productInventory.create({
          data: removeUndefinedFields({
            productId,
            ...inventory,
            lastUpdated: new Date(),
          }) as any,
        });
      }
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return NextResponse.json({
    success: true,
    message: `Inventory sync completed: ${successful} successful, ${failed} failed`,
    data: {
      successful,
      failed,
      total: productIds.length,
    },
  });
}

async function handleBulkCertificationUpdate(
  body: z.infer<typeof BulkCertificationUpdateSchema>
) {
  const {
    productIds,
    certificationIds,
    action,
    updatedBy: _updatedBy,
  } = BulkCertificationUpdateSchema.parse(body);

  const results = await Promise.allSettled(
    productIds.map(async productId => {
      if (action === 'add') {
        return await Promise.all(
          certificationIds.map(certId =>
            prisma.productCertification.upsert({
              where: {
                productId_certificationId: {
                  productId,
                  certificationId: certId,
                },
              },
              update: removeUndefinedFields({
                isActive: true,
              }) as any,
              create: removeUndefinedFields({
                productId,
                certificationId: certId,
                isActive: true,
              }) as any,
            })
          )
        );
      } else {
        return await prisma.productCertification.updateMany({
          where: {
            productId,
            certificationId: {
              in: certificationIds,
            },
          },
          data: {
            isActive: false,
          },
        });
      }
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return NextResponse.json({
    success: true,
    message: `Certification update completed: ${successful} successful, ${failed} failed`,
    data: {
      successful,
      failed,
      total: productIds.length,
    },
  });
}
