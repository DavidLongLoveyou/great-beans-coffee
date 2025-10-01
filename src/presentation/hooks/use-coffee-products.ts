'use client';

import { useState, useEffect, useCallback } from 'react';

import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { CoffeeProductFilters } from '@/infrastructure/database/repositories/coffee-product.repository';
import {
  getCoffeeProductsUseCase,
  getFeaturedProductsUseCase,
  searchCoffeeProductsUseCase,
  getProductsByCategoryUseCase,
} from '@/infrastructure/di/container';

interface UseCoffeeProductsState {
  products: CoffeeProductEntity[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
}

interface UseCoffeeProductsOptions {
  filters?: CoffeeProductFilters;
  locale?: string;
  autoFetch?: boolean;
}

export function useCoffeeProducts(options: UseCoffeeProductsOptions = {}) {
  const { filters, locale, autoFetch = true } = options;

  const [state, setState] = useState<UseCoffeeProductsState>({
    products: [],
    loading: false,
    error: null,
    total: 0,
    hasMore: false,
  });

  const fetchProducts = useCallback(
    async (newFilters?: CoffeeProductFilters) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await getCoffeeProductsUseCase.execute({
          filters: newFilters || filters,
          locale,
        });

        setState(prev => ({
          ...prev,
          products: response.products,
          total: response.total,
          hasMore: response.hasMore,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error ? error.message : 'Failed to fetch products',
          loading: false,
        }));
      }
    },
    [filters, locale]
  );

  const refetch = useCallback(() => {
    return fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback(
    (newFilters: CoffeeProductFilters) => {
      return fetchProducts(newFilters);
    },
    [fetchProducts]
  );

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    ...state,
    refetch,
    updateFilters,
    fetchProducts,
  };
}

// Hook for featured products
export function useFeaturedProducts(limit = 6, locale?: string) {
  const [state, setState] = useState<{
    products: CoffeeProductEntity[];
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    loading: false,
    error: null,
  });

  const fetchFeaturedProducts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await getFeaturedProductsUseCase.execute({
        limit,
        locale,
      });

      setState(prev => ({
        ...prev,
        products: response.products,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch featured products',
        loading: false,
      }));
    }
  }, [limit, locale]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    ...state,
    refetch: fetchFeaturedProducts,
  };
}

// Hook for searching products
export function useSearchCoffeeProducts() {
  const [state, setState] = useState<{
    products: CoffeeProductEntity[];
    loading: boolean;
    error: string | null;
    query: string;
    total: number;
  }>({
    products: [],
    loading: false,
    error: null,
    query: '',
    total: 0,
  });

  const search = useCallback(
    async (query: string, locale?: string, limit?: number) => {
      setState(prev => ({ ...prev, loading: true, error: null, query }));

      try {
        const response = await searchCoffeeProductsUseCase.execute({
          query,
          locale,
          limit,
        });

        setState(prev => ({
          ...prev,
          products: response.products,
          total: response.total,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to search products',
          loading: false,
        }));
      }
    },
    []
  );

  const clearSearch = useCallback(() => {
    setState({
      products: [],
      loading: false,
      error: null,
      query: '',
      total: 0,
    });
  }, []);

  return {
    ...state,
    search,
    clearSearch,
  };
}

// Hook for getting products by category
export function useProductsByCategory() {
  const [state, setState] = useState<{
    products: CoffeeProductEntity[];
    loading: boolean;
    error: string | null;
    category: string;
    value: string;
    total: number;
  }>({
    products: [],
    loading: false,
    error: null,
    category: '',
    value: '',
    total: 0,
  });

  const fetchByCategory = useCallback(
    async (
      category: 'type' | 'grade' | 'origin' | 'processing',
      value: string,
      filters?: CoffeeProductFilters,
      locale?: string
    ) => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        category,
        value,
      }));

      try {
        const response = await getProductsByCategoryUseCase.execute({
          category,
          value,
          filters,
          locale,
        });

        setState(prev => ({
          ...prev,
          products: response.products,
          total: response.total,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch products by category',
          loading: false,
        }));
      }
    },
    []
  );

  return {
    ...state,
    fetchByCategory,
  };
}
