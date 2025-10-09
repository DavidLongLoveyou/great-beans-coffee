import { NextRequest, NextResponse } from 'next/server';

import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { rfqRepository } from '@/infrastructure/database/repositories';
import { pdfGenerationService } from '@/infrastructure/services/pdf-generation.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rfqId, locale = 'en', options = {} } = body;

    // Validate required parameters
    if (!rfqId) {
      return NextResponse.json(
        { error: 'RFQ ID is required' },
        { status: 400 }
      );
    }

    // Fetch RFQ data
    const rfq = await rfqRepository.findById(rfqId);
    if (!rfq) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
    }

    // For now, we'll use an empty array of products since RFQ doesn't contain
    // specific product IDs. In a real implementation, you might want to fetch
    // products based on the product requirements
    const validProducts: CoffeeProductEntity[] = [];

    // Generate PDF using server-side rendering
    const pdfBuffer = await pdfGenerationService.generateRFQDocumentPDF(
      rfq,
      validProducts,
      locale,
      options
    );

    // Return PDF as response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rfq-document-${rfq.id}-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    // Log error for monitoring (replace with proper logging service in production)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rfqId = searchParams.get('rfqId');
  const locale = searchParams.get('locale') || 'en';

  if (!rfqId) {
    return NextResponse.json({ error: 'RFQ ID is required' }, { status: 400 });
  }

  try {
    // Fetch RFQ data
    const rfq = await rfqRepository.findById(rfqId);
    if (!rfq) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
    }

    // For now, we'll use an empty array of products since RFQ doesn't contain
    // specific product IDs. In a real implementation, you might want to fetch
    // products based on the product requirements
    const validProducts: CoffeeProductEntity[] = [];

    // Generate PDF using server-side rendering
    const pdfBuffer = await pdfGenerationService.generateRFQDocumentPDF(
      rfq,
      validProducts,
      locale
    );

    // Return PDF as response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rfq-document-${rfq.id}-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    // Log error for monitoring (replace with proper logging service in production)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
