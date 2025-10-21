'use client';

import {
  Eye,
  ShoppingCart,
  ArrowUpDown,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Scale,
  X,
} from '@/components/ui/icons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { getPrimaryImageUrl } from '@/shared/utils/image-utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { ServerButton } from '@/presentation/components/ui/server-button';
import {
  CertificationBadge,
  CoffeeGradeIndicator,
  OriginFlag,
  ProcessingMethodBadge,
  AdvancedProductComparison,
} from '@/shared/components/design-system/Coffee';
import type {
  CoffeeGrade,
  ProcessingMethod,
  CoffeeCertification,
} from '@/shared/components/design-system/types';
import { CardImage } from '@/shared/components/performance/OptimizedImage';

export interface Product {
  id: string;
  sku: string;
  name: string;
  shortDescription: string;
  type: string;
  grade: CoffeeGrade;
  processingMethod: ProcessingMethod;
  origin: {
    region: string;
    province: string;
    altitude: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    unit: string;
  };
  availability: {
    inStock: boolean;
    stockQuantity: number;
    leadTime: number;
    harvestSeason: string;
  };
  certifications: CoffeeCertification[];
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  isFeatured: boolean;
  specifications: {
    moisture: number;
    screenSize: string;
    defectRate: number;
    cuppingScore?: number;
  };
}

interface ProductGridProps {
  products: Product[];
  locale: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  selectedProducts?: Set<string>;
  onProductSelect?: (productId: string, selected: boolean) => void;
  showSelection?: boolean;
}

type SortOption =
  | 'name'
  | 'price-asc'
  | 'price-desc'
  | 'featured'
  | 'newest'
  | 'grade-asc'
  | 'grade-desc'
  | 'availability'
  | 'harvest-season'
  | 'cupping-score-asc'
  | 'cupping-score-desc'
  | 'altitude-asc'
  | 'altitude-desc';

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'grade-desc', label: 'Grade: Premium to Standard' },
  { value: 'grade-asc', label: 'Grade: Standard to Premium' },
  { value: 'availability', label: 'Availability: In Stock First' },
  { value: 'harvest-season', label: 'Harvest Season' },
  { value: 'cupping-score-desc', label: 'Cupping Score: High to Low' },
  { value: 'cupping-score-asc', label: 'Cupping Score: Low to High' },
  { value: 'altitude-desc', label: 'Altitude: High to Low' },
  { value: 'altitude-asc', label: 'Altitude: Low to High' },
  { value: 'newest', label: 'Newest First' },
];

const PRODUCTS_PER_PAGE = 12;

export function ProductGrid({
  products,
  locale,
  viewMode = 'grid',
  onViewModeChange,
  selectedProducts = new Set(),
  onProductSelect,
  showSelection = false,
}: ProductGridProps) {
  const _t = useTranslations('products');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [showComparison, setShowComparison] = useState(false);

  // Get selected products for comparison
  const selectedProductsArray = products.filter(product =>
    selectedProducts.has(product.id)
  );

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    // Helper function to get grade priority (higher number = better grade)
    const getGradePriority = (grade: CoffeeGrade): number => {
      const gradeMap: Record<CoffeeGrade, number> = {
        specialty: 10,
        premium: 9,
        'grade-1': 8,
        'grade-2': 7,
        'grade-3': 6,
        'grade-4': 5,
        'screen-18': 4,
        'screen-16': 3,
        'screen-14': 2,
        exchange: 1,
        standard: 0,
      };
      return gradeMap[grade] || 0;
    };

    // Helper function to parse harvest season for sorting
    const getHarvestSeasonPriority = (harvestSeason: string): number => {
      // Convert harvest season to a sortable number based on start month
      const monthMap: Record<string, number> = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
      };

      const firstMonth = harvestSeason.toLowerCase().split(/[\s-]+/)[0];
      return firstMonth ? monthMap[firstMonth] || 0 : 0;
    };

    // Helper function for safe string comparison
    const safeLocaleCompare = (a: Product, b: Product): number => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      return nameA.localeCompare(nameB);
    };

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => safeLocaleCompare(a, b));

      case 'price-asc':
        return sorted.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);

      case 'price-desc':
        return sorted.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);

      case 'featured':
        return sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return safeLocaleCompare(a, b);
        });

      case 'grade-desc':
        return sorted.sort((a, b) => {
          const gradeA = getGradePriority(a.grade);
          const gradeB = getGradePriority(b.grade);
          if (gradeA !== gradeB) return gradeB - gradeA; // Higher grade first
          return safeLocaleCompare(a, b); // Secondary sort by name
        });

      case 'grade-asc':
        return sorted.sort((a, b) => {
          const gradeA = getGradePriority(a.grade);
          const gradeB = getGradePriority(b.grade);
          if (gradeA !== gradeB) return gradeA - gradeB; // Lower grade first
          return safeLocaleCompare(a, b); // Secondary sort by name
        });

      case 'availability':
        return sorted.sort((a, b) => {
          // In stock first, then by stock quantity, then by lead time
          if (a.availability.inStock && !b.availability.inStock) return -1;
          if (!a.availability.inStock && b.availability.inStock) return 1;
          if (a.availability.inStock && b.availability.inStock) {
            const stockDiff =
              b.availability.stockQuantity - a.availability.stockQuantity;
            if (stockDiff !== 0) return stockDiff;
            return a.availability.leadTime - b.availability.leadTime; // Shorter lead time first
          }
          return safeLocaleCompare(a, b);
        });

      case 'harvest-season':
        return sorted.sort((a, b) => {
          const seasonA = getHarvestSeasonPriority(
            a.availability.harvestSeason
          );
          const seasonB = getHarvestSeasonPriority(
            b.availability.harvestSeason
          );
          if (seasonA !== seasonB) return seasonA - seasonB;
          return safeLocaleCompare(a, b);
        });

      case 'cupping-score-desc':
        return sorted.sort((a, b) => {
          const scoreA = a.specifications.cuppingScore || 0;
          const scoreB = b.specifications.cuppingScore || 0;
          if (scoreA !== scoreB) return scoreB - scoreA; // Higher score first
          return safeLocaleCompare(a, b);
        });

      case 'cupping-score-asc':
        return sorted.sort((a, b) => {
          const scoreA = a.specifications.cuppingScore || 0;
          const scoreB = b.specifications.cuppingScore || 0;
          if (scoreA !== scoreB) return scoreA - scoreB; // Lower score first
          return safeLocaleCompare(a, b);
        });

      case 'altitude-desc':
        return sorted.sort((a, b) => {
          const altA = a.origin.altitude;
          const altB = b.origin.altitude;
          if (altA !== altB) return altB - altA; // Higher altitude first
          return safeLocaleCompare(a, b);
        });

      case 'altitude-asc':
        return sorted.sort((a, b) => {
          const altA = a.origin.altitude;
          const altB = b.origin.altitude;
          if (altA !== altB) return altA - altB; // Lower altitude first
          return safeLocaleCompare(a, b);
        });

      case 'newest':
        return sorted.sort((a, b) => safeLocaleCompare(a, b)); // Mock sorting by newest

      default:
        return sorted;
    }
  }, [products, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card
      className="group overflow-hidden border-forest-200/50 transition-all duration-300 hover:shadow-forest-glow hover:shadow-xl"
      data-testid="product-card"
    >
      <div className="relative aspect-video bg-forest-50">
        <CardImage
          src={
            getPrimaryImageUrl(product.images) ||
            '/images/coffee-placeholder.svg'
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {showSelection && onProductSelect && (
          <div className="absolute bottom-2 left-2 z-10">
            <Checkbox
              checked={selectedProducts.has(product.id)}
              onCheckedChange={checked =>
                onProductSelect(product.id, checked as boolean)
              }
              className="border-forest-300 bg-white/90 data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
            />
          </div>
        )}
        {/* Only show featured badge if product is featured */}
        {product.isFeatured && (
          <Badge className="absolute right-2 top-1 bg-emerald-500 text-white shadow-emerald-soft">
            Featured
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="mb-2 flex flex-wrap gap-2">
          <CoffeeGradeIndicator grade={product.grade} />
          <ProcessingMethodBadge method={product.processingMethod} />
          <OriginFlag origin="vietnam" />
        </div>
        <CardTitle className="text-lg text-forest-800 transition-colors group-hover:text-emerald-700">
          {product.name}
        </CardTitle>
        <CardDescription className="text-forest-800">
          {product.shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {product.certifications.map(cert => (
              <CertificationBadge key={cert} certification={cert} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-forest-100 bg-forest-50 px-2 py-1">
              <div className="font-medium leading-tight text-forest-700">
                Moisture:
              </div>
              <div className="text-forest-800">
                {product.specifications.moisture}%
              </div>
            </div>
            <div className="rounded border border-forest-100 bg-forest-50 px-2 py-1">
              <div className="font-medium leading-tight text-forest-700">
                Screen:
              </div>
              <div className="text-forest-800">
                {product.specifications.screenSize}
              </div>
            </div>
            <div className="rounded border border-forest-100 bg-forest-50 px-2 py-1">
              <div className="font-medium leading-tight text-forest-700">
                Defects:
              </div>
              <div className="text-forest-800">
                {product.specifications.defectRate}%
              </div>
            </div>
            {product.specifications.cuppingScore && (
              <div className="rounded border border-forest-100 bg-white px-2 py-1">
                <div className="font-medium leading-tight text-forest-700">
                  Cupping:
                </div>
                <div className="text-forest-800">
                  {product.specifications.cuppingScore}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3 border-t border-forest-100 pt-3">
            <div className="flex items-center justify-center">
              <span className="text-xl font-bold text-forest-800">
                ${product.pricing.basePrice.toLocaleString()}/
                {product.pricing.unit}
              </span>
            </div>
            <div className="flex gap-3">
              <ServerButton
                variant="outline"
                size="sm"
                asChild
                className="min-h-[36px] flex-1 border-forest-200 text-forest-800 transition-all duration-200 hover:bg-forest-50 hover:shadow-forest-medium"
              >
                <Link
                  href={`/${locale}/products/${product.id}`}
                  className="flex items-center justify-center"
                >
                  <Eye className="mr-1.5 h-4 w-4" />
                  <span className="text-sm font-medium">View</span>
                </Link>
              </ServerButton>
              <ServerButton
                size="sm"
                asChild
                className="min-h-[36px] flex-1 bg-emerald-600 shadow-emerald-soft transition-all duration-200 hover:bg-emerald-700"
              >
                <Link
                  href={`/${locale}/quote?product=${product.id}`}
                  className="flex items-center justify-center"
                >
                  <ShoppingCart className="mr-1.5 h-4 w-4" />
                  <span className="text-sm font-medium">Quote</span>
                </Link>
              </ServerButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden border-forest-200/50 transition-all duration-300 hover:shadow-forest-medium">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-forest-50">
            <CardImage
              src={
                getPrimaryImageUrl(product.images) ||
                '/images/coffee-placeholder.svg'
              }
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="200px"
            />
            {product.isFeatured && (
              <Badge className="absolute right-2 top-2 bg-emerald-500 text-white shadow-emerald-soft">
                Featured
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <CoffeeGradeIndicator grade={product.grade} />
                <ProcessingMethodBadge method={product.processingMethod} />
                <OriginFlag origin="vietnam" />
                <Badge
                  variant={
                    product.availability.inStock ? 'default' : 'destructive'
                  }
                  className="text-xs"
                >
                  {product.availability.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-forest-800 transition-colors group-hover:text-emerald-700">
                {product.name}
              </h3>
              <p className="text-forest-800">{product.shortDescription}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {product.certifications.map(cert => (
                <CertificationBadge key={cert} certification={cert} />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-forest-700">Moisture:</span>{' '}
                <span className="text-forest-800">
                  {product.specifications.moisture}%
                </span>
              </div>
              <div>
                <span className="font-medium text-forest-700">Screen:</span>{' '}
                <span className="text-forest-800">
                  {product.specifications.screenSize}
                </span>
              </div>
              <div>
                <span className="font-medium text-forest-700">Defects:</span>{' '}
                <span className="text-forest-800">
                  {product.specifications.defectRate}%
                </span>
              </div>
              {product.specifications.cuppingScore && (
                <div>
                  <span className="font-medium text-forest-700">Cupping:</span>{' '}
                  <span className="text-forest-800">
                    {product.specifications.cuppingScore}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col items-end justify-between">
            <span className="text-2xl font-bold text-forest-800">
              ${product.pricing.basePrice.toLocaleString()}/
              {product.pricing.unit}
            </span>
            <div className="flex gap-3">
              <ServerButton
                variant="outline"
                size="sm"
                asChild
                className="min-h-[40px] border-forest-200 px-4 text-forest-800 transition-all duration-200 hover:bg-forest-50 hover:shadow-forest-medium"
              >
                <Link
                  href={`/${locale}/products/${product.id}`}
                  className="flex items-center justify-center"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span className="font-medium">View Details</span>
                </Link>
              </ServerButton>
              <ServerButton
                size="sm"
                asChild
                className="min-h-[40px] bg-emerald-600 px-4 shadow-emerald-soft transition-all duration-200 hover:bg-emerald-700"
              >
                <Link
                  href={`/${locale}/quote?product=${product.id}`}
                  className="flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span className="font-medium">Request Quote</span>
                </Link>
              </ServerButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-forest-400">
          <ShoppingCart className="mx-auto h-16 w-16" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-forest-700">
          No products found
        </h3>
        <p className="text-forest-800">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparison Bar */}
      {selectedProductsArray.length > 0 && (
        <div className="sticky top-0 z-40 border-b border-forest-200 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-amber-700" />
                <span className="text-sm font-medium text-forest-700">
                  {selectedProductsArray.length} products selected for
                  comparison
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowComparison(true)}
                  disabled={selectedProductsArray.length < 2}
                  className="bg-amber-600 text-white hover:bg-amber-700"
                  size="sm"
                >
                  <Scale className="mr-2 h-4 w-4" />
                  Compare ({selectedProductsArray.length})
                </Button>
                <Button
                  onClick={() => {
                    selectedProducts.clear();
                    if (onProductSelect) {
                      selectedProductsArray.forEach(product =>
                        onProductSelect(product.id, false)
                      );
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-forest-200 text-forest-800 hover:bg-forest-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-forest-800">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)}{' '}
            of {sortedProducts.length} products
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-forest-800" />
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="w-48 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex overflow-hidden rounded-md border border-forest-200">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-none border-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-none border-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {currentProducts.map(product => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-forest-200 text-forest-800 hover:bg-forest-50"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={
                  page === currentPage
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'border-forest-200 text-forest-800 hover:bg-forest-50'
                }
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-forest-200 text-forest-800 hover:bg-forest-50"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Advanced Product Comparison Modal */}
      {showComparison && selectedProductsArray.length >= 2 && (
        <AdvancedProductComparison
          products={selectedProductsArray}
          isOpen={showComparison}
          locale={locale}
          onClose={() => setShowComparison(false)}
          onRemoveProduct={productId => {
            if (onProductSelect) {
              onProductSelect(productId, false);
            }
          }}
          onRequestQuote={(_productIds, _analysisData) => {
            // Handle quote request with business analysis data
            // This would typically navigate to a quote form or open a modal
          }}
        />
      )}
    </div>
  );
}
