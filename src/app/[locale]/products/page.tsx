import { Search, Filter, Eye, ShoppingCart, Coffee } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { type Locale } from '@/i18n';
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

interface ProductsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection className="bg-gradient-to-r from-coffee-600 to-coffee-700 py-20 text-white">
        <ContentContainer className="text-center">
          <CoffeeHeading size="4xl" className="mb-6 text-white">
            Premium Vietnamese Coffee Products
          </CoffeeHeading>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-coffee-50 md:text-2xl">
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
              className="border-white text-white hover:bg-white hover:text-coffee-600"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Request Quote
            </CoffeeButton>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">500+</div>
              <div className="text-coffee-100">Global Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">10+</div>
              <div className="text-coffee-100">Export Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">96+</div>
              <div className="text-coffee-100">Tons/Day Production</div>
            </div>
          </div>
        </ContentContainer>
      </HeroSection>

      <ContentSection className="py-12">
        <ContentContainer>
          {/* Filters Section */}
          <Card className="mb-12 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-coffee-50 to-gold-50">
              <CardTitle className="flex items-center text-coffee-800">
                <Filter className="mr-2 h-5 w-5" />
                Filter Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Search */}
                <div className="md:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-coffee-700">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-coffee-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full rounded-md border border-coffee-200 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>
                </div>

                {/* Coffee Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-coffee-700">
                    Coffee Type
                  </label>
                  <select className="w-full rounded-md border border-coffee-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-coffee-500">
                    {coffeeTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-coffee-700">
                    Grade
                  </label>
                  <select className="w-full rounded-md border border-coffee-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-coffee-500">
                    {grades.map(grade => (
                      <option key={grade} value={grade}>
                        {grade.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Processing Method Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-coffee-700">
                    Processing
                  </label>
                  <select className="w-full rounded-md border border-coffee-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-coffee-500">
                    {processingMethods.map(method => (
                      <option key={method} value={method}>
                        {method.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-coffee-600">
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
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src="/images/coffee-placeholder.jpg"
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.isFeatured && (
                    <Badge className="bg-gold absolute right-2 top-2 text-white">
                      Featured
                    </Badge>
                  )}
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
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {product.certifications.map(cert => (
                        <CertificationBadge key={cert} certification={cert} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Moisture: {product.specifications.moisture}%</p>
                      <p>Screen: {product.specifications.screenSize}</p>
                      <p>Defects: {product.specifications.defectRate}%</p>
                      {product.specifications.cuppingScore && (
                        <p>Cupping: {product.specifications.cuppingScore}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-coffee text-xl font-bold">
                        ${product.pricing.basePrice.toLocaleString()}/
                        {product.pricing.unit}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/${locale}/products/${product.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
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
            <CoffeeButton variant="outline" size="lg">
              Load More Products
            </CoffeeButton>
          </div>
        </ContentContainer>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection className="bg-gradient-to-r from-coffee-600 to-coffee-700 py-16 text-white">
        <ContentContainer className="text-center">
          <SectionHeading size="2xl" className="mb-4 text-white">
            Can&apos;t Find What You&apos;re Looking For?
          </SectionHeading>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-coffee-50">
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
              className="border-white text-white hover:bg-white hover:text-coffee-600"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Contact Sales Team
            </CoffeeButton>
          </div>
        </ContentContainer>
      </ContentSection>
    </div>
  );
}
