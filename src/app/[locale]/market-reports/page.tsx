import { useTranslations } from 'next-intl';
import { getMarketReports, getFeaturedMarketReports } from '@/lib/contentlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { CalendarDays, TrendingUp, Globe } from 'lucide-react';

interface MarketReportsPageProps {
  params: { locale: Locale };
}

export default function MarketReportsPage({ params: { locale } }: MarketReportsPageProps) {
  const t = useTranslations('marketReports');
  const tCommon = useTranslations('common');
  
  const featuredReports = getFeaturedMarketReports(locale, 3);
  const allReports = getMarketReports(locale);
  const regularReports = allReports.filter(report => !report.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Featured Reports */}
      {featuredReports.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-amber-600" />
            {t('featured')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReports.map((report) => (
              <Card key={report.slug} className="hover:shadow-lg transition-shadow">
                {report.coverImage && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={report.coverImage} 
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    {new Date(report.publishedAt).toLocaleDateString(locale)}
                  </div>
                  <CardTitle className="line-clamp-2">{report.title}</CardTitle>
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
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          {t('allReports')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularReports.map((report) => (
            <Card key={report.slug} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    {new Date(report.publishedAt).toLocaleDateString(locale)}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
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
        <div className="text-center py-16">
          <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('noReports')}
          </h3>
          <p className="text-gray-600">
            {t('noReportsDescription')}
          </p>
        </div>
      )}
    </div>
  );
}