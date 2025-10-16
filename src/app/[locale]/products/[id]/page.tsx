import {  Coffee, MapPin, Package, Download, ShoppingCart, Star, Award, Thermometer, Scale, Clock, CheckCircle, ArrowLeft, Share2, Heart, FileText, Globe, Truck, Shield, TrendingUp, Calendar, AlertCircle, BarChart3, BookOpen, HardDrive  } from '@/components/ui/dynamic-icons';
import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { BulkPricingCalculator } from '@/components/ui/BulkPricingCalculator';
import { LogisticsCostEstimator } from '@/components/ui/LogisticsCostEstimator';
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
import {
  CoffeeGradeIndicator,
  OriginFlag,
  ProcessingMethodBadge,
  EnhancedRelatedProducts,
} from '@/shared/components/design-system/Coffee';
import { EnhancedCertificationBadge } from '@/shared/components/design-system/Coffee/EnhancedCertificationBadge';
import {
  ProductImageGallery,
  type ProductImage,
} from '@/components/features/products/ProductImageGallery';
import {
  ContentSection,
  ContentContainer,
} from '@/shared/components/design-system/Layout';
import {
  CoffeeHeading,
  SectionHeading,
} from '@/shared/components/design-system/Typography/Heading';
import { ProductSpecDownloadButton } from '@/shared/components/pdf';
import { generateB2BProductSchema } from '@/shared/utils/enhanced-structured-data';
import {
  generateMetadata as generateSEOMetadata,
  generateOrganizationSchema,
} from '@/shared/utils/seo-utils';
import {
  CertificationType,
  CoffeeType as CatalogCoffeeType,
  CoffeeGrade as CatalogCoffeeGrade,
  ProcessingMethod as CatalogProcessingMethod,
} from '@/data/product-catalog';
import {
  CoffeeGrade,
  ProcessingMethod,
  CoffeeOrigin,
  CoffeeCertification,
} from '@/shared/components/design-system/types';

// Helper functions to map API data to design system types
const mapGradeToDesignSystem = (grade: string): CoffeeGrade => {
  const gradeMap: Record<string, CoffeeGrade> = {
    GRADE_1: 'grade-1',
    GRADE_2: 'grade-2',
    GRADE_3: 'grade-3',
    GRADE_4: 'grade-4',
    SPECIALTY: 'specialty',
    PREMIUM: 'premium',
    EXCHANGE: 'exchange',
    STANDARD: 'standard',
    SCREEN_18: 'screen-18',
    SCREEN_16: 'screen-16',
    SCREEN_14: 'screen-14',
  };
  return gradeMap[grade.toUpperCase()] || 'standard';
};

const mapProcessingMethodToDesignSystem = (
  processing: string
): ProcessingMethod => {
  const processingMap: Record<string, ProcessingMethod> = {
    WASHED: 'washed',
    NATURAL: 'natural',
    HONEY: 'honey',
    SEMI_WASHED: 'semi-washed',
    WET_HULLED: 'wet-hulled',
    ANAEROBIC: 'anaerobic',
    CARBONIC_MACERATION: 'carbonic-maceration',
    BLACK_HONEY: 'black-honey',
    WHITE_HONEY: 'white-honey',
    RED_HONEY: 'red-honey',
  };
  return processingMap[processing.toUpperCase()] || 'natural';
};

const mapCountryToOrigin = (country: string): CoffeeOrigin => {
  const countryMap: Record<string, CoffeeOrigin> = {
    VIETNAM: 'vietnam',
    'VIET NAM': 'vietnam',
    BRAZIL: 'brazil',
    COLOMBIA: 'colombia',
    ETHIOPIA: 'ethiopia',
    GUATEMALA: 'guatemala',
    HONDURAS: 'honduras',
    PERU: 'peru',
    INDONESIA: 'indonesia',
    INDIA: 'india',
    'COSTA RICA': 'costa-rica',
    NICARAGUA: 'nicaragua',
    ECUADOR: 'ecuador',
    MEXICO: 'mexico',
    PANAMA: 'panama',
    JAMAICA: 'jamaica',
    KENYA: 'kenya',
  };
  return countryMap[country.toUpperCase()] || 'vietnam';
};

const mapCoffeeTypeToCatalog = (coffeeType: string): CatalogCoffeeType => {
  const typeMap: Record<string, CatalogCoffeeType> = {
    ROBUSTA: CatalogCoffeeType.ROBUSTA,
    ARABICA: CatalogCoffeeType.ARABICA,
    BLEND: CatalogCoffeeType.BLEND,
    INSTANT: CatalogCoffeeType.INSTANT,
    ROASTED: CatalogCoffeeType.ROASTED,
  };
  return typeMap[coffeeType.toUpperCase()] || CatalogCoffeeType.ROBUSTA;
};

const mapGradeToCatalog = (grade: string): CatalogCoffeeGrade => {
  const gradeMap: Record<string, CatalogCoffeeGrade> = {
    GRADE_1: CatalogCoffeeGrade.GRADE_1,
    GRADE_2: CatalogCoffeeGrade.GRADE_2,
    GRADE_3: CatalogCoffeeGrade.GRADE_3,
    SPECIALTY: CatalogCoffeeGrade.SPECIALTY,
    PREMIUM: CatalogCoffeeGrade.PREMIUM,
    COMMERCIAL: CatalogCoffeeGrade.COMMERCIAL,
  };
  return gradeMap[grade.toUpperCase()] || CatalogCoffeeGrade.GRADE_1;
};

const mapProcessingMethodToCatalog = (
  processing: string
): CatalogProcessingMethod => {
  const processingMap: Record<string, CatalogProcessingMethod> = {
    NATURAL: CatalogProcessingMethod.NATURAL,
    WASHED: CatalogProcessingMethod.WASHED,
    HONEY: CatalogProcessingMethod.HONEY,
    SEMI_WASHED: CatalogProcessingMethod.SEMI_WASHED,
    WET_HULLED: CatalogProcessingMethod.WET_HULLED,
    PULPED_NATURAL: CatalogProcessingMethod.PULPED_NATURAL,
  };
  return (
    processingMap[processing.toUpperCase()] || CatalogProcessingMethod.NATURAL
  );
};

const createSpecificationsFromApi = (product: ApiProductDetail) => {
  return {
    moisture: 12.5, // Default value, could be extracted from specificationItems
    defectRate: 0.5, // Default value
    screenSize:
      getSpecificationValue(product.specificationItems, 'Screen Size') || '18+',
    density: 0.75, // Default value
    cuppingScore: product.cuppingScore,
    acidity:
      getSpecificationValue(product.specificationItems, 'Acidity') || 'Medium',
    body: getSpecificationValue(product.specificationItems, 'Body') || 'Full',
    flavor:
      getSpecificationValue(product.specificationItems, 'Flavor') ||
      'Rich coffee flavor',
    aroma:
      getSpecificationValue(product.specificationItems, 'Aroma') ||
      'Coffee aroma',
    aftertaste:
      getSpecificationValue(product.specificationItems, 'Aftertaste') ||
      'Pleasant',
  };
};

// API Types for enhanced product details
interface ApiProductDetail {
  id: string;
  sku: string;
  name: string;
  description: string;
  coffeeType: string;
  grade: string;
  processing: string;
  origin: string;
  region: string;
  farm?: string;
  country?: string;
  province?: string;
  farmingMethod?: string;
  altitude: number;
  cuppingScore: number;
  harvestSeason: string;
  minimumOrder: number;
  inStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images: Array<{
    id?: string;
    url: string;
    cloudinaryId?: string;
    alt?: string;
    caption?: string;
    isPrimary?: boolean;
    category?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  translations: Array<{
    locale: string;
    name: string;
    description: string;
    tastingNotes?: string;
  }>;
  certifications: Array<{
    certification: {
      id: string;
      name: string;
      type: string;
      description?: string;
      translations: Array<{
        locale: string;
        name: string;
        description?: string;
      }>;
    };
  }>;
  suppliers: Array<{
    supplier: {
      id: string;
      name: string;
      contactPerson?: string;
      email?: string;
      phone?: string;
      address?: string;
      country?: string;
      contacts: Array<{
        name: string;
        role: string;
        email: string;
        phone?: string;
      }>;
    };
  }>;
  specificationItems: Array<{
    id: string;
    name: string;
    value: string;
    unit?: string;
    category: string;
    sortOrder: number;
  }>;
  pricingModels: Array<{
    pricingModel: {
      id: string;
      name: string;
      type: string;
      basePrice: number;
      currency: string;
      minimumQuantity: number;
      maximumQuantity?: number;
      validFrom: string;
      validTo?: string;
      incoterms: string;
    };
  }>;
  inventory?: Array<{
    id: string;
    quantity: number;
    unit: string;
    location: string;
    lastUpdated: string;
  }>;
  qualityReports?: Array<{
    id: string;
    reportDate: string;
    cuppingScore: number;
    moisture: number;
    defects: number;
    screenSize: string;
    reportUrl?: string;
  }>;
  packagingOptions?: Array<{
    id: string;
    name: string;
    description?: string;
    weight: number;
    unit: string;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    description?: string;
    uploadDate: string;
    size?: string;
    language?: string;
  }>;
  qualityTests?: Record<string, string | number | boolean>;
}

interface ProductDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

// Fetch product details from API
async function fetchProductDetails(
  id: string,
  locale: string = 'en'
): Promise<ApiProductDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/products/${id}?locale=${locale}&includeInventory=true&includeQuality=true`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    return null;
  }
}

// Fetch related products
async function fetchRelatedProducts(
  productId: string,
  coffeeType: string,
  locale: string = 'en'
): Promise<ApiProductDetail[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/products?coffeeType=${coffeeType}&limit=4&locale=${locale}`,
      {
        next: { revalidate: 600 }, // Revalidate every 10 minutes
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch related products: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (data.success && data.products) {
      // Filter out the current product
      return data.products.filter((p: ApiProductDetail) => p.id !== productId);
    }
    return [];
  } catch (error) {
    return [];
  }
}

// Helper functions to safely access product data
function getProductPricing(product: ApiProductDetail) {
  const pricing = product.pricingModels?.[0]?.pricingModel;
  return {
    basePrice: pricing?.basePrice || 0,
    currency: pricing?.currency || 'USD',
    unit: 'MT',
    incoterms: pricing?.incoterms || 'FOB',
    minimumOrder: product.minimumOrder || 1,
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    paymentTerms: '30 days net',
    discountTiers: [],
  };
}

function getProductOrigin(product: ApiProductDetail) {
  return {
    region: product.region || 'Unknown Region',
    country: product.country || 'Unknown Country',
    province: product.province || 'Unknown Province',
    altitude: product.altitude || 0,
    farmSize: 'Unknown',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    soilType: 'Unknown',
    climate: 'Unknown',
    harvestSeason: product.harvestSeason || 'Unknown Season',
    farmingMethod: product.farmingMethod || 'Unknown Method',
  };
}

interface WarehouseLocation {
  location: string;
  quantity: number;
  lastUpdated: Date;
}

interface QualityGradeDistribution {
  grade: string;
  quantity: number;
  percentage: number;
}

function getProductAvailability(product: ApiProductDetail) {
  const inventory = product.inventory?.[0];

  // Convert inventory data to warehouse locations format
  const warehouseLocations: WarehouseLocation[] =
    product.inventory?.map(inv => ({
      location: inv.location,
      quantity: inv.quantity,
      lastUpdated: new Date(inv.lastUpdated),
    })) || [];

  return {
    inStock: product.inStock,
    stockQuantity: inventory?.quantity || 0,
    harvestSeason: product.harvestSeason || 'Unknown',
    availableFrom: new Date(),
    availableUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    leadTime: 30, // Default lead time
    productionCapacity: 1000, // Default capacity
    reservedQuantity: 0,
    availableQuantity: inventory?.quantity || 0,
    reorderLevel: 100,
    nextHarvestDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    qualityGradeDistribution: [
      { grade: 'Grade 1', quantity: 500, percentage: 60 },
      { grade: 'Grade 2', quantity: 250, percentage: 30 },
      { grade: 'Grade 3', quantity: 83, percentage: 10 },
    ] as QualityGradeDistribution[],
    warehouseLocations,
    processingStatus: {
      raw: 0,
      processing: 0,
      ready: inventory?.quantity || 0,
      lastUpdated: new Date(),
    },
    forecastData: {
      expectedDemand: 500,
      plannedProduction: 1000,
      riskFactors: [],
    },
  };
}

function getProcessingMethod(product: ApiProductDetail) {
  return product.processing;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const _t = await getTranslations({ locale, namespace: 'products' });

  // Get product data from API
  const product = await fetchProductDetails(id, locale);

  if (!product) {
    return generateSEOMetadata({
      title: 'Product Not Found - The Great Beans',
      description: 'The requested coffee product could not be found.',
      locale,
      url: `/products/${id}`,
      type: 'product',
    });
  }

  // Get localized content
  const translation = product.translations?.find(t => t.locale === locale);
  const productName = translation?.name || product.name;
  const productDescription = translation?.description || product.description;
  const origin = getProductOrigin(product);
  const originInfo = `${origin.region}, ${origin.country}`;

  // Enhanced SEO keywords based on product attributes
  const keywords = [
    productName,
    product.coffeeType.toLowerCase(),
    product.grade.toLowerCase().replace('_', ' '),
    getProcessingMethod(product).toLowerCase(),
    'vietnamese coffee',
    'coffee beans',
    'wholesale coffee',
    'b2b coffee',
    originInfo.toLowerCase(),
    ...product.certifications
      .map(cert => cert.certification.name?.toLowerCase().replace('_', ' '))
      .filter((cert): cert is string => Boolean(cert)),
  ].filter((keyword): keyword is string => Boolean(keyword));

  return generateSEOMetadata({
    title: `${productName} - Premium Vietnamese Coffee | The Great Beans`,
    description: `${productDescription} | ${originInfo} | ${product.coffeeType} ${product.grade} | Wholesale & B2B Coffee Supply`,
    locale,
    url: `/products/${id}`,
    type: 'product',
    keywords,
    image: product.images?.[0]?.url || '/images/logo.svg',
  });
}

// Helper function to map certification types to design system
const _mapCertificationToDesignSystem = (cert: CertificationType) => {
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
const mapCertificationToEnhanced = (
  cert: CertificationType
): CoffeeCertification => {
  const certMap: Record<CertificationType, CoffeeCertification> = {
    [CertificationType.ORGANIC]: 'organic',
    [CertificationType.FAIR_TRADE]: 'fair-trade',
    [CertificationType.RAINFOREST_ALLIANCE]: 'rainforest-alliance',
    [CertificationType.UTZ]: 'utz',
    [CertificationType.UTZ_CERTIFIED]: 'utz',
    [CertificationType.C_CAFE_PRACTICES]: 'c-cafe',
    [CertificationType.BIRD_FRIENDLY]: 'bird-friendly',
    [CertificationType.SHADE_GROWN]: 'shade-grown',
    [CertificationType.DIRECT_TRADE]: 'direct-trade',
    [CertificationType.ISO_22000]: 'iso-22000',
    [CertificationType.HACCP]: 'haccp',
    [CertificationType.BRC]: 'brc',
    [CertificationType.KOSHER]: 'organic', // Fallback to organic for unsupported types
    [CertificationType.HALAL]: 'organic', // Fallback to organic for unsupported types
  };
  return certMap[cert] || 'organic';
};

// Helper function to get specification value from specificationItems array
const getSpecificationValue = (
  specificationItems: Array<{
    id: string;
    name: string;
    value: string;
    unit?: string;
    category: string;
    sortOrder: number;
  }>,
  name: string
): string => {
  const item = specificationItems.find(
    spec => spec.name.toLowerCase() === name.toLowerCase()
  );
  return item?.value || 'N/A';
};

// Helper function to get specification value with unit
const getSpecificationValueWithUnit = (
  specificationItems: Array<{
    id: string;
    name: string;
    value: string;
    unit?: string;
    category: string;
    sortOrder: number;
  }>,
  name: string
): string => {
  const item = specificationItems.find(
    spec => spec.name.toLowerCase() === name.toLowerCase()
  );
  if (!item) return 'N/A';
  return item.unit ? `${item.value}${item.unit}` : item.value;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, id } = await params;
  const _t = await getTranslations('products');

  // Get product data from API
  const product = await fetchProductDetails(id, locale);

  if (!product) {
    notFound();
  }

  // Get related products for recommendations
  const relatedProducts = await fetchRelatedProducts(
    product.id,
    product.coffeeType,
    locale
  );

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();

  // Get localized content
  const translation = product.translations?.find(t => t.locale === locale);
  const productName = translation?.name || product.name;
  const productDescription = translation?.description || product.description;
  const origin = getProductOrigin(product);
  const pricing = getProductPricing(product);

  const productSchema = generateB2BProductSchema(
    {
      id: product.id,
      name: productName,
      description: productDescription,
      images: product.images?.map(img => img.url) || [],
      category: product.coffeeType,
      sku: product.sku,
      origin: `${origin.region}, ${origin.country}`,
      certifications: product.certifications.map(cert => ({
        name: cert.certification.name,
        identifier: `${cert.certification.id}-${product.id}`,
        issuer: 'The Great Beans',
      })),
      minOrderQuantity: pricing.minimumOrder * 1000, // Convert MT to kg
      unitOfMeasure: 'kg',
      leadTime: {
        min: 14,
        max: 21,
      },
      targetMarkets: ['Global'],
      incoterms: [pricing.incoterms],
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
        name: productName,
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
              <span className="font-medium text-coffee-900">{productName}</span>
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
                <ProductImageGallery
                  images={product.images.map(
                    (image, index): ProductImage => ({
                      id: image.id || `${product.id}-${index}`,
                      url: image.url,
                      cloudinaryId: image.cloudinaryId || '',
                      alt: image.alt || `${productName} - Image ${index + 1}`,
                      caption: image.caption || '',
                      isPrimary: image.isPrimary ?? index === 0,
                      category:
                        (image.category as ProductImage['category']) ||
                        'product',
                    })
                  )}
                  productName={productName}
                  showThumbnails={true}
                  showControls={true}
                  showImageInfo={true}
                  enableZoom={true}
                  enableShare={true}
                />

                {/* Action Buttons */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <div className="space-y-3">
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
                          {productName}
                        </CoffeeHeading>
                        <CardDescription className="text-lg text-coffee-600">
                          {productDescription}
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
                            getProductAvailability(product).inStock
                              ? 'default'
                              : 'destructive'
                          }
                          className="block"
                        >
                          {getProductAvailability(product).inStock
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
                          grade={mapGradeToDesignSystem(product.grade)}
                        />
                        <p className="mt-1 text-xs text-coffee-600">Grade</p>
                      </div>
                      <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                        <ProcessingMethodBadge
                          method={mapProcessingMethodToDesignSystem(
                            getProcessingMethod(product)
                          )}
                        />
                        <p className="mt-1 text-xs text-coffee-600">
                          Processing
                        </p>
                      </div>
                      <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                        <OriginFlag
                          origin={mapCountryToOrigin(
                            getProductOrigin(product).country
                          )}
                        />
                        <p className="mt-1 text-xs text-coffee-600">Origin</p>
                      </div>
                      <div className="rounded-lg border border-coffee-100 bg-coffee-50 p-4 text-center">
                        <MapPin className="mx-auto mb-2 h-6 w-6 text-coffee-600" />
                        <p className="text-sm font-medium text-coffee-800">
                          {getProductOrigin(product).altitude}m
                        </p>
                        <p className="text-xs text-coffee-600">Altitude</p>
                      </div>
                    </div>

                    {/* Interactive Bulk Pricing Calculator */}
                    <BulkPricingCalculator
                      product={{
                        id: product.id,
                        sku: product.id,
                        name: { en: product.name },
                        description: { en: product.description },
                        shortDescription: { en: product.description },
                        type: mapCoffeeTypeToCatalog(product.coffeeType),
                        grade: mapGradeToCatalog(product.grade),
                        processingMethod: mapProcessingMethodToCatalog(
                          getProcessingMethod(product)
                        ),
                        specifications: createSpecificationsFromApi(product),
                        pricing: getProductPricing(product),
                        availability: getProductAvailability(product),
                        certifications: [],
                        origin: getProductOrigin(product),
                        images:
                          product.images?.map(img => {
                            const imageObj: any = {
                              id: img.id || '',
                              url: img.url,
                              cloudinaryId: img.cloudinaryId,
                              alt: {
                                en: img.alt || `${product.name} coffee image`,
                              },
                              isPrimary: img.isPrimary || false,
                              category: img.category as
                                | 'product'
                                | 'packaging'
                                | 'origin'
                                | 'process'
                                | 'quality'
                                | undefined,
                            };
                            if (img.caption) {
                              imageObj.caption = { en: img.caption };
                            }
                            return imageObj;
                          }) || [],
                        documents: [],
                        packagingOptions: [],
                        isActive: true,
                        isFeatured: product.isFeatured || false,
                        sortOrder: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        createdBy: 'system',
                        updatedBy: 'system',
                      }}
                    />
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
                              {product.description}
                            </div>

                            <SectionHeading
                              size="md"
                              className="mb-4 mt-6 text-coffee-800"
                            >
                              Certifications & Quality Assurance
                            </SectionHeading>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {product.certifications.map(cert => {
                                // Convert enum to proper CoffeeCertification format
                                const certKey = mapCertificationToEnhanced(
                                  cert.certification.type as CertificationType
                                );
                                return (
                                  <EnhancedCertificationBadge
                                    key={`cert-${cert.certification.id}`}
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
                                      {getSpecificationValueWithUnit(
                                        product.specificationItems,
                                        'moisture'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Screen Size:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValue(
                                        product.specificationItems,
                                        'screenSize'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Defect Rate:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValueWithUnit(
                                        product.specificationItems,
                                        'defectRate'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Bulk Density:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValueWithUnit(
                                        product.specificationItems,
                                        'density'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Bean Size:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValueWithUnit(
                                        product.specificationItems,
                                        'screenSize'
                                      )}
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
                                      {getSpecificationValue(
                                        product.specificationItems,
                                        'cuppingScore'
                                      )}
                                      /100
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Acidity Level:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValue(
                                        product.specificationItems,
                                        'acidity'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Body:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValue(
                                        product.specificationItems,
                                        'body'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Aroma:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValue(
                                        product.specificationItems,
                                        'aroma'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                    <span className="text-sm text-coffee-700">
                                      Aftertaste:
                                    </span>
                                    <span className="font-semibold text-coffee-800">
                                      {getSpecificationValue(
                                        product.specificationItems,
                                        'aftertaste'
                                      )}
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
                                  {getSpecificationValue(
                                    product.specificationItems,
                                    'caffeine'
                                  ) !== 'N/A' && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Caffeine:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {getSpecificationValueWithUnit(
                                          product.specificationItems,
                                          'caffeine'
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {getSpecificationValue(
                                    product.specificationItems,
                                    'ash'
                                  ) !== 'N/A' && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Ash Content:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {getSpecificationValueWithUnit(
                                          product.specificationItems,
                                          'ash'
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {getSpecificationValue(
                                    product.specificationItems,
                                    'lipids'
                                  ) !== 'N/A' && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Lipids:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {getSpecificationValueWithUnit(
                                          product.specificationItems,
                                          'lipids'
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {getSpecificationValue(
                                    product.specificationItems,
                                    'proteins'
                                  ) !== 'N/A' && (
                                    <div className="flex items-center justify-between rounded-lg bg-coffee-50 p-3">
                                      <span className="text-sm text-coffee-700">
                                        Proteins:
                                      </span>
                                      <span className="font-semibold text-coffee-800">
                                        {getSpecificationValueWithUnit(
                                          product.specificationItems,
                                          'proteins'
                                        )}
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
                              {(product.packagingOptions || []).map(option => (
                                <div
                                  key={`packaging-${option.id}`}
                                  className="rounded-lg border border-coffee-200 bg-gradient-to-br from-coffee-50 to-gold-50 p-4"
                                >
                                  <div className="mb-3 flex items-center">
                                    <Package className="mr-2 h-5 w-5 text-coffee-600" />
                                    <span className="font-semibold text-coffee-800">
                                      {option.name}
                                    </span>
                                  </div>
                                  <p className="mb-1 text-sm font-medium text-coffee-700">
                                    Standard packaging
                                  </p>
                                  <p className="text-xs text-coffee-600">
                                    Professional packaging option
                                  </p>
                                </div>
                              ))}
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
                                    {
                                      getProductAvailability(product)
                                        .stockQuantity
                                    }{' '}
                                    MT
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
                                    {getProductAvailability(product)
                                      .availableQuantity ||
                                      getProductAvailability(product)
                                        .stockQuantity}{' '}
                                    MT
                                  </p>
                                </div>
                                {getProductAvailability(product)
                                  .reservedQuantity && (
                                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-amber-700">
                                        Reserved
                                      </span>
                                      <AlertCircle className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-amber-800">
                                      {
                                        getProductAvailability(product)
                                          .reservedQuantity
                                      }{' '}
                                      MT
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
                                    {getProductAvailability(product).leadTime}{' '}
                                    days
                                  </p>
                                </div>
                              </div>

                              {/* Processing Status */}
                              {getProductAvailability(product)
                                .processingStatus && (
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
                                          getProductAvailability(product)
                                            .processingStatus?.raw
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
                                          getProductAvailability(product)
                                            .processingStatus?.processing
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
                                          getProductAvailability(product)
                                            .processingStatus?.ready
                                        }{' '}
                                        MT
                                      </span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-xs text-gray-500">
                                    Last updated:{' '}
                                    {getProductAvailability(
                                      product
                                    ).processingStatus?.lastUpdated?.toLocaleDateString()}
                                  </p>
                                </div>
                              )}

                              {/* Quality Grade Distribution */}
                              {getProductAvailability(product)
                                .qualityGradeDistribution && (
                                <div>
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Quality Grade Distribution
                                  </h4>
                                  <div className="space-y-2">
                                    {getProductAvailability(
                                      product
                                    ).qualityGradeDistribution?.map(grade => (
                                      <div
                                        key={`grade-${grade.grade}`}
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
                                    ))}
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
                                      {
                                        getProductAvailability(product)
                                          .harvestSeason
                                      }
                                    </span>
                                  </div>
                                  {getProductAvailability(product)
                                    .nextHarvestDate && (
                                    <div className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 p-3">
                                      <span className="text-sm text-blue-700">
                                        Next Harvest
                                      </span>
                                      <span className="font-medium text-blue-800">
                                        {getProductAvailability(
                                          product
                                        ).nextHarvestDate?.toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between rounded border border-purple-200 bg-purple-50 p-3">
                                    <span className="text-sm text-purple-700">
                                      Production Capacity
                                    </span>
                                    <span className="font-medium text-purple-800">
                                      {
                                        getProductAvailability(product)
                                          .productionCapacity
                                      }{' '}
                                      MT/month
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Warehouse Locations */}
                              {getProductAvailability(product)
                                .warehouseLocations && (
                                <div className="mb-6">
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Warehouse Locations
                                  </h4>
                                  <div className="space-y-2">
                                    {getProductAvailability(
                                      product
                                    ).warehouseLocations?.map(location => (
                                      <div
                                        key={`location-${location.location}`}
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
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Forecast Data */}
                              {getProductAvailability(product).forecastData && (
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
                                          getProductAvailability(product)
                                            .forecastData?.expectedDemand
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
                                          getProductAvailability(product)
                                            .forecastData?.plannedProduction
                                        }{' '}
                                        MT
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Risk Factors */}
                              {getProductAvailability(product).forecastData
                                ?.riskFactors && (
                                <div>
                                  <h4 className="mb-3 text-sm font-semibold text-coffee-700">
                                    Risk Factors
                                  </h4>
                                  <div className="space-y-2">
                                    {getProductAvailability(
                                      product
                                    ).forecastData?.riskFactors?.map(
                                      (risk: string) => (
                                        <div
                                          key={`risk-${risk.replace(/\s+/g, '-').toLowerCase()}`}
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
                              {getProductAvailability(product).reorderLevel &&
                                getProductAvailability(product)
                                  .availableQuantity &&
                                getProductAvailability(product)
                                  .availableQuantity! <=
                                  getProductAvailability(product)
                                    .reorderLevel! && (
                                  <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <div className="flex items-center">
                                      <AlertCircle className="mr-3 h-5 w-5 text-yellow-600" />
                                      <div>
                                        <h4 className="text-sm font-semibold text-yellow-800">
                                          Reorder Alert
                                        </h4>
                                        <p className="text-xs text-yellow-700">
                                          Stock level is below reorder threshold
                                          (
                                          {
                                            getProductAvailability(product)
                                              .reorderLevel
                                          }{' '}
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
                                        {getProductOrigin(product).country}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <MapPin className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Region:{' '}
                                      <span className="font-semibold">
                                        {getProductOrigin(product).region},{' '}
                                        {getProductOrigin(product).province}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Thermometer className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Altitude:{' '}
                                      <span className="font-semibold">
                                        {getProductOrigin(product).altitude}m
                                        above sea level
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
                                        {
                                          getProductOrigin(product)
                                            .harvestSeason
                                        }
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Award className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Farming Method:{' '}
                                      <span className="font-semibold">
                                        {
                                          getProductOrigin(product)
                                            .farmingMethod
                                        }
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center rounded-lg bg-coffee-50 p-3">
                                    <Scale className="mr-3 h-5 w-5 text-coffee-600" />
                                    <span className="text-coffee-800">
                                      Production Capacity:{' '}
                                      <span className="font-semibold">
                                        {
                                          getProductAvailability(product)
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
                                  ([key, value]) => (
                                    <div
                                      key={`test-${key}`}
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
                                          {String(value)}
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
                              onEstimateCalculated={_estimate => {
                                // Optional: Handle estimate calculation for analytics or other purposes
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
                              {product.documents?.map(doc => (
                                <div
                                  key={`doc-${doc.id}`}
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
                                          {doc.name}
                                        </p>
                                        {doc.description && (
                                          <p className="mb-2 text-sm leading-relaxed text-coffee-600">
                                            {doc.description}
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
                                            {(
                                              doc.language || 'EN'
                                            ).toUpperCase()}
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
                  const _productName = relatedProduct.name || '';
                  const productDescription = relatedProduct.description || '';
                  return {
                    id: relatedProduct.id,
                    name: relatedProduct.name,
                    shortDescription: productDescription,
                    images: relatedProduct.images.map(img => ({
                      url: img.url,
                      alt: img.alt || '',
                      isPrimary: img.isPrimary || false,
                    })),
                    pricing: {
                      basePrice: getProductPricing(relatedProduct).basePrice,
                      unit: getProductPricing(relatedProduct).unit,
                      minimumOrder:
                        getProductPricing(relatedProduct).minimumOrder,
                      incoterms: [getProductPricing(relatedProduct).incoterms],
                    },
                    grade: relatedProduct.grade,
                    origin: {
                      region: getProductOrigin(relatedProduct).region,
                      country: getProductOrigin(relatedProduct).country,
                    },
                    processingMethod: getProcessingMethod(relatedProduct),
                    certifications:
                      relatedProduct.certifications?.map(
                        cert => cert.certification.name
                      ) || [],
                    availability: {
                      inStock: getProductAvailability(relatedProduct).inStock,
                      leadTime: getProductAvailability(relatedProduct).leadTime,
                    },
                    isFeatured: relatedProduct.isFeatured,
                    specifications: {
                      moisture: getSpecificationValue(
                        relatedProduct.specificationItems,
                        'moisture'
                      ),
                      screenSize: getSpecificationValue(
                        relatedProduct.specificationItems,
                        'screenSize'
                      ),
                      defectRate: getSpecificationValue(
                        relatedProduct.specificationItems,
                        'defectRate'
                      ),
                      cuppingScore:
                        parseInt(
                          getSpecificationValue(
                            relatedProduct.specificationItems,
                            'cuppingScore'
                          )
                        ) || 0,
                    },
                  };
                })}
                currentProduct={{
                  id: product.id,
                  type: product.coffeeType,
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
