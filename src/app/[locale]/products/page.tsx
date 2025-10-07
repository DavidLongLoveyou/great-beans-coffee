'use client';

import { Coffee, ShoppingCart, Filter, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { ProductFilters, type ProductFilters as ProductFiltersType } from '@/presentation/components/catalog/ProductFilters';
import { ProductGrid } from '@/presentation/components/catalog/ProductGrid';
import type { Product } from '@/presentation/components/catalog/ProductGrid';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import { ServerButton } from '@/presentation/components/ui/server-button';
import type {
  CoffeeGrade,
  ProcessingMethod,
  CoffeeCertification,
} from '@/shared/components/design-system/types';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';
import { SectionHeading } from '@/shared/components/typography/SectionHeading';

// Mock data - will be replaced with real data from repository
const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'ROB-G1-NAT-001',
    name: 'Premium Robusta Grade 1',
    shortDescription:
      'High-quality natural processed Robusta from Dak Lak province',
    type: 'ROBUSTA',
    grade: 'grade-1' as CoffeeGrade,
    processingMethod: 'natural' as ProcessingMethod,
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
    certifications: ['organic', 'rainforest-alliance'] as CoffeeCertification[],
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
    grade: 'specialty' as CoffeeGrade,
    processingMethod: 'washed' as ProcessingMethod,
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
    certifications: ['organic', 'fair-trade'] as CoffeeCertification[],
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
    grade: 'grade-2' as CoffeeGrade,
    processingMethod: 'honey' as ProcessingMethod,
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
    certifications: ['rainforest-alliance'] as CoffeeCertification[],
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

export default function ProductsPage() {
  const t = useTranslations('products');
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: '',
    coffeeType: 'ALL',
    grade: 'ALL',
    processingMethod: 'ALL',
    certification: 'ALL',
    priceRange: { min: 0, max: 10000 },
    inStock: null,
  });

  // Update filtered products when filters change
  useEffect(() => {
    let filtered = [...mockProducts];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.shortDescription
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.coffeeType && filters.coffeeType !== 'ALL') {
      filtered = filtered.filter(
        product => product.type === filters.coffeeType
      );
    }

    // Apply grade filter
    if (filters.grade && filters.grade !== 'ALL') {
      filtered = filtered.filter(product => product.grade === filters.grade);
    }

    // Apply processing method filter
    if (filters.processingMethod && filters.processingMethod !== 'ALL') {
      filtered = filtered.filter(
        product => product.processingMethod === filters.processingMethod
      );
    }

    // Apply certification filter
    if (filters.certification && filters.certification !== 'ALL') {
      filtered = filtered.filter(product =>
        product.certifications.includes(
          filters.certification as CoffeeCertification
        )
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        product =>
          product.pricing.basePrice >= filters.priceRange.min &&
          product.pricing.basePrice <= filters.priceRange.max
      );
    }

    // Apply stock status filter
    if (filters.inStock !== null) {
      filtered = filtered.filter(
        product => product.availability.inStock === filters.inStock
      );
    }

    setFilteredProducts(filtered);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white">
      {/* Hero Section */}
      <ContentSection className="bg-gradient-to-r from-forest-600 to-forest-700 py-20 text-white">
        <ContentContainer>
          <div className="text-center">
            <CoffeeHeading size="3xl" className="mb-6 text-white">
              Premium Vietnamese Coffee Products
            </CoffeeHeading>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-forest-50">
              Discover our extensive range of high-quality Vietnamese coffee
              beans, from premium Robusta to specialty Arabica, all sourced
              directly from the finest farms in Vietnam&apos;s Central
              Highlands.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <ServerButton
                size="lg"
                className="bg-amber-600 text-white hover:bg-amber-700"
              >
                <Filter className="mr-2 h-5 w-5" />
                Filter Products
              </ServerButton>
              <ServerButton
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-forest-600"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Request Quote
              </ServerButton>
            </div>
          </div>
        </ContentContainer>
      </ContentSection>

      <ContentSection className="py-8">
        <ContentContainer>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                totalProducts={mockProducts.length}
                filteredProducts={filteredProducts.length}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <ProductGrid
                products={filteredProducts}
                locale="en"
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        </ContentContainer>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection className="bg-gradient-to-r from-forest-600 to-forest-700 py-16 text-white">
        <ContentContainer className="text-center">
          <SectionHeading size="xl" className="mb-4 text-white">
            Can&apos;t Find What You&apos;re Looking For?
          </SectionHeading>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-forest-50">
            Our team can source custom coffee products to meet your specific
            requirements. Contact us for personalized sourcing solutions.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <ServerButton
              size="lg"
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <Search className="mr-2 h-5 w-5" />
              Custom Sourcing
            </ServerButton>
            <ServerButton
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-forest-600"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Contact Sales Team
            </ServerButton>
          </div>
        </ContentContainer>
      </ContentSection>
    </div>
  );
}
