'use client';

import {  CalendarIcon, FilterIcon, XIcon  } from '@/components/ui/dynamic-icons';
import React, { useState } from 'react';

import { Button } from '@/presentation/components/ui/button';
import { Calendar } from '@/presentation/components/ui/calendar';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet';
import { cn } from '@/shared/utils';

import { SearchFilters } from '@/shared/hooks/useContentSearch';

interface ContentFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  className?: string;
  compact?: boolean;
}

const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Posts' },
  { value: 'market-report', label: 'Market Reports' },
  { value: 'origin-story', label: 'Origin Stories' },
  { value: 'service', label: 'Service Pages' },
];

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function ContentFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className,
  compact = false,
}: ContentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== '' && value !== null
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Content Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Content Type</Label>
        <Select
          value={filters.type || ''}
          onValueChange={value =>
            onFiltersChange({
              type: value === '' ? undefined : (value as SearchFilters['type']),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            {CONTENT_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Locale */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Language</Label>
        <Select
          value={filters.locale || ''}
          onValueChange={value =>
            onFiltersChange({
              locale:
                value === '' ? undefined : (value as SearchFilters['locale']),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All languages</SelectItem>
            {LOCALES.map(locale => (
              <SelectItem key={locale.value} value={locale.value}>
                {locale.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Status</Label>
        <Select
          value={filters.status || ''}
          onValueChange={value =>
            onFiltersChange({
              status:
                value === '' ? undefined : (value as SearchFilters['status']),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {STATUS_OPTIONS.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <Label htmlFor="category" className="text-sm font-medium">
          Category
        </Label>
        <Input
          id="category"
          placeholder="Enter category..."
          value={filters.category || ''}
          onChange={e =>
            onFiltersChange({ category: e.target.value || undefined })
          }
        />
      </div>

      {/* Author */}
      <div className="space-y-3">
        <Label htmlFor="author" className="text-sm font-medium">
          Author
        </Label>
        <Input
          id="author"
          placeholder="Enter author name..."
          value={filters.author || ''}
          onChange={e =>
            onFiltersChange({ author: e.target.value || undefined })
          }
        />
      </div>

      {/* Featured */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={filters.featured || false}
          onCheckedChange={checked =>
            onFiltersChange({ featured: checked ? true : undefined })
          }
        />
        <Label htmlFor="featured" className="text-sm font-medium">
          Featured content only
        </Label>
      </div>

      <Separator />

      {/* Date Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Date Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !filters.dateFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom
                  ? new Date(filters.dateFrom).toLocaleDateString()
                  : 'From'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  filters.dateFrom ? new Date(filters.dateFrom) : undefined
                }
                onSelect={date =>
                  onFiltersChange({
                    dateFrom: date
                      ? date.toISOString().split('T')[0]
                      : undefined,
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !filters.dateTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo
                  ? new Date(filters.dateTo).toLocaleDateString()
                  : 'To'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                onSelect={date =>
                  onFiltersChange({
                    dateTo: date ? date.toISOString().split('T')[0] : undefined,
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full sm:w-auto"
        >
          <XIcon className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (compact) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {
                  Object.values(filters).filter(
                    v => v !== undefined && v !== '' && v !== null
                  ).length
                }
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Content Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
          </span>
          {hasActiveFilters && (
            <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
              {
                Object.values(filters).filter(
                  v => v !== undefined && v !== '' && v !== null
                ).length
              }
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  );
}
