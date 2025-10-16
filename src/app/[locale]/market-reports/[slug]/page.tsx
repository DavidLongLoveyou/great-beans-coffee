import {  CalendarDays, Clock, User, Tag, ArrowLeft, TrendingUp  } from '@/components/ui/dynamic-icons';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import FileContentLoader from '@/lib/content-file-loader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { ServerButton } from '@/presentation/components/ui/server-button';

interface MarketReportPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const reports = await FileContentLoader.getMarketReports('en');
  return reports.map(report => ({
    slug: report.slug,
  }));
}

export default async function MarketReportPage({
  params,
}: MarketReportPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('marketReports');
  const tCommon = await getTranslations('common');

  const report = await FileContentLoader.getMarketReportBySlug(slug, locale);

  if (!report) {
    notFound();
  }

  const allReports = await FileContentLoader.getMarketReports(locale);
  const relatedReports = allReports
    .filter(r => r.slug !== report.slug)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link href={`/${locale}/market-reports`}>
          <ServerButton variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToReports')}
          </ServerButton>
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
              {report.category && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Category:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {report.category}
                  </span>
                </div>
              )}
              {report.tags && report.tags.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700">
                    Tags:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {report.tags.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg mb-12 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: report.content }} />
        </div>

        {/* Author */}
        {report.author && (
          <div className="mb-12 border-t border-gray-200 pt-8">
            <div className="flex items-start space-x-4">
              <div>
                <h3 className="font-semibold text-gray-900">{report.author}</h3>
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
                  <Link href={`/${locale}/market-reports/${relatedReport.slug}`}>
                    <ServerButton
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {tCommon('readMore')}
                    </ServerButton>
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
