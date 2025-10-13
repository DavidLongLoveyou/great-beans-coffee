import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { rfqRepository } from '../../../../../infrastructure/di/container';
import { CommunicationType } from '../../../../../shared/types/business.types';
import { createScopedLogger } from '../../../../../shared/utils/logger';

const logger = createScopedLogger('RFQ-Communications-API');

// Validation schema for adding communication
const addCommunicationSchema = z.object({
  type: z.nativeEnum(CommunicationType),
  subject: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  isInternal: z.boolean().default(false),
  createdBy: z.string().uuid('Invalid user ID'),
  attachments: z.array(z.string().url()).optional(),
});

/**
 * GET /api/rfq/[id]/communications - Get communication history for RFQ
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // API logging removed for production

    // Get communication history from repository
    const communications = await rfqRepository.getCommunicationHistory(id);

    // API logging removed for production

    return NextResponse.json({
      success: true,
      message: 'Communication history retrieved successfully',
      data: {
        rfqId: id,
        communications: communications.map(comm => ({
          id: comm.id,
          type: comm.type,
          subject: comm.subject,
          content: comm.content,
          isInternal: comm.isInternal,
          createdBy: comm.createdBy,
          createdAt: comm.createdAt,
          attachments: comm.attachments,
        })),
        total: communications.length,
      },
    });
  } catch (error) {
    // API error logging removed for production

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
 * POST /api/rfq/[id]/communications - Add new communication to RFQ
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = addCommunicationSchema.parse(body);

    // API logging removed for production

    // Add communication using repository
    const updatedRfq = await rfqRepository.addCommunication(id, {
      type: validatedData.type,
      subject: validatedData.subject,
      content: validatedData.content,
      isInternal: validatedData.isInternal,
      createdBy: validatedData.createdBy,
      attachments: validatedData.attachments,
    });

    // Get the newly added communication (last one in the array)
    const newCommunication = updatedRfq.communications?.slice(-1)[0];

    // API logging removed for production

    return NextResponse.json(
      {
        success: true,
        message: 'Communication added successfully',
        data: {
          rfqId: id,
          communication: newCommunication
            ? {
                id: newCommunication.id,
                type: newCommunication.type,
                subject: newCommunication.subject,
                content: newCommunication.content,
                isInternal: newCommunication.isInternal,
                createdBy: newCommunication.createdBy,
                createdAt: newCommunication.createdAt,
                attachments: newCommunication.attachments,
              }
            : null,
        },
      },
      { status: 201 }
    );
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
 * PATCH /api/rfq/[id]/communications - Mark communications as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { communicationId, readBy } = body;

    if (!communicationId || !readBy) {
      return NextResponse.json(
        {
          success: false,
          message: 'Communication ID and readBy are required',
        },
        { status: 400 }
      );
    }

    // API logging removed for production

    // Mark communication as read using repository
    await rfqRepository.markAsRead(id, communicationId, readBy);

    // API logging removed for production

    return NextResponse.json({
      success: true,
      message: 'Communication marked as read',
      data: {
        rfqId: id,
        communicationId,
        readBy,
        readAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // API error logging removed for production

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          message: 'RFQ or communication not found',
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
