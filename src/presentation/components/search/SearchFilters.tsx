'use client';

import { Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Label } from '@/presentation/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/presentation/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Separator } from '@/presentation/components/ui/separator';
import { cn } from '@/shared/utils/cn';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'checkbox';
  options: FilterOption[];
  value?: string | string[];
  placeholder?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface SearchFiltersProps {
  filters: FilterGroup[];
  sortOptions: SortOption[];
  sortBy: string;
  onFilterChange: (filterId: string, value: string | string[]) => void;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
  className?: string;
  showFilterCount?: boolean;
  compact?: boolean;
}

export function SearchFilters({
  filters,
  sortOptions,
  sortBy,
  onFilterChange,
  onSortChange,
  onClearFilters,
  className,
  showFilterCount = true,
  compact = false,
}: SearchFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Count active filters
  const activeFiltersCount = filters.reduce((count, filter) => {
    if (filter.type === 'multiselect' && Array.isArray(filter.value)) {
      return count + filter.value.length;
    }
    if (filter.value && filter.value !== '') {
      return count + 1;
    }
    return count;
  }, 0);

  const handleFilterChange = (filterId: string, value: string | string[]) => {
    onFilterChange(filterId, value);
  };

  const handleMultiSelectChange = (
    filterId: string,
    optionValue: string,
    checked: boolean
  ) => {
    const filter = filters.find(f => f.id === filterId);
    if (!filter) return;

    const currentValues = Array.isArray(filter.value) ? filter.value : [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(v => v !== optionValue);
    }

    onFilterChange(filterId, newValues);
  };

  const removeFilter = (filterId: string, optionValue?: string) => {
    const filter = filters.find(f => f.id === filterId);
    if (!filter) return;

    if (filter.type === 'multiselect' && optionValue) {
      const currentValues = Array.isArray(filter.value) ? filter.value : [];
      const newValues = currentValues.filter(v => v !== optionValue);
      onFilterChange(filterId, newValues);
    } else {
      onFilterChange(filterId, filter.type === 'multiselect' ? [] : '');
    }
  };

  const getActiveFilterBadges = () => {
    const badges: Array<{ filterId: string; label: string; value?: string }> =
      [];

    filters.forEach(filter => {
      if (filter.type === 'multiselect' && Array.isArray(filter.value)) {
        filter.value.forEach(value => {
          const option = filter.options.find(opt => opt.value === value);
          if (option) {
            badges.push({
              filterId: filter.id,
              label: `${filter.label}: ${option.label}`,
              value,
            });
          }
        });
      } else if (filter.value && filter.value !== '') {
        const option = filter.options.find(opt => opt.value === filter.value);
        if (option) {
          badges.push({
            filterId: filter.id,
            label: `${filter.label}: ${option.label}`,
          });
        }
      }
    });

    return badges;
  };

  const activeFilterBadges = getActiveFilterBadges();

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {showFilterCount && activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              {filters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  <Label className="text-sm font-medium">{filter.label}</Label>
                  {filter.type === 'select' && (
                    <Select
                      value={(filter.value as string) || ''}
                      onValueChange={value =>
                        handleFilterChange(filter.id, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={filter.placeholder || 'Select...'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex w-full items-center justify-between">
                              <span>{option.label}</span>
                              {option.count && (
                                <span className="ml-2 text-xs text-gray-500">
                                  ({option.count})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {filter.type === 'multiselect' && (
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {filter.options.map(option => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${filter.id}-${option.value}`}
                            checked={
                              Array.isArray(filter.value) &&
                              filter.value.includes(option.value)
                            }
                            onCheckedChange={checked =>
                              handleMultiSelectChange(
                                filter.id,
                                option.value,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`${filter.id}-${option.value}`}
                            className="flex-1 cursor-pointer text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.label}</span>
                              {option.count && (
                                <span className="text-xs text-gray-500">
                                  ({option.count})
                                </span>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {activeFiltersCount > 0 && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by..." />
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
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        {filters.map(filter => (
          <div key={filter.id} className="min-w-0">
            {filter.type === 'select' && (
              <Select
                value={(filter.value as string) || ''}
                onValueChange={value => handleFilterChange(filter.id, value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue
                    placeholder={filter.placeholder || filter.label}
                  />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex w-full items-center justify-between">
                        <span>{option.label}</span>
                        {option.count && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({option.count})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {filter.type === 'multiselect' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-between">
                    <span className="truncate">
                      {Array.isArray(filter.value) && filter.value.length > 0
                        ? `${filter.label} (${filter.value.length})`
                        : filter.label}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-4">
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {filter.options.map(option => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${filter.id}-${option.value}`}
                          checked={
                            Array.isArray(filter.value) &&
                            filter.value.includes(option.value)
                          }
                          onCheckedChange={checked =>
                            handleMultiSelectChange(
                              filter.id,
                              option.value,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`${filter.id}-${option.value}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.label}</span>
                            {option.count && (
                              <span className="text-xs text-gray-500">
                                ({option.count})
                              </span>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
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

        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {activeFilterBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilterBadges.map((badge, index) => (
            <Badge
              key={`${badge.filterId}-${badge.value || 'single'}-${index}`}
              variant="secondary"
              className="gap-1"
            >
              {badge.label}
              <button
                type="button"
                onClick={() => removeFilter(badge.filterId, badge.value)}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
