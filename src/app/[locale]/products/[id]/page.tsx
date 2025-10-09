import {
  Coffee,
  MapPin,
  Package,
  Download,
  ShoppingCart,
  Star,
  Award,
  Thermometer,
  Scale,
  Clock,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
  FileText,
  Globe,
  Truck,
  Shield,
  Factory,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  BarChart3,
  BookOpen,
  HardDrive,
} from 'lucide-react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { type Locale } from '@/i18n';
import { SEOHead } from '@/presentation/components/seo/SEOHead';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/presentation/components/ui/card';
import { ServerButton } from '@/presentation/components/ui/server-button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { CoffeeButton } from '@/shared/components/design-system/Button';
import { ProductCard } from '@/shared/components/design-system/Card';
import {
  CertificationBadge,
  CoffeeGradeIndicator,
  OriginFlag,
  ProcessingMethodBadge,
  TastingNotes,
  EnhancedRelatedProducts,
} from '@/shared/components/design-system/Coffee';
import { EnhancedCertificationBadge } from '@/shared/components/design-system/Coffee/EnhancedCertificationBadge';
import {
  ContentSection,
  ContentContainer,
  ProductGrid,
} from '@/shared/components/design-system/Layout';
import {
  CoffeeHeading,
  SectionHeading,
} from '@/shared/components/design-system/Typography/Heading';
import { generateB2BProductSchema } from '@/shared/utils/enhanced-structured-data';
import { LogisticsCostEstimator } from '@/components/ui/LogisticsCostEstimator';
import { BulkPricingCalculator } from '@/components/ui/BulkPricingCalculator';
import {
  generateMetadata as generateSEOMetadata,
  generateOrganizationSchema,
} from '@/shared/utils/seo-utils';
import { ProductSpecDownloadButton } from '@/shared/components/pdf';
import {
  getProductById,
  searchProducts,
  filterProducts,
  type CatalogProduct,
  CoffeeType,
  CoffeeGrade,
  ProcessingMethod,
  CertificationType,
} from '@/data/product-catalog';

interface ProductDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  // Get product data from catalog
  const product = getProductById(id);

  if (!product) {
    return generateSEOMetadata({
      title: 'Product Not Found - The Great Beans',
      description: 'The requested coffee product could not be found.',
      locale,
      url: `/products/${id}`,
      type: 'product',
    });
  }

  const productName = product.name[locale] || product.name.en;
  const productDescription =
    product.description[locale] || product.description.en;
  const originInfo = `${product.origin.region}, ${product.origin.country}`;

  // Enhanced SEO keywords based on product attributes
  const keywords = [
    productName,
    product.type.toLowerCase(),
    product.grade.toLowerCase().replace('_', ' '),
    product.processingMethod.toLowerCase(),
    'vietnamese coffee',
    'coffee beans',
    'wholesale coffee',
    'b2b coffee',
    originInfo.toLowerCase(),
    ...product.certifications
      .map(cert => cert?.toLowerCase().replace('_', ' '))
      .filter((cert): cert is string => Boolean(cert)),
  ].filter((keyword): keyword is string => Boolean(keyword));

  return generateSEOMetadata({
    title: `${productName} - Premium Vietnamese Coffee | The Great Beans`,
    description: `${productDescription} | ${originInfo} | ${product.type} ${product.grade} | Wholesale & B2B Coffee Supply`,
    locale,
    url: `/products/${id}`,
    type: 'product',
    keywords,
    image:
      product.images.find(img => img.isPrimary)?.url ||
      product.images[0]?.url ||
      '/images/logo.svg',
  });
}

// Helper function to map certification types to design system
const mapCertificationToDesignSystem = (cert: CertificationType) => {
  const certMap = {
    [CertificationType.ORGANIC]: { variant: 'organic' as const, icon: '🌱' },
    [CertificationType.FAIR_TRADE]: {
      variant: 'fairtrade' as const,
      icon: '🤝',
    },
    [CertificationType.RAINFOREST_ALLIANCE]: {
      variant: 'rainforest' as const,
      icon: '🌳',
    },
    [CertificationType.UTZ]: { variant: 'utz' as const, icon: '✓' },
    [CertificationType.UTZ_CERTIFIED]: { variant: 'utz' as const, icon: '✓' },
    [CertificationType.C_CAFE_PRACTICES]: {
      variant: 'default' as const,
      icon: '☕',
    },
    [CertificationType.ISO_22000]: { variant: 'iso' as const, icon: '🛡️' },
    [CertificationType.HACCP]: { variant: 'haccp' as const, icon: '🔬' },
    [CertificationType.BRC]: { variant: 'brc' as const, icon: '📋' },
    [CertificationType.BIRD_FRIENDLY]: {
      variant: 'bird-friendly' as const,
      icon: '🐦',
    },
    [CertificationType.SHADE_GROWN]: {
      variant: 'shade-grown' as const,
      icon: '🌿',
    },
    [CertificationType.DIRECT_TRADE]: {
      variant: 'direct-trade' as const,
      icon: '🤝',
    },
    [CertificationType.KOSHER]: { variant: 'default' as const, icon: '✡️' },
    [CertificationType.HALAL]: { variant: 'default' as const, icon: '☪️' },
  };
  return certMap[cert] || { variant: 'default' as const, icon: '✓' };
};

// Helper function to convert CertificationType enum to CoffeeCertification format
const mapCertificationToEnhanced = (cert: CertificationType): string => {
  const certMap = {
    [CertificationType.ORGANIC]: 'organic',
    [CertificationType.FAIR_TRADE]: 'fair-trade',
    [CertificationType.RAINFOREST_ALLIANCE]: 'rainforest-alliance',
    [CertificationType.UTZ]: 'utz',
    [CertificationType.UTZ_CERTIFIED]: 'utz',
    [CertificationType.C_CAFE_PRACTICES]: 'organic',
    [CertificationType.BIRD_FRIENDLY]: 'bird-friendly',
    [CertificationType.SHADE_GROWN]: 'shade-grown',
    [CertificationType.DIRECT_TRADE]: 'direct-trade',
    [CertificationType.ISO_22000]: 'iso',
    [CertificationType.HACCP]: 'haccp',
    [CertificationType.BRC]: 'brc',
    [CertificationType.KOSHER]: 'organic',
    [CertificationType.HALAL]: 'organic',
  };
  return certMap[cert] || 'organic';
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations('products');

  // Get product data from catalog
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  // Get related products for recommendations
  const relatedProducts = filterProducts({
    type: [product.type],
  })
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const productSchema = generateB2BProductSchema(
    {
      id: product.id,
      name: product.name[locale] || product.name.en || '',
      description:
        product.shortDescription[locale] || product.shortDescription.en || '',
      images: product.images.map(img => img.url),
      category: product.type,
      sku: product.sku,
      origin: `${product.origin.region}, ${product.origin.country}`,
      certifications: product.certifications.map(cert => ({
        name: cert,
        identifier: `${cert}-${product.id}`,
        issuer: 'The Great Beans',
      })),
      minOrderQuantity: product.pricing.minimumOrder * 1000, // Convert MT to kg
      unitOfMeasure: 'kg',
      leadTime: {
        min: product.availability.leadTime,
        max: product.availability.leadTime + 7,
      },
      targetMarkets: ['Global'],
      incoterms: [product.pricing.incoterms],
    },
    locale
  );

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
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
        name: 'Products',
        item: `https://thegreatbeans.com/${locale}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name[locale] || product.name.en,
        item: `https://thegreatbeans.com/${locale}/products/${id}`,
      },
    ],
  };

  const structuredData = [organizationSchema, productSchema, breadcrumbSchema];

  return (
    <>
      <SEOHead structuredData={structuredData} />
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-coffee-200 bg-coffee-50">
          <ContentContainer className="py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link
                href={`/${locale}`}
                className="text-coffee-600 hover:text-coffee-800"
              >
                Home
              </Link>
              <span className="text-coffee-400">/</span>
              <Link
                href={`/${locale}/products`}
                className="text-coffee-600 hover:text-coffee-800"
              >
                Products
              </Link>
              <span className="text-coffee-400">/</span>
              <span className="font-medium text-coffee-900">
                {product.name[locale] || product.name.en}
              </span>
            </div>
          </ContentContainer>
        </div>

        <ContentSection className="py-8">
          <ContentContainer>
            {/* Back Button */}
            <Link href={`/${locale}/products`}>
              <ServerButton variant="outline" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </ServerButton>
            </Link>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Product Images */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    {/* Main Product Image */}
                    <div className="mb-4 flex h-80 w-full items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-amber-200">
                      <Coffee className="h-24 w-24 text-amber-600" />
                    </div>

                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-3 gap-2">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className="flex h-20 w-full cursor-pointer items-center justify-center rounded border-2 border-transparent bg-gradient-to-br from-amber-50 to-amber-100 hover:border-green-500"
                        >
                          <Coffee className="h-8 w-8 text-amber-500" />
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      <ServerButton
                        asChild
                        className="w-full transform bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl"
                        size="lg"
                      >
                        <Link href={`/${locale}/quote?product=${product.id}`}>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Request Quote
                        </Link>
                      </ServerButton>
                      <div className="grid grid-cols-2 gap-2">
                        <ServerButton variant="outline" size="sm">
                          <Heart className="mr-2 h-4 w-4" />
                          Save
                        </ServerButton>
                        <ServerButton variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </ServerButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Product Information */}
              <div className="lg:col-span-2">
                {/* Product Header */}
                <Card className="mb-6 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-coffee-50 to-gold-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CoffeeHeading
                          variant="heading-xl"
                          className="mb-2 text-coffee-800"
                        >
                          {product.name[locale] || product.name.en}
                        </CoffeeHeading>
                        <CardDescription className="text-lg text-coffee-600">
                          {product.shortDescription[locale] ||
                            product.shortDescription.en}
                        </CardDescription>
                        <p className="mt-2 font-mono text-sm text-coffee-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="space-y-2 text-right">
                        {product.isFeatured && (
                          <Badge className="mb-2 bg-gold-500 text-white">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                        <Badge
                          variant={
                            product.availability.inStock
                              ? 'default'
                              : 'destructive'
                          }
                          className="block"
                        >
                          {product.availability.inStock
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Key Details with Design System Components */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                        <Coffee className="mx-auto mb-2 h-6 w-6 text-coffee-600" />
                        <CoffeeGradeIndicator
                          grade={
                            product.grade.toLowerCase().replace('_', '-') as any
                          }
                        />
                        <p className="mt-1 text-xs text-coffee-600">Grade</p>
                      </div>
                      <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                        <ProcessingMethodBadge
                          method={product.processingMethod.toLowerCase() as any}
                        />
                        <p className="mt-1 text-xs text-coffee-600">
                          Processing
                        </p>
                      </div>
                      <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                        <OriginFlag
                          origin={product.origin.country.toLowerCase() as any}
                        />
                        <p className="mt-1 text-xs text-coffee-600">Origin</p>
                      </div>
                      <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                        <MapPin className="mx-auto mb-2 h-6 w-6 text-coffee-600" />
                        <p className="text-sm font-medium text-coffee-800">
                          {product.origin.altitude}m
                        </p>
                        <p className="text-xs text-coffee-600">Altitude</p>
                      </div>
                    </div>

                    {/* Interactive Bulk Pricing Calculator */}
                    <BulkPricingCalculator product={product} />
                  </CardContent>
                </Card>

                {/* Detailed Information Tabs */}
                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="grid w-full grid-cols-7 border border-coffee-200 bg-coffee-50">
                        <TabsTrigger
                          value="description"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-white"
                        >
                          Description
                        </TabsTrigger>
                        <TabsTrigger
                          value="specifications"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-white"
                        >
                          Specifications
                        </TabsTrigger>
                        <TabsTrigger
                          value="availability"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-white"
                        >
                          Availability
                        </TabsTrigger>
                        <TabsTrigger
                          value="origin"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-white"
                        >
                          Origin
                        </TabsTrigger>
                        <TabsTrigger
                          value="quality"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-white"
                        >
                          Quality
                        </TabsTrigger>
                        <TabsTrigger
                          value="shipping"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-white"
                        >
                          Shipping
                        </TabsTrigger>
                        <TabsTrigger
                          value="documents"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-white"
                        >
                          Documents
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="mt-6">
                        <Card className="shadow-md">
                          <CardContent className="p-6">
                            <SectionHeading
                              size="lg"
                              className="mb-4 text-coffee-800"
                            >
                              Product Description
                            </SectionHeading>
                            <div className="mb-6 whitespace-pre-line leading-relaxed text-coffee-700">
                              {product.longDescription?.[locale] ||
                                product.longDescription?.en}
                            </div>

                            <SectionHeading
                              size="md"
                              className="mb-4 mt-6 text-coffee-800"
                            >
                              Certifications & Quality Assurance
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {product.certifications.map((cert, index) => {
                                // Convert enum to proper CoffeeCertification format
                                const certKey = mapCertificationToEnhanced(
                                  cert
                                ) as any;
                                return (
                                  <EnhancedCertificationBadge
                                    key={index}
                                    certification={certKey}
                                    size="lg"
                                    showDetails={true}
                                    className="w-full"
                                  />
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="specifications" className="mt-6">
                        <Card className="shadow-md">
                          <CardContent className="p-6">
                            <SectionHeading
                              size="lg"
                              className="mb-6 text-coffee-800"
                            >
                              Technical Specifications
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                              <div>
                                <SectionHeading
                                  size="md"
                                  className="mb-4 text-coffee-700"
                                >
                                  Physical Properties
                                </SectionHeading>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Moisture Content:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.moisture}%
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Screen Size:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.screenSize}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Defect Rate:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.defectRate}%
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Bulk Density:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.density} g/ml
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Bean Size:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.screenSize} mesh
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <SectionHeading
                                  size="md"
                                  className="mb-4 text-coffee-700"
                                >
                                  Quality & Sensory
                                </SectionHeading>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                                    <span className="text-sm text-emerald-700">
                                      Cupping Score:
                                    </span>
                                    <span className="font-semibold text-emerald-800">
                                      {product.specifications.cuppingScore}/100
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Acidity Level:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.acidity}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Body:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.body}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Aroma:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.aroma}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Aftertaste:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {product.specifications.aftertaste}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <SectionHeading
                                  size="md"
                                  className="mb-4 text-coffee-700"
                                >
                                  Chemical Analysis
                                </SectionHeading>
                                <div className="space-y-3">
                                  {product.specifications.caffeine && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Caffeine:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {product.specifications.caffeine}%
                                      </span>
                                    </div>
                                  )}
                                  {product.specifications.ash && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Ash Content:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {product.specifications.ash}%
                                      </span>
                                    </div>
                                  )}
                                  {product.specifications.lipids && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Lipids:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {product.specifications.lipids}%
                                      </span>
                                    </div>
                                  )}
                                  {product.specifications.proteins && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Proteins:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {product.specifications.proteins}%
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                    <span className="text-sm text-blue-700">
                                      Water Activity:
                                    </span>
                                    <span className="font-semibold text-blue-800">
                                      &lt; 0.60 aw
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* B2B Compliance & Standards */}
                            <div className="mt-8 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                              <SectionHeading
                                size="md"
                                className="mb-4 text-blue-800"
                              >
                                B2B Compliance & Standards
                              </SectionHeading>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg bg-white/70 p-4">
                                  <h4 className="mb-2 text-sm font-semibold text-blue-700">
                                    Food Safety
                                  </h4>
                                  <ul className="space-y-1 text-xs text-blue-600">
                                    <li>• HACCP Compliant</li>
                                    <li>• ISO 22000 Certified</li>
                                    <li>• FDA Approved</li>
                                    <li>• EU Regulations</li>
                                  </ul>
                                </div>
                                <div className="rounded-lg bg-white/70 p-4">
                                  <h4 className="mb-2 text-sm font-semibold text-blue-700">
                                    Quality Standards
                                  </h4>
                                  <ul className="space-y-1 text-xs text-blue-600">
                                    <li>• SCA Standards</li>
                                    <li>• ICO Guidelines</li>
                                    <li>• Vietnam TCVN</li>
                                    <li>• ISO 9001:2015</li>
                                  </ul>
                                </div>
                                <div className="rounded-lg bg-white/70 p-4">
                                  <h4 className="mb-2 text-sm font-semibold text-blue-700">
                                    Sustainability
                                  </h4>
                                  <ul className="space-y-1 text-xs text-blue-600">
                                    <li>• Rainforest Alliance</li>
                                    <li>• UTZ Certified</li>
                                    <li>• Fair Trade</li>
                                    <li>• Organic (USDA)</li>
                                  </ul>
                                </div>
                                <div className="rounded-lg bg-white/70 p-4">
                                  <h4 className="mb-2 text-sm font-semibold text-blue-700">
                                    Traceability
                                  </h4>
                                  <ul className="space-y-1 text-xs text-blue-600">
                                    <li>• Farm-to-Port</li>
                                    <li>• Batch Tracking</li>
                                    <li>• QR Code System</li>
                                    <li>• Blockchain Ready</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <SectionHeading
                              size="md"
                              className="mb-4 mt-8 text-coffee-700"
                            >
                              Packaging Options
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              {(product.packagingOptions || []).map(
                                (option, index) => (
                                  <div
                                    key={index}
                                    className="rounded-lg border border-coffee-200 bg-gradient-to-br from-coffee-50 to-gold-50 p-4"
                                  >
                                    <div className="mb-3 flex items-center">
                                      <Package className="mr-2 h-5 w-5 text-coffee-600" />
                                      <span className="font-semibold text-coffee-800">
                                        {option}
                                      </span>
                                    </div>
                                    <p className="mb-1 text-sm font-medium text-coffee-700">
                                      Standard packaging
                                    </p>
                                    <p className="text-xs text-coffee-600">
                                      Professional packaging option
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="availability" className="mt-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          {/* Real-time Inventory Status */}
                          <Card className="shadow-md">
                            <CardContent className="p-6">
                              <SectionHeading
                                size="lg"
                                className="mb-6 text-coffee-800"
                              >
                                <div className="flex items-center">
                                  <Package className="mr-3 h-6 w-6" />
                                  Real-time Inventory Status
                                </div>
                              </SectionHeading>

                              {/* Stock Overview */}
                              <div className="mb-6 grid grid-cols-2 gap-4">
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-700">
                                      Total Stock
                                    </span>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  </div>
                                  <p className="text-2xl font-bold text-green-800">
                                    {product.availability.stockQuantity} MT
                                  </p>
                                </div>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-700">
                                      Available Now
                                    </span>
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <p className="text-2xl font-bold text-blue-800">
                                    {product.availability.availableQuantity ||
                                      product.availability.stockQuantity}{' '}
                                    MT
                                  </p>
                                </div>
                                {product.availability.reservedQuantity && (
                                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-amber-700">
                                        Reserved
                                      </span>
                                      <AlertCircle className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-amber-800">
                                      {product.availability.reservedQuantity} MT
                                    </p>
                                  </div>
                                )}
                                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-purple-700">
                                      Lead Time
                                    </span>
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <p className="text-2xl font-bold text-purple-800">
                                    {product.availability.leadTime} days
                                  </p>
                                </div>
                              </div>

                              {/* Processing Status */}
                              {product.availability.processingStatus && (
                                <div className="mb-6">
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Processing Pipeline
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                                      <span className="text-sm text-gray-700">
                                        Raw Beans
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {
                                          product.availability.processingStatus
                                            .raw
                                        }{' '}
                                        MT
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded bg-yellow-50 p-3">
                                      <span className="text-sm text-yellow-700">
                                        In Processing
                                      </span>
                                      <span className="font-medium text-yellow-800">
                                        {
                                          product.availability.processingStatus
                                            .processing
                                        }{' '}
                                        MT
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded bg-green-50 p-3">
                                      <span className="text-sm text-green-700">
                                        Ready to Ship
                                      </span>
                                      <span className="font-medium text-green-800">
                                        {
                                          product.availability.processingStatus
                                            .ready
                                        }{' '}
                                        MT
                                      </span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-xs text-gray-500">
                                    Last updated:{' '}
                                    {product.availability.processingStatus.lastUpdated.toLocaleDateString()}
                                  </p>
                                </div>
                              )}

                              {/* Quality Grade Distribution */}
                              {product.availability
                                .qualityGradeDistribution && (
                                <div>
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Quality Grade Distribution
                                  </h4>
                                  <div className="space-y-2">
                                    {product.availability.qualityGradeDistribution.map(
                                      (grade, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between rounded bg-coffee-50 p-3"
                                        >
                                          <span className="text-sm text-coffee-700">
                                            {grade.grade}
                                          </span>
                                          <div className="text-right">
                                            <span className="font-medium text-coffee-800">
                                              {grade.quantity} MT
                                            </span>
                                            <span className="ml-2 text-xs text-coffee-600">
                                              ({grade.percentage}%)
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* B2B Planning Information */}
                          <Card className="shadow-md">
                            <CardContent className="p-6">
                              <SectionHeading
                                size="lg"
                                className="mb-6 text-coffee-800"
                              >
                                <div className="flex items-center">
                                  <BarChart3 className="mr-3 h-6 w-6" />
                                  B2B Planning Information
                                </div>
                              </SectionHeading>

                              {/* Harvest & Production Schedule */}
                              <div className="mb-6">
                                <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                  Harvest & Production Schedule
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-3">
                                    <span className="text-sm text-green-700">
                                      Current Harvest Season
                                    </span>
                                    <span className="font-medium text-green-800">
                                      {product.availability.harvestSeason}
                                    </span>
                                  </div>
                                  {product.availability.nextHarvestDate && (
                                    <div className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 p-3">
                                      <span className="text-sm text-blue-700">
                                        Next Harvest
                                      </span>
                                      <span className="font-medium text-blue-800">
                                        {product.availability.nextHarvestDate.toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between rounded border border-purple-200 bg-purple-50 p-3">
                                    <span className="text-sm text-purple-700">
                                      Production Capacity
                                    </span>
                                    <span className="font-medium text-purple-800">
                                      {product.availability.productionCapacity}{' '}
                                      MT/month
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Warehouse Locations */}
                              {product.availability.warehouseLocations && (
                                <div className="mb-6">
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Warehouse Locations
                                  </h4>
                                  <div className="space-y-2">
                                    {product.availability.warehouseLocations.map(
                                      (location, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between rounded bg-gray-50 p-3"
                                        >
                                          <div>
                                            <span className="text-sm font-medium text-gray-800">
                                              {location.location}
                                            </span>
                                            <p className="text-xs text-gray-500">
                                              Updated:{' '}
                                              {location.lastUpdated.toLocaleDateString()}
                                            </p>
                                          </div>
                                          <span className="font-medium text-gray-700">
                                            {location.quantity} MT
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Forecast Data */}
                              {product.availability.forecastData && (
                                <div className="mb-6">
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Market Forecast (Next 3 Months)
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded border border-orange-200 bg-orange-50 p-3">
                                      <span className="text-sm text-orange-700">
                                        Expected Demand
                                      </span>
                                      <span className="font-medium text-orange-800">
                                        {
                                          product.availability.forecastData
                                            .expectedDemand
                                        }{' '}
                                        MT
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-3">
                                      <span className="text-sm text-green-700">
                                        Planned Production
                                      </span>
                                      <span className="font-medium text-green-800">
                                        {
                                          product.availability.forecastData
                                            .plannedProduction
                                        }{' '}
                                        MT
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Risk Factors */}
                              {product.availability.forecastData
                                ?.riskFactors && (
                                <div>
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Risk Factors
                                  </h4>
                                  <div className="space-y-2">
                                    {product.availability.forecastData.riskFactors.map(
                                      (risk, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start rounded border border-red-200 bg-red-50 p-3"
                                        >
                                          <AlertCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                                          <span className="text-sm text-red-700">
                                            {risk}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Reorder Alert */}
                              {product.availability.reorderLevel &&
                                product.availability.availableQuantity &&
                                product.availability.availableQuantity <=
                                  product.availability.reorderLevel && (
                                  <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <div className="flex items-center">
                                      <AlertCircle className="mr-3 h-5 w-5 text-yellow-600" />
                                      <div>
                                        <h4 className="text-sm font-semibold text-yellow-800">
                                          Reorder Alert
                                        </h4>
                                        <p className="text-xs text-yellow-700">
                                          Stock level is below reorder threshold
                                          ({product.availability.reorderLevel}{' '}
                                          MT). Consider placing orders early to
                                          ensure availability.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="origin" className="mt-6">
                        <Card className="shadow-md">
                          <CardContent className="p-6">
                            <SectionHeading
                              size="lg"
                              className="mb-6 text-coffee-800"
                            >
                              Origin Information
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                              <div>
                                <SectionHeading
                                  size="md"
                                  className="mb-4 text-coffee-700"
                                >
                                  Location Details
                                </SectionHeading>
                                <div className="space-y-4">
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Globe className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Country:{' '}
                                      <span className="font-semibold">
                                        {product.origin.country}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <MapPin className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Region:{' '}
                                      <span className="font-semibold">
                                        {product.origin.region},{' '}
                                        {product.origin.province}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Thermometer className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Altitude:{' '}
                                      <span className="font-semibold">
                                        {product.origin.altitude}m above sea
                                        level
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <SectionHeading
                                  size="md"
                                  className="mb-4 text-coffee-700"
                                >
                                  Farming Information
                                </SectionHeading>
                                <div className="space-y-4">
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Clock className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Harvest Season:{' '}
                                      <span className="font-semibold">
                                        {product.origin.harvestSeason}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Award className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Farming Method:{' '}
                                      <span className="font-semibold">
                                        {product.origin.farmingMethod}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Scale className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Production Capacity:{' '}
                                      <span className="font-semibold">
                                        {
                                          product.availability
                                            .productionCapacity
                                        }
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="quality" className="mt-6">
                        <Card className="shadow-md">
                          <CardContent className="p-6">
                            <SectionHeading
                              size="lg"
                              className="mb-6 text-coffee-800"
                            >
                              Quality Test Results
                            </SectionHeading>
                            <div className="space-y-4">
                              {product.qualityTests &&
                                Object.entries(product.qualityTests).map(
                                  ([key, value], index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between rounded-lg border border-coffee-200 bg-gradient-to-r from-coffee-50 to-gold-50 p-4"
                                    >
                                      <div>
                                        <p className="font-semibold text-coffee-800">
                                          {key}
                                        </p>
                                        <p className="text-sm text-coffee-600">
                                          Test Result
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-semibold text-coffee-800">
                                          {value}
                                        </p>
                                        <div className="flex items-center">
                                          <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                                          <span className="text-sm font-medium text-green-600">
                                            Passed
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="shipping" className="mt-6">
                        <Card className="shadow-md">
                          <CardContent className="p-6">
                            <SectionHeading
                              size="lg"
                              className="mb-6 text-coffee-800"
                            >
                              Shipping Cost Calculator
                            </SectionHeading>

                            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                              <div className="flex items-start gap-3">
                                <Truck className="mt-0.5 h-5 w-5 text-blue-600" />
                                <div>
                                  <h4 className="mb-1 font-semibold text-blue-800">
                                    Get Instant Shipping Estimates
                                  </h4>
                                  <p className="text-sm text-blue-700">
                                    Calculate shipping costs for this product
                                    based on your destination, quantity, and
                                    preferred shipping method. All estimates
                                    include handling, documentation, and
                                    insurance costs based on selected Incoterms.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <LogisticsCostEstimator
                              className="w-full"
                              onEstimateCalculated={estimate => {
                                // Optional: Handle estimate calculation for analytics or other purposes
                                console.log(
                                  'Shipping estimate calculated:',
                                  estimate
                                );
                              }}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="documents" className="mt-6">
                        <Card className="shadow-md">
                          <CardContent className="p-6">
                            <SectionHeading
                              size="lg"
                              className="mb-6 text-coffee-800"
                            >
                              Available Documents
                            </SectionHeading>

                            {/* Generate Product Spec Sheet - Prominent CTA */}
                            <div className="mb-6 rounded-lg border border-gold-200 bg-gradient-to-r from-gold-50 to-coffee-50 p-6 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="mb-2 text-lg font-semibold text-coffee-800">
                                    Product Specification Sheet
                                  </h3>
                                  <p className="text-sm text-coffee-600">
                                    Generate a comprehensive PDF specification
                                    sheet with all product details, quality
                                    parameters, and certifications.
                                  </p>
                                </div>
                                <ProductSpecDownloadButton
                                  productId={product.id}
                                  variant="default"
                                  size="lg"
                                  className="bg-coffee-600 text-white hover:bg-coffee-700"
                                >
                                  <FileText className="mr-2 h-5 w-5" />
                                  Generate PDF
                                </ProductSpecDownloadButton>
                              </div>
                            </div>

                            {/* Existing Documents */}
                            <div className="space-y-4">
                              {product.documents.map((doc, index) => (
                                <div
                                  key={`doc-${index}`}
                                  className="rounded-lg border border-coffee-200 bg-gradient-to-r from-coffee-50 to-gold-50 p-4 transition-shadow hover:shadow-md"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                      <div className="mr-3 mt-1 text-coffee-600">
                                        {doc.type === 'SPECIFICATION' && (
                                          <FileText className="h-5 w-5" />
                                        )}
                                        {doc.type === 'CERTIFICATE' && (
                                          <Award className="h-5 w-5" />
                                        )}
                                        {doc.type === 'QUALITY_CERTIFICATE' && (
                                          <Shield className="h-5 w-5" />
                                        )}
                                        {doc.type === 'SAMPLE_REPORT' && (
                                          <BarChart3 className="h-5 w-5" />
                                        )}
                                        {doc.type === 'BROCHURE' && (
                                          <BookOpen className="h-5 w-5" />
                                        )}
                                        {doc.type === 'OTHER' && (
                                          <FileText className="h-5 w-5" />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <p className="mb-1 font-semibold text-coffee-800">
                                          {doc.name[locale] || doc.name.en}
                                        </p>
                                        {doc.description && (
                                          <p className="mb-2 text-sm leading-relaxed text-coffee-600">
                                            {doc.description[locale] ||
                                              doc.description.en}
                                          </p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-coffee-500">
                                          <span className="rounded-full bg-coffee-100 px-2 py-1 font-medium text-coffee-700">
                                            {doc.type.replace('_', ' ')}
                                          </span>
                                          {doc.size && (
                                            <span className="flex items-center">
                                              <HardDrive className="mr-1 h-3 w-3" />
                                              {doc.size}
                                            </span>
                                          )}
                                          <span className="flex items-center">
                                            <Globe className="mr-1 h-3 w-3" />
                                            {doc.language.toUpperCase()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="transition-colors hover:border-coffee-300 hover:bg-coffee-50"
                                    >
                                      <Download className="mr-2 h-4 w-4" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ContentContainer>
        </ContentSection>

        {/* Enhanced Related Products */}
        {relatedProducts.length > 0 && (
          <ContentSection className="mt-12">
            <ContentContainer>
              <EnhancedRelatedProducts
                products={relatedProducts.map(relatedProduct => {
                  const productName =
                    relatedProduct.name[locale] || relatedProduct.name.en || '';
                  const productDescription =
                    relatedProduct.shortDescription[locale] ||
                    relatedProduct.shortDescription.en ||
                    '';

                  return {
                    id: relatedProduct.id,
                    name: productName,
                    shortDescription: productDescription,
                    images: relatedProduct.images.map(img => ({
                      url: img.url,
                      alt: img.alt[locale] || img.alt.en || '',
                      isPrimary: img.isPrimary,
                    })),
                    pricing: {
                      basePrice: relatedProduct.pricing.basePrice,
                      unit: relatedProduct.pricing.unit,
                      minimumOrder: relatedProduct.pricing.minimumOrder,
                      incoterms: [relatedProduct.pricing.incoterms],
                    },
                    grade: relatedProduct.grade,
                    origin: {
                      region: relatedProduct.origin.region,
                      country: relatedProduct.origin.country,
                    },
                    processingMethod: relatedProduct.processingMethod,
                    certifications: relatedProduct.certifications,
                    availability: {
                      inStock: relatedProduct.availability.inStock,
                      leadTime: relatedProduct.availability.leadTime,
                    },
                    isFeatured: relatedProduct.isFeatured,
                    specifications: {
                      moisture:
                        relatedProduct.specifications?.moisture?.toString() ||
                        'N/A',
                      screenSize:
                        relatedProduct.specifications?.screenSize || 'N/A',
                      defectRate:
                        relatedProduct.specifications?.defectRate?.toString() ||
                        'N/A',
                      cuppingScore:
                        relatedProduct.specifications?.cuppingScore || 0,
                    },
                  };
                })}
                currentProduct={{
                  id: product.id,
                  type: product.type,
                  grade: product.grade,
                }}
                locale={locale}
                className="mt-8"
              />
            </ContentContainer>
          </ContentSection>
        )}
      </div>
    </>
  );
}
