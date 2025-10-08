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
    product.shortDescription[locale] || product.shortDescription.en;
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
  ];

  return generateSEOMetadata({
    title: `${productName} - Premium Vietnamese Coffee | The Great Beans`,
    description: `${productDescription} | ${originInfo} | ${product.type} ${product.grade} | Wholesale & B2B Coffee Supply`,
    locale,
    url: `/products/${id}`,
    type: 'product',
    keywords,
    images: product.images.filter(img => img.isPrimary).map(img => img.url),
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
    [CertificationType.ISO]: { variant: 'iso' as const, icon: '🛡️' },
    [CertificationType.HACCP]: { variant: 'haccp' as const, icon: '🔬' },
    [CertificationType.BRC]: { variant: 'brc' as const, icon: '📋' },
    [CertificationType.BIRD_FRIENDLY]: { variant: 'bird-friendly' as const, icon: '🐦' },
    [CertificationType.SHADE_GROWN]: { variant: 'shade-grown' as const, icon: '🌿' },
    [CertificationType.DIRECT_TRADE]: { variant: 'direct-trade' as const, icon: '🤝' },
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
    [CertificationType.BIRD_FRIENDLY]: 'bird-friendly',
    [CertificationType.SHADE_GROWN]: 'shade-grown',
    [CertificationType.DIRECT_TRADE]: 'direct-trade',
    [CertificationType.ISO]: 'iso',
    [CertificationType.HACCP]: 'haccp',
    [CertificationType.BRC]: 'brc',
    [CertificationType.SQF]: 'sqf',
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
  const relatedProducts = searchProducts({
    type: product.type,
    limit: 4,
  }).filter(p => p.id !== product.id);

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const productSchema = generateB2BProductSchema(
    {
      id: product.id,
      name: product.name[locale] || product.name.en,
      description:
        product.shortDescription[locale] || product.shortDescription.en,
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
      incoterms: product.pricing.incoterms,
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
        <div className="border-coffee-200 bg-coffee-50 border-b">
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
              <span className="text-coffee-900 font-medium">
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
                  <CardHeader className="from-coffee-50 to-gold-50 bg-gradient-to-r">
                    <div className="flex items-start justify-between">
                      <div>
                        <CoffeeHeading
                          variant="heading-xl"
                          className="text-coffee-800 mb-2"
                        >
                          {product.name[locale] || product.name.en}
                        </CoffeeHeading>
                        <CardDescription className="text-coffee-600 text-lg">
                          {product.shortDescription[locale] ||
                            product.shortDescription.en}
                        </CardDescription>
                        <p className="text-coffee-500 mt-2 font-mono text-sm">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="space-y-2 text-right">
                        {product.isFeatured && (
                          <Badge className="bg-gold-500 mb-2 text-white">
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
                      <div className="border-coffee-100 bg-coffee-50 rounded-lg border p-4 text-center">
                        <Coffee className="text-coffee-600 mx-auto mb-2 h-6 w-6" />
                        <CoffeeGradeIndicator
                          grade={
                            product.grade.toLowerCase().replace('_', '-') as any
                          }
                        />
                        <p className="text-coffee-600 mt-1 text-xs">Grade</p>
                      </div>
                      <div className="border-coffee-100 bg-coffee-50 rounded-lg border p-4 text-center">
                        <ProcessingMethodBadge
                          method={product.processingMethod.toLowerCase() as any}
                        />
                        <p className="text-coffee-600 mt-1 text-xs">
                          Processing
                        </p>
                      </div>
                      <div className="border-coffee-100 bg-coffee-50 rounded-lg border p-4 text-center">
                        <OriginFlag
                          origin={product.origin.country.toLowerCase() as any}
                        />
                        <p className="text-coffee-600 mt-1 text-xs">Origin</p>
                      </div>
                      <div className="border-coffee-100 bg-coffee-50 rounded-lg border p-4 text-center">
                        <MapPin className="text-coffee-600 mx-auto mb-2 h-6 w-6" />
                        <p className="text-coffee-800 text-sm font-medium">
                          {product.origin.altitude}m
                        </p>
                        <p className="text-coffee-600 text-xs">Altitude</p>
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
                      <TabsList className="border-coffee-200 bg-coffee-50 grid w-full grid-cols-7 border">
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
                              className="text-coffee-800 mb-4"
                            >
                              Product Description
                            </SectionHeading>
                            <div className="text-coffee-700 mb-6 whitespace-pre-line leading-relaxed">
                              {product.longDescription?.[locale] ||
                                product.longDescription?.en}
                            </div>

                            <SectionHeading
                              size="md"
                              className="text-coffee-800 mb-4 mt-6"
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
                              className="text-coffee-800 mb-6"
                            >
                              Technical Specifications
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                              <div>
                                <SectionHeading
                                  size="md"
                                  className="text-coffee-700 mb-4"
                                >
                                  Physical Properties
                                </SectionHeading>
                                <div className="space-y-3">
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Moisture Content:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.moisture}%
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Screen Size:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.screenSize}
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Defect Rate:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.defectRate}%
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Bulk Density:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.density} g/ml
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Bean Size:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.screenSize} mesh
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <SectionHeading
                                  size="md"
                                  className="text-coffee-700 mb-4"
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
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Acidity Level:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.acidity}
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Body:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.body}
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Aroma:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.aroma}
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                    <span className="text-coffee-700 text-sm">
                                      Aftertaste:
                                    </span>
                                    <span className="text-coffee-800 font-semibold">
                                      {product.specifications.aftertaste}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <SectionHeading
                                  size="md"
                                  className="text-coffee-700 mb-4"
                                >
                                  Chemical Analysis
                                </SectionHeading>
                                <div className="space-y-3">
                                  {product.specifications.caffeine && (
                                    <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                      <span className="text-coffee-700 text-sm">
                                        Caffeine:
                                      </span>
                                      <span className="text-coffee-800 font-semibold">
                                        {product.specifications.caffeine}%
                                      </span>
                                    </div>
                                  )}
                                  {product.specifications.ash && (
                                    <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                      <span className="text-coffee-700 text-sm">
                                        Ash Content:
                                      </span>
                                      <span className="text-coffee-800 font-semibold">
                                        {product.specifications.ash}%
                                      </span>
                                    </div>
                                  )}
                                  {product.specifications.lipids && (
                                    <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                      <span className="text-coffee-700 text-sm">
                                        Lipids:
                                      </span>
                                      <span className="text-coffee-800 font-semibold">
                                        {product.specifications.lipids}%
                                      </span>
                                    </div>
                                  )}
                                  {product.specifications.proteins && (
                                    <div className="bg-coffee-50 flex items-center justify-between rounded-lg p-3">
                                      <span className="text-coffee-700 text-sm">
                                        Proteins:
                                      </span>
                                      <span className="text-coffee-800 font-semibold">
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
                              className="text-coffee-700 mb-4 mt-8"
                            >
                              Packaging Options
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              {product.packaging?.options?.map(
                                (option, index) => (
                                  <div
                                    key={index}
                                    className="border-coffee-200 from-coffee-50 to-gold-50 rounded-lg border bg-gradient-to-br p-4"
                                  >
                                    <div className="mb-3 flex items-center">
                                      <Package className="text-coffee-600 mr-2 h-5 w-5" />
                                      <span className="text-coffee-800 font-semibold">
                                        {option.type}
                                      </span>
                                    </div>
                                    <p className="text-coffee-700 mb-1 text-sm font-medium">
                                      {option.weight}
                                    </p>
                                    <p className="text-coffee-600 text-xs">
                                      {option.description}
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
                                className="text-coffee-800 mb-6"
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
                                  <h4 className="text-coffee-700 mb-3 text-sm font-semibold">
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
                                  <h4 className="text-coffee-700 mb-3 text-sm font-semibold">
                                    Quality Grade Distribution
                                  </h4>
                                  <div className="space-y-2">
                                    {product.availability.qualityGradeDistribution.map(
                                      (grade, index) => (
                                        <div
                                          key={index}
                                          className="bg-coffee-50 flex items-center justify-between rounded p-3"
                                        >
                                          <span className="text-coffee-700 text-sm">
                                            {grade.grade}
                                          </span>
                                          <div className="text-right">
                                            <span className="text-coffee-800 font-medium">
                                              {grade.quantity} MT
                                            </span>
                                            <span className="text-coffee-600 ml-2 text-xs">
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
                                className="text-coffee-800 mb-6"
                              >
                                <div className="flex items-center">
                                  <BarChart3 className="mr-3 h-6 w-6" />
                                  B2B Planning Information
                                </div>
                              </SectionHeading>

                              {/* Harvest & Production Schedule */}
                              <div className="mb-6">
                                <h4 className="text-coffee-700 mb-3 text-sm font-semibold">
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
                                  <h4 className="text-coffee-700 mb-3 text-sm font-semibold">
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
                                  <h4 className="text-coffee-700 mb-3 text-sm font-semibold">
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
                                  <h4 className="text-coffee-700 mb-3 text-sm font-semibold">
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
                              className="text-coffee-800 mb-6"
                            >
                              Origin Information
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                              <div>
                                <SectionHeading
                                  size="md"
                                  className="text-coffee-700 mb-4"
                                >
                                  Location Details
                                </SectionHeading>
                                <div className="space-y-4">
                                  <div className="bg-coffee-50 flex items-center rounded-lg p-3">
                                    <Globe className="text-coffee-600 mr-3 h-5 w-5" />
                                    <span className="text-coffee-800">
                                      Country:{' '}
                                      <span className="font-semibold">
                                        {product.origin.country}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center rounded-lg p-3">
                                    <MapPin className="text-coffee-600 mr-3 h-5 w-5" />
                                    <span className="text-coffee-800">
                                      Region:{' '}
                                      <span className="font-semibold">
                                        {product.origin.region},{' '}
                                        {product.origin.province}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center rounded-lg p-3">
                                    <Thermometer className="text-coffee-600 mr-3 h-5 w-5" />
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
                                  className="text-coffee-700 mb-4"
                                >
                                  Farming Information
                                </SectionHeading>
                                <div className="space-y-4">
                                  <div className="bg-coffee-50 flex items-center rounded-lg p-3">
                                    <Clock className="text-coffee-600 mr-3 h-5 w-5" />
                                    <span className="text-coffee-800">
                                      Harvest Season:{' '}
                                      <span className="font-semibold">
                                        {product.origin.harvestSeason}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center rounded-lg p-3">
                                    <Award className="text-coffee-600 mr-3 h-5 w-5" />
                                    <span className="text-coffee-800">
                                      Farming Method:{' '}
                                      <span className="font-semibold">
                                        {product.origin.farmingMethod}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="bg-coffee-50 flex items-center rounded-lg p-3">
                                    <Scale className="text-coffee-600 mr-3 h-5 w-5" />
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
                              className="text-coffee-800 mb-6"
                            >
                              Quality Test Results
                            </SectionHeading>
                            <div className="space-y-4">
                              {product.qualityTests?.map((test, index) => (
                                <div
                                  key={index}
                                  className="border-coffee-200 from-coffee-50 to-gold-50 flex items-center justify-between rounded-lg border bg-gradient-to-r p-4"
                                >
                                  <div>
                                    <p className="text-coffee-800 font-semibold">
                                      {test.parameter}
                                    </p>
                                    <p className="text-coffee-600 text-sm">
                                      Standard: {test.standard}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-coffee-800 font-semibold">
                                      {test.value}
                                    </p>
                                    <div className="flex items-center">
                                      <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                                      <span className="text-sm font-medium text-green-600">
                                        {test.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="shipping" className="mt-6">
                        <Card className="shadow-md">
                          <CardContent className="p-6">
                            <SectionHeading
                              size="lg"
                              className="text-coffee-800 mb-6"
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
                              className="text-coffee-800 mb-6"
                            >
                              Available Documents
                            </SectionHeading>

                            {/* Generate Product Spec Sheet - Prominent CTA */}
                            <div className="border-gold-200 from-gold-50 to-coffee-50 mb-6 rounded-lg border bg-gradient-to-r p-6 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-coffee-800 mb-2 text-lg font-semibold">
                                    Product Specification Sheet
                                  </h3>
                                  <p className="text-coffee-600 text-sm">
                                    Generate a comprehensive PDF specification
                                    sheet with all product details, quality
                                    parameters, and certifications.
                                  </p>
                                </div>
                                <ProductSpecDownloadButton
                                  productId={product.id}
                                  variant="default"
                                  size="lg"
                                  className="bg-coffee-600 hover:bg-coffee-700 text-white"
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
                                  className="border-coffee-200 from-coffee-50 to-gold-50 rounded-lg border bg-gradient-to-r p-4 transition-shadow hover:shadow-md"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                      <div className="text-coffee-600 mr-3 mt-1">
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
                                        <p className="text-coffee-800 mb-1 font-semibold">
                                          {doc.name[locale] || doc.name.en}
                                        </p>
                                        {doc.description && (
                                          <p className="text-coffee-600 mb-2 text-sm leading-relaxed">
                                            {doc.description[locale] ||
                                              doc.description.en}
                                          </p>
                                        )}
                                        <div className="text-coffee-500 flex items-center gap-3 text-xs">
                                          <span className="bg-coffee-100 text-coffee-700 rounded-full px-2 py-1 font-medium">
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
                                      className="hover:bg-coffee-50 hover:border-coffee-300 transition-colors"
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
                    relatedProduct.name[locale] || relatedProduct.name.en;
                  const productDescription =
                    relatedProduct.shortDescription[locale] ||
                    relatedProduct.shortDescription.en;

                  return {
                    id: relatedProduct.id,
                    name: productName,
                    shortDescription: productDescription,
                    images: relatedProduct.images,
                    pricing: relatedProduct.pricing,
                    grade: relatedProduct.grade,
                    origin: relatedProduct.origin,
                    processingMethod: relatedProduct.processingMethod,
                    certifications: relatedProduct.certifications,
                    availability: relatedProduct.availability,
                    isFeatured: relatedProduct.isFeatured,
                    specifications: {
                      moisture:
                        relatedProduct.specifications?.moisture || 'N/A',
                      screenSize:
                        relatedProduct.specifications?.screenSize || 'N/A',
                      defectRate:
                        relatedProduct.specifications?.defectRate || 'N/A',
                      cuppingScore: relatedProduct.specifications?.cuppingScore,
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
