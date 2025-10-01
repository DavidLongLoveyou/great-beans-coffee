import { ArrowLeft, FileText, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { getLegalPageBySlug, getLegalPages } from '@/lib/contentlayer';
import { MDXContent } from '@/presentation/components/MDXContent';
import { Button } from '@/presentation/components/ui/button';

interface LegalPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const pages = getLegalPages('en');
  return pages.map(page => ({
    slug: page.slug,
  }));
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('legal');
  const tCommon = await getTranslations('common');

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

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-lg bg-blue-100 p-3">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{page.title}</h1>
              <div className="mt-2 flex items-center text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  {t('lastUpdated')}:{' '}
                  {new Date(page.publishedAt).toLocaleDateString(locale)}
                </span>
              </div>
            </div>
          </div>

          {page.description && (
            <p className="text-xl text-gray-600">{page.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg mb-12 max-w-none">
          <MDXContent code={page.body.code} />
        </div>

        {/* Contact Information */}
        <div className="mb-12 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
            <FileText className="mr-2 h-5 w-5" />
            {t('questions')}
          </h2>
          <p className="mb-4 text-gray-600">{t('questionsDescription')}</p>
          <Link href={`/${locale}/contact`}>
            <Button>{t('contactUs')}</Button>
          </Link>
        </div>

        {/* Other Legal Pages */}
        {otherPages.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              {t('otherLegalPages')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {otherPages.map(otherPage => (
                <Link
                  key={otherPage.slug}
                  href={otherPage.url}
                  className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {otherPage.title}
                  </h3>
                  {otherPage.description && (
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {otherPage.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    {t('updated')}{' '}
                    {new Date(otherPage.publishedAt).toLocaleDateString(locale)}
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
