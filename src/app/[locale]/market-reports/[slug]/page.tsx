import {
  CalendarDays,
  Clock,
  User,
  Tag,
  ArrowLeft,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { getRelatedContent } from '@/lib/contentlayer';
import { MDXContent } from '@/presentation/components/MDXContent';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { allMarketReports } from 'contentlayer/generated';

interface MarketReportPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return allMarketReports.map(report => ({
    slug: report.slug,
  }));
}

export default async function MarketReportPage({
  params,
}: MarketReportPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('marketReports');
  const tCommon = await getTranslations('common');

  const report = allMarketReports.find(
    report => report.slug === slug && report.locale === locale
  );

  if (!report) {
    notFound();
  }

  const relatedReports = getRelatedContent(
    locale,
    report.slug,
    report.tags || [],
    report.category,
    3
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link href={`/${locale}/market-reports`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToReports')}
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          {report.coverImage && (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={report.coverImage}
                alt={report.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <CalendarDays className="mr-1 h-4 w-4" />
                {new Date(report.publishedAt).toLocaleDateString(locale)}
              </div>
              {report.updatedAt && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Updated:{' '}
                  {new Date(report.updatedAt).toLocaleDateString(locale)}
                </div>
              )}
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                {report.author}
              </div>
              {report.readingTime && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {report.readingTime} min read
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold leading-tight text-gray-900">
              {report.title}
            </h1>

            <p className="text-xl leading-relaxed text-gray-600">
              {report.description}
            </p>

            {/* Tags */}
            {report.tags && report.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Report Metadata */}
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
              {report.reportType && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Report Type:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {report.reportType}
                  </span>
                </div>
              )}
              {report.dataSource && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Data Source:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {report.dataSource}
                  </span>
                </div>
              )}
              {report.targetMarkets && report.targetMarkets.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700">
                    Target Markets:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {report.targetMarkets.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg mb-12 max-w-none">
          <MDXContent code={report.body.code} />
        </div>

        {/* Author Bio */}
        {report.authorBio && (
          <div className="mb-12 border-t border-gray-200 pt-8">
            <div className="flex items-start space-x-4">
              {report.authorImage && (
                <div className="relative h-16 w-16">
                  <Image
                    src={report.authorImage}
                    alt={report.author}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{report.author}</h3>
                <p className="mt-1 text-gray-600">{report.authorBio}</p>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl">
          <h2 className="mb-8 flex items-center text-3xl font-semibold text-gray-900">
            <TrendingUp className="mr-3 h-8 w-8 text-amber-600" />
            {t('relatedReports')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedReports.map(relatedReport => (
              <Card
                key={relatedReport.slug}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {relatedReport.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {relatedReport.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={relatedReport.url}>
                    <Button variant="outline" size="sm" className="w-full">
                      {tCommon('readMore')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
