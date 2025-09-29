import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type Metadata } from 'next';
import { getServicePageBySlug, getServicePages } from '@/lib/contentlayer';
import { MDXContent } from '@/presentation/components/MDXContent';
import { SEOHead } from '@/presentation/components/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, Coffee, Factory, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';
import { 
  generateMetadata as generateSEOMetadata, 
  generateServiceSchema 
} from '@/shared/utils/seo-utils';

interface ServicePageProps {
  params: { locale: Locale; slug: string };
}

const serviceIcons = {
  'oem': Factory,
  'private-label': Package,
  'coffee-sourcing': Coffee,
  'logistics': Truck,
  'default': Package
};

export async function generateStaticParams() {
  const services = getServicePages('en');
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ 
  params: { locale, slug } 
}: ServicePageProps): Promise<Metadata> {
  const service = getServicePageBySlug(slug, locale);
  
  if (!service) {
    return generateSEOMetadata({
      title: 'Service Not Found',
      description: 'The requested service page could not be found.',
      noIndex: true,
      locale
    });
  }
  
  return generateSEOMetadata({
    title: service.title,
    description: service.description,
    keywords: service.features || [],
    locale,
    url: `/${locale}/services/${slug}`,
    type: 'service',
    image: service.image || '/images/services-default.jpg'
  });
}

export default function ServicePage({ params: { locale, slug } }: ServicePageProps) {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  
  const service = getServicePageBySlug(slug, locale);
  
  if (!service) {
    notFound();
  }

  const IconComponent = serviceIcons[service.slug as keyof typeof serviceIcons] || serviceIcons.default;
  const relatedServices = getServicePages(locale)
    .filter(s => s.slug !== slug && s.category === service.category)
    .slice(0, 3);

  // Generate structured data for the service
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description,
    serviceType: service.category || 'Coffee Export Service'
  });

  const breadcrumbs = [
    { name: 'Home', url: `/${locale}` },
    { name: 'Services', url: `/${locale}/services` },
    { name: service.title, url: `/${locale}/services/${slug}` }
  ];

  return (
    <>
      <SEOHead 
        structuredData={serviceSchema}
        breadcrumbs={breadcrumbs}
        locale={locale}
        includeOrganization={false}
      />
      <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link href={`/${locale}/services`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToServices')}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-100 rounded-2xl">
              <IconComponent className="h-16 w-16 text-amber-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {service.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {service.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {service.category && (
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {service.category}
              </span>
            )}
            {service.deliveryTime && (
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {service.deliveryTime}
              </div>
            )}
            {service.pricing && (
              <div className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4" />
                {service.pricing}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Features */}
        {service.features && service.features.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                {t('features')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {service.benefits && service.benefits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                {t('benefits')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('serviceInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {service.deliveryTime && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('deliveryTime')}</span>
                <span className="font-semibold">{service.deliveryTime}</span>
              </div>
            )}
            {service.pricing && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('pricing')}</span>
                <span className="font-semibold">{service.pricing}</span>
              </div>
            )}
            {service.category && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('category')}</span>
                <span className="font-semibold">{service.category}</span>
              </div>
            )}
            <div className="pt-4 border-t">
              <Link href={`/${locale}/contact`}>
                <Button className="w-full">
                  {t('requestQuote')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="prose prose-lg max-w-none">
          <MDXContent code={service.body.code} />
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            {t('relatedServices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((relatedService) => {
              const RelatedIcon = serviceIcons[relatedService.slug as keyof typeof serviceIcons] || serviceIcons.default;
              
              return (
                <Card key={relatedService.slug} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-amber-100 rounded-lg mr-3">
                        <RelatedIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <CardTitle className="text-lg">{relatedService.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {relatedService.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={relatedService.url}>
                      <Button variant="outline" size="sm" className="w-full">
                        {tCommon('learnMore')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('readyToStart')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('readyToStartDescription')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              {t('getQuote')}
            </Button>
          </Link>
          <Link href={`/${locale}/services`}>
            <Button variant="outline" size="lg">
              {t('viewAllServices')}
            </Button>
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}