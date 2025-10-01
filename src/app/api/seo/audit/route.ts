import { NextRequest, NextResponse } from 'next/server';
import { seoAuditManager, generateSEOReport, type SEOAuditConfig } from '@/shared/utils/seo-audit';
import { advancedSEOManager } from '@/shared/utils/advanced-seo-manager';
import { headers } from 'next/headers';

// Rate limiting (simple in-memory store)
const auditRequests = new Map<string, number[]>();
const RATE_LIMIT = 10; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = auditRequests.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  auditRequests.set(ip, recentRequests);
  
  return false;
}

/**
 * POST /api/seo/audit
 * 
 * Perform SEO audit on a page or content
 * 
 * Body:
 * {
 *   url: string;
 *   content?: string;
 *   metadata?: Metadata;
 *   structuredData?: any[];
 *   config?: Partial<SEOAuditConfig>;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many audit requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { url, content, metadata, structuredData, config, format = 'json' } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Perform SEO audit
    const auditResult = await seoAuditManager.auditPage(
      url,
      metadata,
      content,
      structuredData
    );

    // Return different formats based on request
    if (format === 'report') {
      const report = generateSEOReport(auditResult);
      return new NextResponse(report, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="seo-audit-${new Date().toISOString().split('T')[0]}.md"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      audit: auditResult,
      timestamp: new Date().toISOString(),
      url,
    });

  } catch (error) {
    console.error('SEO audit error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to perform SEO audit',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo/audit?url=...
 * 
 * Quick SEO audit for a URL (limited functionality)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const format = searchParams.get('format') || 'json';

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many audit requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // For GET requests, we can only do basic audits without content
    const auditResult = await seoAuditManager.auditPage(url);

    if (format === 'report') {
      const report = generateSEOReport(auditResult);
      return new NextResponse(report, {
        headers: {
          'Content-Type': 'text/markdown',
        },
      });
    }

    return NextResponse.json({
      success: true,
      audit: auditResult,
      timestamp: new Date().toISOString(),
      url,
      note: 'Limited audit - provide content via POST for comprehensive analysis',
    });

  } catch (error) {
    console.error('SEO audit error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to perform SEO audit',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/seo/audit/batch
 * 
 * Batch SEO audit for multiple URLs
 */
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting (stricter for batch operations)
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many audit requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { urls, config } = body;

    // Validate input
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    if (urls.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 URLs allowed per batch' },
        { status: 400 }
      );
    }

    // Validate all URLs
    for (const url of urls) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { error: `Invalid URL format: ${url}` },
          { status: 400 }
        );
      }
    }

    // Perform batch audit
    const results = await Promise.allSettled(
      urls.map(async (url: string) => {
        const audit = await seoAuditManager.auditPage(url);
        return { url, audit };
      })
    );

    const successful = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    const failed = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result, index) => ({
        url: urls[index],
        error: result.reason?.message || 'Unknown error',
      }));

    // Calculate batch statistics
    const scores = successful.map(result => result.audit.score);
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    const totalIssues = successful.reduce(
      (sum, result) => sum + result.audit.issues.length, 
      0
    );

    return NextResponse.json({
      success: true,
      summary: {
        totalUrls: urls.length,
        successful: successful.length,
        failed: failed.length,
        averageScore: Math.round(averageScore),
        totalIssues,
      },
      results: successful,
      failures: failed,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Batch SEO audit error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to perform batch SEO audit',
      },
      { status: 500 }
    );
  }
}