'use client';

import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
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
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';

export interface ProductFilters {
  search: string;
  coffeeType: string;
  grade: string;
  processingMethod: string;
  certification: string;
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean | null;
}

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  totalProducts: number;
  filteredProducts: number;
}

const coffeeTypes = [
  { value: 'ALL', label: 'All Types' },
  { value: 'ROBUSTA', label: 'Robusta' },
  { value: 'ARABICA', label: 'Arabica' },
  { value: 'SPECIALTY', label: 'Specialty' },
  { value: 'BLEND', label: 'Blend' },
];

const grades = [
  { value: 'ALL', label: 'All Grades' },
  { value: 'GRADE_1', label: 'Grade 1' },
  { value: 'GRADE_2', label: 'Grade 2' },
  { value: 'SPECIALTY', label: 'Specialty' },
  { value: 'SCREEN_18', label: 'Screen 18+' },
  { value: 'SCREEN_16', label: 'Screen 16+' },
];

const processingMethods = [
  { value: 'ALL', label: 'All Methods' },
  { value: 'NATURAL', label: 'Natural' },
  { value: 'WASHED', label: 'Washed' },
  { value: 'HONEY', label: 'Honey' },
  { value: 'WET_HULLED', label: 'Wet Hulled' },
];

const certifications = [
  { value: 'ALL', label: 'All Certifications' },
  { value: 'organic', label: 'Organic' },
  { value: 'fair-trade', label: 'Fair Trade' },
  { value: 'rainforest-alliance', label: 'Rainforest Alliance' },
  { value: 'utz', label: 'UTZ' },
];

const stockOptions = [
  { value: 'ALL', label: 'All Products' },
  { value: 'IN_STOCK', label: 'In Stock Only' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

export function ProductFilters({
  filters,
  onFiltersChange,
  totalProducts,
  filteredProducts,
}: ProductFiltersProps) {
  const t = useTranslations('products.filters');
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = useCallback(
    (key: keyof ProductFilters, value: any) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFiltersChange]
  );

  const resetFilters = useCallback(() => {
    onFiltersChange({
      search: '',
      coffeeType: 'ALL',
      grade: 'ALL',
      processingMethod: 'ALL',
      certification: 'ALL',
      priceRange: { min: 0, max: 10000 },
      inStock: null,
    });
  }, [onFiltersChange]);

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.coffeeType !== 'ALL' ||
    filters.grade !== 'ALL' ||
    filters.processingMethod !== 'ALL' ||
    filters.certification !== 'ALL' ||
    filters.inStock !== null;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search !== '') count++;
    if (filters.coffeeType !== 'ALL') count++;
    if (filters.grade !== 'ALL') count++;
    if (filters.processingMethod !== 'ALL') count++;
    if (filters.certification !== 'ALL') count++;
    if (filters.inStock !== null) count++;
    return count;
  };

  return (
    <Card className="mb-8 shadow-forest-medium border-forest-200/50">
      <CardHeader className="bg-gradient-to-r from-forest-50 to-sage-50 border-b border-forest-200/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-forest-800">
            <Filter className="mr-2 h-5 w-5" />
            Product Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-forest-600 hover:text-forest-800"
            >
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Search Bar - Always Visible */}
        <div className="mb-6">
          <Label htmlFor="search" className="mb-2 block text-sm font-medium text-forest-700">
            Search Products
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-forest-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by name, origin, or description..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('search', '')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-forest-400 hover:text-forest-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Filters */}
        {isExpanded && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Coffee Type */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-forest-700">
                  Coffee Type
                </Label>
                <Select
                  value={filters.coffeeType}
                  onValueChange={(value) => updateFilter('coffeeType', value)}
                >
                  <SelectTrigger className="border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coffeeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grade */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-forest-700">
                  Grade
                </Label>
                <Select
                  value={filters.grade}
                  onValueChange={(value) => updateFilter('grade', value)}
                >
                  <SelectTrigger className="border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Processing Method */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-forest-700">
                  Processing Method
                </Label>
                <Select
                  value={filters.processingMethod}
                  onValueChange={(value) => updateFilter('processingMethod', value)}
                >
                  <SelectTrigger className="border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {processingMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Certification */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-forest-700">
                  Certification
                </Label>
                <Select
                  value={filters.certification}
                  onValueChange={(value) => updateFilter('certification', value)}
                >
                  <SelectTrigger className="border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {certifications.map((cert) => (
                      <SelectItem key={cert.value} value={cert.value}>
                        {cert.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-forest-700">
                Price Range (USD per MT)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice" className="text-xs text-forest-600">
                    Min Price
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={filters.priceRange.min || ''}
                    onChange={(e) =>
                      updateFilter('priceRange', {
                        ...filters.priceRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    className="border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-xs text-forest-600">
                    Max Price
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="10000"
                    value={filters.priceRange.max || ''}
                    onChange={(e) =>
                      updateFilter('priceRange', {
                        ...filters.priceRange,
                        max: parseInt(e.target.value) || 10000,
                      })
                    }
                    className="border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-forest-700">
                Availability
              </Label>
              <Select
                value={
                  filters.inStock === null
                    ? 'ALL'
                    : filters.inStock
                    ? 'IN_STOCK'
                    : 'OUT_OF_STOCK'
                }
                onValueChange={(value) =>
                  updateFilter(
                    'inStock',
                    value === 'ALL' ? null : value === 'IN_STOCK'
                  )
                }
              >
                <SelectTrigger className="border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stockOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Results Summary and Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-forest-100 pt-4">
          <div className="text-sm text-forest-600">
            Showing <span className="font-semibold text-forest-800">{filteredProducts}</span> of{' '}
            <span className="font-semibold text-forest-800">{totalProducts}</span> products
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="border-forest-200 text-forest-600 hover:bg-forest-50"
              >
                <X className="mr-1 h-4 w-4" />
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}