import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  submitRfqUseCase,
  getRfqsUseCase,
} from '../../../infrastructure/di/container';
import { createScopedLogger } from '../../../shared/utils/logger';

const logger = createScopedLogger('RFQ-API');

// Validation schema for RFQ submission
const submitRfqSchema = z.object({
  // Product Requirements
  productType: z
    .array(z.string())
    .min(1, 'At least one product type is required'),
  grade: z.array(z.string()).min(1, 'At least one grade is required'),
  origin: z.array(z.string()).min(1, 'At least one origin is required'),
  processingMethod: z
    .array(z.string())
    .min(1, 'At least one processing method is required'),
  certifications: z.array(z.string()).default([]),

  // Quantity & Delivery
  quantity: z.number().positive('Quantity must be positive'),
  quantityUnit: z.string().min(1, 'Quantity unit is required'),
  deliveryTerms: z.string().min(1, 'Delivery terms are required'),
  targetPrice: z
    .number()
    .nonnegative('Target price must be non-negative')
    .default(0),
  currency: z.string().min(1, 'Currency is required'),
  deliveryDate: z.string().transform(str => new Date(str)),
  deliveryLocation: z.string().min(1, 'Delivery location is required'),

  // Recurring Order (optional)
  isRecurringOrder: z.boolean().default(false),
  recurringFrequency: z
    .enum(['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'])
    .optional()
    .or(z.undefined()),

  // Payment Terms
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  paymentMethod: z
    .array(z.string())
    .min(1, 'At least one payment method is required'),

  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  businessType: z.string().min(1, 'Business type is required'),

  // Additional Details (optional)
  additionalRequirements: z.string().optional().or(z.undefined()),
  sampleRequired: z.boolean().default(false),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),

  // Metadata (optional)
  locale: z.string().default('en'),
});

// Validation schema for RFQ listing
const getRfqsSchema = z.object({
  page: z
    .string()
    .optional()
    .or(z.undefined())
    .transform(val => Math.max(1, Number(val) || 1)),
  limit: z
    .string()
    .optional()
    .or(z.undefined())
    .transform(val => Math.min(100, Math.max(1, Number(val) || 10))),
  status: z.string().optional().or(z.undefined()),
  priority: z.string().optional().or(z.undefined()),
  companyName: z.string().optional().or(z.undefined()),
  dateFrom: z
    .string()
    .transform(str => (str ? new Date(str) : undefined))
    .optional()
    .or(z.undefined()),
  dateTo: z
    .string()
    .transform(str => (str ? new Date(str) : undefined))
    .optional()
    .or(z.undefined()),
  sortBy: z
    .enum(['submittedAt', 'updatedAt', 'priority', 'status'])
    .default('submittedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * POST /api/rfq - Submit a new RFQ
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = submitRfqSchema.parse(body);

    logger.info('Submitting RFQ', {
      companyName: validatedData.companyName,
      productType: validatedData.productType,
      quantity: validatedData.quantity,
    });

    // Submit RFQ using the use case
    const result = await submitRfqUseCase.execute(validatedData);

    logger.info('RFQ submitted successfully', {
      rfqNumber: result.rfqNumber,
      rfqId: result.rfq.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: {
          rfqNumber: result.rfqNumber,
          rfqId: result.rfq.id,
          status: result.rfq.status,
          submittedAt: result.rfq.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error submitting RFQ:', error);

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

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
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
 * GET /api/rfq - Get list of RFQs with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Convert search params to object
    const params = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validatedParams = getRfqsSchema.parse(params);

    logger.info('Fetching RFQs', validatedParams);

    // Get RFQs using the use case
    const result = await getRfqsUseCase.execute(validatedParams);

    logger.info('RFQs fetched successfully', {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        rfqs: result.rfqs.map(rfq => ({
          id: rfq.id,
          rfqNumber: rfq.rfqNumber,
          status: rfq.status,
          priority: rfq.priority,
          companyInfo: {
            companyName: rfq.companyInfo.companyName,
            contactPerson: rfq.companyInfo.contactPerson,
            email: rfq.companyInfo.email,
            country: rfq.companyInfo.address.country,
          },
          productRequirements: rfq.productRequirements,
          quantityRequirements: rfq.quantityRequirements,
          submittedAt: rfq.submittedAt,
          lastActivityAt: rfq.lastActivityAt,
        })),
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching RFQs:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid query parameters',
          errors: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
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
