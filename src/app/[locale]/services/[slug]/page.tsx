import {  ArrowLeft, Package, Truck, Coffee, Factory, CheckCircle, Clock, DollarSign, Users, Shield, FileText, Download, Star, Globe, Calendar, AlertCircle, Settings  } from '@/components/ui/dynamic-icons';
import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { CertificationType } from '@/data/product-catalog';
import {
  getServiceByCode,
  filterServices,
  VIETNAMESE_COFFEE_SERVICE_CATALOG,
  ServiceType,
  ServiceCategory,
} from '@/data/service-catalog';
import { type Locale } from '@/i18n';
import { SEOHead } from '@/presentation/components/seo';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { ServerButton } from '@/presentation/components/ui/server-button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { CertificationBadge } from '@/shared/components/design-system/Coffee';
import type { CoffeeCertification } from '@/shared/components/design-system/types';
import {
  generateMetadata as generateSEOMetadata,
  generateServiceSchema,
} from '@/shared/utils/seo-utils';

// Helper function to convert CertificationType enum to CoffeeCertification format
const mapCertificationToDesignSystem = (
  cert: CertificationType
): CoffeeCertification => {
  const certMap: Record<CertificationType, CoffeeCertification> = {
    [CertificationType.ORGANIC]: 'organic',
    [CertificationType.FAIR_TRADE]: 'fair-trade',
    [CertificationType.RAINFOREST_ALLIANCE]: 'rainforest-alliance',
    [CertificationType.UTZ]: 'utz',
    [CertificationType.UTZ_CERTIFIED]: 'utz',
    [CertificationType.C_CAFE_PRACTICES]: 'organic',
    [CertificationType.BIRD_FRIENDLY]: 'bird-friendly',
    [CertificationType.SHADE_GROWN]: 'shade-grown',
    [CertificationType.DIRECT_TRADE]: 'direct-trade',
    [CertificationType.ISO_22000]: 'iso-22000',
    [CertificationType.HACCP]: 'haccp',
    [CertificationType.BRC]: 'brc',
    [CertificationType.KOSHER]: 'organic',
    [CertificationType.HALAL]: 'organic',
  };
  return certMap[cert] || 'organic';
};

interface ServicePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

const serviceIcons = {
  [ServiceType.OEM]: Factory,
  [ServiceType.PRIVATE_LABEL]: Package,
  [ServiceType.SOURCING]: Coffee,
  [ServiceType.LOGISTICS]: Truck,
  [ServiceType.QUALITY_CONTROL]: Shield,
  [ServiceType.CONSULTING]: Settings,
  default: Package,
};

const serviceCategoryIcons = {
  [ServiceCategory.MANUFACTURING]: Factory,
  [ServiceCategory.BRANDING]: Package,
  [ServiceCategory.SUPPLY_CHAIN]: Coffee,
  [ServiceCategory.LOGISTICS]: Truck,
  [ServiceCategory.QUALITY_ASSURANCE]: Shield,
  [ServiceCategory.CONSULTING]: Settings,
  default: Package,
};

export async function generateStaticParams() {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.map(service => ({
    slug: service.serviceCode.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const serviceCode = slug.toUpperCase();
  const service = getServiceByCode(serviceCode);

  if (!service) {
    return generateSEOMetadata({
      title: 'Service Not Found',
      description: 'The requested service page could not be found.',
      noIndex: true,
      locale,
    });
  }

  const serviceName = service.name[locale] || service.name.en || '';
  const serviceDescription =
    service.shortDescription[locale] || service.shortDescription.en || '';
  const capabilities = service.capabilities.map(
    cap => cap.name[locale] || cap.name.en || ''
  );

  return generateSEOMetadata({
    title: `${serviceName} | Vietnamese Coffee B2B Services`,
    description: serviceDescription,
    keywords: [
      serviceName,
      service.type,
      service.category,
      'Vietnamese coffee',
      'B2B services',
      ...capabilities,
    ],
    locale,
    url: `/${locale}/services/${slug}`,
    type: 'service',
    image:
      service.images.find(img => img.isPrimary)?.url ||
      '/images/services-default.jpg',
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('services');
  const _tCommon = await getTranslations('common');

  const serviceCode = slug.toUpperCase();
  const service = getServiceByCode(serviceCode);

  if (!service) {
    notFound();
  }

  const serviceName = service.name[locale] || service.name.en || '';
  const serviceDescription =
    service.shortDescription[locale] || service.shortDescription.en || '';
  const serviceLongDescription =
    service.longDescription[locale] || service.longDescription.en;

  const IconComponent = serviceIcons[service.type] || serviceIcons.default;
  const CategoryIcon =
    serviceCategoryIcons[service.category] || serviceCategoryIcons.default;

  // Get related services by category
  const relatedServices = filterServices({
    category: [service.category],
  })
    .filter(s => s.id !== service.id)
    .slice(0, 3);

  // Generate structured data for the service
  const serviceSchema = generateServiceSchema({
    name: serviceName,
    description: serviceDescription,
    serviceType: service.category || 'Coffee Export Service',
  });

  const breadcrumbs = [
    { name: 'Home', url: `/${locale}` },
    { name: 'Services', url: `/${locale}/services` },
    { name: serviceName || 'Service', url: `/${locale}/services/${slug}` },
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
            <ServerButton variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToServices')}
            </ServerButton>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-2xl bg-amber-100 p-4">
                <IconComponent className="h-16 w-16 text-amber-600" />
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              {serviceName}
            </h1>

            <p className="mb-6 text-xl text-gray-600">{serviceDescription}</p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <Badge variant="secondary" className="flex items-center">
                <CategoryIcon className="mr-1 h-3 w-3" />
                {service.category}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {service.timeframe}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <DollarSign className="mr-1 h-3 w-3" />
                {service.pricing.model}
              </Badge>
              {service.isFeatured && (
                <Badge className="flex items-center bg-amber-500">
                  <Star className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Certifications */}
            {service.certifications.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {service.certifications.map((cert, index) => (
                  <CertificationBadge
                    key={`cert-${cert}-${index}`}
                    certification={mapCertificationToDesignSystem(cert)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Service Overview */}
        <div className="mb-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="mr-3 h-6 w-6 text-amber-600" />
                Service Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-gray-700">
                {serviceLongDescription}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="capabilities" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="capabilities" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {service.capabilities.map((capability, index) => (
                  <Card
                    key={`capability-${capability.name.en}-${index}`}
                    className="shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Settings className="mr-2 h-5 w-5 text-blue-600" />
                        {capability.name[locale] || capability.name.en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-gray-700">
                        {capability.description[locale] ||
                          capability.description.en}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Lead Time:
                          </span>
                          <Badge variant="outline">
                            {capability.leadTime} days
                          </Badge>
                        </div>

                        {capability.minimumOrder && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Min Order:
                            </span>
                            <Badge variant="outline">
                              {capability.minimumOrder.toLocaleString()}
                            </Badge>
                          </div>
                        )}

                        {capability.maximumCapacity && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Max Capacity:
                            </span>
                            <Badge variant="outline">
                              {capability.maximumCapacity.toLocaleString()}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {capability.specifications.length > 0 && (
                        <div className="mt-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            Specifications:
                          </h4>
                          <ul className="space-y-1">
                            {capability.specifications.map(
                              (spec, specIndex) => (
                                <li
                                  key={specIndex}
                                  className="flex items-start text-sm text-gray-700"
                                >
                                  <CheckCircle className="mr-2 mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
                                  {spec}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <DollarSign className="mr-2 h-6 w-6 text-green-600" />
                    Pricing Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pricing Model:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {service.pricing.model}
                        </Badge>
                      </div>

                      {service.pricing.basePrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Base Price:</span>
                          <span className="font-semibold">
                            {service.pricing.basePrice.toLocaleString()}{' '}
                            {service.pricing.currency}
                            {service.pricing.unit &&
                              ` / ${service.pricing.unit}`}
                          </span>
                        </div>
                      )}

                      {service.pricing.setupFee && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Setup Fee:</span>
                          <span className="font-semibold">
                            {service.pricing.setupFee.toLocaleString()}{' '}
                            {service.pricing.currency}
                          </span>
                        </div>
                      )}

                      {service.pricing.minimumOrder && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Minimum Order:</span>
                          <span className="font-semibold">
                            {service.pricing.minimumOrder.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {service.pricing.discountTiers &&
                      service.pricing.discountTiers.length > 0 && (
                        <div>
                          <h4 className="mb-3 font-semibold text-gray-900">
                            Volume Discounts:
                          </h4>
                          <div className="space-y-2">
                            {service.pricing.discountTiers.map(
                              (tier, index) => (
                                <div
                                  key={`tier-${tier.minQuantity}-${tier.discountPercent}-${index}`}
                                  className="flex items-center justify-between rounded bg-gray-50 p-2"
                                >
                                  <span className="text-sm text-gray-600">
                                    {tier.minQuantity.toLocaleString()}+ units
                                  </span>
                                  <Badge variant="outline">
                                    {tier.discountPercent}% off
                                  </Badge>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="mt-6 rounded-lg bg-amber-50 p-4">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
                      <span className="text-sm text-amber-800">
                        Prices valid until:{' '}
                        {service.pricing.priceValidUntil.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deliverables" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {service.deliverables.map((deliverable, index) => (
                  <Card
                    key={`deliverable-${deliverable.name.en}-${index}`}
                    className="shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Package className="mr-2 h-5 w-5 text-purple-600" />
                        {deliverable.name[locale] || deliverable.name.en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 text-gray-700">
                        {deliverable.description[locale] ||
                          deliverable.description.en}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Timeline:</span>
                        <Badge variant="outline" className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {deliverable.timeline} days
                        </Badge>
                      </div>

                      {deliverable.dependencies &&
                        deliverable.dependencies.length > 0 && (
                          <div className="mt-3">
                            <h5 className="mb-1 text-sm font-semibold text-gray-900">
                              Dependencies:
                            </h5>
                            <ul className="space-y-1">
                              {deliverable.dependencies.map((dep, depIndex) => (
                                <li
                                  key={depIndex}
                                  className="text-xs text-gray-600"
                                >
                                  • {dep}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {service.requirements.map((requirement, index) => (
                  <Card
                    key={`requirement-${requirement.name.en}-${index}`}
                    className="shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Shield className="mr-2 h-5 w-5 text-red-600" />
                        {requirement.name[locale] || requirement.name.en}
                        {requirement.isMandatory && (
                          <Badge className="ml-2 bg-red-100 text-red-800">
                            Required
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 text-gray-700">
                        {requirement.description[locale] ||
                          requirement.description.en}
                      </p>

                      <Badge variant="outline" className="text-xs">
                        {requirement.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Documents and Resources */}
        {service.documents.length > 0 && (
          <div className="mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <FileText className="mr-2 h-6 w-6 text-blue-600" />
                  Documents & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {service.documents.map((doc, index) => (
                    <div
                      key={`doc-${doc.name.en}-${doc.type}-${index}`}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center">
                        <Download className="mr-3 h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.name[locale] || doc.name.en}
                          </p>
                          <p className="text-sm text-gray-600">{doc.type}</p>
                        </div>
                      </div>
                      <ServerButton variant="outline" size="sm">
                        Download
                      </ServerButton>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Request Quote CTA */}
        <div className="mb-12">
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Ready to Get Started?
              </h2>
              <p className="mb-6 text-lg text-gray-700">
                Contact our team for a customized quote and detailed
                consultation.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={`/${locale}/contact?service=${service.serviceCode}`}
                >
                  <ServerButton size="lg" className="w-full sm:w-auto">
                    <Users className="mr-2 h-5 w-5" />
                    Request Quote
                  </ServerButton>
                </Link>
                <Link href={`/${locale}/contact?type=consultation`}>
                  <ServerButton
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </ServerButton>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="mb-8 text-3xl font-semibold text-gray-900">
              Related Services
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map(relatedService => {
                const relatedServiceName =
                  relatedService.name[locale] || relatedService.name.en;
                const relatedServiceDescription =
                  relatedService.shortDescription[locale] ||
                  relatedService.shortDescription.en;
                const RelatedIcon =
                  serviceIcons[relatedService.type] ||
                  serviceCategoryIcons[relatedService.category] ||
                  serviceIcons.default;

                return (
                  <Card
                    key={relatedService.serviceCode}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="mb-3 flex items-center">
                        <div className="mr-3 rounded-lg bg-amber-100 p-2">
                          <RelatedIcon className="h-6 w-6 text-amber-600" />
                        </div>
                        <CardTitle className="text-lg">
                          {relatedServiceName}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {relatedServiceDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {relatedService.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {relatedService.timeframe}
                        </Badge>
                        {relatedService.isFeatured && (
                          <Badge className="bg-amber-100 text-xs text-amber-800">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <Link
                        href={`/${locale}/services/${relatedService.serviceCode.toLowerCase()}`}
                      >
                        <ServerButton
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Learn More
                        </ServerButton>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Need More Information?
          </h2>
          <p className="mb-6 text-gray-600">
            Explore our complete range of coffee services and solutions.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}/contact`}>
              <ServerButton
                size="lg"
                className="bg-amber-600 hover:bg-amber-700"
              >
                Get Quote
              </ServerButton>
            </Link>
            <Link href={`/${locale}/services`}>
              <ServerButton variant="outline" size="lg">
                View All Services
              </ServerButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
