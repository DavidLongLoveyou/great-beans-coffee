'use client';

import { format } from 'date-fns';
import {
  Search,
  Filter,
  Calendar,
  SortAsc,
  SortDesc,
  RefreshCw,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Calendar as CalendarComponent } from '@/presentation/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
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

export interface RFQFilters {
  search: string;
  status: string;
  priority: string;
  dateFrom?: Date;
  dateTo?: Date;
  minValue?: number;
  maxValue?: number;
  assignedTo?: string;
}

export interface RFQSortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface RFQListFiltersProps {
  filters: RFQFilters;
  onFiltersChange: (filters: RFQFilters) => void;
  onReset: () => void;
  sortConfig: RFQSortConfig;
  onSortChange: (config: RFQSortConfig) => void;
  loading?: boolean;
  filteredCount: number;
  totalCount: number;
}

const getStatusOptions = (t: any) => [
  { value: 'ALL', label: t('filters.status.all') },
  { value: 'SUBMITTED', label: t('status.submitted') },
  { value: 'UNDER_REVIEW', label: t('status.underReview') },
  { value: 'QUOTED', label: t('status.quoted') },
  { value: 'NEGOTIATING', label: t('status.negotiating') },
  { value: 'ACCEPTED', label: t('status.accepted') },
  { value: 'REJECTED', label: t('status.rejected') },
  { value: 'EXPIRED', label: t('status.expired') },
];

const getPriorityOptions = (t: any) => [
  { value: 'ALL', label: t('filters.priority.all') },
  { value: 'LOW', label: t('priority.low') },
  { value: 'MEDIUM', label: t('priority.medium') },
  { value: 'HIGH', label: t('priority.high') },
  { value: 'URGENT', label: t('priority.urgent') },
];

const getSortOptions = (t: any) => [
  { value: 'submittedAt', label: t('filters.sort.submittedDate') },
  { value: 'lastUpdate', label: t('filters.sort.lastUpdate') },
  { value: 'responseDeadline', label: t('filters.sort.deadline') },
  { value: 'estimatedValue', label: t('filters.sort.value') },
  { value: 'rfqNumber', label: t('filters.sort.rfqNumber') },
  { value: 'priority', label: t('filters.sort.priority') },
  { value: 'status', label: t('filters.sort.status') },
];

export function RFQListFilters({
  filters,
  onFiltersChange,
  onReset,
  sortConfig,
  onSortChange,
  loading = false,
  filteredCount,
  totalCount,
}: RFQListFiltersProps) {
  const t = useTranslations('rfq');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Get translated options
  const statusOptions = getStatusOptions(t);
  const priorityOptions = getPriorityOptions(t);
  const sortOptions = getSortOptions(t);

  // Update temp filters when props change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof RFQFilters, value: any) => {
    const newFilters = { ...tempFilters, [key]: value };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Handle sort changes
  const handleSortChange = (field: string) => {
    const newDirection =
      sortConfig.field === field && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';

    onSortChange({
      field: field as RFQSortConfig['field'],
      direction: newDirection,
    });
  };

  // Handle reset
  const handleReset = () => {
    onReset();
    setShowAdvanced(false);
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.status !== 'ALL' ||
      filters.priority !== 'ALL' ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.minValue ||
      filters.maxValue ||
      filters.assignedTo
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'ALL') count++;
    if (filters.priority !== 'ALL') count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.minValue || filters.maxValue) count++;
    if (filters.assignedTo) count++;
    return count;
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg">{t('filters.title')}</span>
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('filters.activeCount', { count: getActiveFiltersCount() })}
              </Badge>
            )}
          </CardTitle>
          <div className="flex flex-col items-start gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:text-sm">
            <span className="whitespace-nowrap">
              {t('filters.resultsCount', {
                filtered: filteredCount,
                total: totalCount,
              })}
            </span>
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex h-8 items-center gap-1 px-3 text-xs"
              >
                <X className="h-3 w-3" />
                <span className="hidden sm:inline">
                  {t('filters.clearAll')}
                </span>
                <span className="sm:hidden">{t('filters.clear')}</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Primary Filters Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
              {t('filters.search.label')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400 sm:h-4 sm:w-4" />
              <Input
                placeholder={t('filters.search.placeholder')}
                value={tempFilters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                className="h-9 pl-9 text-sm sm:h-10 sm:pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
              {t('filters.status.label')}
            </label>
            <Select
              value={tempFilters.status}
              onValueChange={value => handleFilterChange('status', value)}
            >
              <SelectTrigger className="h-9 text-sm sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
              {t('filters.priority.label')}
            </label>
            <Select
              value={tempFilters.priority}
              onValueChange={value => handleFilterChange('priority', value)}
            >
              <SelectTrigger className="h-9 text-sm sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col flex-wrap items-start gap-3 border-t pt-3 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <label className="whitespace-nowrap text-xs font-medium text-gray-700 sm:text-sm">
              {t('filters.sort.label')}:
            </label>
            <Select
              value={`${sortConfig.field}-${sortConfig.direction}`}
              onValueChange={value => {
                const [field, direction] = value.split('-');
                onSortChange({
                  field: field as RFQSortConfig['field'],
                  direction: direction as 'asc' | 'desc',
                });
              }}
            >
              <SelectTrigger className="h-9 w-full text-sm sm:h-10 sm:w-48">
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

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onSortChange({
                ...sortConfig,
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
              })
            }
            className="flex h-8 items-center gap-1 px-3 text-xs sm:h-9 sm:text-sm"
          >
            {sortConfig.direction === 'asc' ? (
              <SortAsc className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <SortDesc className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline">
              {sortConfig.direction === 'asc'
                ? t('filters.sort.ascending')
                : t('filters.sort.descending')}
            </span>
            <span className="sm:hidden">
              {sortConfig.direction === 'asc'
                ? t('filters.sort.asc')
                : t('filters.sort.desc')}
            </span>
          </Button>
        </div>

        {/* Advanced Filters (Collapsible) */}
        <div className="border-t pt-3 sm:pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mb-3 flex items-center gap-2 p-0 text-xs font-medium text-gray-700 hover:text-gray-900 sm:mb-4 sm:text-sm"
          >
            {showAdvanced ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            {t('filters.advanced.title')}
          </Button>

          {showAdvanced && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {/* Date From */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  {t('filters.advanced.submittedDateFrom')}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 w-full justify-start text-left text-xs font-normal sm:h-10 sm:text-sm"
                    >
                      <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {filters.dateFrom
                        ? format(filters.dateFrom, 'PPP')
                        : t('filters.advanced.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date: Date | undefined) =>
                        handleFilterChange('dateFrom', date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  {t('filters.advanced.submittedDateTo')}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 w-full justify-start text-left text-xs font-normal sm:h-10 sm:text-sm"
                    >
                      <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {filters.dateTo
                        ? format(filters.dateTo, 'PPP')
                        : t('filters.advanced.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date: Date | undefined) =>
                        handleFilterChange('dateTo', date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Min Value */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  {t('filters.advanced.minValue')}
                </label>
                <Input
                  type="number"
                  placeholder={t('filters.advanced.minValuePlaceholder')}
                  value={filters.minValue || ''}
                  onChange={e =>
                    handleFilterChange(
                      'minValue',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-9 text-sm sm:h-10"
                />
              </div>

              {/* Max Value */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  {t('filters.advanced.maxValue')}
                </label>
                <Input
                  type="number"
                  placeholder={t('filters.advanced.maxValuePlaceholder')}
                  value={filters.maxValue || ''}
                  onChange={e =>
                    handleFilterChange(
                      'maxValue',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-9 text-sm sm:h-10"
                />
              </div>

              {/* Assigned To */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  {t('filters.advanced.assignedTo')}
                </label>
                <Input
                  placeholder={t('filters.advanced.assignedToPlaceholder')}
                  value={filters.assignedTo || ''}
                  onChange={e =>
                    handleFilterChange('assignedTo', e.target.value)
                  }
                  className="h-9 text-sm sm:h-10"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
