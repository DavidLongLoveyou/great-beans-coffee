'use client';

import {
  Coffee,
  ShoppingCart,
  Filter,
  Search,
  Download,
  FileText,
  Package,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import {
  ProductFilters,
  type ProductFilters as ProductFiltersType,
} from '@/presentation/components/catalog/ProductFilters';
import { ProductGrid } from '@/presentation/components/catalog/ProductGrid';
import type { Product } from '@/presentation/components/catalog/ProductGrid';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import { ServerButton } from '@/presentation/components/ui/server-button';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import type {
  CoffeeGrade,
  ProcessingMethod,
  CoffeeCertification,
} from '@/shared/components/design-system/types';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';
import { SectionHeading } from '@/shared/components/typography/SectionHeading';
import {
  VIETNAMESE_COFFEE_CATALOG,
  searchProducts,
  filterProducts,
  type CatalogProduct,
  CoffeeType,
  CoffeeGrade as CatalogCoffeeGrade,
  ProcessingMethod as CatalogProcessingMethod,
  CertificationType,
  type ProductFilters as CatalogProductFilters,
} from '@/data/product-catalog';

// Convert catalog product to grid product format
const convertCatalogToGridProduct = (
  catalogProduct: CatalogProduct,
  locale: string = 'en'
): Product => {
  const primaryImage =
    catalogProduct.images.find(img => img.isPrimary) ||
    catalogProduct.images[0];

  return {
    id: catalogProduct.id,
    sku: catalogProduct.sku,
    name: catalogProduct.name[locale] || catalogProduct.name.en || '',
    shortDescription:
      catalogProduct.description[locale] || catalogProduct.description.en || '',
    type: catalogProduct.type,
    grade: catalogProduct.grade.toLowerCase().replace('_', '-') as CoffeeGrade,
    processingMethod:
      catalogProduct.processingMethod.toLowerCase() as ProcessingMethod,
    origin: {
      region: catalogProduct.origin.region,
      province: catalogProduct.origin.province,
      altitude: catalogProduct.origin.altitude,
    },
    pricing: {
      basePrice: catalogProduct.pricing.basePrice,
      currency: catalogProduct.pricing.currency,
      unit: catalogProduct.pricing.unit,
    },
    availability: {
      inStock: catalogProduct.availability.inStock,
      stockQuantity: catalogProduct.availability.stockQuantity,
      leadTime: catalogProduct.availability.leadTime,
      harvestSeason: catalogProduct.availability.harvestSeason,
    },
    certifications: catalogProduct.certifications.map(cert =>
      cert.toLowerCase().replace('_', '-')
    ) as CoffeeCertification[],
    images: catalogProduct.images.map(img => ({
      url: img.url,
      alt: img.alt[locale] || img.alt.en || '',
      isPrimary: img.isPrimary,
    })),
    isFeatured: catalogProduct.isFeatured,
    specifications: {
      moisture: catalogProduct.specifications.moisture,
      screenSize: catalogProduct.specifications.screenSize,
      defectRate: catalogProduct.specifications.defectRate,
      cuppingScore: catalogProduct.specifications.cuppingScore || 0,
    },
  };
};

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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [showBulkActions, setShowBulkActions] = useState(false);
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

  // Initialize products from catalog
  useEffect(() => {
    const products = VIETNAMESE_COFFEE_CATALOG.filter(
      product => product.isActive
    ).map(product => convertCatalogToGridProduct(product, 'en'));
    setAllProducts(products);
    setFilteredProducts(products);
  }, []);

  // Update filtered products when filters change
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.shortDescription
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          product.origin.region
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          product.sku.toLowerCase().includes(filters.search.toLowerCase())
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

    // Apply advanced B2B filters
    // Origin filter
    if (filters.origin && filters.origin !== 'ALL') {
      filtered = filtered.filter(
        product =>
          product.origin.region
            .toLowerCase()
            .includes(filters.origin.toLowerCase()) ||
          product.origin.province
            ?.toLowerCase()
            .includes(filters.origin.toLowerCase())
      );
    }

    // Harvest season filter (based on availability data)
    if (filters.harvestSeason && filters.harvestSeason !== 'ALL') {
      // This would need to be implemented based on harvest season data in the catalog
      // For now, we'll filter based on availability patterns
      filtered = filtered.filter(product => {
        // Placeholder logic - in real implementation, this would check harvest season data
        return true;
      });
    }

    // Minimum order range filter - disabled as minimumOrder is not part of Product type
    // if (filters.minimumOrderRange) {
    //   filtered = filtered.filter(product => {
    //     const minOrder = 0; // Default value since minimumOrder is not available
    //     return (
    //       minOrder >= filters.minimumOrderRange.min &&
    //       minOrder <= filters.minimumOrderRange.max
    //     );
    //   });
    // }

    // Cupping score range filter
    if (filters.cuppingScoreRange) {
      filtered = filtered.filter(product => {
        const cuppingScore = product.specifications?.cuppingScore || 0;
        return (
          cuppingScore >= filters.cuppingScoreRange.min &&
          cuppingScore <= filters.cuppingScoreRange.max
        );
      });
    }

    // Altitude range filter
    if (filters.altitudeRange) {
      filtered = filtered.filter(product => {
        const altitude = product.origin.altitude || 0;
        return (
          altitude >= filters.altitudeRange.min &&
          altitude <= filters.altitudeRange.max
        );
      });
    }

    // Multiple certifications filter
    if (filters.certifications && filters.certifications.length > 0) {
      filtered = filtered.filter(product =>
        filters.certifications.some(cert =>
          product.certifications.includes(cert as CoffeeCertification)
        )
      );
    }

    // Incoterms filter (would need to be added to product data)
    if (filters.incoterms && filters.incoterms !== 'ALL') {
      // Placeholder - in real implementation, this would check Incoterms data
      filtered = filtered.filter(product => {
        // This would check against product.shipping.incoterms or similar
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

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

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vietnamese-coffee-products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate bulk quote request
  const requestBulkQuote = () => {
    const selectedProductData = filteredProducts.filter(p =>
      selectedProducts.has(p.id)
    );
    const quoteData = {
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
    console.log('Bulk quote request:', quoteData);
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
                totalProducts={allProducts.length}
                filteredProducts={filteredProducts.length}
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
                    {filteredProducts.length} Product
                    {filteredProducts.length !== 1 ? 's' : ''} Found
                  </h2>
                  {filteredProducts.length > 0 && (
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
                    disabled={filteredProducts.length === 0}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export Catalog
                  </Button>
                </div>
              </div>

              <ProductGrid
                products={filteredProducts}
                locale="en"
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
                showSelection={true}
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
