'use client';

import { 
  Eye, 
  ShoppingCart, 
  ArrowUpDown, 
  Grid3X3, 
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
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
} from '@/shared/components/design-system/Coffee';
import { CardImage } from '@/shared/components/performance/OptimizedImage';
import type {
  CoffeeGrade,
  ProcessingMethod,
  CoffeeCertification,
} from '@/shared/components/design-system/types';

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
}

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'featured' | 'newest';

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const PRODUCTS_PER_PAGE = 12;

export function ProductGrid({ 
  products, 
  locale, 
  viewMode = 'grid',
  onViewModeChange 
}: ProductGridProps) {
  const t = useTranslations('products');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
      case 'price-desc':
        return sorted.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
      case 'featured':
        return sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.localeCompare(b.name);
        });
      case 'newest':
        return sorted.sort((a, b) => a.name.localeCompare(b.name)); // Mock sorting by newest
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
      className="group overflow-hidden transition-all duration-300 hover:shadow-forest-glow hover:shadow-xl border-forest-200/50"
      data-testid="product-card"
    >
      <div className="relative aspect-video bg-forest-50">
        <CardImage
            src="/images/coffee-placeholder.svg"
            alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <OriginFlag origin="vietnam" />
        </div>
        <CardTitle className="text-lg text-forest-800 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </CardTitle>
        <CardDescription className="text-forest-600">
          {product.shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {product.certifications.map((cert) => (
              <CertificationBadge key={cert} certification={cert} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-forest-100 bg-forest-50 p-2">
              <span className="font-medium text-forest-700">Moisture:</span>{' '}
              <span className="text-forest-600">{product.specifications.moisture}%</span>
            </div>
            <div className="rounded border border-forest-100 bg-forest-50 p-2">
              <span className="font-medium text-forest-700">Screen:</span>{' '}
              <span className="text-forest-600">{product.specifications.screenSize}</span>
            </div>
            <div className="rounded border border-forest-100 bg-forest-50 p-2">
              <span className="font-medium text-forest-700">Defects:</span>{' '}
              <span className="text-forest-600">{product.specifications.defectRate}%</span>
            </div>
            {product.specifications.cuppingScore && (
              <div className="rounded border border-sage-100 bg-sage-50 p-2">
                <span className="font-medium text-sage-700">Cupping:</span>{' '}
                <span className="text-sage-600">{product.specifications.cuppingScore}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-forest-100 pt-2">
            <span className="text-xl font-bold text-forest-800">
              ${product.pricing.basePrice.toLocaleString()}/{product.pricing.unit}
            </span>
            <div className="flex gap-2">
              <ServerButton
                variant="outline"
                size="sm"
                asChild
                className="hover:shadow-forest-medium border-forest-200 text-forest-600 hover:bg-forest-50"
              >
                <Link href={`/${locale}/products/${product.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Link>
              </ServerButton>
              <ServerButton
                size="sm"
                asChild
                className="bg-emerald-600 shadow-emerald-soft hover:bg-emerald-700"
              >
                <Link href={`/${locale}/quote?product=${product.id}`}>
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Quote
                </Link>
              </ServerButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-forest-medium border-forest-200/50">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-forest-50">
            <CardImage
              src="/images/coffee-placeholder.svg"
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
                  variant={product.availability.inStock ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {product.availability.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-forest-800 group-hover:text-emerald-700 transition-colors">
                {product.name}
              </h3>
              <p className="text-forest-600">{product.shortDescription}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {product.certifications.map((cert) => (
                <CertificationBadge key={cert} certification={cert} />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-forest-700">Moisture:</span>{' '}
                <span className="text-forest-600">{product.specifications.moisture}%</span>
              </div>
              <div>
                <span className="font-medium text-forest-700">Screen:</span>{' '}
                <span className="text-forest-600">{product.specifications.screenSize}</span>
              </div>
              <div>
                <span className="font-medium text-forest-700">Defects:</span>{' '}
                <span className="text-forest-600">{product.specifications.defectRate}%</span>
              </div>
              {product.specifications.cuppingScore && (
                <div>
                  <span className="font-medium text-sage-700">Cupping:</span>{' '}
                  <span className="text-sage-600">{product.specifications.cuppingScore}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col items-end justify-between">
            <span className="text-2xl font-bold text-forest-800">
              ${product.pricing.basePrice.toLocaleString()}/{product.pricing.unit}
            </span>
            <div className="flex gap-2">
              <ServerButton
                variant="outline"
                size="sm"
                asChild
                className="hover:shadow-forest-medium border-forest-200 text-forest-600 hover:bg-forest-50"
              >
                <Link href={`/${locale}/products/${product.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View Details
                </Link>
              </ServerButton>
              <ServerButton
                size="sm"
                asChild
                className="bg-emerald-600 shadow-emerald-soft hover:bg-emerald-700"
              >
                <Link href={`/${locale}/quote?product=${product.id}`}>
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Request Quote
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
      <div className="text-center py-12">
        <div className="text-forest-400 mb-4">
          <ShoppingCart className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-forest-700 mb-2">No products found</h3>
        <p className="text-forest-600">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-forest-600">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-forest-600" />
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex rounded-md border border-forest-200 overflow-hidden">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {currentProducts.map((product) => (
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
            className="border-forest-200 text-forest-600 hover:bg-forest-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={
                  page === currentPage
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'border-forest-200 text-forest-600 hover:bg-forest-50'
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
            className="border-forest-200 text-forest-600 hover:bg-forest-50"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}