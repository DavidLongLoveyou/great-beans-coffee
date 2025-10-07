import { NextRequest, NextResponse } from 'next/server';
import { pdfGenerationService } from '@/infrastructure/services/pdf-generation.service';
import { rfqRepository, coffeeProductRepository } from '@/infrastructure/database/repositories';

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
      return NextResponse.json(
        { error: 'RFQ not found' },
        { status: 404 }
      );
    }

    // For now, we'll use an empty array of products since RFQ doesn't contain specific product IDs
    // In a real implementation, you might want to fetch products based on the product requirements
    const validProducts: any[] = [];

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
    console.error('Error generating RFQ document PDF:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
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
    return NextResponse.json(
      { error: 'RFQ ID is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch RFQ data
    const rfq = await rfqRepository.findById(rfqId);
    if (!rfq) {
      return NextResponse.json(
        { error: 'RFQ not found' },
        { status: 404 }
      );
    }

    // For now, we'll use an empty array of products since RFQ doesn't contain specific product IDs
    // In a real implementation, you might want to fetch products based on the product requirements
    const validProducts: any[] = [];

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
    console.error('Error generating RFQ document PDF:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}