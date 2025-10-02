import { CalendarDays, TrendingUp, Globe } from 'lucide-react';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { getMarketReports, getFeaturedMarketReports } from '@/lib/contentlayer';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { generateMetadata as generateSEOMetadata } from '@/shared/utils/seo-utils';
import { generateMarketReportsCollectionSchema } from '@/shared/utils/structured-data-utils';

interface MarketReportsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: MarketReportsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Coffee Market Reports & Analysis';
  const description =
    'Comprehensive market reports and analysis on Vietnamese coffee exports, global coffee trends, price forecasts, and industry insights. Data-driven intelligence for coffee professionals and buyers.';

  const keywords = [
    'coffee market reports',
    'coffee market analysis',
    'vietnamese coffee market',
    'coffee price trends',
    'coffee export data',
    'global coffee market',
    'robusta market analysis',
    'arabica market trends',
    'coffee industry research',
    'coffee market intelligence',
    'coffee trade statistics',
    'coffee supply chain analysis',
  ];

  return generateSEOMetadata({
    title,
    description,
    keywords,
    locale,
    url: `/${locale}/market-reports`,
    type: 'website',
    image: '/images/market-reports-hero.jpg',
  });
}

export default async function MarketReportsPage({
  params,
}: MarketReportsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('marketReports');
  const tCommon = await getTranslations('common');

  const featuredReports = getFeaturedMarketReports(locale, 3);
  const allReports = getMarketReports(locale);
  const regularReports = allReports.filter(report => !report.featured);

  // Generate structured data for SEO
  const structuredData = generateMarketReportsCollectionSchema(
    allReports.map(report => ({
      slug: report.slug,
      title: report.title,
      description: report.description,
      publishedAt: report.publishedAt,
      author: report.author,
      ...(report.coverImage && { coverImage: report.coverImage }),
    })),
    locale
  );

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            {t('description')}
          </p>
        </div>

        {/* Featured Reports */}
        {featuredReports.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-8 flex items-center text-3xl font-semibold text-gray-900">
              <TrendingUp className="mr-3 h-8 w-8 text-amber-600" />
              {t('featured')}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredReports.map(report => (
                <Card
                  key={report.slug}
                  className="transition-shadow hover:shadow-lg"
                >
                  {report.coverImage && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                      <Image
                        src={report.coverImage}
                        alt={report.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {new Date(report.publishedAt).toLocaleDateString(locale)}
                    </div>
                    <CardTitle className="line-clamp-2">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Globe className="mr-1 h-4 w-4" />
                        {report.category}
                      </div>
                      <Link href={report.url}>
                        <Button variant="outline" size="sm">
                          {tCommon('readMore')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Reports */}
        <section>
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">
            {t('allReports')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {regularReports.map(report => (
              <Card
                key={report.slug}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {new Date(report.publishedAt).toLocaleDateString(locale)}
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {report.category}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{report.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {report.readingTime && `${report.readingTime} min read`}
                    </div>
                    <Link href={report.url}>
                      <Button variant="outline" size="sm">
                        {tCommon('readMore')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {allReports.length === 0 && (
          <div className="py-16 text-center">
            <TrendingUp className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {t('noReports')}
            </h3>
            <p className="text-gray-600">{t('noReportsDescription')}</p>
          </div>
        )}
      </div>
    </>
  );
}
