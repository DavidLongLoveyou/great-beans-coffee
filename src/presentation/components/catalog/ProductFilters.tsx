'use client';

import { Search, Filter, X, SlidersHorizontal } from '@/components/ui/icons';
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
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';

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
  // Advanced B2B filters
  origin: string;
  harvestSeason: string;
  minimumOrderRange: {
    min: number;
    max: number;
  };
  cuppingScoreRange: {
    min: number;
    max: number;
  };
  altitudeRange: {
    min: number;
    max: number;
  };
  certifications: string[]; // Multiple certifications
  incoterms: string;
}

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  totalProducts: number;
  filteredProducts: number;
  loading?: boolean;
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
  { value: 'organic', label: 'Organic' },
  { value: 'fair-trade', label: 'Fair Trade' },
  { value: 'rainforest-alliance', label: 'Rainforest Alliance' },
  { value: 'utz', label: 'UTZ' },
  { value: 'c-cafe-practices', label: 'C.A.F.E. Practices' },
  { value: 'bird-friendly', label: 'Bird Friendly' },
  { value: 'shade-grown', label: 'Shade Grown' },
  { value: 'direct-trade', label: 'Direct Trade' },
];

const stockOptions = [
  { value: 'ALL', label: 'All Products' },
  { value: 'IN_STOCK', label: 'In Stock Only' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

// Advanced B2B filter options
const origins = [
  { value: 'ALL', label: 'All Regions' },
  { value: 'dak-lak', label: 'Dak Lak' },
  { value: 'gia-lai', label: 'Gia Lai' },
  { value: 'kon-tum', label: 'Kon Tum' },
  { value: 'lam-dong', label: 'Lam Dong' },
  { value: 'dak-nong', label: 'Dak Nong' },
  { value: 'son-la', label: 'Son La' },
  { value: 'dien-bien', label: 'Dien Bien' },
];

const harvestSeasons = [
  { value: 'ALL', label: 'All Seasons' },
  { value: 'october-february', label: 'October - February' },
  { value: 'november-march', label: 'November - March' },
  { value: 'december-april', label: 'December - April' },
  { value: 'year-round', label: 'Year Round' },
];

const incotermsOptions = [
  { value: 'ALL', label: 'All Terms' },
  { value: 'FOB', label: 'FOB (Free on Board)' },
  { value: 'CIF', label: 'CIF (Cost, Insurance & Freight)' },
  { value: 'CFR', label: 'CFR (Cost & Freight)' },
  { value: 'EXW', label: 'EXW (Ex Works)' },
  { value: 'FCA', label: 'FCA (Free Carrier)' },
];

export function ProductFilters({
  filters,
  onFiltersChange,
  totalProducts,
  filteredProducts,
  loading = false,
}: ProductFiltersProps) {
  const _t = useTranslations('products.filters');
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = useCallback(
    (
      key: keyof ProductFilters,
      value: ProductFilters[keyof ProductFilters]
    ) => {
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
      // Advanced B2B filters
      origin: 'ALL',
      harvestSeason: 'ALL',
      minimumOrderRange: { min: 0, max: 1000 },
      cuppingScoreRange: { min: 0, max: 100 },
      altitudeRange: { min: 0, max: 2000 },
      certifications: [],
      incoterms: 'ALL',
    });
  }, [onFiltersChange]);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.coffeeType !== 'ALL' ||
    filters.grade !== 'ALL' ||
    filters.processingMethod !== 'ALL' ||
    filters.certification !== 'ALL' ||
    filters.inStock !== null ||
    filters.origin !== 'ALL' ||
    filters.harvestSeason !== 'ALL' ||
    filters.certifications.length > 0 ||
    filters.incoterms !== 'ALL' ||
    filters.minimumOrderRange.min > 0 ||
    filters.minimumOrderRange.max < 1000 ||
    filters.cuppingScoreRange.min > 0 ||
    filters.cuppingScoreRange.max < 100 ||
    filters.altitudeRange.min > 0 ||
    filters.altitudeRange.max < 2000;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search !== '') count++;
    if (filters.coffeeType !== 'ALL') count++;
    if (filters.grade !== 'ALL') count++;
    if (filters.processingMethod !== 'ALL') count++;
    if (filters.certification !== 'ALL') count++;
    if (filters.inStock !== null) count++;
    if (filters.origin !== 'ALL') count++;
    if (filters.harvestSeason !== 'ALL') count++;
    if (filters.certifications.length > 0) count++;
    if (filters.incoterms !== 'ALL') count++;
    if (
      filters.minimumOrderRange.min > 0 ||
      filters.minimumOrderRange.max < 1000
    )
      count++;
    if (
      filters.cuppingScoreRange.min > 0 ||
      filters.cuppingScoreRange.max < 100
    )
      count++;
    if (filters.altitudeRange.min > 0 || filters.altitudeRange.max < 2000)
      count++;
    return count;
  };

  return (
    <Card className="mb-8 border-forest-200/50 shadow-forest-medium">
      <CardHeader className="border-b border-forest-200/30 bg-gradient-to-r from-forest-50 to-sage-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-forest-800">
            <Filter className="mr-2 h-5 w-5" />
            Product Filters
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-2 bg-emerald-100 text-emerald-700"
              >
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-forest-800 hover:text-forest-900"
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
          <div className="flex flex-col">
            <Label
              htmlFor="search"
              className="block text-sm font-medium text-forest-700"
            >
              Search Products
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-forest-400" />
              <Input
                id="search"
                type="text"
                placeholder="Search by name, origin, or description..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                disabled={loading}
                className="border-forest-200 pl-10 focus:border-emerald-400 focus:ring-emerald-400 disabled:opacity-50"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 text-forest-800 hover:text-forest-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {isExpanded && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Coffee Type */}
              <div>
                <div className="flex flex-col">
                  <Label className="block text-sm font-medium text-forest-700">
                    Coffee Type
                  </Label>
                  <Select
                    value={filters.coffeeType}
                    onValueChange={value => updateFilter('coffeeType', value)}
                    disabled={loading}
                  >
                    <SelectTrigger
                      className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400 disabled:opacity-50"
                      aria-label="Select coffee type"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {coffeeTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grade */}
              <div>
                <div className="flex flex-col">
                  <Label className="block text-sm font-medium text-forest-700">
                    Grade
                  </Label>
                  <Select
                    value={filters.grade}
                    onValueChange={value => updateFilter('grade', value)}
                  >
                    <SelectTrigger
                      className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                      aria-label="Select coffee grade"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Processing Method */}
              <div>
                <div className="flex flex-col">
                  <Label className="block text-sm font-medium text-forest-700">
                    Processing Method
                  </Label>
                  <Select
                    value={filters.processingMethod}
                    onValueChange={value =>
                      updateFilter('processingMethod', value)
                    }
                  >
                    <SelectTrigger className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {processingMethods.map(method => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Certification */}
              <div>
                <div className="flex flex-col">
                  <Label className="block text-sm font-medium text-forest-700">
                    Certification
                  </Label>
                  <Select
                    value={filters.certification}
                    onValueChange={value =>
                      updateFilter('certification', value)
                    }
                  >
                    <SelectTrigger className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {certifications.map(cert => (
                        <SelectItem key={cert.value} value={cert.value}>
                          {cert.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-forest-700">
                  Price Range (USD per MT)
                </Label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="minPrice"
                      className="text-xs text-forest-800"
                    >
                      Min Price
                    </Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      value={filters.priceRange.min || ''}
                      onChange={e =>
                        updateFilter('priceRange', {
                          ...filters.priceRange,
                          min: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="maxPrice"
                      className="text-xs text-forest-800"
                    >
                      Max Price
                    </Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="10000"
                      value={filters.priceRange.max || ''}
                      onChange={e =>
                        updateFilter('priceRange', {
                          ...filters.priceRange,
                          max: parseInt(e.target.value) || 10000,
                        })
                      }
                      className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-forest-700">
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
                  onValueChange={value =>
                    updateFilter(
                      'inStock',
                      value === 'ALL' ? null : value === 'IN_STOCK'
                    )
                  }
                >
                  <SelectTrigger className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stockOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced B2B Filters */}
            <div className="col-span-full border-t border-forest-100 pt-6">
              <h4 className="mb-4 text-sm font-semibold text-forest-800">
                Advanced B2B Filters
              </h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Origin */}
                <div>
                  <div className="flex flex-col">
                    <Label className="block text-sm font-medium text-forest-700">
                      Origin
                    </Label>
                    <Select
                      value={filters.origin}
                      onValueChange={value => updateFilter('origin', value)}
                    >
                      <SelectTrigger className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {origins.map(origin => (
                          <SelectItem key={origin.value} value={origin.value}>
                            {origin.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Harvest Season */}
                <div>
                  <div className="flex flex-col">
                    <Label className="block text-sm font-medium text-forest-700">
                      Harvest Season
                    </Label>
                    <Select
                      value={filters.harvestSeason}
                      onValueChange={value =>
                        updateFilter('harvestSeason', value)
                      }
                    >
                      <SelectTrigger className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {harvestSeasons.map(season => (
                          <SelectItem key={season.value} value={season.value}>
                            {season.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Incoterms */}
                <div>
                  <div className="flex flex-col">
                    <Label className="block text-sm font-medium text-forest-700">
                      Incoterms
                    </Label>
                    <Select
                      value={filters.incoterms}
                      onValueChange={value => updateFilter('incoterms', value)}
                    >
                      <SelectTrigger className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {incotermsOptions.map(term => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Minimum Order Range */}
                <div>
                  <div className="flex flex-col">
                    <Label className="block text-sm font-medium text-forest-700">
                      Minimum Order (MT)
                    </Label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="minOrder"
                          className="text-xs text-forest-800"
                        >
                          Min
                        </Label>
                        <Input
                          id="minOrder"
                          type="number"
                          placeholder="0"
                          value={filters.minimumOrderRange.min || ''}
                          onChange={e =>
                            updateFilter('minimumOrderRange', {
                              ...filters.minimumOrderRange,
                              min: parseInt(e.target.value) || 0,
                            })
                          }
                          className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maxOrder"
                          className="text-xs text-forest-800"
                        >
                          Max
                        </Label>
                        <Input
                          id="maxOrder"
                          type="number"
                          placeholder="1000"
                          value={filters.minimumOrderRange.max || ''}
                          onChange={e =>
                            updateFilter('minimumOrderRange', {
                              ...filters.minimumOrderRange,
                              max: parseInt(e.target.value) || 1000,
                            })
                          }
                          className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cupping Score Range */}
                <div>
                  <div className="flex flex-col">
                    <Label className="block text-sm font-medium text-forest-700">
                      Cupping Score
                    </Label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="minCupping"
                          className="text-xs text-forest-800"
                        >
                          Min
                        </Label>
                        <Input
                          id="minCupping"
                          type="number"
                          placeholder="0"
                          min="0"
                          max="100"
                          value={filters.cuppingScoreRange.min || ''}
                          onChange={e =>
                            updateFilter('cuppingScoreRange', {
                              ...filters.cuppingScoreRange,
                              min: parseInt(e.target.value) || 0,
                            })
                          }
                          className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maxCupping"
                          className="text-xs text-forest-800"
                        >
                          Max
                        </Label>
                        <Input
                          id="maxCupping"
                          type="number"
                          placeholder="100"
                          min="0"
                          max="100"
                          value={filters.cuppingScoreRange.max || ''}
                          onChange={e =>
                            updateFilter('cuppingScoreRange', {
                              ...filters.cuppingScoreRange,
                              max: parseInt(e.target.value) || 100,
                            })
                          }
                          className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Altitude Range */}
                <div>
                  <div className="flex flex-col">
                    <Label className="block text-sm font-medium text-forest-700">
                      Altitude (MASL)
                    </Label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="minAltitude"
                          className="text-xs text-forest-800"
                        >
                          Min
                        </Label>
                        <Input
                          id="minAltitude"
                          type="number"
                          placeholder="0"
                          value={filters.altitudeRange.min || ''}
                          onChange={e =>
                            updateFilter('altitudeRange', {
                              ...filters.altitudeRange,
                              min: parseInt(e.target.value) || 0,
                            })
                          }
                          className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maxAltitude"
                          className="text-xs text-forest-800"
                        >
                          Max
                        </Label>
                        <Input
                          id="maxAltitude"
                          type="number"
                          placeholder="2000"
                          value={filters.altitudeRange.max || ''}
                          onChange={e =>
                            updateFilter('altitudeRange', {
                              ...filters.altitudeRange,
                              max: parseInt(e.target.value) || 2000,
                            })
                          }
                          className="mt-1 border-forest-200 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multiple Certifications */}
              <div className="mt-6">
                <div className="flex flex-col">
                  <Label className="block text-sm font-medium text-forest-700">
                    Certifications (Multiple Selection)
                  </Label>
                  <div className="mt-1 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {certifications.map(cert => (
                      <div
                        key={cert.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`cert-${cert.value}`}
                          checked={filters.certifications.includes(cert.value)}
                          onCheckedChange={checked => {
                            const newCertifications = checked
                              ? [...filters.certifications, cert.value]
                              : filters.certifications.filter(
                                  c => c !== cert.value
                                );
                            updateFilter('certifications', newCertifications);
                          }}
                          className="border-forest-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
                        />
                        <Label
                          htmlFor={`cert-${cert.value}`}
                          className="cursor-pointer text-sm text-forest-700"
                        >
                          {cert.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary and Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-forest-100 pt-4">
          <div className="text-sm text-forest-800">
            Showing{' '}
            <span className="font-semibold text-forest-800">
              {filteredProducts}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-forest-800">
              {totalProducts}
            </span>{' '}
            products
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="border-forest-200 text-forest-800 hover:bg-forest-50"
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
