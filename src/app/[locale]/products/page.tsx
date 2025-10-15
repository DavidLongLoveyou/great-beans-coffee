'use client';

import {
  Coffee,
  ShoppingCart,
  Filter,
  Search,
  Download,
  FileText,
  Package,
  Loader2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';

import { downloadCSV } from '@/shared/utils/download';

import type { CoffeeCertification } from '@/shared/components/design-system/types';

import {
  ProductFilters,
  type ProductFilters as ProductFiltersType,
} from '@/presentation/components/catalog/ProductFilters';
import { ProductGrid } from '@/presentation/components/catalog/ProductGrid';
import type { Product } from '@/presentation/components/catalog/ProductGrid';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';

import { Button } from '@/presentation/components/ui/button';
import { ServerButton } from '@/presentation/components/ui/server-button';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';
import { SectionHeading } from '@/shared/components/typography/SectionHeading';

// API Types
interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  coffeeType: string;
  grade: string;
  processing: string;
  origin: string;
  altitude: number;
  cuppingScore: number;
  harvestSeason: string;
  minimumOrder: number;
  inStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  certifications: Array<{
    certification: {
      name: string;
      type: string;
    };
  }>;
  pricing: Array<{
    type: string;
    basePrice: number;
    currency: string;
    minimumQuantity: number;
  }>;
  translations: Array<{
    locale: string;
    name: string;
    description: string;
  }>;
}

interface ApiResponse {
  products: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    coffeeTypes: string[];
    grades: string[];
    processingMethods: string[];
    origins: string[];
    certifications: string[];
  };
}

// Convert API product to grid product format
const convertApiToGridProduct = (
  apiProduct: ApiProduct,
  locale: string = 'en'
): Product => {
  // Get localized content
  const translation = apiProduct.translations?.find(t => t.locale === locale);
  const localizedName = translation?.name || apiProduct.name;
  const localizedDescription =
    translation?.description || apiProduct.description;

  // Convert certifications
  const certifications: CoffeeCertification[] =
    apiProduct.certifications?.map(cert => {
      // Map certification names to CoffeeCertification type
      const certName = cert.certification.name
        .toLowerCase()
        .replace(/\s+/g, '-');
      const validCertifications: Record<string, CoffeeCertification> = {
        organic: 'organic',
        'fair-trade': 'fair-trade',
        fairtrade: 'fair-trade',
        'rainforest-alliance': 'rainforest-alliance',
        utz: 'utz',
        'bird-friendly': 'bird-friendly',
        'shade-grown': 'shade-grown',
        'direct-trade': 'direct-trade',
        'c-cafe': 'c-cafe',
        '4c': '4c',
        'iso-22000': 'iso-22000',
        haccp: 'haccp',
        brc: 'brc',
        ifs: 'ifs',
      };
      return validCertifications[certName] || 'organic';
    }) || [];

  // Get pricing information
  const pricing = apiProduct.pricing?.[0] || {
    type: 'FOB',
    basePrice: 0,
    currency: 'USD',
    minimumQuantity: 1000,
  };

  return {
    id: apiProduct.id,
    sku: apiProduct.sku,
    name: localizedName,
    shortDescription: localizedDescription,
    type: apiProduct.coffeeType,
    grade: apiProduct.grade as any,
    processingMethod: apiProduct.processing as any,
    origin: {
      region: apiProduct.origin,
      province: apiProduct.origin,
      altitude: apiProduct.altitude,
    },
    pricing: {
      basePrice: pricing.basePrice,
      currency: pricing.currency,
      unit: 'MT',
    },
    availability: {
      inStock: apiProduct.inStock,
      stockQuantity: 0, // Default value since not provided by API
      leadTime: 30, // Default value
      harvestSeason: apiProduct.harvestSeason,
    },
    certifications: certifications,
    images: (apiProduct.images || []).map((img: string, index: number) => ({
      url: img,
      alt: `${localizedName} - Image ${index + 1}`,
      isPrimary: index === 0,
    })),
    isFeatured: apiProduct.isFeatured,
    specifications: {
      moisture: 12, // Default value since not provided by API
      screenSize: '16+', // Default value
      defectRate: 5, // Default value
      cuppingScore: apiProduct.cuppingScore,
    },
  };
};

const _coffeeTypes = ['ALL', 'ROBUSTA', 'ARABICA', 'SPECIALTY', 'BLEND'];
const _grades = [
  'ALL',
  'GRADE_1',
  'GRADE_2',
  'SPECIALTY',
  'SCREEN_18',
  'SCREEN_16',
];
const _processingMethods = ['ALL', 'NATURAL', 'WASHED', 'HONEY', 'WET_HULLED'];

export default function ProductsPage() {
  const _t = useTranslations('products');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Initialize filters
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: '',
    coffeeType: 'ALL',
    grade: 'ALL',
    processingMethod: 'ALL',
    certification: 'ALL',
    priceRange: { min: 0, max: 10000 },
    inStock: null,
    // Advanced B2B filters
    origin: 'ALL',
    harvestSeason: 'ALL',
    minimumOrderRange: { min: 0, max: 1000 },
    cuppingScoreRange: { min: 0, max: 100 },
    altitudeRange: { min: 0, max: 2000 },
    certifications: [],
    incoterms: 'ALL',
  });

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add filters to query
      if (filters.search) params.append('search', filters.search);
      if (filters.coffeeType !== 'ALL')
        params.append('coffeeType', filters.coffeeType);
      if (filters.grade !== 'ALL') params.append('grade', filters.grade);
      if (filters.processingMethod !== 'ALL')
        params.append('processing', filters.processingMethod);
      if (filters.origin !== 'ALL') params.append('origin', filters.origin);
      if (filters.inStock !== null)
        params.append('inStock', filters.inStock.toString());
      if (filters.priceRange.min > 0)
        params.append('minPrice', filters.priceRange.min.toString());
      if (filters.priceRange.max < 10000)
        params.append('maxPrice', filters.priceRange.max.toString());
      if (filters.cuppingScoreRange.min > 0)
        params.append(
          'minCuppingScore',
          filters.cuppingScoreRange.min.toString()
        );
      if (filters.cuppingScoreRange.max < 100)
        params.append(
          'maxCuppingScore',
          filters.cuppingScoreRange.max.toString()
        );
      if (filters.altitudeRange.min > 0)
        params.append('minAltitude', filters.altitudeRange.min.toString());
      if (filters.altitudeRange.max < 2000)
        params.append('maxAltitude', filters.altitudeRange.max.toString());
      if (filters.certifications.length > 0) {
        filters.certifications.forEach(cert =>
          params.append('certifications', cert)
        );
      }

      const response = await fetch(`/api/products/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ApiResponse = await response.json();

      // Convert API products to grid format
      const convertedProducts = data.products.map(product =>
        convertApiToGridProduct(product, 'en')
      );

      setProducts(convertedProducts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Fetch products on component mount and filter changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply local filtering for immediate UI feedback (minimal since API handles most filtering)
  // This is mainly for UI responsiveness while API request is in progress
  const filteredProducts = products;

  // Handle product selection for bulk actions
  const handleProductSelect = (productId: string, selected: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (selected) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  // Handle select all products
  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } else {
      const allIds = new Set(filteredProducts.map(p => p.id));
      setSelectedProducts(allIds);
      setShowBulkActions(true);
    }
  };

  // Export selected products to CSV
  const exportToCSV = () => {
    const selectedProductData = filteredProducts.filter(p =>
      selectedProducts.has(p.id)
    );
    const csvContent = [
      [
        'SKU',
        'Name',
        'Type',
        'Grade',
        'Processing',
        'Origin',
        'Price (USD/kg)',
        'In Stock',
        'Certifications',
      ].join(','),
      ...selectedProductData.map(p =>
        [
          p.sku,
          `"${p.name}"`,
          p.type,
          p.grade,
          p.processingMethod,
          `"${p.origin.region}, ${p.origin.province}"`,
          p.pricing.basePrice,
          p.availability.inStock ? 'Yes' : 'No',
          `"${p.certifications.join(', ')}"`,
        ].join(',')
      ),
    ].join('\n');

    downloadCSV(
      csvContent,
      `vietnamese-coffee-products-${new Date().toISOString().split('T')[0]}`
    );
  };

  // Generate bulk quote request
  const requestBulkQuote = () => {
    const selectedProductData = filteredProducts.filter(p =>
      selectedProducts.has(p.id)
    );
    const _quoteData = {
      products: selectedProductData.map(p => ({
        sku: p.sku,
        name: p.name,
        type: p.type,
        grade: p.grade,
        requestedQuantity: 1000, // Default quantity in kg
      })),
      requestDate: new Date().toISOString(),
      totalProducts: selectedProductData.length,
    };

    // In a real app, this would send to an API
    alert(
      `Quote request submitted for ${selectedProductData.length} products. Our sales team will contact you within 24 hours.`
    );

    // Clear selection
    setSelectedProducts(new Set());
    setShowBulkActions(false);
  };

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
                totalProducts={pagination.total}
                filteredProducts={filteredProducts.length}
                loading={loading}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Bulk Actions Toolbar */}
              {showBulkActions && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-800">
                        {selectedProducts.size} product
                        {selectedProducts.size !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={requestBulkQuote}
                        className="bg-amber-600 text-white hover:bg-amber-700"
                        size="sm"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Request Bulk Quote
                      </Button>
                      <Button
                        onClick={exportToCSV}
                        variant="outline"
                        size="sm"
                        className="border-amber-600 text-amber-600 hover:bg-amber-50"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedProducts(new Set());
                          setShowBulkActions(false);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:bg-amber-50"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Grid Header */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-forest-800">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <>
                        {pagination.total} Product
                        {pagination.total !== 1 ? 's' : ''} Found
                        {filteredProducts.length !== pagination.total && (
                          <span className="text-sm text-gray-500">
                            ({filteredProducts.length} shown)
                          </span>
                        )}
                      </>
                    )}
                  </h2>
                  {!loading && filteredProducts.length > 0 && (
                    <Button
                      onClick={handleSelectAll}
                      variant="outline"
                      size="sm"
                      className="border-forest-300 text-forest-600 hover:bg-forest-50"
                    >
                      {selectedProducts.size === filteredProducts.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    size="sm"
                    className="border-forest-300 text-forest-600 hover:bg-forest-50"
                    disabled={loading || filteredProducts.length === 0}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export Catalog
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
                  <span className="ml-2 text-forest-600">
                    Loading products...
                  </span>
                </div>
              ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                  <div className="text-red-600">
                    <Coffee className="mx-auto mb-2 h-8 w-8" />
                    <h3 className="mb-2 text-lg font-semibold">
                      Error Loading Products
                    </h3>
                    <p className="mb-4">{error}</p>
                    <Button
                      onClick={fetchProducts}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                  <Coffee className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-600">
                    No Products Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to see more products.
                  </p>
                </div>
              ) : (
                <>
                  <ProductGrid
                    products={filteredProducts}
                    locale="en"
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    selectedProducts={selectedProducts}
                    onProductSelect={handleProductSelect}
                    showSelection={true}
                  />

                  {/* Pagination Controls */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {(pagination.page - 1) * pagination.limit + 1}{' '}
                        to{' '}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}{' '}
                        of {pagination.total} products
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPagination(prev => ({
                              ...prev,
                              page: prev.page - 1,
                            }))
                          }
                          disabled={pagination.page <= 1 || loading}
                        >
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              const pageNum = i + 1;
                              const isCurrentPage = pageNum === pagination.page;

                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    isCurrentPage ? 'default' : 'outline'
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setPagination(prev => ({
                                      ...prev,
                                      page: pageNum,
                                    }))
                                  }
                                  disabled={loading}
                                  className={
                                    isCurrentPage
                                      ? 'bg-forest-600 text-white'
                                      : ''
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}

                          {pagination.totalPages > 5 && (
                            <>
                              <span className="px-2 text-gray-400">...</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setPagination(prev => ({
                                    ...prev,
                                    page: pagination.totalPages,
                                  }))
                                }
                                disabled={loading}
                              >
                                {pagination.totalPages}
                              </Button>
                            </>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPagination(prev => ({
                              ...prev,
                              page: prev.page + 1,
                            }))
                          }
                          disabled={
                            pagination.page >= pagination.totalPages || loading
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
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
