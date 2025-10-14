import { NextRequest, NextResponse } from 'next/server';

import { siteConfig } from '@/shared/config/site';
import { createScopedLogger } from '@/shared/utils/logger';

const _logger = createScopedLogger('SitemapIndex');

/**
 * Generate and serve the sitemap index file
 * This references all individual sitemaps for better organization
 */
export async function GET(_request: NextRequest) {
  try {
    const baseUrl = siteConfig.url;
    const currentDate = new Date().toISOString();

    // Generate sitemap index XML
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    // Return XML response with appropriate headers
    return new NextResponse(sitemapIndex, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    // API error logging removed for production

    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * Handle HEAD requests for sitemap index validation
 */
export async function HEAD(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
