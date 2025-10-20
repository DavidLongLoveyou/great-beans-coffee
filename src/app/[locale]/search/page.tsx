'use client';

import {
  Search,
  Filter,
  X,
  TrendingUp,
  Clock,
  Hash,
} from '@/components/ui/icons';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';

import { type Locale } from '@/i18n';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import {
  SearchInput,
  SearchFilters,
  SearchResults,
  SearchSuggestions,
  type FilterGroup,
  type SortOption,
  type SearchResultItem,
  type SearchSuggestion,
} from '@/presentation/components/search';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet';
import { SectionHeading } from '@/shared/components/typography/SectionHeading';

interface SearchFiltersState {
  type: string;
  category: string;
  sortBy: string;
}

interface SearchResult {
  items: Array<{
    id: string;
    type: 'blog' | 'market-report' | 'service' | 'product';
    title: string;
    description: string;
    excerpt?: string;
    url: string;
    publishedAt?: string;
    category?: string;
    tags?: string[];
    coverImage?: string;
    readingTime?: number;
    featured?: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  query: string;
  filters: {
    type?: string;
    category?: string;
    locale: Locale;
  };
}

interface SearchPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default function SearchPage({ params }: SearchPageProps) {
  const _t = useTranslations('search');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle async params
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    params.then(resolvedParams => {
      setLocale(resolvedParams.locale);
    });
  }, [params]);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFiltersState>({
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'relevance',
  });
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Mock data for suggestions
  const recentSearches = [
    'sustainable coffee',
    'vietnam arabica',
    'market trends',
  ];
  const popularSearches = [
    'coffee export',
    'quality standards',
    'sourcing guide',
  ];
  const trendingTopics = ['climate change impact', 'fair trade certification'];

  // Filter configuration
  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Content Type',
      type: 'select',
      placeholder: 'All Types',
      value: filters.type,
      options: [
        { value: '', label: 'All Types' },
        { value: 'blog', label: 'Blog Posts' },
        { value: 'market-report', label: 'Market Reports' },
        { value: 'service', label: 'Services' },
        { value: 'product', label: 'Products' },
      ],
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'All Categories',
      value: filters.category,
      options: [
        { value: '', label: 'All Categories' },
        { value: 'sustainability', label: 'Sustainability' },
        { value: 'market-analysis', label: 'Market Analysis' },
        { value: 'sourcing', label: 'Sourcing' },
        { value: 'quality', label: 'Quality' },
        { value: 'processing', label: 'Processing' },
        { value: 'export', label: 'Export' },
        { value: 'certification', label: 'Certification' },
      ],
    },
  ];

  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
  ];

  // Update URL when search parameters change
  const updateURL = useCallback(
    (newQuery: string, newFilters: SearchFiltersState, page: number = 1) => {
      const params = new URLSearchParams();

      if (newQuery) params.set('q', newQuery);
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.sortBy !== 'relevance')
        params.set('sortBy', newFilters.sortBy);
      if (page > 1) params.set('page', page.toString());

      const newURL = `${pathname}?${params.toString()}`;
      router.push(newURL, { scroll: false });
    },
    [pathname, router]
  );

  // Perform search
  const performSearch = useCallback(
    async (
      searchQuery: string,
      searchFilters: SearchFiltersState,
      page: number = 1
    ) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setTotalCount(0);
        setShowSuggestions(true);
        return;
      }

      setLoading(true);
      setShowSuggestions(false);

      try {
        const searchURL = new URLSearchParams({
          q: searchQuery,
          type: searchFilters.type,
          category: searchFilters.category,
          locale: locale,
          page: page.toString(),
          limit: '20',
          sortBy: searchFilters.sortBy,
          sortOrder: 'desc',
        });

        const response = await fetch(`/api/search?${searchURL}`);

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data: SearchResult = await response.json();
        setResults(data.items);
        setTotalCount(data.total);
        setCurrentPage(page);
      } catch (err) {
        // Error handling removed for production
        setResults([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [locale]
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);

    // Show suggestions when input is empty or has content
    setShowSuggestions(value.length === 0 || value.length > 0);

    // Generate mock suggestions based on input
    if (value.trim()) {
      const mockSuggestions: SearchSuggestion[] = [
        { id: '1', text: `${value} guide`, type: 'popular' },
        { id: '2', text: `${value} market analysis`, type: 'trending' },
        { id: '3', text: `${value} best practices`, type: 'popular' },
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    updateURL(queryToSearch, filters, 1);
    performSearch(queryToSearch, filters, 1);
    setShowSuggestions(false);
  };

  // Handle filter change
  const handleFilterChange = (filterId: string, value: string | string[]) => {
    const newFilters = { ...filters, [filterId]: value as string };
    setFilters(newFilters);
    updateURL(query, newFilters, 1);
    performSearch(query, newFilters, 1);
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    updateURL(query, newFilters, 1);
    performSearch(query, newFilters, 1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const newFilters = { type: '', category: '', sortBy: 'relevance' };
    setFilters(newFilters);
    updateURL(query, newFilters, 1);
    performSearch(query, newFilters, 1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(query, filters, page);
    performSearch(query, filters, page);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  // Initial search on mount
  useEffect(() => {
    const initialQuery = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page') || '1');

    if (initialQuery) {
      performSearch(initialQuery, filters, initialPage);
    } else {
      setShowSuggestions(true);
    }
  }, [searchParams, filters, performSearch]);

  const totalPages = Math.ceil(totalCount / 20);

  // Check if any filters are active
  const hasActiveFilters =
    filters.type || filters.category || filters.sortBy !== 'relevance';

  // Get active filter count
  const activeFilterCount = [filters.type, filters.category].filter(
    Boolean
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50/30 via-white to-amber-50/30">
      {/* Hero Section */}
      <ContentSection className="relative overflow-hidden bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 pb-6 pt-8 text-white md:pb-12 md:pt-16">
        <div className="absolute inset-0 bg-[url('/images/coffee-pattern.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

        <ContentContainer className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">
                Discover Coffee Knowledge
              </span>
            </div>

            <SectionHeading size="xl" className="mb-4 text-white">
              Search The Great Beans
            </SectionHeading>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-forest-100 md:text-xl">
              Find blog posts, market reports, services, and products across our
              comprehensive coffee platform
            </p>
          </div>
        </ContentContainer>
      </ContentSection>

      {/* Search Section */}
      <ContentSection className="relative z-20 -mt-8 py-8 md:py-12">
        <ContentContainer>
          {/* Search Input Card */}
          <Card className="mb-8 border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <SearchInput
                value={query}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                placeholder="Search for content, insights, and expertise..."
                showSuggestions={true}
                suggestions={suggestions}
                recentSearches={recentSearches}
                popularSearches={popularSearches}
                className="w-full"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* Search Stats & Mobile Filter Toggle */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {query && (
                <div className="text-sm text-gray-600">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-forest-600 border-t-transparent"></div>
                      Searching...
                    </span>
                  ) : (
                    <span>
                      <span className="font-semibold text-gray-900">
                        {totalCount.toLocaleString()}
                      </span>{' '}
                      results for{' '}
                      <span className="font-medium">&quot;{query}&quot;</span>
                    </span>
                  )}
                </div>
              )}

              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount} filter
                    {activeFilterCount !== 1 ? 's' : ''} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden">
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 w-5 p-0 text-xs"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Search Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SearchFilters
                      filters={filterGroups}
                      sortOptions={sortOptions}
                      sortBy={filters.sortBy}
                      onFilterChange={handleFilterChange}
                      onSortChange={handleSortChange}
                      onClearFilters={handleClearFilters}
                      compact={false}
                      className="space-y-6"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-4">
            {/* Desktop Sidebar */}
            <div className="order-2 hidden xl:order-1 xl:col-span-1 xl:block">
              <div className="sticky top-8 space-y-6">
                {/* Filters */}
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Filters</h3>
                    </div>
                    <SearchFilters
                      filters={filterGroups}
                      sortOptions={sortOptions}
                      sortBy={filters.sortBy}
                      onFilterChange={handleFilterChange}
                      onSortChange={handleSortChange}
                      onClearFilters={handleClearFilters}
                      compact={false}
                      className="space-y-4"
                    />
                  </CardContent>
                </Card>

                {/* Suggestions */}
                {showSuggestions && (
                  <SearchSuggestions
                    suggestions={suggestions}
                    recentSearches={recentSearches}
                    popularSearches={popularSearches}
                    trendingTopics={trendingTopics}
                    onSuggestionClick={handleSuggestionClick}
                    onSearchClick={handleSearch}
                    maxItems={4}
                    variant="compact"
                    className="duration-500 animate-in fade-in-0 slide-in-from-right-4"
                  />
                )}
              </div>
            </div>

            {/* Main Results */}
            <div className="order-1 xl:order-2 xl:col-span-3">
              {/* Desktop Filters Bar */}
              <div className="mb-6 hidden sm:block xl:hidden">
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <SearchFilters
                      filters={filterGroups}
                      sortOptions={sortOptions}
                      sortBy={filters.sortBy}
                      onFilterChange={handleFilterChange}
                      onSortChange={handleSortChange}
                      onClearFilters={handleClearFilters}
                      compact={true}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <SearchResults
                  results={results}
                  loading={loading}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  emptyStateMessage={
                    query
                      ? `No results found for "${query}"`
                      : 'Start searching to discover content'
                  }
                  emptyStateDescription={
                    query
                      ? "Try adjusting your search terms or filters to find what you're looking for"
                      : 'Enter a search term above to explore our comprehensive coffee knowledge base'
                  }
                  layout="grid"
                  showMetrics={true}
                  className="duration-500 animate-in fade-in-0 slide-in-from-bottom-4"
                />

                {/* Mobile Suggestions */}
                {showSuggestions && (
                  <div className="xl:hidden">
                    <SearchSuggestions
                      suggestions={suggestions}
                      recentSearches={recentSearches}
                      popularSearches={popularSearches}
                      trendingTopics={trendingTopics}
                      onSuggestionClick={handleSuggestionClick}
                      onSearchClick={handleSearch}
                      maxItems={3}
                      variant="compact"
                      className="duration-500 animate-in fade-in-0 slide-in-from-bottom-4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </ContentContainer>
      </ContentSection>

      {/* Quick Actions Section */}
      {!query && (
        <ContentSection className="bg-gradient-to-r from-forest-50 to-amber-50 py-12">
          <ContentContainer>
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Popular Searches
              </h3>
              <p className="text-gray-600">
                Discover trending topics and popular content
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card
                className="group cursor-pointer border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                onClick={() => handleSearch('sustainable coffee')}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-colors group-hover:bg-green-200">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Sustainable Coffee
                  </h4>
                  <p className="text-sm text-gray-600">
                    Explore eco-friendly practices and certifications
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                onClick={() => handleSearch('market analysis')}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Market Analysis
                  </h4>
                  <p className="text-sm text-gray-600">
                    Latest trends and market insights
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                onClick={() => handleSearch('quality standards')}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 transition-colors group-hover:bg-purple-200">
                    <Hash className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Quality Standards
                  </h4>
                  <p className="text-sm text-gray-600">
                    Learn about coffee grading and quality
                  </p>
                </CardContent>
              </Card>
            </div>
          </ContentContainer>
        </ContentSection>
      )}
    </div>
  );
}
