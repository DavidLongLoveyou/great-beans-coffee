import { ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';
import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { MarketInfo } from '@/presentation/components/features/MarketInfo';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { SEOHead } from '@/presentation/components/seo/SEOHead';
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema } from '@/shared/utils/seo-utils';

interface MarketInfoPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params,
}: MarketInfoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketInfo' });

  return generateSEOMetadata({
    title: t('title', { default: 'Market Information - Coffee Export Data' }),
    description: t('description', {
      default: 'Comprehensive market-specific information for coffee export operations, including currency, shipping details, certifications, and business requirements.'
    }),
    locale,
    url: '/market-info',
    type: 'website',
  });
}

export default async function MarketInfoPage({ params }: MarketInfoPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketInfo' });

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title', { default: 'Market Information - Coffee Export Data' }),
    description: t('description', {
      default: 'Comprehensive market-specific information for coffee export operations, including currency, shipping details, certifications, and business requirements.'
    }),
    url: `https://thegreatbeans.com/${locale}/market-info`,
    mainEntity: {
      '@type': 'Dataset',
      name: 'Coffee Export Market Information',
      description: 'Market-specific data for international coffee export operations',
      keywords: ['coffee export', 'market information', 'shipping data', 'certifications', 'business requirements'],
      provider: organizationSchema,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://thegreatbeans.com/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Market Information',
          item: `https://thegreatbeans.com/${locale}/market-info`,
        },
      ],
    },
  };

  const structuredData = [organizationSchema, webPageSchema];

  return (
    <>
      <SEOHead structuredData={structuredData} />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <Globe className="mr-3 h-8 w-8 text-amber-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Market Information
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Comprehensive market-specific information for coffee export
              operations, including currency, shipping details, certifications,
              and business requirements.
            </p>
          </div>
        </div>

        {/* Market Info Component */}
        <MarketInfo
          showPorts={true}
          showCertifications={true}
          showPaymentTerms={true}
          className="mb-8"
        />

        {/* Additional Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Market Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">
                Our market configuration system provides localized information
                for each supported region, ensuring that our B2B coffee export
                operations are tailored to local requirements and preferences.
              </p>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Key Features:
              </h3>
              <ul className="mb-6 list-inside list-disc space-y-2 text-gray-700">
                <li>
                  <strong>Currency & Pricing:</strong> Local currency formatting
                  and pricing display
                </li>
                <li>
                  <strong>Shipping Information:</strong> Major ports, transit
                  times, and preferred Incoterms
                </li>
                <li>
                  <strong>Business Hours:</strong> Local timezone and operating
                  hours
                </li>
                <li>
                  <strong>Quality Standards:</strong> Market-specific coffee
                  grading systems
                </li>
                <li>
                  <strong>Payment Terms:</strong> Preferred payment methods and
                  standard terms
                </li>
                <li>
                  <strong>Certifications:</strong> Required, preferred, and
                  optional certifications
                </li>
              </ul>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Supported Markets:
              </h3>
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇺🇸</div>
                  <div className="text-sm font-medium">United States</div>
                  <div className="text-xs text-gray-500">USD, EST/EDT</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇩🇪</div>
                  <div className="text-sm font-medium">Germany</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇯🇵</div>
                  <div className="text-sm font-medium">Japan</div>
                  <div className="text-xs text-gray-500">JPY, JST</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇫🇷</div>
                  <div className="text-sm font-medium">France</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇮🇹</div>
                  <div className="text-sm font-medium">Italy</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇪🇸</div>
                  <div className="text-sm font-medium">Spain</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇳🇱</div>
                  <div className="text-sm font-medium">Netherlands</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-2xl">🇰🇷</div>
                  <div className="text-sm font-medium">South Korea</div>
                  <div className="text-xs text-gray-500">KRW, KST</div>
                </div>
              </div>

              <p className="text-gray-700">
                This information is automatically updated based on your selected
                locale and helps ensure compliance with local regulations and
                business practices.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
