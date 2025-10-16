'use client';

import {  SearchIcon, SortAscIcon, SortDescIcon, GridIcon, ListIcon, LoaderIcon  } from '@/components/ui/dynamic-icons';
import React, { useState } from 'react';

import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Separator } from '@/presentation/components/ui/separator';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/shared/utils';

import {
  useContentSearch,
  SearchSorting,
} from '@/shared/hooks/useContentSearch';
import { ContentFilters } from './ContentFilters';

interface ContentSearchProps {
  onSelectContent?: (contentId: string) => void;
  className?: string;
  compact?: boolean;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Date' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
];

export function ContentSearch({
  onSelectContent,
  className,
  compact = false,
}: ContentSearchProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const {
    query,
    setQuery,
    filters,
    setFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
    results,
    isLoading,
    error,
    hasSearched,
    searchResponse,
    search,
    clearFilters,
  } = useContentSearch({
    autoSearch: true,
    debounceMs: 300,
  });

  const handleSortChange = (sortBy: string) => {
    setSorting({
      sortBy: sortBy as SearchSorting['sortBy'],
      sortOrder: sorting.sortOrder,
    });
  };

  const handleSortOrderToggle = () => {
    setSorting({
      ...sorting,
      sortOrder: sorting.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800';
      case 'market-report':
        return 'bg-purple-100 text-purple-800';
      case 'origin-story':
        return 'bg-orange-100 text-orange-800';
      case 'service':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Header */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search content by title, description, or content..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {/* Sort Controls */}
            <Select value={sorting.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32" aria-label="Sort content by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSortOrderToggle}
              className="px-2"
            >
              {sorting.sortOrder === 'asc' ? (
                <SortAscIcon className="h-4 w-4" />
              ) : (
                <SortDescIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <GridIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Manual Search Button */}
            <Button onClick={search} disabled={isLoading} size="sm">
              {isLoading ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ContentFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            compact={compact}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          {hasSearched && searchResponse && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {searchResponse.stats.totalResults} results found in{' '}
                {searchResponse.stats.searchTime}ms
                {query && (
                  <span className="ml-1">
                    for &ldquo;<span className="font-medium">{query}</span>
                    &rdquo;
                  </span>
                )}
              </div>
              {searchResponse.pagination.totalPages > 1 && (
                <div className="text-sm text-muted-foreground">
                  Page {searchResponse.pagination.page} of{' '}
                  {searchResponse.pagination.totalPages}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <LoaderIcon className="h-6 w-6 animate-spin" />
              <span className="ml-2">Searching...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">Error: {error}</p>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {hasSearched && !isLoading && !error && results.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No content found matching your search criteria.
                </p>
                {Object.values(filters).some(
                  v => v !== undefined && v !== '' && v !== null
                ) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Clear filters and try again
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results List/Grid */}
          {results.length > 0 && (
            <div
              className={cn(
                viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'
              )}
            >
              {results.map(result => (
                <Card
                  key={result.id}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-muted/50',
                    onSelectContent && 'hover:border-primary'
                  )}
                  onClick={() => onSelectContent?.(result.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle
                        className="line-clamp-2 text-base"
                        dangerouslySetInnerHTML={{
                          __html: result.titleHighlight,
                        }}
                      />
                      <div className="flex shrink-0 gap-1">
                        <Badge className={getTypeColor(result.type)}>
                          {result.type}
                        </Badge>
                        <Badge
                          className={getStatusColor(result.metadata.status)}
                        >
                          {result.metadata.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p
                        className="line-clamp-3 text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: result.descriptionHighlight,
                        }}
                      />

                      {result.excerpt && (
                        <p
                          className="line-clamp-2 text-xs italic text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{result.locale.toUpperCase()}</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>{result.metadata.author}</span>
                          {result.metadata.category && (
                            <>
                              <Separator
                                orientation="vertical"
                                className="h-3"
                              />
                              <span>{result.metadata.category}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{result.stats.wordCount} words</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>{formatDate(result.stats.lastModified)}</span>
                        </div>
                      </div>

                      {result.metadata.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {searchResponse && searchResponse.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(searchResponse.pagination.page - 1)
                }
                disabled={!searchResponse.pagination.hasPrev}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, searchResponse.pagination.totalPages) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={
                          page === searchResponse.pagination.page
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(searchResponse.pagination.page + 1)
                }
                disabled={!searchResponse.pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {searchResponse &&
        searchResponse.suggestions &&
        searchResponse.suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {searchResponse.suggestions.map(suggestion => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(suggestion)}
                    className="h-auto py-1 text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
