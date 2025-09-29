import { NextRequest, NextResponse } from 'next/server';
import { generateContentClusterRSS } from '@/shared/utils/rss-utils';
import type { Locale } from '@/i18n';

// Valid cluster names
const validClusters = [
  'vietnam-robusta-suppliers',
  'specialty-arabica-sourcing',
  'private-label-coffee-manufacturing',
];

export async function GET(
  request: NextRequest,
  { params }: { params: { cluster: string } }
) {
  try {
    const { cluster } = params;
    
    // Validate cluster name
    if (!validClusters.includes(cluster)) {
      return new NextResponse('Invalid cluster name', { status: 404 });
    }
    
    // Get locale from query params or default to 'en'
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') as Locale) || 'en';
    
    // Generate content cluster RSS feed
    const rssXML = generateContentClusterRSS(cluster, locale);
    
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
    console.error('Error generating content cluster RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Generate static params for valid clusters
export async function generateStaticParams() {
  return validClusters.map((cluster) => ({
    cluster,
  }));
}

// Enable static generation for better performance
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour