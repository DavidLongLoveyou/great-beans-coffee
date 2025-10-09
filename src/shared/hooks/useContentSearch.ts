import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export interface SearchFilters {
  type?: 'blog' | 'market-report' | 'origin-story' | 'service';
  locale?: 'en' | 'es' | 'fr' | 'pt';
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  author?: string;
  featured?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchSorting {
  sortBy: 'relevance' | 'date' | 'title' | 'author';
  sortOrder: 'asc' | 'desc';
}

export interface SearchPagination {
  page: number;
  limit: number;
}

export interface SearchResult {
  id: string;
  type: string;
  locale: string;
  filename: string;
  metadata: {
    title: string;
    description: string;
    slug: string;
    status: string;
    category: string;
    author: string;
    featured: boolean;
    publishedAt?: string;
    createdAt?: string;
  } & Record<string, unknown>;
  content: string;
  stats: {
    wordCount: number;
    lastModified: string;
    size: number;
  };
  relevanceScore: number;
  excerpt: string;
  titleHighlight: string;
  descriptionHighlight: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  filters: SearchFilters;
  sorting: SearchSorting;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  suggestions: string[];
  stats: {
    totalResults: number;
    searchTime: number;
    topCategories: string[];
    topAuthors: string[];
  };
}

export interface UseContentSearchOptions {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  initialSorting?: SearchSorting;
  initialPagination?: SearchPagination;
  debounceMs?: number;
  autoSearch?: boolean;
}

export interface UseContentSearchReturn {
  // State
  query: string;
  filters: SearchFilters;
  sorting: SearchSorting;
  pagination: SearchPagination;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  
  // Search response data
  totalResults: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  suggestions: string[];
  stats: SearchResponse['stats'] | null;
  
  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setSorting: (sorting: Partial<SearchSorting>) => void;
  setPagination: (pagination: Partial<SearchPagination>) => void;
  search: () => Promise<void>;
  clearSearch: () => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const DEFAULT_FILTERS: SearchFilters = {};
const DEFAULT_SORTING: SearchSorting = { sortBy: 'relevance', sortOrder: 'desc' };
const DEFAULT_PAGINATION: SearchPagination = { page: 1, limit: 10 };

export function useContentSearch(options: UseContentSearchOptions = {}): UseContentSearchReturn {
  const {
    initialQuery = '',
    initialFilters = DEFAULT_FILTERS,
    initialSorting = DEFAULT_SORTING,
    initialPagination = DEFAULT_PAGINATION,
    debounceMs = 300,
    autoSearch = true,
  } = options;
  
  // State
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFiltersState] = useState<SearchFilters>(initialFilters);
  const [sorting, setSortingState] = useState<SearchSorting>(initialSorting);
  const [pagination, setPaginationState] = useState<SearchPagination>(initialPagination);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  
  // Debounced query for auto-search
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Search function
  const search = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setSearchResponse(null);
      setHasSearched(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const searchData = {
        query: query.trim(),
        ...filters,
        ...sorting,
        ...pagination,
      };
      
      const response = await fetch('/api/cms/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }
      
      setResults(data.data.results);
      setSearchResponse(data.data);
      setHasSearched(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
      setSearchResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, sorting, pagination]);
  
  // Auto-search effect
  useEffect(() => {
    if (autoSearch && debouncedQuery !== initialQuery) {
      search();
    }
  }, [debouncedQuery, autoSearch, search, initialQuery]);
  
  // Pagination effect
  useEffect(() => {
    if (hasSearched) {
      search();
    }
  }, [pagination.page, hasSearched, search]);
  
  // Action handlers
  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);
  
  const setSorting = useCallback((newSorting: Partial<SearchSorting>) => {
    setSortingState(prev => ({ ...prev, ...newSorting }));
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);
  
  const setPagination = useCallback((newPagination: Partial<SearchPagination>) => {
    setPaginationState(prev => ({ ...prev, ...newPagination }));
  }, []);
  
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSearchResponse(null);
    setHasSearched(false);
    setError(null);
    setPaginationState(DEFAULT_PAGINATION);
  }, []);
  
  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setSortingState(DEFAULT_SORTING);
    setPaginationState(DEFAULT_PAGINATION);
  }, []);
  
  const goToPage = useCallback((page: number) => {
    setPagination({ page });
  }, [setPagination]);
  
  const nextPage = useCallback(() => {
    if (searchResponse?.pagination.hasNext) {
      setPagination({ page: pagination.page + 1 });
    }
  }, [searchResponse?.pagination.hasNext, pagination.page, setPagination]);
  
  const prevPage = useCallback(() => {
    if (searchResponse?.pagination.hasPrev) {
      setPagination({ page: pagination.page - 1 });
    }
  }, [searchResponse?.pagination.hasPrev, pagination.page, setPagination]);
  
  // Computed values from search response
  const totalResults = searchResponse?.pagination.total || 0;
  const totalPages = searchResponse?.pagination.totalPages || 0;
  const hasNext = searchResponse?.pagination.hasNext || false;
  const hasPrev = searchResponse?.pagination.hasPrev || false;
  const suggestions = searchResponse?.suggestions || [];
  const stats = searchResponse?.stats || null;
  
  return {
    // State
    query,
    filters,
    sorting,
    pagination,
    results,
    isLoading,
    error,
    hasSearched,
    
    // Search response data
    totalResults,
    totalPages,
    hasNext,
    hasPrev,
    suggestions,
    stats,
    
    // Actions
    setQuery,
    setFilters,
    setSorting,
    setPagination,
    search,
    clearSearch,
    resetFilters,
    goToPage,
    nextPage,
    prevPage,
  };
}