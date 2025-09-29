import { NextRequest, NextResponse } from 'next/server';
import { generateAllContentRSS } from '@/shared/utils/rss-utils';
import type { Locale } from '@/i18n';

export async function GET(request: NextRequest) {
  try {
    // Get locale from query params or default to 'en'
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') as Locale) || 'en';
    
    // Generate RSS feed
    const rssXML = generateAllContentRSS(locale);
    
    // Return RSS response with proper headers
    return new NextResponse(rssXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Enable static generation for better performance
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour