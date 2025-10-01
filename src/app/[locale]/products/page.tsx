import { Search, Filter, Eye, ShoppingCart, Coffee } from 'lucide-react';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { SEOHead } from '@/presentation/components/seo';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
// Import our design system components
import {
  CoffeeHeading,
  SectionHeading,
  GoldButton,
  CoffeeButton,
} from '@/shared/components/design-system';
import {
  CertificationBadge,
  CoffeeGradeIndicator,
  OriginFlag,
  ProcessingMethodBadge,
} from '@/shared/components/design-system';
import {
  HeroSection,
  ContentSection,
  ContentContainer,
  ProductGrid,
} from '@/shared/components/design-system/layout';
import { 
  generateMetadata as generateSEOMetadata,
  generateOrganizationSchema,
} from '@/shared/utils/seo-utils';
import { generateB2BProductSchema } from '@/shared/utils/enhanced-structured-data';

interface ProductsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return generateSEOMetadata({
    title: 'Premium Vietnamese Coffee Products - Robusta & Arabica Beans',
    description: 'Discover our exceptional range of premium Vietnamese coffee products. High-quality Robusta and Arabica beans sourced directly from Vietnam\'s finest coffee regions for B2B partners worldwide.',
    keywords: [
      'vietnamese coffee products',
      'robusta coffee beans',
      'arabica coffee beans',
      'premium coffee export',
      'coffee wholesale',
      'b2b coffee products',
      'specialty coffee beans',
      'coffee sourcing vietnam',
      'coffee grade 1',
      'organic coffee beans'
    ],
    locale,
    url: `/${locale}/products`,
    type: 'website',
  });
}

// Mock data - will be replaced with real data from repository
const mockProducts = [
  {
    id: '1',
    sku: 'ROB-G1-NAT-001',
    name: 'Premium Robusta Grade 1',
    shortDescription:
      'High-quality natural processed Robusta from Dak Lak province',
    type: 'ROBUSTA',
    grade: 'GRADE_1',
    processingMethod: 'NATURAL',
    origin: {
      region: 'Dak Lak',
      province: 'Dak Lak',
      altitude: 500,
    },
    pricing: {
      basePrice: 2850,
      currency: 'USD',
      unit: 'MT',
    },
    availability: {
      inStock: true,
      stockQuantity: 150,
      leadTime: 14,
    },
    certifications: ['ORGANIC', 'RAINFOREST_ALLIANCE'],
    images: [
      {
        url: '/images/products/robusta-grade1.jpg',
        alt: 'Premium Robusta Grade 1 Coffee Beans',
        isPrimary: true,
      },
    ],
    isFeatured: true,
    specifications: {
      moisture: 12.5,
      screenSize: '18+',
      defectRate: 0.5,
    },
  },
  {
    id: '2',
    sku: 'ARA-SP-WAS-002',
    name: 'Specialty Arabica Washed',
    shortDescription: 'Premium washed Arabica from Lam Dong highlands',
    type: 'ARABICA',
    grade: 'SPECIALTY',
    processingMethod: 'WASHED',
    origin: {
      region: 'Lam Dong',
      province: 'Lam Dong',
      altitude: 1200,
    },
    pricing: {
      basePrice: 4200,
      currency: 'USD',
      unit: 'MT',
    },
    availability: {
      inStock: true,
      stockQuantity: 80,
      leadTime: 21,
    },
    certifications: ['ORGANIC', 'FAIR_TRADE'],
    images: [
      {
        url: '/images/products/arabica-specialty.jpg',
        alt: 'Specialty Arabica Washed Coffee Beans',
        isPrimary: true,
      },
    ],
    isFeatured: true,
    specifications: {
      moisture: 11.0,
      screenSize: '16+',
      defectRate: 0.2,
      cuppingScore: 85,
    },
  },
  {
    id: '3',
    sku: 'ROB-G2-HON-003',
    name: 'Robusta Grade 2 Honey',
    shortDescription: 'Honey processed Robusta with unique flavor profile',
    type: 'ROBUSTA',
    grade: 'GRADE_2',
    processingMethod: 'HONEY',
    origin: {
      region: 'Gia Lai',
      province: 'Gia Lai',
      altitude: 600,
    },
    pricing: {
      basePrice: 2650,
      currency: 'USD',
      unit: 'MT',
    },
    availability: {
      inStock: true,
      stockQuantity: 200,
      leadTime: 10,
    },
    certifications: ['RAINFOREST_ALLIANCE'],
    images: [
      {
        url: '/images/products/robusta-honey.jpg',
        alt: 'Robusta Grade 2 Honey Processed Coffee Beans',
        isPrimary: true,
      },
    ],
    isFeatured: false,
    specifications: {
      moisture: 12.0,
      screenSize: '16+',
      defectRate: 1.0,
    },
  },
];

const coffeeTypes = ['ALL', 'ROBUSTA', 'ARABICA', 'SPECIALTY', 'BLEND'];
const grades = [
  'ALL',
  'GRADE_1',
  'GRADE_2',
  'SPECIALTY',
  'SCREEN_18',
  'SCREEN_16',
];
const processingMethods = ['ALL', 'NATURAL', 'WASHED', 'HONEY', 'WET_HULLED'];

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('products');

  // Generate structured data for the products page
  const organizationSchema = generateOrganizationSchema();
  
  // Generate product collection schema
  const productCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Premium Vietnamese Coffee Products',
    description: 'Discover our exceptional range of premium Vietnamese coffee products. High-quality Robusta and Arabica beans sourced directly from Vietnam\'s finest coffee regions.',
    url: `https://thegreatbeans.com/${locale}/products`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: mockProducts.length,
      itemListElement: mockProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: generateB2BProductSchema({
          name: product.name,
          description: product.shortDescription,
          sku: product.sku,
          price: product.pricing.basePrice,
          currency: product.pricing.currency,
          availability: product.availability.inStock ? 'InStock' : 'OutOfStock',
          category: `${product.type} Coffee`,
          brand: 'The Great Beans',
          origin: `${product.origin.region}, Vietnam`,
          certifications: product.certifications,
          specifications: product.specifications,
          images: product.images.map(img => img.url),
          url: `https://thegreatbeans.com/${locale}/products/${product.id}`,
        }),
      })),
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
          name: 'Products',
          item: `https://thegreatbeans.com/${locale}/products`,
        },
      ],
    },
  };

  return (
    <>
      <SEOHead
        structuredData={[organizationSchema, productCollectionSchema]}
        breadcrumbs={[
          { name: 'Home', url: `/${locale}` },
          { name: 'Products', url: `/${locale}/products` },
        ]}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection className="bg-gradient-to-r from-forest-600 to-forest-700 py-20 text-white">
        <ContentContainer className="text-center">
          <CoffeeHeading size="4xl" className="mb-6 text-white">
            Premium Vietnamese Coffee Products
          </CoffeeHeading>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-forest-50 md:text-2xl">
            Discover our exceptional range of Robusta and Arabica beans, sourced
            directly from Vietnam&apos;s finest coffee regions
          </p>
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <GoldButton size="lg">
              <Coffee className="mr-2 h-5 w-5" />
              Browse Catalog
            </GoldButton>
            <CoffeeButton
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-forest-600"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Request Quote
            </CoffeeButton>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-400">500+</div>
              <div className="text-forest-100">Global Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-400">10+</div>
              <div className="text-forest-100">Export Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-400">96+</div>
              <div className="text-forest-100">Tons/Day Production</div>
            </div>
          </div>
        </ContentContainer>
      </HeroSection>

      <ContentSection className="py-12">
        <ContentContainer>
          {/* Filters Section */}
          <Card className="mb-12 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-forest-50 to-sage-50">
              <CardTitle className="flex items-center text-forest-800">
                <Filter className="mr-2 h-5 w-5" />
                Filter Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Search */}
                <div className="md:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-forest-700">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-forest-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full rounded-md border border-forest-200 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                </div>

                {/* Coffee Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-forest-700">
                    Coffee Type
                  </label>
                  <select className="w-full rounded-md border border-forest-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-forest-500">
                    {coffeeTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-forest-700">
                    Grade
                  </label>
                  <select className="w-full rounded-md border border-forest-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-forest-500">
                    {grades.map(grade => (
                      <option key={grade} value={grade}>
                        {grade.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Processing Method Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-forest-700">
                    Processing
                  </label>
                  <select className="w-full rounded-md border border-forest-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-forest-500">
                    {processingMethods.map(method => (
                      <option key={method} value={method}>
                        {method.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-forest-600">
                  Showing {mockProducts.length} products
                </p>
                <div className="flex gap-2">
                  <CoffeeButton variant="outline" size="sm">
                    Reset Filters
                  </CoffeeButton>
                  <GoldButton size="sm">Apply Filters</GoldButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <ProductGrid>
            {mockProducts.map(product => (
              <Card
                key={product.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-forest-glow"
                data-testid="product-card"
              >
                <div className="relative aspect-video bg-forest-50">
                  <Image
                    src="/images/coffee-placeholder.jpg"
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.isFeatured && (
                    <Badge className="absolute right-2 top-2 bg-emerald-500 text-white shadow-emerald-soft">
                      Featured
                    </Badge>
                  )}
                  <Badge
                    variant={product.availability.inStock ? 'default' : 'destructive'}
                    className="absolute left-2 top-2"
                  >
                    {product.availability.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <CoffeeGradeIndicator grade={product.grade} />
                    <ProcessingMethodBadge method={product.processingMethod} />
                    <OriginFlag
                      country="Vietnam"
                      region={product.origin.region}
                    />
                  </div>
                  <CardTitle className="text-lg text-forest-800">{product.name}</CardTitle>
                  <CardDescription className="text-forest-600">{product.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {product.certifications.map(cert => (
                        <CertificationBadge key={cert} certification={cert} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded bg-forest-50 p-2 border border-forest-100">
                        <span className="font-medium text-forest-700">Moisture:</span>{' '}
                        <span className="text-forest-600">{product.specifications.moisture}%</span>
                      </div>
                      <div className="rounded bg-forest-50 p-2 border border-forest-100">
                        <span className="font-medium text-forest-700">Screen:</span>{' '}
                        <span className="text-forest-600">{product.specifications.screenSize}</span>
                      </div>
                      <div className="rounded bg-forest-50 p-2 border border-forest-100">
                        <span className="font-medium text-forest-700">Defects:</span>{' '}
                        <span className="text-forest-600">{product.specifications.defectRate}%</span>
                      </div>
                      {product.specifications.cuppingScore && (
                        <div className="rounded bg-sage-50 p-2 border border-sage-100">
                          <span className="font-medium text-sage-700">Cupping:</span>{' '}
                          <span className="text-sage-600">{product.specifications.cuppingScore}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-forest-100">
                      <span className="text-forest-800 text-xl font-bold">
                        ${product.pricing.basePrice.toLocaleString()}/
                        {product.pricing.unit}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="forest-outline" size="sm" asChild className="hover:shadow-forest-medium">
                          <Link href={`/${locale}/products/${product.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-soft">
                          <Link href={`/${locale}/quote?product=${product.id}`}>
                            <ShoppingCart className="mr-1 h-4 w-4" />
                            Quote
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ProductGrid>

          {/* Load More / Pagination */}
          <div className="mt-12 text-center">
            <Button variant="forest" size="lg" className="shadow-forest-medium">
              Load More Products
            </Button>
          </div>
        </ContentContainer>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection className="bg-gradient-to-r from-forest-600 to-forest-700 py-16 text-white">
        <ContentContainer className="text-center">
          <SectionHeading size="2xl" className="mb-4 text-white">
            Can&apos;t Find What You&apos;re Looking For?
          </SectionHeading>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-forest-50">
            Our team can source custom coffee products to meet your specific
            requirements. Contact us for personalized sourcing solutions.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <GoldButton size="lg">
              <Coffee className="mr-2 h-5 w-5" />
              Custom Sourcing
            </GoldButton>
            <CoffeeButton
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-forest-600"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Contact Sales Team
            </CoffeeButton>
          </div>
        </ContentContainer>
      </ContentSection>
    </div>
    </>
  );
}
