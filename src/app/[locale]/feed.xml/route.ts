import { NextRequest, NextResponse } from 'next/server';

import { Locale, locales } from '@/shared/config/i18n';
import { createScopedLogger } from '@/shared/utils/logger';
import { generateAllContentRSSFeed } from '@/shared/utils/rss-generator';

const logger = createScopedLogger('LocaleRSSFeedAPI');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  // Validate locale
  if (!locales.includes(typedLocale)) {
    return new NextResponse('Invalid locale', { status: 404 });
  }

  try {
    const rssContent = await generateAllContentRSSFeed(typedLocale);

    return new NextResponse(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    logger.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
