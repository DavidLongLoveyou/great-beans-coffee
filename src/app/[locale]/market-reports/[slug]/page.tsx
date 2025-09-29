import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { allMarketReports } from 'contentlayer/generated';
import { getRelatedContent } from '@/lib/contentlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { CalendarDays, Clock, User, Tag, ArrowLeft, TrendingUp } from 'lucide-react';
import { MDXContent } from '@/presentation/components/MDXContent';

interface MarketReportPageProps {
  params: { 
    locale: Locale;
    slug: string;
  };
}

export async function generateStaticParams() {
  return allMarketReports.map((report) => ({
    slug: report.slug,
  }));
}

export default function MarketReportPage({ params: { locale, slug } }: MarketReportPageProps) {
  const t = useTranslations('marketReports');
  const tCommon = useTranslations('common');
  
  const report = allMarketReports.find(
    (report) => report.slug === slug && report.locale === locale
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
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          {report.coverImage && (
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-6">
              <img 
                src={report.coverImage} 
                alt={report.title}
                className="w-full h-full object-cover"
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
                  Updated: {new Date(report.updatedAt).toLocaleDateString(locale)}
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

            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {report.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {report.description}
            </p>

            {/* Tags */}
            {report.tags && report.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Report Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {report.reportType && (
                <div>
                  <span className="font-semibold text-gray-700">Report Type:</span>
                  <span className="ml-2 text-gray-600">{report.reportType}</span>
                </div>
              )}
              {report.dataSource && (
                <div>
                  <span className="font-semibold text-gray-700">Data Source:</span>
                  <span className="ml-2 text-gray-600">{report.dataSource}</span>
                </div>
              )}
              {report.targetMarkets && report.targetMarkets.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700">Target Markets:</span>
                  <span className="ml-2 text-gray-600">
                    {report.targetMarkets.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <MDXContent code={report.body.code} />
        </div>

        {/* Author Bio */}
        {report.authorBio && (
          <div className="border-t border-gray-200 pt-8 mb-12">
            <div className="flex items-start space-x-4">
              {report.authorImage && (
                <img 
                  src={report.authorImage} 
                  alt={report.author}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{report.author}</h3>
                <p className="text-gray-600 mt-1">{report.authorBio}</p>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <section className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-amber-600" />
            {t('relatedReports')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedReports.map((relatedReport) => (
              <Card key={relatedReport.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{relatedReport.title}</CardTitle>
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