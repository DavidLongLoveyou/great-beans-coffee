import { useTranslations } from 'next-intl';
import { getServicePages } from '@/lib/contentlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { Package, Truck, Coffee, Factory, ArrowRight } from 'lucide-react';

interface ServicesPageProps {
  params: { locale: Locale };
}

const serviceIcons = {
  'oem': Factory,
  'private-label': Package,
  'coffee-sourcing': Coffee,
  'logistics': Truck,
  'default': Package
};

export default function ServicesPage({ params: { locale } }: ServicesPageProps) {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  
  const services = getServicePages(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {services.map((service) => {
          const IconComponent = serviceIcons[service.slug as keyof typeof serviceIcons] || serviceIcons.default;
          
          return (
            <Card key={service.slug} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-amber-100 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                    <IconComponent className="h-8 w-8 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    {service.category && (
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
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
                    <h4 className="font-semibold text-gray-900 mb-3">{t('keyFeatures')}</h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  {service.pricing && (
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{t('startingFrom')}: </span>
                      {service.pricing}
                    </div>
                  )}
                  <Link href={service.url}>
                    <Button className="group-hover:bg-amber-700 transition-colors">
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
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('ctaTitle')}
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          {t('ctaDescription')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        <div className="text-center py-16">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('noServices')}
          </h3>
          <p className="text-gray-600">
            {t('noServicesDescription')}
          </p>
        </div>
      )}
    </div>
  );
}