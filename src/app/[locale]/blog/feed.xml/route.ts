import { NextRequest, NextResponse } from 'next/server';

import { Locale, locales } from '@/shared/config/i18n';
import { generateBlogRSSFeed } from '@/shared/utils/rss-generator';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  // Validate locale
  if (!locales.includes(typedLocale)) {
    return new NextResponse('Invalid locale', { status: 404 });
  }

  try {
    const rssContent = await generateBlogRSSFeed(typedLocale);

    return new NextResponse(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating blog RSS feed:', error);
    return new NextResponse('Error generating blog RSS feed', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
