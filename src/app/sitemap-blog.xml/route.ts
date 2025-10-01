import { NextRequest, NextResponse } from 'next/server';
import { generateContentSitemap, SitemapGenerator } from '@/shared/utils/sitemap-generator';

/**
 * Generate and serve the blog-specific sitemap.xml
 * This includes all blog posts across all supported languages
 */
export async function GET(request: NextRequest) {
  try {
    // Generate blog-specific sitemap entries
    const entries = await generateContentSitemap('blog');

    // Create sitemap generator instance
    const generator = new SitemapGenerator();
    
    // Generate XML sitemap
    const xmlSitemap = generator.generateXMLSitemap(entries);

    // Return XML response with appropriate headers
    return new NextResponse(xmlSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // Cache for 30 minutes (blog updates more frequently)
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * Handle HEAD requests for sitemap validation
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  });
}