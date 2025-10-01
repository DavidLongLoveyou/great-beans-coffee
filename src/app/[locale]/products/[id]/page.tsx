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
} from 'lucide-react';
import Link from 'next/link';
import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { SEOHead } from '@/presentation/components/SEO/SEOHead';
import { generateSEOMetadata, generateOrganizationSchema } from '@/shared/utils/seo-utils';
import { generateB2BProductSchema } from '@/shared/utils/enhanced-structured-data';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  GoldButton,
  CoffeeButton,
} from '@/shared/components/design-system/Button';
import { ProductCard } from '@/shared/components/design-system/Card';
import {
  CertificationBadge,
  CoffeeGradeIndicator,
  OriginFlag,
  ProcessingMethodBadge,
} from '@/shared/components/design-system/coffee';
import {
  ContentSection,
  ContentContainer,
  ProductGrid,
} from '@/shared/components/design-system/layout';
import {
  CoffeeHeading,
  SectionHeading,
} from '@/shared/components/design-system/typography/Heading';

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

  // In a real app, you would fetch the product data here
  // For now, using mock data
  const productName = 'The Great Beans Premium Robusta Grade 1';
  const productDescription = 'High-quality natural processed Robusta from Dak Lak province - available green or roasted';

  return generateSEOMetadata({
    title: `${productName} - Premium Vietnamese Coffee`,
    description: productDescription,
    locale,
    path: `/products/${id}`,
    type: 'product',
  });
}

// Mock product data - will be replaced with real data from repository
const mockProduct = {
  id: '1',
  sku: 'ROB-G1-NAT-001',
  name: 'The Great Beans Premium Robusta Grade 1',
  shortDescription:
    'High-quality natural processed Robusta from Dak Lak province - available green or roasted',
  longDescription: `Our Premium Robusta Grade 1 represents the finest quality Robusta coffee beans sourced directly from the fertile highlands of Dak Lak province, Vietnam. These beans are carefully selected from farms that practice sustainable agriculture and are processed using traditional natural methods that enhance the coffee's inherent characteristics.

This exceptional coffee offers a full-bodied flavor profile with notes of dark chocolate, nuts, and a hint of earthiness. The natural processing method allows the beans to develop their unique flavor complexity while maintaining the robust characteristics that make Vietnamese Robusta world-renowned.

Perfect for espresso blends, instant coffee production, and commercial roasting applications. Our strict quality control ensures consistent moisture content, minimal defects, and optimal bean size distribution.`,
  type: 'ROBUSTA',
  grade: 'GRADE_1',
  processingMethod: 'NATURAL',
  origin: {
    country: 'Vietnam',
    region: 'Dak Lak',
    province: 'Dak Lak',
    altitude: 500,
    coordinates: {
      latitude: 12.71,
      longitude: 108.2378,
    },
    harvestSeason: 'October - February',
    farmingMethod: 'Sustainable Agriculture',
  },
  pricing: {
    basePrice: 2850,
    currency: 'USD',
    unit: 'MT',
    minimumOrder: 20,
    priceValidUntil: '2024-12-31',
    paymentTerms: 'T/T, L/C at sight',
    incoterms: ['FOB', 'CIF', 'CFR'],
  },
  availability: {
    inStock: true,
    stockQuantity: 150,
    leadTime: 14,
    productionCapacity: '500 MT/month',
    nextHarvest: '2024-10-01',
  },
  certifications: [
    {
      name: 'ORGANIC',
      issuer: 'USDA Organic',
      validUntil: '2025-06-30',
      certificateNumber: 'ORG-2024-001',
    },
    {
      name: 'RAINFOREST_ALLIANCE',
      issuer: 'Rainforest Alliance',
      validUntil: '2025-12-31',
      certificateNumber: 'RA-2024-VN-001',
    },
  ],
  images: [
    {
      url: '/images/products/robusta-grade1-1.jpg',
      alt: 'Premium Robusta Grade 1 Coffee Beans - Main View',
      isPrimary: true,
    },
    {
      url: '/images/products/robusta-grade1-2.jpg',
      alt: 'Premium Robusta Grade 1 Coffee Beans - Close Up',
      isPrimary: false,
    },
    {
      url: '/images/products/robusta-grade1-3.jpg',
      alt: 'Premium Robusta Grade 1 Coffee Beans - Packaging',
      isPrimary: false,
    },
  ],
  isFeatured: true,
  specifications: {
    moisture: 12.5,
    screenSize: '18+',
    defectRate: 0.5,
    density: '0.65-0.70 g/ml',
    caffeine: '2.2-2.7%',
    ash: '3.5-4.5%',
    lipids: '10-12%',
    proteins: '11-13%',
    chlorogenicAcid: '7-10%',
  },
  packaging: {
    options: [
      {
        type: 'Jute Bags',
        weight: '60kg',
        description: 'Traditional jute bags with inner plastic lining',
      },
      {
        type: 'PP Bags',
        weight: '60kg',
        description: 'Polypropylene bags with moisture barrier',
      },
      {
        type: 'Bulk Container',
        weight: '20MT',
        description: 'Food-grade bulk containers for large shipments',
      },
    ],
    customPackaging: true,
  },
  qualityTests: [
    {
      parameter: 'Moisture Content',
      value: '12.5%',
      standard: '≤ 12.5%',
      status: 'PASS',
    },
    {
      parameter: 'Defect Rate',
      value: '0.5%',
      standard: '≤ 1%',
      status: 'PASS',
    },
    {
      parameter: 'Screen Size',
      value: '18+',
      standard: '≥ 18',
      status: 'PASS',
    },
    {
      parameter: 'Foreign Matter',
      value: '0.1%',
      standard: '≤ 0.5%',
      status: 'PASS',
    },
  ],
  documents: [
    {
      name: 'Product Specification Sheet',
      type: 'PDF',
      size: '2.3 MB',
      downloadUrl: '/documents/robusta-g1-specs.pdf',
    },
    {
      name: 'Quality Certificate',
      type: 'PDF',
      size: '1.8 MB',
      downloadUrl: '/documents/robusta-g1-quality.pdf',
    },
    {
      name: 'Organic Certificate',
      type: 'PDF',
      size: '1.2 MB',
      downloadUrl: '/documents/robusta-g1-organic.pdf',
    },
  ],
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, id: _id } = await params;
  const _t = await getTranslations('products');

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const productSchema = generateB2BProductSchema({
    name: mockProduct.name,
    description: mockProduct.shortDescription,
    sku: mockProduct.sku,
    category: mockProduct.type,
    origin: mockProduct.origin,
    certifications: mockProduct.certifications,
    specifications: {
      moisture: mockProduct.moisture,
      screenSize: mockProduct.screenSize,
      defects: mockProduct.defects,
      processing: mockProduct.processing,
    },
    pricing: {
      currency: 'USD',
      minOrderQuantity: mockProduct.minOrderQuantity,
      leadTime: mockProduct.leadTime,
    },
    availability: mockProduct.availability,
    locale,
  });

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
        name: mockProduct.name,
        item: `https://thegreatbeans.com/${locale}/products/${_id}`,
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
              {mockProduct.name}
            </span>
          </div>
        </ContentContainer>
      </div>

      <ContentSection className="py-8">
        <ContentContainer>
          {/* Back Button */}
          <Link href={`/${locale}/products`}>
            <CoffeeButton variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </CoffeeButton>
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
                    {mockProduct.images.map((image, index) => (
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
                    <GoldButton className="w-full" size="lg">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Request Quote
                    </GoldButton>
                    <div className="grid grid-cols-2 gap-2">
                      <CoffeeButton variant="outline" size="sm">
                        <Heart className="mr-2 h-4 w-4" />
                        Save
                      </CoffeeButton>
                      <CoffeeButton variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </CoffeeButton>
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
                        size="2xl"
                        className="mb-2 text-coffee-800"
                      >
                        {mockProduct.name}
                      </CoffeeHeading>
                      <CardDescription className="text-lg text-coffee-600">
                        {mockProduct.shortDescription}
                      </CardDescription>
                      <p className="mt-2 font-mono text-sm text-coffee-500">
                        SKU: {mockProduct.sku}
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      {mockProduct.isFeatured && (
                        <Badge className="mb-2 bg-gold-500 text-white">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={
                          mockProduct.availability.inStock
                            ? 'default'
                            : 'destructive'
                        }
                        className="block"
                      >
                        {mockProduct.availability.inStock
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
                      <CoffeeGradeIndicator grade={mockProduct.grade} />
                      <p className="mt-1 text-xs text-coffee-600">Grade</p>
                    </div>
                    <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                      <ProcessingMethodBadge
                        method={mockProduct.processingMethod}
                      />
                      <p className="mt-1 text-xs text-coffee-600">Processing</p>
                    </div>
                    <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                      <OriginFlag
                        country="Vietnam"
                        region={mockProduct.origin.region}
                      />
                      <p className="mt-1 text-xs text-coffee-600">Origin</p>
                    </div>
                    <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                      <MapPin className="mx-auto mb-2 h-6 w-6 text-coffee-600" />
                      <p className="text-sm font-medium text-coffee-800">
                        {mockProduct.origin.altitude}m
                      </p>
                      <p className="text-xs text-coffee-600">Altitude</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="rounded-lg border border-gold-200 bg-gradient-to-r from-gold-50 to-coffee-50 p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <SectionHeading size="lg" className="text-coffee-800">
                        Price:
                      </SectionHeading>
                      <span className="text-3xl font-bold text-gold-600">
                        ${mockProduct.pricing.basePrice.toLocaleString()}/
                        {mockProduct.pricing.unit}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-white/50 p-3">
                        <p className="text-sm font-medium text-coffee-800">
                          Minimum Order
                        </p>
                        <p className="text-sm text-coffee-600">
                          {mockProduct.pricing.minimumOrder} MT
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/50 p-3">
                        <p className="text-sm font-medium text-coffee-800">
                          Lead Time
                        </p>
                        <p className="text-sm text-coffee-600">
                          {mockProduct.availability.leadTime} days
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/50 p-3">
                        <p className="text-sm font-medium text-coffee-800">
                          Payment Terms
                        </p>
                        <p className="text-sm text-coffee-600">
                          {mockProduct.pricing.paymentTerms}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/50 p-3">
                        <p className="text-sm font-medium text-coffee-800">
                          Valid Until
                        </p>
                        <p className="text-sm text-coffee-600">
                          {mockProduct.pricing.priceValidUntil}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Information Tabs */}
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 border border-coffee-200 bg-coffee-50">
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
                            {mockProduct.longDescription}
                          </div>

                          <SectionHeading
                            size="md"
                            className="mb-4 mt-6 text-coffee-800"
                          >
                            Certifications
                          </SectionHeading>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {mockProduct.certifications.map((cert, index) => (
                              <CertificationBadge
                                key={index}
                                certification={cert.name}
                                issuer={cert.issuer}
                                validUntil={cert.validUntil}
                                className="p-4"
                              />
                            ))}
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
                          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                              <SectionHeading
                                size="md"
                                className="mb-4 text-coffee-700"
                              >
                                Physical Properties
                              </SectionHeading>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">
                                    Moisture Content:
                                  </span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.moisture}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">
                                    Screen Size:
                                  </span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.screenSize}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">
                                    Defect Rate:
                                  </span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.defectRate}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">
                                    Density:
                                  </span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.density}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <SectionHeading
                                size="md"
                                className="mb-4 text-coffee-700"
                              >
                                Chemical Composition
                              </SectionHeading>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">
                                    Caffeine:
                                  </span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.caffeine}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">Ash:</span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.ash}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">
                                    Lipids:
                                  </span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.lipids}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                  <span className="text-coffee-700">
                                    Proteins:
                                  </span>
                                  <span className="font-semibold text-coffee-800">
                                    {mockProduct.specifications.proteins}
                                  </span>
                                </div>
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
                            {mockProduct.packaging.options.map(
                              (option, index) => (
                                <div
                                  key={index}
                                  className="rounded-lg border border-coffee-200 bg-gradient-to-br from-coffee-50 to-gold-50 p-4"
                                >
                                  <div className="mb-3 flex items-center">
                                    <Package className="mr-2 h-5 w-5 text-coffee-600" />
                                    <span className="font-semibold text-coffee-800">
                                      {option.type}
                                    </span>
                                  </div>
                                  <p className="mb-1 text-sm font-medium text-coffee-700">
                                    {option.weight}
                                  </p>
                                  <p className="text-xs text-coffee-600">
                                    {option.description}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
                                      {mockProduct.origin.country}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                  <MapPin className="mr-3 h-5 w-5 text-coffee-600" />
                                  <span className="text-coffee-800">
                                    Region:{' '}
                                    <span className="font-semibold">
                                      {mockProduct.origin.region},{' '}
                                      {mockProduct.origin.province}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                  <Thermometer className="mr-3 h-5 w-5 text-coffee-600" />
                                  <span className="text-coffee-800">
                                    Altitude:{' '}
                                    <span className="font-semibold">
                                      {mockProduct.origin.altitude}m above sea
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
                                      {mockProduct.origin.harvestSeason}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                  <Award className="mr-3 h-5 w-5 text-coffee-600" />
                                  <span className="text-coffee-800">
                                    Farming Method:{' '}
                                    <span className="font-semibold">
                                      {mockProduct.origin.farmingMethod}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                  <Scale className="mr-3 h-5 w-5 text-coffee-600" />
                                  <span className="text-coffee-800">
                                    Production Capacity:{' '}
                                    <span className="font-semibold">
                                      {
                                        mockProduct.availability
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
                            {mockProduct.qualityTests.map((test, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border border-coffee-200 bg-gradient-to-r from-coffee-50 to-gold-50 p-4"
                              >
                                <div>
                                  <p className="font-semibold text-coffee-800">
                                    {test.parameter}
                                  </p>
                                  <p className="text-sm text-coffee-600">
                                    Standard: {test.standard}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-coffee-800">
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

                    <TabsContent value="documents" className="mt-6">
                      <Card className="shadow-md">
                        <CardContent className="p-6">
                          <SectionHeading
                            size="lg"
                            className="mb-6 text-coffee-800"
                          >
                            Available Documents
                          </SectionHeading>
                          <div className="space-y-4">
                            {mockProduct.documents.map(doc => (
                              <div
                                key={`doc-${doc.name}`}
                                className="flex items-center justify-between rounded-lg border border-coffee-200 bg-gradient-to-r from-coffee-50 to-gold-50 p-4"
                              >
                                <div className="flex items-center">
                                  <FileText className="mr-3 h-5 w-5 text-coffee-600" />
                                  <div>
                                    <p className="font-semibold text-coffee-800">
                                      {doc.name}
                                    </p>
                                    <p className="text-sm text-coffee-600">
                                      {doc.type} • {doc.size}
                                    </p>
                                  </div>
                                </div>
                                <CoffeeButton variant="outline" size="sm">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </CoffeeButton>
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

      {/* Related Products */}
      <ContentSection className="mt-12">
        <ContentContainer>
          <SectionHeading
            size="xl"
            className="mb-8 text-center text-coffee-800"
          >
            Related Products
          </SectionHeading>
          <ProductGrid>
            {[1, 2, 3].map(i => (
              <ProductCard
                key={i}
                product={{
                  id: `related-${i}`,
                  name: 'The Great Beans Premium Robusta Grade 1',
                  type: 'Robusta',
                  grade: 'Grade 1',
                  origin: 'Dak Lak Province',
                  price: 2.85,
                  currency: 'USD',
                  unit: 'kg',
                  availability: 'In Stock',
                  image: '/images/coffee-beans-placeholder.jpg',
                  certifications: ['Organic', 'Fair Trade'],
                  processingMethod: 'Wet Process',
                }}
              />
            ))}
          </ProductGrid>

          <div className="mt-8 text-center">
            <Link href={`/${locale}/products`}>
              <CoffeeButton size="lg">View All Products</CoffeeButton>
            </Link>
          </div>
        </ContentContainer>
      </ContentSection>
    </div>
    </>
  );
}
