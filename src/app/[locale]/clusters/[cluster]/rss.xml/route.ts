import { NextRequest, NextResponse } from 'next/server';

import type { Locale } from '@/i18n';
import { generateContentClusterRSS } from '@/shared/utils/rss-utils';

// Valid cluster names
const validClusters = [
  'vietnam-robusta-suppliers',
  'specialty-arabica-sourcing',
  'private-label-coffee-manufacturing',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cluster: string; locale: string }> }
) {
  try {
    const { cluster, locale } = await params;

    // Validate cluster name
    if (!validClusters.includes(cluster)) {
      return new NextResponse('Invalid cluster name', { status: 404 });
    }

    // Generate content cluster RSS feed
    const rssXML = generateContentClusterRSS(cluster, locale as Locale);

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
    // eslint-disable-next-line no-console
    console.error('Error generating content cluster RSS feed:', error);
    return new NextResponse('Error generating content cluster RSS feed', {
      status: 500,
    });
  }
}

// Generate static params for valid clusters
export async function generateStaticParams() {
  return validClusters.map(cluster => ({
    cluster,
  }));
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour
