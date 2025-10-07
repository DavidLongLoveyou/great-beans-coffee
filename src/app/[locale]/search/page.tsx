import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';

// Generate metadata for search page
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q: query } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'search' });

  const searchQuery = Array.isArray(query) ? query[0] : query;
  const title = searchQuery 
    ? t('metadata.titleWithQuery', { query: searchQuery })
    : t('metadata.title');
  const description = searchQuery
    ? t('metadata.descriptionWithQuery', { query: searchQuery })
    : t('metadata.description');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      siteName: 'The Great Beans',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Filter, X, TrendingUp, Clock, Hash } from 'lucide-react';

import { type Locale } from '@/i18n';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import { SectionHeading } from '@/shared/components/typography/SectionHeading';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/presentation/components/ui/sheet';
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
import { cn } from '@/shared/utils/cn';

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
  const t = useTranslations('search');
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
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Mock data for suggestions
  const recentSearches = ['sustainable coffee', 'vietnam arabica', 'market trends'];
  const popularSearches = ['coffee export', 'quality standards', 'sourcing guide'];
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
  const updateURL = useCallback((newQuery: string, newFilters: SearchFiltersState, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newQuery) params.set('q', newQuery);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.sortBy !== 'relevance') params.set('sortBy', newFilters.sortBy);
    if (page > 1) params.set('page', page.toString());

    const newURL = `${pathname}?${params.toString()}`;
    router.push(newURL, { scroll: false });
  }, [pathname, router]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFiltersState, page: number = 1) => {
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
      console.error('Search error:', err);
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [locale]);

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
  const hasActiveFilters = filters.type || filters.category || filters.sortBy !== 'relevance';

  // Get active filter count
  const activeFilterCount = [filters.type, filters.category].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50/30 via-white to-amber-50/30">
      {/* Hero Section */}
      <ContentSection className="pt-8 pb-6 md:pt-16 md:pb-12 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/coffee-pattern.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        
        <ContentContainer className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">Discover Coffee Knowledge</span>
            </div>
            
            <SectionHeading size="xl" className="mb-4 text-white">
              Search The Great Beans
            </SectionHeading>
            <p className="text-lg md:text-xl text-forest-100 max-w-2xl mx-auto leading-relaxed">
              Find blog posts, market reports, services, and products across our comprehensive coffee platform
            </p>
          </div>
        </ContentContainer>
      </ContentSection>

      {/* Search Section */}
      <ContentSection className="py-8 md:py-12 -mt-8 relative z-20">
        <ContentContainer>
          {/* Search Input Card */}
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                      <span className="font-semibold text-gray-900">{totalCount.toLocaleString()}</span> results for{' '}
                      <span className="font-medium">"{query}"</span>
                    </span>
                  )}
                </div>
              )}
              
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs h-6 px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
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
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden xl:block xl:col-span-1 order-2 xl:order-1">
              <div className="sticky top-8 space-y-6">
                {/* Filters */}
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
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
                    className="animate-in fade-in-0 slide-in-from-right-4 duration-500"
                  />
                )}
              </div>
            </div>

            {/* Main Results */}
            <div className="xl:col-span-3 order-1 xl:order-2">
              {/* Desktop Filters Bar */}
              <div className="hidden sm:block xl:hidden mb-6">
                <Card className="shadow-sm border-gray-200">
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
                  emptyStateMessage={query ? `No results found for "${query}"` : 'Start searching to discover content'}
                  emptyStateDescription={query ? 'Try adjusting your search terms or filters to find what you\'re looking for' : 'Enter a search term above to explore our comprehensive coffee knowledge base'}
                  layout="grid"
                  showMetrics={true}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
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
                      className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
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
        <ContentSection className="py-12 bg-gradient-to-r from-forest-50 to-amber-50">
          <ContentContainer>
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Popular Searches</h3>
              <p className="text-gray-600">Discover trending topics and popular content</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => handleSearch('sustainable coffee')}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sustainable Coffee</h4>
                  <p className="text-sm text-gray-600">Explore eco-friendly practices and certifications</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => handleSearch('market analysis')}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Market Analysis</h4>
                  <p className="text-sm text-gray-600">Latest trends and market insights</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => handleSearch('quality standards')}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                    <Hash className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Standards</h4>
                  <p className="text-sm text-gray-600">Learn about coffee grading and quality</p>
                </CardContent>
              </Card>
            </div>
          </ContentContainer>
        </ContentSection>
      )}
    </div>
  );
}