import { NextRequest, NextResponse } from 'next/server';
import { submitSitemapsToSearchEngines, sitemapSubmissionService } from '@/shared/utils/sitemap-submission';

/**
 * API route for manual sitemap submission to search engines
 * POST /api/sitemap/submit - Submit all sitemaps
 * GET /api/sitemap/submit - Check sitemap health
 */

export async function POST(request: NextRequest) {
  try {
    // Check for authorization (you might want to add API key validation here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - API key required' },
        { status: 401 }
      );
    }

    // Submit sitemaps to search engines
    const { submissions, healthChecks } = await submitSitemapsToSearchEngines();

    // Generate reports
    const submissionReport = sitemapSubmissionService.generateSubmissionReport(submissions);
    const healthReport = sitemapSubmissionService.generateHealthReport(healthChecks);

    return NextResponse.json({
      success: true,
      message: 'Sitemap submission completed',
      data: {
        submissions,
        healthChecks,
        reports: {
          submission: submissionReport,
          health: healthReport,
        },
      },
    });
  } catch (error) {
    console.error('Error submitting sitemaps:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check sitemap health without submitting
    const healthChecks = await sitemapSubmissionService.checkAllSitemapsHealth();
    const healthReport = sitemapSubmissionService.generateHealthReport(healthChecks);

    return NextResponse.json({
      success: true,
      message: 'Sitemap health check completed',
      data: {
        healthChecks,
        report: healthReport,
      },
    });
  } catch (error) {
    console.error('Error checking sitemap health:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}