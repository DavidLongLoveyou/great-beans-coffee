import { NextRequest, NextResponse } from 'next/server';
import { pdfGenerationService } from '@/infrastructure/services/pdf-generation.service';
import { coffeeProductRepository } from '@/infrastructure/database/repositories';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, locale = 'en', options = {} } = body;

    // Validate required parameters
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch product data
    const product = await coffeeProductRepository.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate PDF using server-side rendering
    const pdfBuffer = await pdfGenerationService.generateProductSpecPDF(
      product,
      locale,
      options
    );

    // Return PDF as response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="product-spec-${(product.name[locale as keyof typeof product.name] || product.name.en).replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating product spec PDF:', error);
    
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
  const productId = searchParams.get('productId');
  const locale = searchParams.get('locale') || 'en';

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch product data
    const product = await coffeeProductRepository.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate PDF using server-side rendering
    const pdfBuffer = await pdfGenerationService.generateProductSpecPDF(
      product,
      locale
    );

    // Return PDF as response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="product-spec-${(product.name[locale as keyof typeof product.name] || product.name.en).replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating product spec PDF:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}