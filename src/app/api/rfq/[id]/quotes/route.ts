import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { rfqRepository } from '../../../../../infrastructure/di/container';
import { createScopedLogger } from '../../../../../shared/utils/logger';

const logger = createScopedLogger('RFQ-Quotes-API');

// Validation schema for creating a quote
const createQuoteSchema = z.object({
  version: z.string().default('1.0'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  validUntil: z.string().transform(str => new Date(str)),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        description: z.string().min(1, 'Description is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unit: z.string().min(1, 'Unit is required'),
        unitPrice: z.number().positive('Unit price must be positive'),
        totalPrice: z.number().positive('Total price must be positive'),
        specifications: z.record(z.string(), z.any()).optional(),
      })
    )
    .min(1, 'At least one item is required'),
  shipping: z.object({
    method: z.string().min(1, 'Shipping method is required'),
    cost: z.number().nonnegative('Shipping cost cannot be negative'),
    estimatedDays: z.number().positive('Estimated days must be positive'),
    incoterms: z.string().min(1, 'Incoterms are required'),
  }),
  paymentTerms: z.object({
    method: z.string().min(1, 'Payment method is required'),
    terms: z.string().min(1, 'Payment terms are required'),
    advancePercentage: z.number().min(0).max(100).optional(),
  }),
  notes: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
  createdBy: z.string().uuid('Invalid user ID'),
});

// Validation schema for updating quote status
const updateQuoteStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']),
  notes: z.string().optional(),
  updatedBy: z.string().uuid('Invalid user ID'),
});

/**
 * GET /api/rfq/[id]/quotes - Get all quotes for an RFQ
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.info('Fetching quotes for RFQ', { rfqId: id });

    // Get quotes from repository
    const quotes = await rfqRepository.getQuotes(id);

    logger.info('RFQ quotes fetched successfully', {
      rfqId: id,
      quoteCount: quotes.length,
    });

    return NextResponse.json({
      success: true,
      message: 'Quotes retrieved successfully',
      data: {
        rfqId: id,
        quotes: quotes.map(quote => ({
          id: quote.id,
          version: quote.version,
          status: quote.status,
          currency: quote.currency,
          totalAmount: quote.totalAmount,
          validUntil: quote.validUntil,
          createdAt: quote.createdAt,
          createdBy: quote.createdBy,
          items: quote.items,
          shipping: quote.shipping,
          paymentTerms: quote.paymentTerms,
          notes: quote.notes,
          attachments: quote.attachments,
        })),
        total: quotes.length,
      },
    });
  } catch (error) {
    logger.error('Error fetching RFQ quotes:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          message: 'RFQ not found',
        },
        { status: 404 }
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
 * POST /api/rfq/[id]/quotes - Create a new quote for an RFQ
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = createQuoteSchema.parse(body);

    // Calculate total amount
    const totalAmount =
      validatedData.items.reduce((sum, item) => sum + item.totalPrice, 0) +
      validatedData.shipping.cost;

    logger.info('Creating quote for RFQ', {
      rfqId: id,
      totalAmount,
      currency: validatedData.currency,
    });

    // Create quote using repository
    const quote = await rfqRepository.createQuote(id, {
      rfqId: id,
      version: validatedData.version,
      status: 'DRAFT' as const,
      currency: validatedData.currency,
      totalAmount,
      validUntil: validatedData.validUntil,
      items: validatedData.items,
      shipping: validatedData.shipping,
      paymentTerms: validatedData.paymentTerms,
      notes: validatedData.notes,
      attachments: validatedData.attachments,
      createdBy: validatedData.createdBy,
    });

    logger.info('Quote created successfully', {
      rfqId: id,
      quoteId: quote.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Quote created successfully',
        data: {
          rfqId: id,
          quote: {
            id: quote.id,
            version: quote.version,
            status: quote.status,
            currency: quote.currency,
            totalAmount: quote.totalAmount,
            validUntil: quote.validUntil,
            createdAt: quote.createdAt,
            createdBy: quote.createdBy,
            items: quote.items,
            shipping: quote.shipping,
            paymentTerms: quote.paymentTerms,
            notes: quote.notes,
            attachments: quote.attachments,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error creating quote for RFQ:', error);

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

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          message: 'RFQ not found',
        },
        { status: 404 }
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
 * PATCH /api/rfq/[id]/quotes - Update quote status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateQuoteStatusSchema.parse(body);
    const { quoteId } = body;

    if (!quoteId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote ID is required',
        },
        { status: 400 }
      );
    }

    logger.info('Updating quote status', {
      rfqId: id,
      quoteId,
      newStatus: validatedData.status,
    });

    // Update quote status using repository
    const updatedQuote = await rfqRepository.updateQuoteStatus(
      id,
      quoteId,
      validatedData.status,
      validatedData.notes,
      validatedData.updatedBy
    );

    logger.info('Quote status updated successfully', {
      rfqId: id,
      quoteId,
      status: validatedData.status,
    });

    return NextResponse.json({
      success: true,
      message: 'Quote status updated successfully',
      data: {
        rfqId: id,
        quote: {
          id: updatedQuote.id,
          status: updatedQuote.status,
          updatedAt: updatedQuote.updatedAt,
          updatedBy: updatedQuote.updatedBy,
        },
      },
    });
  } catch (error) {
    logger.error('Error updating quote status:', error);

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

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          message: 'RFQ or quote not found',
        },
        { status: 404 }
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
