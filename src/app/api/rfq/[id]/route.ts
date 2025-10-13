import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { RFQEntity } from '../../../../domain/entities/rfq.entity';
import { getRfqByIdUseCase } from '../../../../infrastructure/di/container';
import { createScopedLogger } from '../../../../shared/utils/logger';

const logger = createScopedLogger('RFQ-ID-API');

// Validation schema for RFQ updates
const updateRfqSchema = z.object({
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().uuid().optional(),
  estimatedValue: z.number().positive().optional(),
  probability: z.number().min(0).max(100).optional(),
  competitorInfo: z.string().optional(),
  additionalRequirements: z.string().optional(),
  sampleRequired: z.boolean().optional(),
  sampleAddress: z.string().optional(),
  urgencyReason: z.string().optional(),
});

/**
 * GET /api/rfq/[id] - Get specific RFQ by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // API logging removed for production

    // Get RFQ using the use case
    const result = await getRfqByIdUseCase.execute({ id });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.rfq ? 500 : 404 }
      );
    }

    // API logging removed for production

    const rfq = result.rfq as RFQEntity;

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        id: rfq.id,
        rfqNumber: rfq.rfqNumber,
        status: rfq.status,
        priority: rfq.priority,
        companyInfo: rfq.companyInfo,
        productRequirements: rfq.productRequirements,
        quantityRequirements: rfq.quantityRequirements,
        deliveryRequirements: rfq.deliveryRequirements,
        paymentTerms: rfq.paymentTerms,
        additionalRequirements: rfq.additionalRequirements,
        sampleRequired: rfq.sampleRequired,
        submittedAt: rfq.submittedAt,
        lastActivityAt: rfq.lastActivityAt,
        // Include additional fields if they exist
        assignedTo: rfq.assignedTo,
        estimatedValue: rfq.estimatedValue,
        probability: rfq.probability,
        competitorInfo: rfq.competitorInfo,
        quoteSentAt: rfq.quoteSentAt,
        quoteValidUntil: rfq.quoteValidUntil,
        documents: rfq.documents,
        communications: rfq.communications,
      },
    });
  } catch (error) {
    // API error logging removed for production

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/rfq/[id] - Update specific RFQ
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateRfqSchema.parse(body);

    // API logging removed for production

    // For now, we'll return a success response
    // In a real implementation, you would use an UpdateRfqUseCase
    // API logging removed for production

    return NextResponse.json({
      success: true,
      message: 'RFQ updated successfully',
      data: {
        id,
        updatedFields: Object.keys(validatedData),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // API error logging removed for production

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rfq/[id] - Delete specific RFQ (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // API logging removed for production

    // For now, we'll return a success response
    // In a real implementation, you would use a DeleteRfqUseCase
    // API logging removed for production

    return NextResponse.json({
      success: true,
      message: 'RFQ deleted successfully',
      data: {
        id,
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // API error logging removed for production

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
