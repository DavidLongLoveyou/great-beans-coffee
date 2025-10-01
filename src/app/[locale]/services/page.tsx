import { Package, Truck, Coffee, Factory, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { getServicePages } from '@/lib/contentlayer';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

interface ServicesPageProps {
  params: Promise<{ locale: Locale }>;
}

const serviceIcons = {
  oem: Factory,
  'private-label': Package,
  'coffee-sourcing': Coffee,
  logistics: Truck,
  default: Package,
};

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const t = await getTranslations('services');
  const tCommon = await getTranslations('common');

  const services = getServicePages(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Services Grid */}
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {services.map(service => {
          const IconComponent =
            serviceIcons[service.slug as keyof typeof serviceIcons] ||
            serviceIcons.default;

          return (
            <Card
              key={service.slug}
              className="group transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-4 flex items-center">
                  <div className="mr-4 rounded-lg bg-amber-100 p-3 transition-colors group-hover:bg-amber-200">
                    <IconComponent className="h-8 w-8 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="mb-2 text-xl">
                      {service.title}
                    </CardTitle>
                    {service.category && (
                      <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                        {service.category}
                      </span>
                    )}
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {service.features && service.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 font-semibold text-gray-900">
                      {t('keyFeatures')}
                    </h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map(feature => (
                        <li
                          key={`feature-${feature.slice(0, 30)}`}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {service.pricing && (
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">
                        {t('startingFrom')}:{' '}
                      </span>
                      {service.pricing}
                    </div>
                  )}
                  <Link href={service.url}>
                    <Button className="transition-colors group-hover:bg-amber-700">
                      {tCommon('learnMore')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {t('ctaTitle')}
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
          {t('ctaDescription')}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              {t('getQuote')}
            </Button>
          </Link>
          <Link href={`/${locale}/about`}>
            <Button variant="outline" size="lg">
              {t('learnAboutUs')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            {t('noServices')}
          </h3>
          <p className="text-gray-600">{t('noServicesDescription')}</p>
        </div>
      )}
    </div>
  );
}
