import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getLegalPageBySlug, getLegalPages } from '@/lib/contentlayer';
import { MDXContent } from '@/presentation/components/MDXContent';
import { Button } from '@/presentation/components/ui/button';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, Shield } from 'lucide-react';

interface LegalPageProps {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const pages = getLegalPages('en');
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default function LegalPage({ params: { locale, slug } }: LegalPageProps) {
  const t = useTranslations('legal');
  const tCommon = useTranslations('common');
  
  const page = getLegalPageBySlug(slug, locale);
  
  if (!page) {
    notFound();
  }

  const allLegalPages = getLegalPages(locale);
  const otherPages = allLegalPages.filter(p => p.slug !== slug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link href={`/${locale}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tCommon('backToHome')}
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {page.title}
              </h1>
              <div className="flex items-center text-gray-600 mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{t('lastUpdated')}: {new Date(page.publishedAt).toLocaleDateString(locale)}</span>
              </div>
            </div>
          </div>
          
          {page.description && (
            <p className="text-xl text-gray-600">
              {page.description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <MDXContent code={page.body.code} />
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {t('questions')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('questionsDescription')}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button>
              {t('contactUs')}
            </Button>
          </Link>
        </div>

        {/* Other Legal Pages */}
        {otherPages.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t('otherLegalPages')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherPages.map((otherPage) => (
                <Link 
                  key={otherPage.slug} 
                  href={otherPage.url}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {otherPage.title}
                  </h3>
                  {otherPage.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {otherPage.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <Calendar className="mr-1 h-3 w-3" />
                    {t('updated')} {new Date(otherPage.publishedAt).toLocaleDateString(locale)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}